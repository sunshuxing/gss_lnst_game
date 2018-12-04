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


	private gro_top:eui.Group;
	private bg:eui.Image;				//背景图片
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
	private dynamic: eui.Group;			//动态组
	private dynamic_bg: eui.Image;		//动态背景
	private dynamic_image: eui.Image;	//动态头像
	private dynamic_info: eui.Label;		//动态消息
	private btn_task: eui.Image;			//任务按钮
	private btn_fertilizer: eui.Image;	//化肥按钮
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
	private frimg_kettle:eui.Image;
	private img_love:eui.Image;
	private list_seed:eui.List;			//领取种子列表
	private pick_hand:eui.Image;		//摘果子的手
	private steal_label:eui.Label;		//偷水的字
	private pick_label:eui.Label;		//摘果的字
	private img1_bg:eui.Image;
	private img2_bg:eui.Image;
	private distribution_label:eui.Label;	//配送的字
	private fruit_num:eui.Label;
	private fruit_img:eui.Image;
	private sign_gro:eui.Group;
	public task_gro:eui.Group;
	

	/**
	 * 沒有果樹的
	 */
	private seed_btn: eui.Image;             //领取按钮
	private seed_id;						//种子id
	private seed_value;



	//好友果园
	private hudong_btn: eui.Image;			//互动按钮
	private friendUser: string;				//好友
	private timer: egret.Timer = new egret.Timer(17000, 1);		//计时器

	// private webSocket:egret.WebSocket; 	//网络连接
	private n = 0;
	private m = 0;
	private a = 20;							//冷却计时
	private b = 20;

	private loadLeaveMsg: boolean = true;			//是否需要加载留言模板（当第一次进入时需要）
	private leaveMsgTemplateList: Array<LeaveMsgTemplate>;		//留言模板对象列表
	private nowTreeUserId: string			//当前果树id
	private ownTreeUserId: string;			//自己的果树id
	private noHarvest: Boolean = null				//还未收获

	protected childrenCreated(): void {
		super.childrenCreated();
		this.gro_prop.touchThrough = true;
		this.gro_kettle.touchThrough = true;
		this.str1.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.str2.scrollRect = new egret.Rectangle(0, 0, 320, 50);
		this.img1.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img2.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img1_bg.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.img2_bg.scrollRect = new egret.Rectangle(0, 0, 50, 50);
		this.gro_top.y = this.height - SceneManager.instance._stage.height;
		this.friend_scr.horizontalScrollBar = null;
		this.cloud1.y = this.height - SceneManager.instance._stage.height - 62;
		this.cloud2.y = this.height - SceneManager.instance._stage.height + 119;
		this.cloud3.y = this.height - SceneManager.instance._stage.height - 7;

		//沒有果樹
		this.seed_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getSeed, this)
	}

	public initData() {
		this.getSystemMsg();				//系统消息
		this.getFriends();					//好友数据
		this.getOwnTree();					//自己果树数据
		this.logorot();
		this.cloudTwn();
	}
	private onComplete(): void {
		console.log("onComplete");
		this.addEventListener(PuticonEvent.PUTGRASS, this.putgrass, this);
		this.addEventListener(PuticonEvent.PUTINSECT, this.putinsect, this);
		this.addEventListener(PuticonEvent.LEAVEMSG, this.addBarrageMsg, this);
		this.addEventListener(PuticonEvent.TOFRIEND, this.toOther, this);
		this.addEventListener(MaskEvent.REMOVEMASK, this.removemask, this);
		this.addEventListener(PuticonEvent.USEHUAFEI, this.huafeiTwn, this);
		this.addEventListener(PuticonEvent.TASKFINSHED, this.getOwnTree, this);
		this.bg_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mask_touch, this);
		this.btn_task.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToTaskScene, this);
		this.btn_dynamic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToDynamicScene, this);
		this.add_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addfriend, this);
		this.img_kettle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addwater, this);
		this.btn_signin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSignInScene, this);
		this.hudong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToInteractiveScene, this);
		this.self_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToSelfTree, this);
		this.gro_lq.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lqfast, this);
		this.pick_hand.addEventListener(egret.TouchEvent.TOUCH_TAP, this.PickFruit, this);
		//偷水
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

	private checktask(flag){
		if(flag){
			SceneManager.sceneManager.mainScene.task_gro.visible = true;
		}
		else if(!flag){
			SceneManager.sceneManager.mainScene.task_gro.visible = false;
		}
	}


	//偷水
	private toushui() {
		this.stealWater(this.friendUser, this.nowTreeUserId);
	}

	//摘果子
	private PickFruit() {
		if(this.currentState == "havetree"){
			let text:string = this.pick_num.text
			text = text.substring(1,text.length)
			if (Number(text) > 0 && this.gameTreedata.needTake == "true") {
				this.useProp(3);
			} 
			else if (this.gameTreedata.needTake == "false") {
				let content = "您现在还不能使用道具哦~"
				let btn = "确定"
				let ti = "(快让您的小树快快成长吧！)"
				SceneManager.addPrompt(content, btn, ti);
			}
			else if(Number(text) <= 0){
				let content = "道具数量不够"
				let btn = "确定"
				let ti = "(完成任务可以获得道具！)"
				SceneManager.addPrompt(content, btn, ti);
			}
		}
		else if(this.currentState == "friendtree"){
			this.friendpick(this.gameTreedata.id);
		}
	}

	//使用爱心值
	private loveTouch() {
		let text:string = this.love_num.text
		text = text.substring(0,text.length-1)
		if (Number(text) >= 100) {
			if (Help.getTreeUserData().needTake == "true") {
				let content = "需要先摘果子才能使用爱心值哦~"
				let btn = "确定"
				let ti = "(多多帮助好友可使您的小树更快成长哦！)"
				SceneManager.addPrompt(content, btn, ti);
			}
			else {
				this.useProp(2);
			}
		}
		else if (Number(text) < 100) {
			let content = "您的爱心值不够兑换成长值哦！"
			let btn = "确定"
			let ti = "(为好友除虫除草可增加爱心值哦！)"
			SceneManager.addPrompt(content, btn, ti);
		}
	}

	//浇水
	private addwater() {
		let kettleNum:string = this.kettle_num.text;
		kettleNum = kettleNum.substring(0,kettleNum.length-1);
		let canWater = false;
		canWater = this.gameTreedata.growthValue != this.gameTreedata.stageObj.energy && ((this.gameTreedata.needTake == null ? 'false' : this.gameTreedata.needTake) == 'false');
		if (canWater && this.currentState == "havetree" && Number(kettleNum) >= 10) {
			this.useProp(1);		//1:使用水滴
		} else if (this.gameTreedata.needTake == "true") {
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

	// 风车图片旋转
	private logorot() {
		egret.Tween.get(this.logo, { loop: true })
			.to({ rotation: 360 }, 10000);
	}
	// 果树图片点击事件
	private treeTouch() {
		this.gro_tree.touchEnabled = false;
		egret.Tween.get(this.tree)
			.to({ scaleX: 1.05, scaleY: 1.05 }, 200)
			.wait(150)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ scaleX: 1.02, scaleY: 1.02 }, 200)
			.to({ scaleX: 1, scaleY: 1 }, 200).call(this.treeEad, this);

		// 所有树语中随机一个
		let n = Help.random_num(0, this.treelanguagedata.length - 1)
		SceneManager.treepromptgro.removeChildren();
		SceneManager.treetimer.reset();
		SceneManager.addtreePrompt(this.treelanguagedata[n].msg);
	}

	// //根据阶段值获取树语
	// private gettreeLanguageByStage(stage) {
	// 	let data: any[] = []
	// 	for (let i = 0; i < this.treelanguagedata.length; i++) {
	// 		if (this.treelanguagedata[i].stage == stage && this.treelanguagedata[i].isStage) {
	// 			data.push(this.treelanguagedata[i]);
	// 		}
	// 		if (this.treelanguagedata[i].isStage == "false") {
	// 			data.push(this.treelanguagedata[i]);
	// 		}
	// 	}
	// 	return data;
	// }

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


	private onlyFlag:boolean = true; 	//只有用户推送的情况需要的标记
	// 推送滚动1
	public info1scr() {
		if (this.infodata && this.infodata.length) {
			if (this.n >= this.infodata.length) {
				this.n = 0;
				if(this.hasTopMsg){
					this.getTopMsg()
				}
				return
			}
			let systemEmpty = this.sysinfodata ==null? true:this.sysinfodata.length==0?true:false	//系统消息为空
			let userName = Help.getcharlength(this.infodata[this.n].mainUserName,4);
			let treeName = this.infodata[this.n].treeName;
			let stageName = this.infodata[this.n].stageName;
			let info = ""
			if(this.infodata[this.n].type == "0"){
					info = userName + "的" + treeName + stageName + "了！"
			}else{
				info = userName + "领取了" + treeName + "！"
			}
			if(systemEmpty && this.onlyFlag){//如果为空，则使用系统的框来循环
				HttpRequest.imageloader(this.infodata[this.n].mainUserIcon, this.img2);
				this.n++;
				this.str2.text = Help.getcharlength(info,12);
				var rect: egret.Rectangle = this.str2.scrollRect;
				egret.Tween.get(rect)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000).call(this.info2scr, this)
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
				this.onlyFlag = false;
			}else{
				HttpRequest.imageloader(this.infodata[this.n].mainUserIcon, this.img1);
				this.str1.text = Help.getcharlength(info,12);
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

				var rect2: egret.Rectangle = this.img1_bg.scrollRect;
				egret.Tween.get(rect2)
					.set({ y: -50 })
					.to({ y: 0 }, 1000)
					.wait(2000)
					.to({ y: 50 }, 1000);
				this.onlyFlag = true
			}
			
		}
		else {
			if(this.hasSysMsg){
				this.info2scr()
			}
		}
	}

	// 推送滚动2			
	public info2scr() {
		if (this.sysinfodata && this.sysinfodata.length > 0) {
			if (this.m >= this.sysinfodata.length) {
				this.m = 0;
			}
			this.str2.text = Help.getcharlength(this.sysinfodata[this.m].title,12);
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
	else{
			this.info1scr()
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


	//添加弹幕
	private addBarrageMsg(evt:PuticonEvent){
		let templateId = evt.templateId		//弹幕模板ID
		let barragbg = new eui.Image;		//弹幕背景
		let barragicon = new eui.Image;		//弹幕头像
		let bariconmask = new eui.Rect;		//弹幕头像遮罩
		let barragegroup = new eui.Group;	//弹幕容器
		let barragetext = new eui.Label;	//弹幕内容
		let data = Help.getOwnData();

		barragegroup.x = 750;			//弹幕位置随机
		barragegroup.y = 300 + Help.random_num(1, 3) * 60;
		barragegroup.width = 414;
		barragegroup.height = 72;
		this.BarGroup.addChild(barragegroup);

		//添加弹幕背景
		barragbg.x = 0;
		barragbg.y = 0;
		barragbg.width = 414;
		barragbg.height = 72;
		barragbg.texture = RES.getRes('barragebg-green');
		barragegroup.addChild(barragbg);
		
		//添加弹幕头像
		barragicon.x = 7;
		barragicon.y = 16;
		barragicon.width = 46;
		barragicon.height = 46;
		// barragicon.texture = RES.getRes(TestData.leaveMsgUserdata[i].mainUserIcon);
		if (data.userIcon) {
			HttpRequest.imageloader(data.userIcon, barragicon);	//加载网络头像
		}
		barragegroup.addChild(barragicon);

		//添加弹幕头像遮罩
		bariconmask.x = 7;
		bariconmask.y = 14;
		bariconmask.width = 46;
		bariconmask.height = 46;
		bariconmask.ellipseWidth = 46;
		bariconmask.ellipseHeight = 46;
		barragegroup.addChild(bariconmask);
		barragicon.mask = bariconmask;

		//添加弹幕内容
		barragetext.x = 78;
		barragetext.y = 28;
		barragetext.size = 24;
		// barragetext.text = TestdataHelp.getleaveMsgById(TestData.leaveMsgUserdata[i].templateId);
		barragetext.text = this.getLeaveMsgByTemplateId(templateId)
		barragetext.textColor = 0x0F3B00;
		barragetext.fontFamily = "SimHei";
		barragegroup.addChild(barragetext);

		//弹幕飘动
		egret.Tween.get(barragegroup)
		.to({ x: -430 },8000)
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.removeBarrage, this);
		this.timer.start();
	}


	// 弹幕滚动
	private addBarrage(dataList: Array<LeaveMsgUser>) {
		for (let i = 0; i < dataList.length; i++) {

			let barragbg = new eui.Image;		//弹幕背景
			let barragicon = new eui.Image;		//弹幕头像
			let bariconmask = new eui.Rect;		//弹幕头像遮罩
			let barragegroup = new eui.Group;	//弹幕容器
			let barragetext = new eui.Label;	//弹幕内容

			//添加单个弹幕容器 
			barragegroup.x = 750;			//弹幕位置随机
			barragegroup.y = 300 + Help.random_num(1, 3) * 60;
			barragegroup.width = 414;
			barragegroup.height = 72;
			this.BarGroup.addChild(barragegroup);

			//添加弹幕背景
			barragbg.x = 0;
			barragbg.y = 0;
			barragbg.width = 414;
			barragbg.height = 72;
			barragbg.texture = RES.getRes('barragebg-green');
			barragegroup.addChild(barragbg);

			//添加弹幕头像
			barragicon.x = 7;
			barragicon.y = 16;
			barragicon.width = 46;
			barragicon.height = 46;
			// barragicon.texture = RES.getRes(TestData.leaveMsgUserdata[i].mainUserIcon);
			if (dataList[i].mainUserIcon) {
				HttpRequest.imageloader(dataList[i].mainUserIcon, barragicon);	//加载网络头像
			}
			barragegroup.addChild(barragicon);

			//添加弹幕头像遮罩
			bariconmask.x = 7;
			bariconmask.y = 14;
			bariconmask.width = 46;
			bariconmask.height = 46;
			bariconmask.ellipseWidth = 46;
			bariconmask.ellipseHeight = 46;
			barragegroup.addChild(bariconmask);
			barragicon.mask = bariconmask;

			//添加弹幕内容
			barragetext.x = 78;
			barragetext.y = 28;
			barragetext.size = 24;
			// barragetext.text = TestdataHelp.getleaveMsgById(TestData.leaveMsgUserdata[i].templateId);
			barragetext.text = this.getLeaveMsgByTemplateId(dataList[i].templateId)
			barragetext.textColor = 0x0F3B00;
			barragetext.fontFamily = "SimHei";
			barragegroup.addChild(barragetext);


			//弹幕飘动
			if(barragegroup){
				egret.Tween.get(barragegroup)
				.wait(i * 3000)
				.to({ x: -430 },8000)
			}
		}
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.removeBarrage, this);
		this.timer.start();
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

	//查询签到信息
    private getSignInInfo() {
        MyRequest._post("game/getSignInInfo", null, this, this.Req_getSignInInfo.bind(this), this.onGetIOError)
    }

    //查询成功的处理
    private Req_getSignInInfo(data): void {
		if(data){
			let Signdate = data.data.lastSignDay;
			Signdate = Signdate.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
			let nowdate = new Date();
			let time = new Date(Signdate);
			if(time.getDate() == nowdate.getDate()&&time.getMonth() == nowdate.getMonth()){
				this.sign_gro.visible = false;
			}
			else{
				this.sign_gro.visible = true;
			}
			console.log(data,"签到数据")
		}
		else{
			this.sign_gro.visible = true;
		}
		
	}



	//移除弹幕容器
	private removeBarrage() {
		this.timer.reset()
		this.BarGroup.removeChildren()
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
		SceneManager.toDynamicScene(this.ownTreeUserId);
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
		let evt:MaskEvent = new MaskEvent(MaskEvent.INITEUIARR);
        SceneManager.sceneManager.dynamicScene.dispatchEvent(evt);
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
		let addFriend = MyRequest.geturlstr("addFriend", url)
		if (!addFriend) {
			SceneManager.instance.weixinUtil.shareData.shareUrl = url + "&addFriend=true"
		}
		SceneManager.instance.weixinUtil._openShare();
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
		console.log(treedata.data, "领取果树信息")
		let euiArr:eui.ArrayCollection = new eui.ArrayCollection(treedata.data);
		
		this.list_seed.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.list_seed.itemRenderer = SeedList_item;
		this.list_seed.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onChange,this);
	}

	private onChange(e:eui.PropertyEvent):void{
		this.seed_value = this.list_seed.selectedItem.id;
        //获取点击消息
        console.log(this.seed_value)
    }

	//请求错误
	private onGetIOError(event: egret.IOErrorEvent): void {
		console.log("get error : " + event);
	}

	//检查是否可以帮摘果
	private checkHelpTakeFruit(treeUserId){
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/checkHelpTakeGoods", params, this, this.Req_checkHelpTakeFruit.bind(this), this.onGetIOError)
	}

	//检查是否可以帮摘果返回
	private Req_checkHelpTakeFruit(data): void {
		if(data.data.canTake == "true"){
			this.pick_hand.visible = true;
			this.pick_label.text = "帮摘果";
			this.pick_label.visible = true;
			egret.Tween.get(this.pick_hand,{loop:true})
			.to({y:this.pick_hand.y-20},500)
			.to({y:this.pick_hand.y},500)
			.to({y:this.pick_hand.y+20},500)
			.to({y:this.pick_hand.y},500)
		}
		else{
			this.pick_hand.visible = false;
			this.pick_label.visible = false;
		}
	}


	//获取种子
	private getSeed() {
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
		baoxiang.seticon(data);
		this.addChild(baoxiang);
	}


	//查询自己的果树
	public getOwnTree() {
		MyRequest._post("game/getOwnTree", null, this, this.requestgetOwnTree.bind(this), this.onGetIOError);
		this.getSignInInfo();
	}

	private init(data) {
		let now = new Date();
		let hour = now.getHours();
		if(hour > 17 || hour <6){
			this.logo.texture = RES.getRes("logo-night")
			this.bg.texture = RES.getRes("bg-night_png");
			this.cloud1.visible = false;
			this.cloud2.visible = false;
			this.cloud3.visible = false;
		}else if(hour <18 || hour>5){
			this.logo.texture = RES.getRes("logo")
			this.bg.texture = RES.getRes("bg-day_png");
			this.cloud1.visible = true;
			this.cloud2.visible = true;
			this.cloud3.visible = true;
		}
		console.log("数据", data);
		if (this.currentState == "havetree") {
			SceneManager.sceneManager.taskScene.taskDataInit(this.checktask);
			this.gro_love.touchEnabled = true;
			this.gro_love.touchChildren = true;
		} else {
			this.gro_love.touchEnabled = false;
			this.gro_love.touchChildren = false;
		}
		let nowValue = (Number(data.growthValue)/Number(data.stageObj.energy))
		this.tree_name.text = data.treeName;			//果树名称
		this.garden_name.text = Help.getcharlength(data.userName, 4);			//果园名称
		this.progress.maximum = data.stageObj.energy;	//进度条最大值
		this.progress.minimum = 0;						//进度条最小值
		this.progress.slideDuration = 6000;				//进度条速度	
		this.progress.value = data.growthValue;			//进度条当前值
		this.getTreeLanguage(data);						//获取当前阶段树语
		this.treeUpdate(data);							//果树显示
		this.gameTreedata = data;						//当前用户果树数据
		this.getTreeProp(data.id);						//查询当前果园道具和显示
		if (this.currentState == "havetree") {
			this.progress_label.textFlow = <Array<egret.ITextElement>>[
				{ text: "还需要" },
				{ text: (Number(data.stageObj.energy) - Number(data.growthValue)), style: { "textColor": 0xd67214 } },
				{ text: "成长值才到一下阶段" }
			]
			if(data.needTake == "true"){
				this.progress_label.textFlow = <Array<egret.ITextElement>>[
				{ text: "需要" },
				{ text: "摘果", style: { "textColor": 0xd67214 } },
				{ text: "才能到一下阶段" }
			]
				this.pick_hand.visible = true;
				this.pick_label.text = "可摘果";
				this.pick_label.visible = true;
				egret.Tween.get(this.pick_hand,{loop:true})
				.to({y:this.pick_hand.y-20},500)
				.to({y:this.pick_hand.y},500)
				.to({y:this.pick_hand.y+20},500)
				.to({y:this.pick_hand.y},500)
			}
			else if(data.needTake == "false"){
				this.pick_hand.visible = false;
				this.pick_label.visible = false;
			}
		}
	}

	//查询自己果树回调
	private requestgetOwnTree(data): void {
		var treedata = data;
		let treeUser: TreeUserData = treedata.data;
		Help.saveOwnData(treedata.data);					//保存自己果树数据
		this.friend_list.selectedIndex = -1;
		if (treedata.data) {
			if (treedata.data.canReceive == "true") {
				let prompt = new PromptJump();
				 	prompt.x = 85;
        			prompt.y = 430;
				this.addChild(prompt);
			} else {
				if (treedata.data.needTake == "false") {
					this.noHarvest = false;
				} else if (treedata.data.needTake == "true" && !this.noHarvest) {
					this.noHarvest = true;
					SceneManager.treepromptgro.removeChildren();
					SceneManager.treetimer.reset();
					SceneManager.addtreePrompt("我的果实长好啦，快使用篮子将果子摘下来吧！")
				}
				this.setState("havetree");
				Help.saveTreeUserData(treedata.data);				//保存果树数据
				this.user_name.text = Help.getcharlength(treedata.data.userName, 3);
				HttpRequest.imageloader(treedata.data.userIcon, this.user_icon);				//用户头像
				if (treedata.data.stage >= 4) {
					this.progress1.maximum = treedata.data.exchangeNum;							//装箱需要的果子总数
					this.progress1.minimum = 0;
					// if(treedata.data.obtainFruitNum>treedata.data.exchangeNum){
					// 	this.progress1.value = treedata.data.exchangeNum;
					// }
					this.progress1.value = treedata.data.obtainFruitNum; 						//当前收获果子树
					this.progress1.visible = true;
					this.pick_num.visible = true;
					this.distribution_label.visible = true;
					this.distribution_label.text = treedata.data.obtainFruitNum+"个";
					this.fruit_img.visible = true;
					this.fruit_num.visible = true;
					HttpRequest.imageloader(Config.picurl+treedata.data.seedIcon,this.fruit_img);
					this.fruit_num.text = treedata.data.exchangeNum+"个";
				}
				else {
					this.progress1.visible = false;
					this.pick_num.visible = false;
					this.distribution_label.visible = false;
					this.fruit_img.visible = false;
					this.fruit_num.visible = false;
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
	private treeUpdate(data:TreeUserData) {
		if(data.needTake == "true"){
			HttpRequest.imageloader(Config.picurl+data.stageObj.harvestImage, this.tree);
		}else{
			HttpRequest.imageloader(Config.picurl+data.stageObj.stageImage, this.tree);
		}
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
		let loveNum = Help.getPropById(Data.data, 2) ? Help.getPropById(Data.data, 2).num : "0"
		//显示自己道具数值
		this.love_num.textFlow = <Array<egret.ITextElement>>[					//爱心值数量
			{text: loveNum, style: { "size": 22 }}
			, { text: "%", style: { "size": 18 } }
		];
		let usedNum = Math.floor(Help.getOwnData().obtainFruitNum/Help.getOwnData().basketCapacity);
		this.kettle_num.text = (Help.getPropById(Data.data, 1) ? Help.getPropById(Data.data, 1).num : 0) + "g";							//水滴数量
		this.pick_num.text = "x"+((Help.getPropById(Data.data, 3) ? Help.getPropById(Data.data, 3).num : 0)-usedNum);				//篮子数量
		let text:string = this.love_num.text
		text = text.substring(0,text.length-1)
		if(Number(text)>=100){
			egret.Tween.get(this.img_love,{loop:true})
			.to({ scaleX: 1, scaleY: 1 }, 400)
			.to({ scaleX: 1.1, scaleY: 1.1 },400)
			.to({ scaleX: 1, scaleY: 1 }, 400)
		}
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
	private getTreeLanguage(data) {
		let params = {
			stage: data.stage
		};
		MyRequest._post("game/getTreeLanguage", params, this, this.Req_getTreeLanguage.bind(this), this.onGetIOError)
	}


	//树语数据
	private Req_getTreeLanguage(data): void {
		var Data = data;
		this.treelanguagedata = Data.data
		console.log(this.treelanguagedata, "树语数据")
	}



	private topPage:number = 0		//当前页面

	//查询顶部消息
	public getTopMsg() {
		this.topPage  = this.topPage + 1
		let data = {
			pageNo : this.topPage

		}
		MyRequest._post("game/getTopInfo", data, this, this.Req_getTopMsg.bind(this), this.onGetIOError)
	}

	//查询顶部消息成功后处理
	private Req_getTopMsg(data): void {
		var Data = data;
		let maxPage = parseInt(Data.data.lastPage)
		if(this.topPage == maxPage){
			//如果是最后一页，则下一次从首页开始
			this.topPage = 0
		}
		this.infodata = Data.data.list;
		if(Data.data.list.length == 0 && this.topPage == 1){
			//如果第一页都没有数据，就是没数据
			this.hasTopMsg = false;
		}
		this.info1scr();
		console.log(Data, "顶部消息数据")
	}

	private hasTopMsg = true;
	private hasSysMsg = true;


	//查询系统消息
	public getSystemMsg() {
		MyRequest._post("game/getSystemInfo", null, this, this.Req_getSystemMsg.bind(this), this.onGetIOError)
	}

	//查询系统消息成功后处理
	private Req_getSystemMsg(data): void {
		var Data = data;
		this.sysinfodata = Data.data;

		if(this.sysinfodata.length == 0){
			//如果第一页都没有数据，就是没数据
			this.hasSysMsg = false;
		}
		console.log(Data, "系统消息数据")
		this.getTopMsg();
	}


	//查询好友列表
	public getFriends() {
		MyRequest._post("game/getFriends", null, this, this.Req_getFriends.bind(this), this.onGetIOError);
	}

	//查询好友列表成功后处理
	private Req_getFriends(data): void {
		var Data = data;
		Help.saveUserFriendData(Data.data);
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


	private toOther(evt: PuticonEvent) {
		this.progress.slideDuration = 0;
		this.progress.value = 0;
		Help.passAnm()
		var id = evt.userid;
		this.getTreeInfoByid(id);
	}


	private toOtherTree() {
		//查询好友果树数据
		if (this.friend_list.selectedItem.treeUserId != this.gameTreedata.id && this.friend_list.selectedItem.treeUserId) {
			SceneManager.treepromptgro.removeChildren();
			this.progress.slideDuration = 0;
			this.progress.value = 0;
			this.setState("friendtree");
			this.friendUser = this.friend_list.selectedItem.friendUser		//好友
			let friendTreeUserId = this.friend_list.selectedItem.treeUserId;
			Help.passAnm();
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
			//推送拜访消息
			let data = {
				userId:this.friendUser,
				treeUserId: friendTreeUserId
			}
			MyRequest._post("game/visit",data,this,null,null)
		}
		if (!this.friend_list.selectedItem.treeUserId) {
			//分享弹窗
			SceneManager.addJump()
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
			this.steal_label.visible = true;
			egret.Tween.get(this.steal_btn, { loop: true })
				.to({ y: 780 }, 1000)
				.to({ y: 774 }, 1000)
		} else {//不能偷水，隐藏水滴，并且把错误信息绑定
			this.steal_btn.visible = false;	//隐藏水滴
			this.steal_label.visible = false;
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
		if (Data.data.loveCount > 0) {
			let textflow = <Array<egret.ITextElement>>[																//爱心值数量
			{ text: "爱心值+", style: { "size": 30,"textColor":0xED8282,"bold":true } }
			, { text: Data.data.loveCount, style: { "size": 30,"textColor":0xED8282,"bold":true } }
		];
			SceneManager.addNotice(null,null,textflow)
			let text:string = this.love_num.text
			text = text.substring(0,text.length-1)
			this.love_num.text =(String(Number(text) + Number(Data.data.loveCount)))+"%"
		} else {
			SceneManager.addNotice("清除成功")
		}
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
		else if (propId == 2) {
			Help.useLoveTwn();
			// let content = "您的爱心值已兑换成长值！"
			// let btn = "确定"
			// let ti = "(多多帮助好友可使您的小树更快成长哦！)"
			// SceneManager.addPrompt(content, btn, ti);
		}
		else if (propId == 3) {
			Help.pickTwn(5);
			Help.pickTwnupdata(this.pickafter);
		}
		else {
			this.getOwnTree();
		}
		console.log("使用道具消息:", Data)
	}

	private pickafter(){
		let content = "您的树上还有未摘完的果子哦!"
		let btn = "确定"
		let ti = "(快去邀请好友帮忙摘果吧！)"
		SceneManager.addPrompt(content, btn, ti);
		this.getOwnTree()
	}

	//回到自己果园
	private ToSelfTree() {
		if (this.currentState != "havetree") {
			this.progress.slideDuration = 0;
			this.progress.value = 0;
			this.getOwnTree();
			Help.passAnm();
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
		if(data.data.friendCanObtain>0){
			this.checkHelpTakeFruit(data.data.id);
		}
		else{
			this.pick_hand.visible = false;
			this.pick_label.visible = false;
		}
		this.setState("friendtree");
		var Data = data;
		Help.saveTreeUserData(Data.data);
		console.log("果树数据:", Data.data)
		this.init(Data.data);
	}


	/**
	 * 果树留言
	 */

	//获取果树留言
	private getTreeLeaveMsg(treeUserId) {
		//加载留言前先清空留言内容
		this.removeBarrage();
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
	}

	//帮摘果请求
	private friendpick(treeUserId){
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/helpTakeGoods", params, this, this.Req_friendpick.bind(this), this.onGetIOError);
	}

	//帮摘果之后请求
	private Req_friendpick(data){
		Help.helppickTwn(data.data);
		let text:string = this.love_num.text;
		text = text.substring(0,text.length-1);
		this.love_num.text =(String(Number(text) + Number(data.data.loveCount)))+"%";
		this.getTreeInfoByid(this.gameTreedata.id);
		console.log(data,"帮摘果")
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
		// SceneManager.addNotice("偷到" + Data.stealNum + "g水滴", 2000)
		Help.stealshow(Data.stealNum);
		this.checkSteal(this.gameTreedata.id);
	}

	//显示果园道具
	private showtreeprop(data) {
		let n = 0;
		let m = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i].propType == 0) {
				n++
				if (n < 4) {
					this.putgrass(data[i].id,n);
				}
			}
			if (data[i].propType == 1) {
				m++
				if (m < 4) {
					this.putinsect(data[i].id,m);
				}
			}
		}
	}

	//放入草
	private putgrass(id,m?) {
		let grass = new eui.Image;
		grass.width = 74;
		grass.height = 60;
		grass.texture = RES.getRes("home-grass");
		grass.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(grass, id);
		}, this)
		if(!m){
			m = Help.random_num(4,6)
			if(m == 4){
				this.gro_prop.addChild(grass);
				let twn_x = 230 + Help.random_num(-2,2)*20;
				let twn_y = 950 + Help.random_num(-2,2)*5;
				egret.Tween.get(grass)
				.set({x:210,y:720})
				.to({x:twn_x,y:twn_y},1000)
			}
			else if(m == 5){
				this.gro_prop.addChild(grass);
				let twn_x = 362 + Help.random_num(-2,2)*20;
				let twn_y = 956 + Help.random_num(-2,2)*5;
				egret.Tween.get(grass)
				.set({x:210,y:720})
				.to({x:twn_x,y:twn_y},1000)
			}
			else if(m == 6){
				this.gro_prop.addChild(grass);
				let twn_x = 504 + Help.random_num(-2,2)*20;
				let twn_y = 938 + Help.random_num(-2,2)*5;
				egret.Tween.get(grass)
				.set({x:210,y:720})
				.to({x:twn_x,y:twn_y},1000)
			}
		}
		else if(m){
			Help.grapos(m,grass);
			this.gro_prop.addChild(grass);
		}
		
	}

	//放入虫

	private putinsect(id,m?) {
		let insect = new eui.Image;
		insect.width = 76;
		insect.height = 95.75;
		insect.texture = RES.getRes("home-insect");
		insect.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(insect, id);
		}, this)
		if(!m){
			m = Help.random_num(4,6)
			if(m == 4){
				this.gro_prop.addChild(insect);
				let twn_x = 536 + Help.random_num(-2,2)*20;
				let twn_y = 872 + Help.random_num(-2,2)*5;
				egret.Tween.get(insect)
				.set({x:530,y:720})
				.to({x:twn_x,y:twn_y},1000)
				
			}
			else if(m == 5){
				this.gro_prop.addChild(insect);
				let twn_x = 295 + Help.random_num(-2,2)*20;
				let twn_y = 932 + Help.random_num(-2,2)*5;
				egret.Tween.get(insect)
				.set({x:530,y:720})
				.to({x:twn_x,y:twn_y},1000)
			}
			else if(m == 6){
				this.gro_prop.addChild(insect);
				let twn_x = 436 + Help.random_num(-2,2)*20;
				let twn_y = 930 + Help.random_num(-2,2)*5;
				egret.Tween.get(insect)
				.set({x:530,y:720})
				.to({x:twn_x,y:twn_y},1000)
			}
		}
		else if(m){
			Help.inspos(m,insect);
			this.gro_prop.addChild(insect);
		}
	}



	private kettleTwn() {
		egret.Tween.get(this.img_kettle)
			.to({ y: -130 }, 500)
			.to({ x: -29, y: -170, rotation: -54 }, 500).call(this.waterTwn, this)
			.wait(1200)
			.to({ y: -130, rotation: 0 }, 500)
			.to({ y: 85, x: 102 }, 500).call(this.tettleEad, this);
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
		Help.waters();
		this.img_water.visible = false;
	}

	// 水壶冷却展现
	private tettleEad() {
		this.getOwnTree();
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
		if (time > 3) {
			this.gro_lq.touchEnabled = true;
		}
		else {
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
		this.a = this.a - 1;
		this.showtime(this.a);
		if (this.a <= 0) {
			this.b = this.b + 10
			if(this.b >= 40){
				this.b = 40;
			}
			this.a = this.b
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
		let text = new eui.Label();
		text.text = "-1s";
		text.x = 625;
		text.y = 1000;
		text.textColor = 0x1B8399;
		text.size = 40;
		this.addChild(text);
		egret.Tween.get(text)
		.to({y:960},500).call(()=>{this.removeChild(text)},this)
	}

	//水壶冷却完成
	private kettleshow() {
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
			icon.y = 892;
		}
		else if (type == 2) {
			icon.texture = RES.getRes("fuhe");
			icon.x = 144;
			icon.y = 1005;
		}
		else if (type == 3) {
			icon.texture = RES.getRes("shuirong");
			icon.x = 169;
			icon.y = 1129;
		}
		icon.anchorOffsetX = icon.width / 2;
		icon.anchorOffsetY = icon.height / 2;
		this.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 540, y: 815 }, 1000)
			.wait(300)
			.to({ rotation: -60 }, 500).call(() => { this.huafeikeli(icon), this })
	}


	private huafeikeli(icon1) {
		let icon = new eui.Image();
		icon.texture = RES.getRes("huafeili");
		icon.x = 460;			//355
		icon.y = 847;			//875
		icon.width = 35;
		icon.height = 57;
		this.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 440, y: 875, alpha: 0.2 }, 500)
			.wait(200)
			.set({ x: 460, y: 847, alpha: 1 })
			.to({ x: 440, y: 875, alpha: 0.2 }, 500)
			.wait(200).call(() => { this.removeChild(icon), this }).call(() => { this.removeChild(icon1), this }).call(() => { this.getOwnTree(), this })

	}

	public showDynamicMsg(info: string, userName, userIcon) {
		this.dynamic.visible = true
		this.dynamic.alpha = 1;
		this.dynamic_info.text = info;
		if (info.length > 4) {
			this.dynamic_bg.width = 230 + (info.length - 4) * 25
		}
		HttpRequest.imageloader(userIcon, this.dynamic_image);
		var timer: egret.Timer = new egret.Timer(2000, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
			egret.Tween.get(this.dynamic)
				.to({ alpha: 0 }, 1500)
		}, this)
		timer.start()
	}

}