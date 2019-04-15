class newStageItems extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/StageitemsSkins.exml";
	}

	public BarGroup: eui.Group;			    //弹幕范围
	public share_friend: eui.Image;			//邀请帮摘果按钮
	public gro_pick: eui.Group;				//摘果手显示
	public pick_hand: eui.Image;			//摘果的手
	public pick_label: eui.BitmapLabel;		//摘果的文字
	public gro_steal: eui.Group				//偷水显示
	public steal_btn: eui.Image;			//偷水按钮
	public steal_label: eui.BitmapLabel;			//偷水的字
	private hasCheck = false;				//是否检查过好友
	public like_num: eui.Label;				//点赞数量
	private top_group: eui.Group;			//顶部消息
	public top_icon: eui.Group;				//顶部icon
	private sysmsg_group: eui.Image;		//系统消息
	public user_icon: eui.Image;			//用户头像图片
	public farm_name: eui.Label;			//农场名称
	public farm_group: eui.Group;
	public water_num: eui.Label;
	public btn_kettle: eui.Group;
	public act_red:eui.Rect;

	protected childrenCreated(): void {
		super.childrenCreated();
		// 创建完成后最终调用方法
		this.getTopMsg();						//顶部消息
		this.getSystemMsg();					//系统消息
		NewHelp.showtreelanguage();				//循环显示树语
		this.getFriends();
		if (!this.hasCheck) {
			SceneManager.sceneManager.checkAddFriend();
			this.hasCheck = true;
		}
	}

	private onComplete(): void {
		this.sysmsg_group.y = this.height - SceneManager.sceneManager._stage.height;
		this.top_group.y = this.height - SceneManager.sceneManager._stage.height + 14;
		this.top_icon.y = this.height - SceneManager.sceneManager._stage.height + 88 + 40 + 76;
		this.farm_group.y = this.height - SceneManager.sceneManager._stage.height + 14 + 6 + 68;
		this.currentState = "havetree";
		localStorage.setItem("isNewUser", "old");
		//创建完成立即调用方法
		NewHelp.getSignInInfo()												//查询签到信息
		NewHelp.searchAnswerStage();										//查询保存答题奖励数据
		SceneManager.sceneManager.getTaskScene().taskDataInit(this.checktask);
		this.iconTouchInit()																		//icon点击初始化
		this.share_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sharefriend, this)		//邀请好友帮摘果按钮
		this.pick_hand.once(egret.TouchEvent.TOUCH_TAP, this.PickFruit, this);			//帮摘果按钮点击监听
		this.steal_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.stealWater() }, this);			//偷水按钮点击监听
		this.sysmsg_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tosysmsginfo, this);
		this.BarGroup.touchThrough = true;
		NewHelp.checkActRed();
	}



	private info1: eui.Group;				//推送消息1
	private info2: eui.Group;				//推送消息2
	private str1: eui.Label;				//消息字段1
	private str2: eui.Label;				//消息字段2
	private img1: eui.Image;				//推送消息头像1
	private img2: eui.Image;				//推送消息头像2
	private mask_icon1: eui.Rect;			//头像遮罩1
	private mask_icon2: eui.Rect;			//头像遮罩2
	private n = 0;
	private m = 0;
	private topPage: number = 0				//当前页面
	private infodata: any[];				//消息数据
	private sysmsg_label: eui.Label;

	//查询好友列表
	public getFriends() {
		let params = {
			pageNo: 1,
			numPerPage: 10000
		};
		MyRequest._post("game/getFriends", null, this, this.Req_getFriends.bind(this), null);
	}

	//查询好友列表成功后处理
	private Req_getFriends(data): void {
		var Data = data;
		Datamanager.savefriendsdata(data.data.list);								//保存好友数据
	}



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
	public PickFruit() {
		if (this.currentState == "havetree") {
			let params = {
				treeUserId: Datamanager.getNowtreedata().id
			};
			MyRequest._post("game/harvestFruit", params, this, this.Req_harvestFruit.bind(this), () => {
				this.pick_hand.once(egret.TouchEvent.TOUCH_TAP, this.PickFruit, this);
			})
		}
		else if (this.currentState == "friendtree") {
			NewHelp.friendpick(Datamanager.getNowtreedata().id);
		}
	}

	/**
	 * 摘果之后处理
	 */
	private Req_harvestFruit(data) {
		console.log(data, "摘果完成数据")
		Help.pickTwn(5);
		Help.pickTwnupdata(this.pickafter);
	}

	/**
	 * 摘果之后更新数据
	 */
	private pickafter() {
		if (SceneManager.instance.landId == 1) {
			SceneManager.sceneManager.newmainScene.getOwnTree();						//更新果园数据
		}
		else if (SceneManager.instance.landId == 2) {
			SceneManager.sceneManager.newmain2Scene.getOwnTree();						//更新菜园数据
		}
		SceneManager.sceneManager.StageItems.pick_hand.once(egret.TouchEvent.TOUCH_TAP, SceneManager.sceneManager.StageItems.PickFruit, SceneManager.sceneManager.StageItems);
	}
	//---------------------------------------------------------------------系统消息---------------------------------------------------------------------//

	/**
	 * 进入系统消息详情
	 */
	private tosysmsginfo() {
		let guanggao = new GuanggaoScene(this.sysinfodata[this.m])
		SceneManager.sceneManager._stage.addChild(guanggao);
	}


	//查询系统消息
	public getSystemMsg() {
		MyRequest._post("game/getSystemInfo", null, this, this.Req_getSystemMsg.bind(this), null)
	}


	private sysinfodata = []; //系统消息数据
	//查询系统消息成功后处理
	private Req_getSystemMsg(data): void {
		this.sysinfodata = data.data;
		if (!this.sysinfodata || this.sysinfodata.length <= 0) {
			//如果没有数据 隐藏系统消息条
			this.sysmsg_group.visible = false;
			this.top_group.y = this.height - SceneManager.sceneManager._stage.height + 14;
			this.farm_group.y = this.height - SceneManager.sceneManager._stage.height + 14 + 6 + 68;
			this.top_icon.y = this.height - SceneManager.sceneManager._stage.height + 88 + 40 + 76;
		}
		else {	//有数据  显示系统消息条
			this.sysmsg_group.visible = true;
			this.top_group.y = this.height - SceneManager.sceneManager._stage.height + 14 + 54;
			this.farm_group.y = this.height - SceneManager.sceneManager._stage.height + 14 + 6 + 54 + 68;
			this.top_icon.y = this.height - SceneManager.sceneManager._stage.height + 142 + 40 + 76;
			this.showsysmsg(this.sysinfodata)
		}
	}

	/**
	 * data ：消息数据
	 */
	private showsysmsg(data) {
		if (data.length > 0) {
			if (this.m > data.length - 1) {
				this.m = 0
			}
			var title = data[this.m].title;
			this.sysmsg_label.text = title;
			egret.Tween.get(this.sysmsg_label)
				.set({ x: 610 })
				.to({ x: -(this.sysmsg_label.width) }, this.sysmsg_label.width * 15).call(() => { this.sysmsgnext(data) }, this);
		}
		console.log(data, "消息数据")
	}

	/**
	 * 下一条消息
	 */
	private sysmsgnext(data) {
		this.m++;
		this.showsysmsg(data)
	}
	//---------------------------------------------------------------------顶部消息---------------------------------------------------------------------//


	private toGuide() {
		SceneManager.guiedResource();			//进入引导页
	}


	//查询顶部消息
	//reload:是否从新刷新数据
	public getTopMsg(reload?: Boolean) {
		if (reload) {
			this.topPage = 0
			this.n = 0;
		}
		this.str1.text = "";
		this.img1.texture = null;
		this.str2.text = "";
		this.img2.texture = null;
		egret.Tween.removeTweens(this.str1);
		egret.Tween.removeTweens(this.img1);
		egret.Tween.removeTweens(this.str2);
		egret.Tween.removeTweens(this.img2);
		egret.Tween.removeTweens(this.mask_icon1);
		egret.Tween.removeTweens(this.mask_icon2);
		this.topPage = this.topPage + 1
		let data = {
			pageNo: this.topPage
		}
		MyRequest._post("game/getTopInfo", data, this, this.Req_getTopMsg.bind(this), null)
	}

	//查询顶部消息成功后处理
	private Req_getTopMsg(data): void {
		var Data = data;
		console.log(Data, "顶部消息")
		let maxPage = parseInt(Data.data.pages)
		if (this.topPage == maxPage) {
			//如果是最后一页，则下一次从首页开始
			this.topPage = 0
		}
		this.infodata = Data.data.list;
		if (Data.data.list.length == 0 && this.topPage == 1) {
			//如果第一页都没有数据，就是没数据
			this.getTopMsg(true);
			return
		}
		else {
			this.info1scr()
		}
		console.log("最大页:", maxPage, "当前页：", this.topPage)
	}

	private onlyFlag: boolean = false; 	//只有用户推送的情况需要的标记
	// 推送滚动1
	public info1scr() {
		if (this.infodata && this.infodata.length) {
			if (this.n >= this.infodata.length) {
				this.n = 0;
				this.getTopMsg()
				return
			}
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

			let params = {
				users: this.infodata[this.n].mainUser
			}
			MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.img1), null);
			this.str1.text = Help.getcharlength(info, 12);
			this.n++;
			var rect = this.str1;
			egret.Tween.get(rect)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000).call(this.info2scr, this)
				.to({ y: -40 }, 1000);

			var rect1 = this.img1;
			egret.Tween.get(rect1)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000)
				.to({ y: -40 }, 1000);

			var rect2 = this.mask_icon1;
			egret.Tween.get(rect2)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000)
				.to({ y: -40 }, 1000);
		}
		else {
			this.getTopMsg(true)
		}
	}

	/**
	 * 推送滚动2 flag 是否调用滚动1
	 * 
	* */
	public info2scr() {
		if (this.infodata && this.infodata.length) {
			if (this.n >= this.infodata.length) {
				this.n = 0;
				this.getTopMsg()
				return
			}
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

			let params = {
				users: this.infodata[this.n].mainUser
			}
			MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.img2), null);
			this.str2.text = Help.getcharlength(info, 12);
			this.n++;
			var rect = this.str2;
			egret.Tween.get(rect)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000).call(this.info1scr, this)
				.to({ y: -40 }, 1000);

			var rect1 = this.img2;
			egret.Tween.get(rect1)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000)
				.to({ y: -40 }, 1000);

			var rect2 = this.mask_icon2;
			egret.Tween.get(rect2)
				.set({ y: 40 })
				.to({ y: 2 }, 1000)
				.wait(2000)
				.to({ y: -40 }, 1000);
		}
		else {
			this.getTopMsg(true)
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


	//---------------------------------------------------------------------icon点击(未完成)---------------------------------------------------------------------//

	private btn_dynamic: eui.Group;			//动态按钮
	private btn_signin: eui.Group;			//签到按钮
	private btn_task: eui.Group;			//任务按钮
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
	public gro_lq: eui.Group;				//水壶冷却
	public kettle_num: eui.BitmapLabel;			//水壶水量
	public img_kettle: eui.Image;			//水壶图片
	public frimg_kettle: eui.Image;			//好友水壶
	public time_lq: eui.BitmapLabel;				//冷却时间
	public love_group: eui.Group;			//获赞区域
	public img_water: eui.Image;			//水滴图片
	private friend_kettle: eui.Group;		//帮好友浇水区域
	private btn_nianhuo: eui.Image;			//年货按钮
	public chanzi_btn: eui.Image;			//铲子
	public tootherland: eui.Image;			//菜园/果园按钮
	public tofriend: eui.Image;				//好友按钮
	public friend_love_num: eui.Label;		//好友获赞数量
	public friend_love_group: eui.Group;	//好友点赞区域
	public btn_warehouse: eui.Image;			//仓库按钮
	public fruit_label: eui.Label;			//果子数量
	public fruit_img: eui.Image;				//果实图片
	public btn_activity: eui.Group;


	/**
	 * 	icon点击初始化
	 */
	private iconTouchInit() {
		NewHelp.updateprop();																					//道具数量显示	
		this.btn_warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toWarehouse, this);
		this.btn_dynamic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToDynamicScene, this);				//动态按钮点击监听
		this.btn_signin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSignInScene, this);					//签到按钮点击监听
		this.btn_task.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToTaskScene, this);						//任务按钮点击监听
		this.btn_fertilizer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TohuafeiScene, this);				//化肥按钮点击监听
		this.btn_store.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tostroe, this);						//商城按钮点击监听
		this.hudong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToInteractiveScene, this);			//互动按钮点击监听
		this.btn_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addwater, this);						//自己水壶点击监听
		this.love_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loveTouch, this);						//爱心区域点击监听
		this.btn_activity.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSignInScene, this);
		this.btn_nianhuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tonianhuo, this);					 //年货按钮点击监听
		this.gro_lq.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.lqfast() }, this);				 //水壶冷却点击监听
		this.friend_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.friendWater() }, this)	 //帮好友浇水点击监听
		this.chanzi_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.removetree, this)						 //铲除果树监听
		this.tootherland.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toOtherLand, this)					 //去到其他土地监听
		this.tofriend.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { SceneManager.tofriendScene() }, this) //去到好友界面
		this.friend_love_group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.dianzan(Datamanager.getnowfrienddata().friendUser) }, this); //给好友点赞监听
		this.nianhuoTwn();
	}

	public canreward: boolean = true;


	/**
	 * 仓库
	 */

	private toWarehouse() {
		SceneManager.toWarehouseScene()
	}


	/**
	 * 去其他土地
	 */
	private toOtherLand() {
		if (SceneManager.sceneManager.landId == 1) {	//当前是果园
			SceneManager.toNewMain2Scene();
			if (this.currentState == "havetree") {            //自己农场
				SceneManager.sceneManager.newmain2Scene.getOwnTree();
			}
			else if (this.currentState == "friendtree") {         //好友农场
				let nowtreeid = Datamanager.getfriendtreeUseridByUser(Datamanager.getnowfrienddata().friendUser)
				if (nowtreeid) {
					NewHelp.getTreeInfoByid(nowtreeid);
				}
				else {
					SceneManager.sceneManager.newmain2Scene.updateBytreedata(null);
				}
			}
			Help.passAnm();
		}
		else if (SceneManager.sceneManager.landId == 2) {			//当前是菜园
			SceneManager.toNewMainScene();
			if (this.currentState == "havetree") {            //自己农场
				SceneManager.sceneManager.newmainScene.getOwnTree();
			}
			else if (this.currentState == "friendtree") {         //好友农场
				let nowtreeid = Datamanager.getfriendtreeUseridByUser(Datamanager.getnowfrienddata().friendUser)
				if (nowtreeid) {
					NewHelp.getTreeInfoByid(nowtreeid);
				}
				else {
					SceneManager.sceneManager.newmainScene.updateBytreedata(null);
				}
			}
			Help.passAnm();
		}
	}

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



	//----------------------------------------------------------水壶点击和爱心点击---------------------------------------------------------------------------//




	/**
	 * 点击获赞区域
	 */
	private loveTouch() {
		SceneManager.sceneManager.getDuihuanScene().searchOwnPraise();			//获取好友点赞头像
		SceneManager.toDuihuanScene();
	}

	/**
	 * 
	 */


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
			this.btn_kettle.touchEnabled = false;
		} else if (treedata.needTake == "true") {
			let content = "您需要先把树上成熟果子摘完才可以浇水哦~"
			let btn = "确定"
			let ti = ""
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