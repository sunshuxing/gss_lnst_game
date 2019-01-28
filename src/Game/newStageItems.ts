class newStageItems extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/StageitemsSkins.exml";
	}

	private gro_top: eui.Group;
	private guide_img: eui.Image;
	public gro_prop: eui.Group;
	public BarGroup: eui.Group;			    //弹幕范围
	public share_friend: eui.Image;			//邀请帮摘果按钮
	public gro_pick: eui.Group;				//摘果手显示
	public pick_hand: eui.Image;			//摘果的手
	public pick_label: eui.Label;			//摘果的文字
	public gro_steal: eui.Group				//偷水显示
	public steal_btn: eui.Image;			//偷水按钮
	public steal_label: eui.Label;			//偷水的字
	private hasCheck = false;				//是否检查过好友
	public like_num: eui.Label;				//点赞数量
	public friendlike_num: eui.Label;		//好友点赞的数量

	protected childrenCreated(): void {
		super.childrenCreated();
		// 创建完成后最终调用方法
		this.getTopMsg();						//顶部消息
		// this.getSystemMsg();					//系统消息
		this.getFriends();						//好友数据
		this.friend_scr.horizontalScrollBar = null;
	}

	private onComplete(): void {
		this.currentState = "havetree";
		localStorage.setItem("isNewUser", "old");
		this.getUserInfo()													//获取用户信息
		//创建完成立即调用方法
		NewHelp.getSignInInfo()												//查询签到信息
		NewHelp.searchAnswerStage();										//查询保存答题奖励数据
		this.checkAnswerReward();
		SceneManager.sceneManager.getTaskScene().taskDataInit(this.checktask);
		this.iconTouchInit()																		//icon点击初始化
		this.guide_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toGuide, this);			//引导页点击监听
		this.self_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSelfTree, this);			//自己头像点击监听
		this.add_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addfriend, this);			//添加好友点击监听
		this.share_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sharefriend, this)		//邀请好友帮摘果按钮
		this.pick_hand.addEventListener(egret.TouchEvent.TOUCH_TAP, this.PickFruit, this);			//帮摘果按钮点击监听
		this.steal_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.stealWater() }, this);			//偷水按钮点击监听
		this.gro_top.y = this.height - SceneManager.instance._stage.height;
		this.str1.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.str2.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.img1.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img2.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img1_bg.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img2_bg.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.gro_prop.touchThrough = true;
		this.BarGroup.touchThrough = true;
		if (!this.hasCheck) {
			SceneManager.sceneManager.checkAddFriend();
			this.hasCheck = true;
		}
	}



	private info1: eui.Group;				//推送消息1
	private info2: eui.Group;				//推送消息2
	private str1: eui.Label;				//消息字段1
	private str2: eui.Label;				//消息字段2
	private img1: eui.Image;				//推送消息头像1
	private img2: eui.Image;				//推送消息头像2
	private img1_bg: eui.Image;
	private img2_bg: eui.Image;
	private n = 0;
	private m = 0;
	private topPage: number = 0				//当前页面
	private infodata: any[];				//消息数据
	private sysinfodata: any[];				//系统消息


	//--------------------------------------------------------------------------摘果---------------------------------------------------------------------//

	/**
	 * 邀请好友摘果
	 */
	private sharefriend() {
		SceneManager.addJump("sharetextpick_png");
		if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
			let url = SceneManager.instance.weixinUtil.shareData.shareUrl
			let addFriend = MyRequest.geturlstr("addFriend", url)
			if (!addFriend) {
				SceneManager.instance.weixinUtil.shareData.shareUrl = url + "&addFriend=true"
			}
			SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
			SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
			SceneManager.instance.weixinUtil._openShare();
		} else {
			let info = "【果实熟了】快来、快来帮我摘水果。"
			let data = {
				addFriend: true,
				title: info
			}
			SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
		}
	}


	/**
	 * 摘果子
	 */
	private PickFruit() {
		if (this.currentState == "havetree") {
			let text: string = SceneManager.sceneManager.newmainScene.pick_num.text
			text = text.substring(1, text.length)
			if (Number(text) > 0 && Datamanager.getNowtreedata().needTake == "true") {
				NewHelp.useProp(3, Datamanager.getNowtreedata());
			}
			else if (Datamanager.getNowtreedata().needTake == "false") {
				let content = "您现在还不能使用果篮哦~"
				let btn = "确定"
				let ti = "(快让您的小树快快成长吧！)"
				SceneManager.addPrompt(content, btn, ti);
			}
			else if (Number(text) <= 0) {
				let content = "果篮数量不够"
				let btn = "确定"
				let ti = "(完成任务可以获得果篮！)"
				SceneManager.addPrompt(content, btn, ti);
			}
		}
		else if (this.currentState == "friendtree") {
			NewHelp.friendpick(Datamanager.getNowtreedata().id);
		}
	}


	//---------------------------------------------------------------------顶部消息---------------------------------------------------------------------//


	private toGuide() {
		SceneManager.guiedResource();			//进入引导页
	}


	//查询顶部消息
	public getTopMsg(reload?: Boolean) {
		if (reload) {
			this.topPage = 0
			this.n = 0;
		}
		this.topPage = this.topPage + 1
		let data = {
			pageNo: this.topPage
		}
		MyRequest._post("game/getTopInfo", data, this, this.Req_getTopMsg.bind(this, reload), null)
	}

	//查询顶部消息成功后处理
	private Req_getTopMsg(reload, data): void {
		var Data = data;
		let maxPage = parseInt(Data.data.lastPage)
		if (this.topPage == maxPage) {
			//如果是最后一页，则下一次从首页开始
			this.topPage = 0
		}
		this.infodata = Data.data.list;
		if (Data.data.list.length == 0 && this.topPage == 1) {
			//如果第一页都没有数据，就是没数据
			this.hasTopMsg = false;
		}
		if (!reload) {
			this.info1scr();
		}
	}

	private hasTopMsg = true;
	private hasSysMsg = true;


	//查询系统消息
	public getSystemMsg(reload?: Boolean) {
		if (reload) {
			this.m = 0;
		}
		MyRequest._post("game/getSystemInfo", null, this, this.Req_getSystemMsg.bind(this), null)
	}

	//查询系统消息成功后处理
	private Req_getSystemMsg(data): void {
		var Data = data;
		this.sysinfodata = Data.data;

		if (this.sysinfodata.length == 0) {
			//如果第一页都没有数据，就是没数据
			this.hasSysMsg = false;
		}
	}


	private onlyFlag: boolean = false; 	//只有用户推送的情况需要的标记
	// 推送滚动1
	public info1scr() {
		if (this.infodata && this.infodata.length) {
			if (this.n >= this.infodata.length) {
				this.n = 0;
				if (this.hasTopMsg) {
					this.getTopMsg()
				}
				return
			}
			let systemEmpty = this.sysinfodata == null ? true : this.sysinfodata.length == 0 ? true : false	//系统消息为空
			let userName = Help.getcharlength(this.infodata[this.n].mainUserName, 4);
			let treeName = this.infodata[this.n].treeName;
			let stageName = this.infodata[this.n].stageName;
			let info = ""
			if (this.infodata[this.n].type == "0") {
				info = userName + "的" + treeName + stageName + "了！"
			} else if (this.infodata[this.n].type == "100") {
				info = userName + "的" + treeName + "正在配送！"
			}
			else if (this.infodata[this.n].type == "1") {
				info = userName + "领取了" + treeName + "！"
			}
			if (systemEmpty && !this.onlyFlag) {//如果为空，则使用系统的框来循环
				let params = {
					users: this.infodata[this.n].mainUser
				}
				MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.img2), null);
				this.n++;
				this.str2.text = Help.getcharlength(info, 12);
				var rect: egret.Rectangle = this.str2.scrollRect;
				egret.Tween.get(rect)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000).call(this.info2scr.bind(this, true), this)
					.to({ y: 50 }, 1000);

				var rect1: egret.Rectangle = this.img2.scrollRect;
				egret.Tween.get(rect1)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000)
					.to({ y: 50 }, 1000);

				var rect2: egret.Rectangle = this.img2_bg.scrollRect;
				egret.Tween.get(rect2)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000)
					.to({ y: 50 }, 1000);
				this.onlyFlag = true;
			} else {
				let params = {
					users: this.infodata[this.n].mainUser
				}
				MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.img1), null);
				this.str1.text = Help.getcharlength(info, 12);
				this.n++;
				var rect: egret.Rectangle = this.str1.scrollRect;
				egret.Tween.get(rect)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000).call(this.info2scr.bind(this, true), this)
					.to({ y: 50 }, 1000);

				var rect1: egret.Rectangle = this.img1.scrollRect;
				egret.Tween.get(rect1)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000)
					.to({ y: 50 }, 1000);

				var rect2: egret.Rectangle = this.img1_bg.scrollRect;
				egret.Tween.get(rect2)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000)
					.to({ y: 50 }, 1000);
				this.onlyFlag = false
			}

		}
		else {
			if (this.hasSysMsg) {
				this.info2scr(true)
			}
		}
	}

	/**
	 * 推送滚动2 flag 是否调用滚动1
	 * 
	* */
	public info2scr(flag?: boolean) {
		if (this.sysinfodata && this.sysinfodata.length > 0) {
			if (this.m >= this.sysinfodata.length) {
				this.m = 0;
			}
			this.img2.texture = RES.getRes("gamelogo")
			this.str2.text = Help.getcharlength(this.sysinfodata[this.m].title, 12);
			this.m++;
			var rect: egret.Rectangle = this.str2.scrollRect;
			egret.Tween.get(rect)
				.set({ y: -50 })
				.to({ y: 0 }, 1000)
				.wait(2000).call(this.info1scr, this)
				.to({ y: 50 }, 1000);

			var rect1: egret.Rectangle = this.img2.scrollRect;
			egret.Tween.get(rect1)
				.set({ y: -50 })
				.to({ y: 0 }, 1000)
				.wait(2000)
				.to({ y: 50 }, 1000);

			var rect2: egret.Rectangle = this.img2_bg.scrollRect;
			egret.Tween.get(rect2)
				.set({ y: -50 })
				.to({ y: 0 }, 1000)
				.wait(2000)
				.to({ y: 50 }, 1000);
		}
		else if (this.hasTopMsg && flag) {
			this.info1scr()
		}
	}

	//获取微信头像
	private Req_WechatImg(user, image: eui.Image, data) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		let imgUrl = Config.picurl + data[user];
		HttpRequest.imageloader(imgUrl, image, user);
	}
	//---------------------------------------------------------------------好友列表---------------------------------------------------------------------//

	private friend_scr: eui.Scroller;		//好友列表滑动框
	public friend_list: eui.List;			//好友列表
	private add_friend: eui.Group;			//添加好友
	public self_tree: eui.Group;			//用户头像点击区域
	public user_icon: eui.Image;			//用户头像图片
	public user_name: eui.Label;			//用户昵称
	private friendList;						//好友列表数据

	/**
	 * 显示用户头像和昵称
	 */
	private getUserInfo() {
		this.getOwnavatar(SceneManager.instance.weixinUtil.login_user_id);					//用户头像
		this.user_name.text = Help.getcharlength(SceneManager.instance.weixinUtil.user_name, 8);					//用户昵称
	}

	/**
	 * 获取用户头像
	 * treedata   userId
	 */
	private getOwnavatar(userId) {
		let params = {
			users: userId
		}
		MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, userId, this.user_icon), null);
	}

	//添加好友事件
	private addfriend() {
		let treedata														//果树数据
		if (SceneManager.instance.landId == 1) {								//当前为果园数据
			treedata = Datamanager.getOwnguoyuandata();						//自己果园果树数据
		}
		else if (SceneManager.instance.landId == 2) {							//当前为菜园数据
			treedata = Datamanager.getOwncaiyuandata();						//自己菜园果树数据
		}
		SceneManager.addJump("sharetextwater_png");
		if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
			let url = SceneManager.instance.weixinUtil.shareData.shareUrl
			let addFriend = MyRequest.geturlstr("addFriend", url)
			if (!addFriend) {
				SceneManager.instance.weixinUtil.shareData.shareUrl = url + "&addFriend=true"
			}
			if (treedata && Number(treedata.friendCanObtain) > 0) {
				SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
				SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
			} else {
				SceneManager.instance.weixinUtil.shareData.titles = "【说说农场】邀请你一起种水果，亲手种，免费送到家"
				SceneManager.instance.weixinUtil.shareData.describes = "种上一棵树，经营一座农场，开启舌尖上的旅行--果说说"
			}
			SceneManager.instance.weixinUtil._openShare();

		} else {
			let info
			if (treedata && Number(treedata.friendCanObtain) > 0) {
				info = "【果实熟了】快来、快来帮我摘水果。"
			} else {
				info = "【说说农场】一起种水果，亲手种，免费送到家。"
			}
			let data = {
				addFriend: true,
				title: info
			}
			SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
		}
	}


	//回到自己果园
	private ToSelfTree() {
		if (this.currentState != "havetree") {
			SceneManager.treepromptgro.removeChildren();											//清空显示树语
			SceneManager.treetimer.reset();															//重置树语定时器
			this.friend_list.selectedIndex = -1;
			this.nowseleceindex = -1;
			Help.passAnm();																			//过场动画
			if (SceneManager.instance.landId == 1) {												//果园
				SceneManager.sceneManager.newmainScene.progress.slideDuration = 0;					//成长值进度条缓动速度
				SceneManager.sceneManager.newmainScene.progress.value = 0;							//成长值进度条值
				SceneManager.sceneManager.newmainScene.getOwnTree();								//查询自己果树数据
			}
			else if (SceneManager.instance.landId == 2) {											//菜园
				Help.passAnm()																		//过场动画
				SceneManager.sceneManager.newmain2Scene.progress.slideDuration = 0;					//成长值进度条缓动速度
				SceneManager.sceneManager.newmain2Scene.progress.value = 0;							//成长值进度条值
				SceneManager.sceneManager.newmain2Scene.getOwnTree();								//查询自己果树数据
			}
		}
	}


	//查询好友列表
	public getFriends(userid?) {
		MyRequest._post("game/getFriends", null, this, this.Req_getFriends.bind(this, userid), null);
	}

	//查询好友列表成功后处理
	private Req_getFriends(userid, data): void {
		console.log("好友数据", data)
		var Data = data;
		Datamanager.savefriendsdata(data.data);								//保存好友数据
		this.friendList = Data.data;
		let friend_data = Data.data;
		let friend_user = []
		for (let i = 0; i < friend_data.length; i++) {
			friend_user.push(friend_data[i].friendUser)
		}
		if (friend_user && friend_user.length > 0) {

			let params = {
				users: friend_user.join(",")
			};
			MyRequest._post("game/getWechatImg", params, this, this.Req_getWechatImg.bind(this, userid), null);
		}
	}

	private Req_getWechatImg(userid, data) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		Help.savefriendIcon(data);										//保存好友头像数据
		this.friendlistUpdate(this.friendList, userid);					//更新好友列表
	}

	//更新好友列表
	private friendlistUpdate(data, userid?) {
		console.log(data, "好友数据")
		// 转成eui数据
		let euiArr: eui.ArrayCollection = new eui.ArrayCollection(data);
		// 把list_hero数据源设置成euiArr
		this.friend_list.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.friend_list.itemRenderer = FriendList_item;
		this.friend_list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.toOtherTree, this);
		this.touser(userid);
	}

	private touser(userid) {
		if (this.currentState != "notree") {			//判断条件要改		当自己一棵树都没有时不进入他人果园
			let treeid = Datamanager.getfriendtreeUseridByUser(userid);
			if (treeid) {
				NewHelp.getTreeInfoByid(treeid);						//查询好友果树
			}
		}
	}

	/**
	 * 进入好友果园
	 */
	private nowseleceindex = -1;												//当前选中的好友索引
	private toOtherTree() {
		if (this.friend_list.selectedIndex != this.nowseleceindex) {			//点击的不是选中的好友
			Datamanager.savenowfrienddata(this.friend_list.selectedItem);					//保存当前好友数据
			//查询好友果树数据
			if (!this.friend_list.selectedItem.trees) {							//首先确定该好友不是两块地都没有数据
				//分享弹窗
				SceneManager.addJump("sharetexttree_png");
				return;
			}
			let nowuser = this.friend_list.selectedItem.friendUser;
			let treeid = NewHelp.getTreeIdByLandId(this.friend_list.selectedItem, SceneManager.instance.landId);				//获取果树id
			if (nowuser) {														//当前土地选中好友有果树数据
				if (nowuser != Datamanager.getnowfrienddata().user) {				//选中好友果树和当前果树不是同一个
					if (treeid) {
						NewHelp.getTreeInfoByid(treeid);
					}
					else{
						if(SceneManager.sceneManager.landId == 1){
							SceneManager.sceneManager.newmainScene.updateBytreedata(null);
						}
						else if(SceneManager.sceneManager.landId == 2){
							SceneManager.sceneManager.newmain2Scene.updateBytreedata(null);
						}
					}
				}
				Help.passAnm();
			}
			else {																//当前好友当前土地没有果树
				this.friend_list.selectedIndex = this.nowseleceindex;
				NewHelp.addmask();
				// let invite = new Invitefriend();
				// SceneManager.sceneManager._stage.addChild(invite);
			}
		}
		this.nowseleceindex = this.friend_list.selectedIndex;
	}

	//---------------------------------------------------------------------icon点击(未完成)---------------------------------------------------------------------//

	private btn_dynamic: eui.Group;			//动态按钮
	private btn_signin: eui.Group;			//签到按钮
	private btn_task: eui.Group;				//任务按钮
	private btn_fertilizer: eui.Group;		//化肥按钮
	private btn_store: eui.Group;			//商城按钮
	public dynamic: eui.Group;				//动态组
	public dynamic_bg: eui.Image;			//动态背景
	public dynamic_image: eui.Image;		//动态头像
	public dynamic_info: eui.Label;			//动态消息
	public sign_gro: eui.Group;				//可签到显示
	public task_gro: eui.Group;				//任务可领取显示
	public huafei_red: eui.Rect;			//化肥红点
	public dyn_red: eui.Rect;				//动态红点
	public hudong_btn: eui.Image;			//互动按钮
	public gro_kettle: eui.Group;			//水壶点击区域
	public gro_lq: eui.Group;				//水壶冷却
	public kettle_num: eui.Label;			//水壶水量
	public img_kettle: eui.Image;			//水壶图片
	public frimg_kettle: eui.Image;			//好友水壶
	public sanj: eui.Image;					//冷却线
	public time_lq: eui.Label;				//冷却时间
	public gro_love: eui.Group;				//爱心值区域
	public love_num: eui.Label;				//爱心值数字
	public img_love: eui.Image;				//爱心图片
	public img_water: eui.Image;			//水滴图片
	private friend_kettle: eui.Group;		//帮好友浇水区域
	private btn_nianhuo: eui.Image;			//年货按钮
	private btn_encyclopedia: eui.Image;		//百科按钮
	public chanzi_btn: eui.Image;			//铲子
	/**
	 * 	icon点击初始化
	 */
	private iconTouchInit() {
		NewHelp.updateprop();																				//道具数量显示				
		this.btn_dynamic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToDynamicScene, this);			//动态按钮点击监听
		this.btn_signin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSignInScene, this);				//签到按钮点击监听
		this.btn_task.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToTaskScene, this);					//任务按钮点击监听
		this.btn_fertilizer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TohuafeiScene, this);			//化肥按钮点击监听
		this.btn_store.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tostroe, this);					//商城按钮点击监听
		this.hudong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToInteractiveScene, this);		//互动按钮点击监听
		this.img_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addwater, this);					//自己水壶点击监听
		this.gro_love.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loveTouch, this);					//爱心区域点击监听
		this.btn_nianhuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tonianhuo, this);					//年货按钮点击监听
		this.gro_lq.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.lqfast() }, this);				//水壶冷却点击监听
		this.friend_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.friendWater() }, this)	//帮好友浇水点击监听
		this.chanzi_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.removetree, this)
		this.nianhuoTwn();
	}

	public canreward: boolean = true;


	private removetree() {
		NewHelp.removeTree(Datamanager.getNowtreedata())
	}

	//去答题
	private toproblem() {
		if (this.canreward) {
			let problemScene = new ProblemScene();
			SceneManager.sceneManager._stage.addChild(problemScene)
		}
		else {
			let baikeScene = new BaikeScene();
			SceneManager.sceneManager._stage.addChild(baikeScene)
		}
	}

	/**
	* 检查是否能通过答题获得奖励
	*/
	private checkAnswerReward() {
		MyRequest._post("game/checkAnswerReward", null, this, this.Req_checkAnswerReward.bind(this), null)
	}

	private Req_checkAnswerReward(data) {
		console.log(data, "检查答题")
		if (data.data == "true") {
			this.canreward = true;
		}
		else {
			this.canreward = false;
		}
		this.btn_encyclopedia.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toproblem, this)					//进入答题
	}

	//去年货专区
	private tonianhuo() {
		if (SceneManager.instance.isMiniprogram) {
			wx.miniProgram.navigateTo({
				url: "/pages/gssIndex/nianhuo"
			})
		} else {
			location.href = Config.webHome + "view/nianhuo-list.html"
		}
	}

	//年货按钮动画
	private nianhuoTwn() {
		egret.Tween.get(this.btn_nianhuo, { loop: true })
			.to({ scaleX: 1.1, scaleY: 1.1 }, 800)
			.to({ scaleX: 1, scaleY: 1 }, 800)
	}

	//进入互动场景
	private ToInteractiveScene() {
		SceneManager.toInteractiveScene();
	}

	//进入任务场景
	private ToTaskScene() {
		SceneManager.toTaskScene();
	}
	//进入动态场景
	private ToDynamicScene() {
		let treedata						//用户果树数据
		if (SceneManager.instance.landId == 1) {				//果园数据
			treedata = Datamanager.getOwnguoyuandata()
		}
		else if (SceneManager.instance.landId == 2) {			//菜园数据
			treedata = Datamanager.getOwncaiyuandata()
		}
		SceneManager.toDynamicScene(treedata);
	}

	//进入签到场景
	private ToSignInScene() {
		SceneManager.toSigninScene();
	}

	//进入化肥场景
	private TohuafeiScene() {
		SceneManager.tohuafeiScene();
	}

	//去商城
	private tostroe() {
		if (!SceneManager.instance.isMiniprogram) {
			sessionStorage.setItem("fromgame", "true");
			location.href = Config.webHome + "view/index.html"
		} else {
			wx.miniProgram.switchTab({
				url: "/pages/gssIndex/index"
			})
		}
	}



	//----------------------------------------------------------水壶点击和爱心点击(未完成)---------------------------------------------------------------------------//

	/**
	 * 使用爱心值
	 */
	private loveTouch() {
		SceneManager.sceneManager.getDuihuanScene().searchOwnPraise();			//获取好友点赞头像
		// NewHelp.getTopGoods();
		if (this.currentState == "havetree") {
			SceneManager.toDuihuanScene();
		}
		else if (this.currentState == "friendtree") {
			NewHelp.dianzan(Datamanager.getnowfrienddata().friendUser);
		}

		// NewHelp.removeTree(Datamanager.getNowtreedata());							//铲除果树

		// if (this.currentState == "friendtree") {
		// 	return;
		// }
		// let treedata;
		// if (SceneManager.instance.landId == 1) {
		// 	treedata = Datamanager.getOwnguoyuandata();				//自己果园数据
		// }
		// else if (SceneManager.instance.landId == 2) {
		// 	treedata = Datamanager.getOwncaiyuandata();				//自己菜园数据
		// }
		// if (!treedata) {
		// 	SceneManager.addNotice("您还没有种树哦！");
		// 	return
		// }
		// else {
		// 	let text: string = this.love_num.text;
		// 	text = text.substring(0, text.length - 1)
		// 	if (Number(text) >= 100) {
		// 		if (treedata.needTake == "true") {
		// 			let content = "需要先摘果子才能使用爱心值哦~"
		// 			let btn = "确定"
		// 			let ti = "(多多帮助好友可使您的小树更快成长哦！)"
		// 			SceneManager.addPrompt(content, btn, ti);
		// 		}
		// 		else {
		// 			NewHelp.useProp(2, treedata);
		// 		}
		// 	}
		// 	else if (Number(text) < 100) {
		// 		let content = "百分百爱心才能使用哦~"
		// 		let btn = "确定"
		// 		let ti = "(帮好友除虫/拔草/浇水/帮摘果获取爱心值哦)"
		// 		SceneManager.addPrompt(content, btn, ti);
		// 	}
		// }
	}


	/**
	 * 给自己果树浇水
	 */
	private addwater() {
		let treedata;
		if (SceneManager.instance.landId == 1) {
			treedata = Datamanager.getNowtreedata();				//自己果园数据
		}
		else if (SceneManager.instance.landId == 2) {
			treedata = Datamanager.getNowtreedata();				//自己菜园数据
		}
		let kettleNum: string = this.kettle_num.text;
		kettleNum = kettleNum.substring(0, kettleNum.length - 1);
		if (this.currentState == "havetree" && Number(kettleNum) >= 10) {
			NewHelp.useProp(1, treedata);		//1:使用水滴
		} else if (treedata.needTake == "true") {
			let content = "您需要先把树上成熟果子摘完才可以浇水哦~"
			let btn = "确定"
			let ti = "(篮子可以完成任务获得哦！)"
			SceneManager.addPrompt(content, btn, ti);
		} else if (Number(kettleNum) < 10) {
			let content = "您现在没有水滴可以浇哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}
	}


	/**
	 * 检查任务是否可领取
	 */
	public checktask(flag) {
		if (flag) {
			SceneManager.sceneManager.StageItems.task_gro.visible = true;
		}
		else if (!flag) {
			SceneManager.sceneManager.StageItems.task_gro.visible = false;
		}
	}
}