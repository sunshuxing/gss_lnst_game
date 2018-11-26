class MainScene extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/MainSkins.exml";
	}

	public gameTreedata: TreeUserData;		//用户果树数据
	private treelanguagedata: any[];			//树语数据
	private friendsdata: any[];				//好友数据
	private ownPropdata: any[];				//自己道具数据

	private gro_fruit: eui.Group;		//果实区域
	private gro_prop: eui.Group;			//果园道具区域
	private logo: eui.Image;   			//风车图片
	private tree: eui.Image;				//果树图片
	private info1: eui.Group;			//推送消息1
	private info2: eui.Group;			//推送消息2
	private str1: eui.Label;				//消息字段1
	private str2: eui.Label;				//消息字段2
	private img1: eui.Image;				//推送消息头像1
	private img2: eui.Image;				//推送消息头像2
	private garden_name: eui.Label;		//果园名称
	private tree_name: eui.Label;		//果树名称
	private cloud1: eui.Image;			//云朵1
	private cloud2: eui.Image;			//云朵2
	private cloud3: eui.Image;			//云朵3
	private barragegroup: eui.Group; 	//单个弹幕容器
	private BarGroup: eui.Group;			//弹幕范围
	private bg_mask: eui.Group;			//透明遮罩
	private btn_signin: eui.Image;		//签到按钮
	private btn_dynamic: eui.Image;		//动态按钮
	private btn_task: eui.Image;			//任务按钮
	private btn_fertilizer: eui.Image;	//化肥按钮
	private btn_pick: eui.Image;			//采摘按钮
	private user_name: eui.Label;		//用户名称
	private friend_scr: eui.Scroller;	//好友列表滑动框
	private friend_list: eui.List;		//好友列表
	private add_friend: eui.Group;		//添加好友
	private progress: eui.ProgressBar;	//进度条
	private gro_kettle: eui.Group;		//水壶点击区域
	private gro_lq: eui.Group;			//水壶冷却
	private kettle_num: eui.Label;		//水壶水量
	private img_kettle: eui.Image;		//水壶图片
	private gro_love: eui.Group;			//爱心值区域
	private love_num: eui.Label;			//爱心值数字
	private img_water: eui.Image;		//水滴图片
	private mainState: string;			//主頁狀態
	private self_tree: eui.Group;		//自己果园
	private infodata: any[];				//消息数据
	private sysinfodata: any[];			//系统消息
	private sanj: eui.Image;				//冷却线
	private time_lq: eui.Label;			//冷却时间
	private gro_tree: eui.Group;			//果树点击区域
	private pick_num: eui.Label;			//篮子数量
	private progress_label: eui.Label;	//进度条提示
	private steal_btn: eui.Image;		//可偷的水滴
	private user_icon: eui.Image;		//用户头像
	private friend_kettle: eui.Group;	//帮好友浇水
	private progress1: eui.ProgressBar;	//果子进度条
	private frimg_kettle: eui.Image;


	/**
	 * 沒有果樹的
	 */

	private RadioBtn1: eui.RadioButton;
	private RadioBtn2: eui.RadioButton;
	private RadioBtn3: eui.RadioButton;
	private RadioBtn4: eui.RadioButton;
	private RadioBtn5: eui.RadioButton;
	private RadioBtn6: eui.RadioButton;
	private seed_btn: eui.Image;             //领取按钮
	private seed_id;						//种子id
	private seed_value;



	//好友果园
	private toushui_btn: eui.Image;			//偷水按钮
	private steal_hand:eui.Image;			//偷水的手
	private no_tou_btn: eui.Image;			//不能偷水按钮
	private hudong_btn: eui.Image;			//互动按钮
	private friendUser: string;				//好友


	// private webSocket:egret.WebSocket; 	//网络连接
	private n = 0;
	private m = 0;
	private a = 0;							//冷却计时

	private loadLeaveMsg: boolean = true;			//是否需要加载留言模板（当第一次进入时需要）
	private leaveMsgTemplateList: Array<LeaveMsgTemplate>;		//留言模板对象列表
	private nowTreeUserId: string			//当前果树id
	private ownTreeUserId: string;			//自己的果树id

	protected childrenCreated(): void {
		super.childrenCreated();
		this.str1.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.str2.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.img1.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img2.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.friend_scr.horizontalScrollBar = null;
		//沒有果樹
		this.seed_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getSeed, this)
		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
		this.RadioBtn1.group = radioGroup;
		this.RadioBtn2.group = radioGroup;
		this.RadioBtn3.group = radioGroup;
		this.RadioBtn4.group = radioGroup;
		this.RadioBtn5.group = radioGroup;
		this.RadioBtn6.group = radioGroup;
		console.log("childrenCreated");
	}

	public initData(){
		this.getTreeLanguage();				//树语数据
		this.getTopMsg();					//顶部消息
		this.getFriends();					//好友数据
		this.getOwnTree();					//自己果树数据
		this.logorot();
		this.cloudTwn();
		this.getSystemMsg();				//系统消息
	}

	private onComplete(): void {
		console.log("onComplete");
		this.addEventListener(PuticonEvent.PUTGRASS, this.putgrass, this);
		this.addEventListener(PuticonEvent.PUTINSECT, this.putinsect, this);
		this.addEventListener(MaskEvent.REMOVEMASK, this.removemask, this);
		this.addEventListener(PuticonEvent.USEHUAFEI, this.huafeiTwn, this);
		this.bg_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mask_touch, this);
		this.btn_task.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToTaskScene, this);
		this.btn_dynamic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToDynamicScene, this);
		this.add_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addfriend, this);
		this.img_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addwater, this);
		this.btn_signin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSignInScene, this);
		this.hudong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToInteractiveScene, this);
		this.self_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSelfTree, this);
		this.btn_pick.addEventListener(egret.TouchEvent.TOUCH_TAP, this.PickFruit, this);
		this.gro_lq.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lqfast, this);
		this.steal_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toushui, this);
		this.btn_fertilizer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TohuafeiScene, this);
		this.gro_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.treeTouch, this);
		this.gro_love.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loveTouch, this);
		this.friend_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.friend_water, this)
	}

	//设置主页状态
	private setState(State) {
		if (State == "havetree") {
			this.currentState = "havetree";
		}
		if (State == "notree") {
			this.currentState = "notree";
		}
		if (State == "friendtree") {
			this.currentState = "friendtree";
		}
	}


	//偷水
	private toushui() {
		egret.Tween.get(this.steal_hand)
			.to({ y: 782, x: 498, alpha: 1 }, 500)
			.wait(500)
			.to({ y: 1046.67, x: 468, alpha: 1 }).call(this.checkSteal.bind(this,this.nowTreeUserId))
		this.stealWater(this.friendUser, this.nowTreeUserId);
	}

	//摘果子
	private PickFruit() {
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// let fruitNum = this.getPropById(3);
		// if(fruitNum && fruitNum.num!=null && fruitNum.num > 0 && this.gameTreedata.needTake == "true"){
		// 	this.useProp(3)
		// 	this.gro_fruit.removeChildAt(0);
		// 	this.getOwnTree();
		// }
		if (Number(this.pick_num.text) > 0 && this.gameTreedata.needTake == "true") {
			this.useProp(3);
		}else if(this.gameTreedata.needTake == "false"){
			let content = "您现在还不能使用篮子哦~"
			let btn = "确定"
			let ti = "(快让您的小树快快成长吧！)"
			SceneManager.addPrompt(content, btn, ti);
		}
	}

	//使用爱心值
	private loveTouch() {
		if (Number(this.love_num.text) >= 100) {
			if(Help.getTreeUserData().needTake == "true"){
				let content = "需要先摘果子才能使用爱心值哦~"
				let btn = "确定"
				let ti = "(多多帮助好友可使您的小树更快成长哦！)"
				SceneManager.addPrompt(content, btn, ti);
			}
			else{
				this.useProp(2);
			}
		}
		else if (Number(this.love_num.text) < 100) {
			let content = "您的爱心值不够兑换成长值哦！"
			let btn = "确定"
			let ti = "(为好友除虫除草可增加爱心值哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}
	}

	//浇水
	private addwater() {
		let canWater = false;
		canWater = this.gameTreedata.growthValue != this.gameTreedata.stageObj.energy && ((this.gameTreedata.needTake == null ? 'false' : this.gameTreedata.needTake) == 'false');
		if (canWater && this.currentState == "havetree" && Number(this.kettle_num.text) >= 10) {
			this.useProp(1);		//1:使用水滴
		}  else if(this.gameTreedata.needTake == "true") {
			let content = "您需要先把树上成熟果子摘完才可以浇水哦~"
			let btn = "确定"
			let ti = "(篮子可以完成任务获得哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}else if(Number(this.kettle_num.text) < 10){
			let content = "您现在没有水滴可以浇哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}
	}

	// 风车图片旋转
	private logorot() {
		egret.Tween.get(this.logo, { loop: true })
			.to({ rotation: 360 }, 10000);
	}
	// 果树图片点击事件
	private treeTouch() {
		this.gro_tree.touchEnabled = false;
		egret.Tween.get(this.tree)
			.to({ scaleX: 1.12, scaleY: 1.12 }, 200)
			.wait(150)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ scaleX: 1.1, scaleY: 1.1 }, 200)
			.to({ scaleX: 1, scaleY: 1 }, 200).call(this.treeEad, this);

		// 所有树语中随机一个
		let n = Help.random_num(0, this.gettreeLanguageByStage(this.gameTreedata.stage).length - 1)
		SceneManager.addtreePrompt(this.gettreeLanguageByStage(this.gameTreedata.stage)[n].msg);
	}

	//根据阶段值获取树语
	private gettreeLanguageByStage(stage) {
		let data: any[] = []
		for (let i = 0; i < this.treelanguagedata.length; i++) {
			if (this.treelanguagedata[i].stage == stage && this.treelanguagedata[i].isStage) {
				data.push(this.treelanguagedata[i]);
			}
			if (this.treelanguagedata[i].isStage == "false") {
				data.push(this.treelanguagedata[i]);
			}
		}
		return data;
	}

	/**
	 * 获取留言模板
	 */
	private getLeaveMsgTemplate() {
		MyRequest._post("game/getLeaveMsgTemplate", null, this, this.Req_LeaveMsgTemplate.bind(this), null)
	}

	/**
	 * 留言模板回调
	 */
	private Req_LeaveMsgTemplate(Data) {
		this.leaveMsgTemplateList = Data.data
		//加载留言
		this.getTreeLeaveMsg(this.nowTreeUserId)
	}


	// 添加果树图片点击
	private treeEad() {
		this.gro_tree.touchEnabled = true;
	}


	// 推送滚动1
	public info1scr() {
		if (this.infodata && this.infodata.length > 0) {
			if (this.n >= this.infodata.length) {
				this.n = 0;
			}
			HttpRequest.imageloader(this.infodata[this.n].mainUserIcon, this.img1);
			this.str1.text = this.infodata[this.n].mainUserName + "的" + this.infodata[this.n].treeName + this.infodata[this.n].stageName + "了！"
			this.n++;
			var rect: egret.Rectangle = this.str1.scrollRect;
			egret.Tween.get(rect)
				.set({ y: -50 })
				.to({ y: 0 }, 1000)
				.wait(2000).call(this.info2scr, this)
				.to({ y: 50 }, 1000);

			var rect1: egret.Rectangle = this.img1.scrollRect;
			egret.Tween.get(rect1)
				.set({ y: -50 })
				.to({ y: 0 }, 1000)
				.wait(2000)
				.to({ y: 50 }, 1000);
		}
		else {
			this.info2scr()
		}
	}

	// 推送滚动2			
	public info2scr() {
		if (this.infodata && this.infodata.length > 0) {
			if (this.m >= this.sysinfodata.length) {
				this.m = 0;
			}
			var imgurl = "http://192.168.3.10:8080/gssmanage"
			// HttpRequest.imageloader(imgurl+this.sysinfodata[this.m].icon,this.img2)
			this.str2.text = this.sysinfodata[this.m].title;
			this.m++;
			var rect: egret.Rectangle = this.str2.scrollRect;
			egret.Tween.get(rect)
				.set({ y: -60 })
				.to({ y: 0 }, 1000)
				.wait(2000).call(this.info1scr, this)
				.to({ y: 60 }, 1000);

			var rect1: egret.Rectangle = this.img2.scrollRect;
			egret.Tween.get(rect1)
				.set({ y: -65 })
				.to({ y: -5 }, 1000)
				.wait(2000)
				.to({ y: 55 }, 1000);
		}
	}


	// 云朵飘动
	private cloudTwn() {
		// 云朵1
		egret.Tween.get(this.cloud1, { loop: true })
			.to({ x: this.cloud1.x + 80 }, 10000)
			.to({ x: this.cloud1.x }, 10000)

		// // 云朵2
		// egret.Tween.get(this.cloud2,{loop:true})
		// .to({x:this.cloud2.x+140},13000) 
		// .to({x:this.cloud2.x-40},13000)
		// .to({x:this.cloud2.x},2888)

		// 云朵3
		egret.Tween.get(this.cloud3, { loop: true })
			.to({ x: this.cloud3.x - 120 }, 8000)
			.to({ x: this.cloud3.x }, 8000)
	}

	// 弹幕滚动
	private addBarrage(dataList: Array<LeaveMsgUser>) {
		for (let i = 0; i < dataList.length; i++) {

			let barragbg = new eui.Image;		//弹幕背景
			let barragicon = new eui.Image;		//弹幕头像
			let bariconmask = new eui.Rect;		//弹幕头像遮罩
			this.barragegroup = new eui.Group;	//弹幕容器
			let barragetext = new eui.Label;	//弹幕内容

			//添加单个弹幕容器 
			this.barragegroup.x = 750;			//弹幕位置随机
			this.barragegroup.y = 300 + Help.random_num(1, 3) * 60;
			this.barragegroup.width = 414;
			this.barragegroup.height = 72;
			this.BarGroup.addChild(this.barragegroup);

			//添加弹幕背景
			barragbg.x = 0;
			barragbg.y = 0;
			barragbg.width = 414;
			barragbg.height = 72;
			barragbg.texture = RES.getRes('barragebg-green');
			this.barragegroup.addChild(barragbg);

			//添加弹幕头像
			barragicon.x = 7;
			barragicon.y = 16;
			barragicon.width = 46;
			barragicon.height = 46;
			// barragicon.texture = RES.getRes(TestData.leaveMsgUserdata[i].mainUserIcon);
			if (dataList[i].mainUserIcon) {
				HttpRequest.imageloader(dataList[i].mainUserIcon, barragicon);	//加载网络头像
			}
			this.barragegroup.addChild(barragicon);

			//添加弹幕头像遮罩
			bariconmask.x = 7;
			bariconmask.y = 14;
			bariconmask.width = 46;
			bariconmask.height = 46;
			bariconmask.ellipseWidth = 46;
			bariconmask.ellipseHeight = 46;
			this.barragegroup.addChild(bariconmask);
			barragicon.mask = bariconmask;

			//添加弹幕内容
			barragetext.x = 78;
			barragetext.y = 28;
			barragetext.size = 24;
			// barragetext.text = TestdataHelp.getleaveMsgById(TestData.leaveMsgUserdata[i].templateId);
			barragetext.text = this.getLeaveMsgByTemplateId(dataList[i].templateId)
			barragetext.textColor = 0x0F3B00;
			barragetext.fontFamily = "SimHei";
			this.barragegroup.addChild(barragetext);


			//弹幕飘动
			egret.Tween.get(this.barragegroup)
				.wait(i * 3000)
				.to({ x: -430 }, 8000)
		}
		var timer: egret.Timer = new egret.Timer(17000, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.removeBarrage, this);
		timer.start();
	}

	/**
	 * 通过模板id获取留言内容
	 */
	private getLeaveMsgByTemplateId(templateId): string {
		if (this.leaveMsgTemplateList) {
			for (let a = 0; a < this.leaveMsgTemplateList.length; a++) {
				if (this.leaveMsgTemplateList[a].id == templateId) {
					return this.leaveMsgTemplateList[a].msg;
				}
			}
		}
		return null
	}

	//移除弹幕容器
	private removeBarrage() {
		if (this.barragegroup&&this.barragegroup.parent) {
			this.barragegroup.parent.removeChildren();
		}
	}

	//进入互动场景
	private ToInteractiveScene() {
		this.addmask();
		SceneManager.toInteractiveScene();
	}

	//进入任务场景
	private ToTaskScene() {
		this.addmask();
		SceneManager.toTaskScene();
	}
	//进入动态场景
	private ToDynamicScene() {
		this.addmask();
		SceneManager.toDynamicScene();
	}

	//进入签到场景
	private ToSignInScene() {
		this.addmask();
		SceneManager.toSigninScene();
	}

	private TohuafeiScene() {
		this.addmask();
		SceneManager.tohuafeiScene();
	}


	//点击透明遮罩关闭场景
	private mask_touch() {
		this.bg_mask.visible = false;
		SceneManager.toMainScene();
	}

	//添加透明遮罩
	private addmask() {
		this.bg_mask.visible = true;
	}

	//移除透明遮罩
	private removemask() {
		this.bg_mask.visible = false;
	}

	//添加好友

	private addfriend() {
		SceneManager.addJump();
		let url = SceneManager.instance.weixinUtil.shareData.shareUrl
		let addFriend = MyRequest.geturlstr("addFriend",url)
		if(!addFriend){
			SceneManager.instance.weixinUtil.shareData.shareUrl = url+"&addFriend=true"
		}
		SceneManager.instance.weixinUtil._openShare();
		// let baoxiang = new BaoxiangScene();
		// this.addChild(baoxiang);
	}

	/**
	 * 沒有果樹
	 */

	//查詢可以領取的果樹id
	private getSeenId() {
		MyRequest._post("game/getTree", null, this, this.requestGetTree.bind(this), this.onGetIOError)
	}

	//查询可领取果树成功
	private requestGetTree(data): void {
		var treedata = data;
		console.log(treedata, "领取果树信息")
		var arr: any[] = [];
		if (treedata.status == 1) {
			console.log("请求错误", treedata.msg)
		}
		else {
			if (treedata.data && treedata.data.length > 0) {
				for (let i = 0; i < treedata.data.length; i++) {
					arr.push(treedata.data[i].id);
					this.seed_id = arr;
				}
			}
		}
	}


	//请求错误
	private onGetIOError(event: egret.IOErrorEvent): void {
		console.log("get error : " + event);
	}


	//领取种子列表
	private radioChangeHandler(evt: eui.UIEvent): void {
		if (this.seed_id && this.seed_id.length > 0) {
			this.RadioBtn1.value = this.seed_id[0];
			this.RadioBtn2.value = this.seed_id[1];
			this.RadioBtn3.value = this.seed_id[2];
			this.RadioBtn4.value = this.seed_id[3];
			this.RadioBtn5.value = this.seed_id[4];
			this.RadioBtn6.value = this.seed_id[5];
		}
		var radioGroup: eui.RadioButtonGroup = evt.target;
		this.seed_value = radioGroup.selectedValue;
		console.log(radioGroup.selectedValue);
	}


	//获取种子
	private getSeed(treeId) {
		let params = {
			treeId: this.seed_value,
			friendSign: SceneManager.instance.friendSign	//分享标识，如果有，则是通过分享进入
		};
		MyRequest._post("game/receiveTree", params, this, this.requestreceiveTree.bind(this), this.onGetIOError)
	}

	//获取种子成功
	private requestreceiveTree(data): void {
		var Data = data;
		console.log(Data)
		this.setState("havetree");
		this.getOwnTree();
		let baoxiang = new BaoxiangScene();
		this.addChild(baoxiang);

	}


	//查询自己的果树
	public getOwnTree() {
		MyRequest._post("game/getOwnTree", null, this, this.requestgetOwnTree.bind(this), this.onGetIOError)
	}

	private init(data) {
		console.log("数据", data);
		if(this.currentState == "havetree"){
			this.gro_love.touchChildren = true;
		}else{
			this.gro_love.touchEnabled = false;
			this.gro_love.touchChildren = false;
		}
		this.tree_name.text = data.treeName;			//果树名称
		this.garden_name.text = Help.getcharlength(data.userName, 5);			//果园名称
		this.progress.maximum = data.stageObj.energy;	//进度条最大值
		this.progress.minimum = 0;						//进度条最小值
		this.progress.slideDuration = 5000;				//进度条速度		
		this.progress.value = data.growthValue;			//进度条当前值
		this.treeUpdate(data);							//果树显示
		this.gameTreedata = data;						//当前用户果树数据
		this.getTreeProp(data.id);						//查询当前果园道具和显示
		if (this.currentState == "havetree") {
			this.progress_label.text = "还需要" + (Number(data.stageObj.energy) - Number(data.growthValue)) + "成长值才到一下阶段"
		}
	}

	//查询自己果树回调
	private requestgetOwnTree(data): void {
		var treedata = data;


		if (treedata.data) {
			if(treedata.data.canReceive == "true"){
				let params = {
					treeUserId:treedata.data.id,
					treeId:treedata.data.treeId
				}; 
				let _str = WeixinUtil.prototype.urlEncode(params,null,null,null);
				window.location.href = Config.webHome+"/view/game-exchange.html"+_str;
			}else{
				this.setState("havetree");
				Help.saveTreeUserData(treedata.data);				//保存果树数据
				this.user_name.text = Help.getcharlength(treedata.data.userName,3);
				HttpRequest.imageloader(treedata.data.userIcon,this.user_icon);
				this.progress.value = 0;
				this.progress.slideDuration = 0;
				if(treedata.data.stage >= 4){
				this.progress1.maximum = treedata.data.exchangeNum;							//装箱需要的果子总数
				this.progress1.minimum = 0;
				// if(treedata.data.obtainFruitNum>treedata.data.exchangeNum){
				// 	this.progress1.value = treedata.data.exchangeNum;
				// }
					this.progress1.value = treedata.data.obtainFruitNum; 						//当前收获果子树
					this.progress1.visible = true;
				}
				else {
					this.progress1.visible = false;
				}
				this.getOwnProp();
				this.init(treedata.data);
				if (this.loadLeaveMsg) {//如果需要加载留言
					this.nowTreeUserId = treedata.data.id;
					this.ownTreeUserId = treedata.data.id;
					this.loadLeaveMsg = false;
					this.getLeaveMsgTemplate()
				}
			}
		}
		else {
			this.setState("notree");
			this.getSeenId();
		}
	}



	//更新果树树
	private treeUpdate(data) {
		this.gro_fruit.removeChildren();
		this.tree.texture = RES.getRes(Help.getTreeIconBystage(data.stage, 1, data.needTake));
		Help.getTreeHWBystage(data.stage, this.tree);
	}




	//查询自己的道具
	public getOwnProp() {
		MyRequest._post("game/getOwnProp", null, this, this.Req_getOwnProp.bind(this), this.onGetIOError)
	}

	//查询自己的道具成功后处理
	private Req_getOwnProp(data): void {
		var Data = data;
		console.log(Data, "自己道具数据")
		//显示自己道具数值
		this.love_num.text = Help.getPropById(Data.data, 2) ? Help.getPropById(Data.data, 2).num : 0;				//爱心值数量
		this.kettle_num.text = Help.getPropById(Data.data, 1) ? Help.getPropById(Data.data, 1).num : 0;			//水滴数量
		this.pick_num.text = Help.getPropById(Data.data, 3) ? Help.getPropById(Data.data, 3).num : 0;				//篮子数量
	}

	//查询果园道具(虫，草)	treeUserId：用户果树id
	private getTreeProp(treeUserId) {
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/getTreeProp", params, this, this.Req_getTreeProp.bind(this), this.onGetIOError)
	}

	//查询果园道具成功后处理
	private Req_getTreeProp(data): void {
		this.gro_prop.removeChildren();
		var Data = data;
		this.showtreeprop(Data.data);					//显示虫和草
		console.log(Data, "果园道具数据")
	}


	//获取树语数据
	private getTreeLanguage() {
		MyRequest._post("game/getTreeLanguage", null, this, this.Req_getTreeLanguage.bind(this), this.onGetIOError)
	}


	//树语数据
	private Req_getTreeLanguage(data): void {
		var Data = data;
		this.treelanguagedata = Data.data
		console.log(this.treelanguagedata, "树语数据")
	}



	//查询顶部消息
	private getTopMsg() {
		MyRequest._post("game/getTopInfo", null, this, this.Req_getTopMsg.bind(this), this.onGetIOError)
	}

	//查询顶部消息成功后处理
	private Req_getTopMsg(data): void {
		var Data = data;
		this.infodata = Data.data.list;
		this.info1scr();
		console.log(Data, "顶部消息数据")
	}


	//查询系统消息
	private getSystemMsg() {
		MyRequest._post("game/getSystemInfo", null, this, this.Req_getSystemMsg.bind(this), this.onGetIOError)
	}

	//查询系统消息成功后处理
	private Req_getSystemMsg(data): void {
		var Data = data;
		this.sysinfodata = Data.data;
		console.log(Data, "系统消息数据")
	}


	//查询好友列表
	public getFriends() {
		MyRequest._post("game/getFriends", null, this, this.Req_getFriends.bind(this), this.onGetIOError);
	}

	//查询好友列表成功后处理
	private Req_getFriends(data): void {
		var Data = data;
		this.friendlistUpdate(Data.data);
		console.log(Data, "好友列表数据")
	}



	//更新好友列表
	private friendlistUpdate(data) {
		// 转成eui数据
		let euiArr: eui.ArrayCollection = new eui.ArrayCollection(data);
		// 把list_hero数据源设置成euiArr
		this.friend_list.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.friend_list.itemRenderer = FriendList_item;
		this.friend_list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.toOtherTree, this)
	}

	//进入他人果园
	private toOtherTree() {
		//查询好友果树数据
		if (this.friend_list.selectedItem.treeUserId != this.gameTreedata.id && this.friend_list.selectedItem.treeUserId) {
			this.setState("friendtree");
			this.friendUser = this.friend_list.selectedItem.friendUser		//好友
			let friendTreeUserId = this.friend_list.selectedItem.treeUserId;
			this.getTreeInfoByid(friendTreeUserId);
			//查询是否可以偷水
			this.checkSteal(friendTreeUserId)
			if (this.loadLeaveMsg) {
				this.nowTreeUserId = friendTreeUserId
				this.getLeaveMsgTemplate()
			} else {
				this.nowTreeUserId = friendTreeUserId
				this.getTreeLeaveMsg(friendTreeUserId)
			}
		}
		if (!this.friend_list.selectedItem.treeUserId) {
			//分享弹窗
		}

	}

	/**
	 * 检查是否可以偷水
	 */
	private checkSteal(friendTreeUserId) {
		let data = {
			treeUserId: friendTreeUserId
		}
		MyRequest._post("game/checkSteal", data, this, this.Req_checkSteal.bind(this), null)
	}

	/**
	 * 是否可以偷水回调
	 */
	private Req_checkSteal(data) {
		data = data.data
		if (data.canSteal == "true") {//可以偷水
			this.steal_btn.visible = true;
			egret.Tween.get(this.steal_btn, { loop: true })
			.to({ y: 780 }, 1000)
			.to({ y: 774 }, 1000)
			this.steal_hand.visible = true;
			this.no_tou_btn.visible = false;
		} else {//不能偷水，隐藏水滴，并且把错误信息绑定//*** */
			this.steal_btn.visible = false;	//隐藏水滴
			this.steal_hand.visible = false;
			this.no_tou_btn.visible = true;
			this.no_tou_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				SceneManager.addNotice(data.msg)
			}, this)
		}
	}


	//除去果园道具(草，虫)    treePropId：果树道具id
	private removeTreeProp(icon, id) {
		let params = {
			treePropId: id
		};
		MyRequest._post("game/removeTreeProp", params, this, this.Req_removeTreeProp.bind(this, icon), this.onGetIOError)
	}

	//除去果园道具成功后处理
	private Req_removeTreeProp(icon, data): void {
		var Data = data;
		this.gro_prop.removeChild(icon);
		let content = ""
		if(Data.data.loveCount>0){
			content = "清除成功,获得爱心值x"+Data.data.loveCount+"！"
			this.love_num.text = String(Number(this.love_num.text)+Number(Data.data.loveCount))
		}else{
			content = "清除成功！"
		}
		let btn = "确定"
		let ti = "(多多帮助好友清除可使您的小树更快成长！)"
		SceneManager.addPrompt(content, btn, ti);
		console.log(Data, "除去果园道具数据")
	}

	//使用道具				propId:道具种类id
	private useProp(propId) {
		let canUseProp = this.gameTreedata.canReceive == null ? "false" : this.gameTreedata.canReceive;
		if (canUseProp == 'true') {
			console.log("果树已经可以兑换啦，不用再使用道具了。")
			return;
		}
		let params = {
			propId: propId
		};
		MyRequest._post("game/useProp", params, this, this.Req_useProp.bind(this, propId), this.onGetIOError);
	}

	//使用道具成功后处理
	private Req_useProp(propId, data): void {
		var Data = data;
		if (propId == 1) {
			this.kettleTwn();			//使用水滴之后更新在动画中完成
		}
		else if(propId == 2){
			this.getOwnTree();
			let content = "您的爱心值已兑换成长值！"
			let btn = "确定"
			let ti = "(多多帮助好友可使您的小树更快成长哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}
		else if(propId == 3){
			Help.pickTwn(5);
		}
		else {
			this.getOwnTree();
		}
		console.log("使用道具消息:", Data)
	}

	//回到自己果园
	private ToSelfTree() {
		if (this.currentState != "havetree") {
			this.getOwnTree();
			this.setState("havetree");
			this.getTreeLeaveMsg(this.ownTreeUserId)	//这时候肯定有自己果树id和模板信息了
		}
	}


	private friend_water() {
		this.friendWater(this.gameTreedata.id);
	}


	//帮好友浇水
	private friendWater(treeUserId) {
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/friendWater", params, this, this.Req_friendWater.bind(this), this.onGetIOError)
	}

	//帮好友浇水后的处理
	private Req_friendWater(data): void {
		var Data = data;
		egret.Tween.get(this.frimg_kettle)
			.to({ y: -130 }, 500)
			.to({ x: -29, y: -170, rotation: -54 }, 500).call(this.waterTwn, this)
			.wait(1200)
			.to({ y: -130, rotation: 0 }, 500)
			.to({ y: 80, x: 100 }, 500)
		this.getTreeInfoByid(this.gameTreedata.id)
		console.log("好友浇水数据:", Data)
	}

	//通过果树ID查询果树数据
	private getTreeInfoByid(treeUserId) {
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/getTreeInfo", params, this, this.Req_getTreeInfo.bind(this), this.onGetIOError);
	}

	//查询果树数据后处理

	private Req_getTreeInfo(data): void {
		var Data = data;
		Help.saveTreeUserData(Data.data);
		this.progress.value = 0;
		this.progress.slideDuration = 0;
		console.log("果树数据:", Data.data)
		this.init(Data.data);
	}


	/**
	 * 果树留言
	 */

	//获取果树留言
	private getTreeLeaveMsg(treeUserId) {
		//加载留言前先清空留言内容
		this.BarGroup.removeChildren()
		let params = {
			treeUserId: treeUserId,
			pageNo: 1
		};
		MyRequest._post("game/getTreeLeaveMsg", params, this, this.Req_getTreeLeaveMsg.bind(this), this.onGetIOError);
	}

	//获取果树留言成功后处理
	private Req_getTreeLeaveMsg(data): void {
		var Data: Array<LeaveMsgUser> = data.data.list;
		this.addBarrage(Data)
		console.log("果树留言数据:", Data);
	}


	//偷水请求	stealUser：被偷的用户    treeUserId：用户果树id
	private stealWater(stealUser, treeUserId) {
		let params = {
			stealUser: stealUser,
			treeUserId: treeUserId
		};
		MyRequest._post("game/stealWater", params, this, this.Req_stealWater.bind(this), this.onGetIOError);
	}

	//偷水请求之后的处理
	private Req_stealWater(data): void {
		var Data = data.data;
		SceneManager.addNotice("偷到" + Data.stealNum + "g水滴",2000)
	}

	//显示果园道具
	private showtreeprop(data) {
		let n = 0;
		let m = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i].propType == 0) {
				n++
				if (n < 4) {
					this.putgrass(data[i].id);
				}
			}
			if (data[i].propType == 1) {
				m++
				if (m < 4) {
					this.putinsect(data[i].id);
				}
			}
		}
	}

	//放入草
	private putgrass(id) {
		let grass = new eui.Image;
		grass.x = 0 + Math.random() * this.gro_prop.width;	//x 250-500
		grass.y = 0 + Math.random() * this.gro_prop.height;	//y 850-980
		grass.width = 74;
		grass.height = 60;
		grass.texture = RES.getRes("home-grass");
		grass.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(grass, id);
		}, this)
		this.gro_prop.addChild(grass);
	}

	//放入虫

	private putinsect(id) {
		let insect = new eui.Image;
		insect.x = 0 + Math.random() * this.gro_prop.width;
		insect.y = 0 + Math.random() * this.gro_prop.height;
		insect.width = 76;
		insect.height = 95.75;
		insect.texture = RES.getRes("home-insect");
		insect.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(insect, id);
		}, this)
		this.gro_prop.addChild(insect);
	}



	private kettleTwn() {
		egret.Tween.get(this.img_kettle)
			.to({ y: -130 }, 500)
			.to({ x: -29, y: -170, rotation: -54 }, 500).call(this.waterTwn, this)
			.wait(1200)
			.to({ y: -130, rotation: 0 }, 500)
			.to({ y: 80, x: 100 }, 500).call(this.tettleEad, this);
	}



	//水滴动画
	private waterTwn() {
		this.img_water.visible = true;
		egret.Tween.get(this.img_water)
			.set({ y: 860, x: 386, alpha: 1 })
			.to({ y: 900, x: 366, alpha: 0.2 }, 500)
			.wait(200)
			.set({ y: 860, x: 386, alpha: 1 })
			.to({ y: 900, x: 366, alpha: 0.2 }, 500)
			.wait(200)
			.call(this.waterVis, this)
	}

	// 水滴不可见
	private waterVis() {
		this.img_water.visible = false;
	}

	// 水壶冷却展现
	private tettleEad() {
		this.getOwnTree();
		this.a = 20
		this.gro_kettle.visible = false;
		this.showtime(this.a);
		this.gro_lq.visible = true;
		this.kettlelq(this.a);
	}

	private lqTwn() {
		egret.Tween.get(this.sanj, { loop: true })
			.set({ rotation: this.sanj.rotation })
			.to({ rotation: this.sanj.rotation + 360 }, 4000)
	}

	//水壶冷却
	private kettlelq(time) {
		this.lqTwn();
		let timer: egret.Timer = new egret.Timer(1000, time);
		timer.addEventListener(egret.TimerEvent.TIMER, () => this.timelq(timer), this);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.kettleshow, this);
		timer.start();
	}


	private showtime(time) {
		if(time>3){
			this.gro_lq.touchEnabled = true;
		}
		else{
			this.gro_lq.touchEnabled = false;
			this.gro_lq.touchChildren = false;
		}

		if (time < 10) {
			this.time_lq.text = "00:0" + time;
		}
		if (time >= 10) {
			this.time_lq.text = "00:" + time;
		}
	}

	private timelq(timer: egret.Timer) {
		console.log("1")
		this.a = this.a - 1;
		this.showtime(this.a);
		if (this.a <= 0) {
			this.gro_kettle.visible = true;
			this.gro_lq.visible = false;
			timer.reset();
		}
	}
	//冷却加速
	private lqfast() {
		egret.Tween.pauseTweens(this.sanj);
		egret.Tween.get(this.sanj)
			.to({ rotation: this.sanj.rotation + 120 }, 500).call(this.lqTwn, this)
		this.a = this.a - 1;
		this.showtime(this.a);
	}

	//水壶冷却完成
	private kettleshow() {
		console.log("2")
		// this.gro_kettle.visible = true;
		// this.gro_lq.visible = false;
	}


	//化肥动画
	private huafeiTwn(evt: PuticonEvent) {
		let type = evt.Type;
		let icon = new eui.Image();
		if (type == 1) {
			icon.texture = RES.getRes("youji");
			icon.x = 77;
			icon.y = 951;
		}
		else if (type == 2) {
			icon.texture = RES.getRes("fuhe");
			icon.x = 194;
			icon.y = 1005;
		}
		else if (type == 3) {
			icon.texture = RES.getRes("shuirong");
			icon.x = 233;
			icon.y = 1129;
		}
		icon.anchorOffsetX = icon.width / 2;
		icon.anchorOffsetY = icon.height / 2;
		this.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 296, y: 815 }, 500)
			.wait(300)
			.to({ rotation: 112 }, 500).call(() => { this.huafeikeli(icon), this })
	}


	private huafeikeli(icon1) {
		let icon = new eui.Image();
		icon.texture = RES.getRes("huafeili_png");
		icon.x = 338;			//355
		icon.y = 847;			//875
		icon.width = 35;
		icon.height = 57;
		this.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 355, y: 875, alpha: 0.2 }, 500)
			.wait(200)
			.set({ x: 337, y: 847, alpha: 1 })
			.to({ x: 355, y: 875, alpha: 0.2 }, 500)
			.wait(200).call(() => { this.removeChild(icon), this }).call(() => { this.removeChild(icon1), this }).call(() => { this.getOwnTree(), this })

	}

}