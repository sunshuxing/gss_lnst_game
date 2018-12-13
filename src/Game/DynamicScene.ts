class DynamicScene extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/DynamicSkins.exml";
	}

	private btn_close: eui.Image;
	private scr_dyn: eui.Scroller;
	private list_dyn: eui.List;
	private line: eui.Image;
	private perNum = 1;
	private isLastPage = "false";
	private treeUserId;
	private dyndata_user = [];
	private euiArr: eui.ArrayCollection = new eui.ArrayCollection();

	protected childrenCreated(): void {
		super.childrenCreated();
		this.addEventListener(PuticonEvent.TOFRIEND, this.closeScene, this);
		this.addEventListener(MaskEvent.INITEUIARR, () => { 
				this.perNum = 1;
				this.euiArr.removeAll();
				this.list_dyn.scrollV = 0;
				if(this.perNum == 1){
					this.map={}
				}
			}
			,this);
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeScene, this)
		this.scr_dyn.verticalScrollBar = null;
		this.scr_dyn.bounces = null;
		this.list_dyn.useVirtualLayout = false;
		console.log("childrenCreated");
	}

	private asdas() {
		if (this.list_dyn.scrollV == this.list_dyn.contentHeight - this.list_dyn.height) {
			if (this.isLastPage == "false") {
				this.perNum = this.perNum + 1;
				this.searchDynamic(this.treeUserId);
			}
			else {
				this.scr_dyn.removeEventListener(eui.UIEvent.CHANGE_END, this.asdas, this);
			}
		}
	}

	//查询动态
	public searchDynamic(treeUserId) {
		this.treeUserId = treeUserId
		
		let params = {
			treeUserId: treeUserId,
			pageNo: this.perNum,
			numPerPage: 10
		};
		MyRequest._post("game/searchDynamic", params, this, this.Req_searchDynamic.bind(this), this.onGetIOError)
	}

	//查询动态信息成功后处理
	private Req_searchDynamic(data): void {
		var Data = data;
		var dyndata = Data.data.list;
		for (let i = 0; i < dyndata.length; i++) {
			if (dyndata[i].mainUser != "") {
				this.dyndata_user.push(dyndata[i].mainUser);
				this.dyndata_user = this.uniq(this.dyndata_user);
			}
		}
		let dyn_data = this.initData(dyndata)
		this.scr_dyn.addEventListener(eui.UIEvent.CHANGE_END, this.asdas, this)
		for(let i=0;i<dyn_data.length;i++){
			this.euiArr.addItem(dyn_data[i])
		}
		if(Data.data.isLastPage == "true"){
			this.euiArr.addItem({ state: true, createDate: "2018-11-30 10:41:44" });
		}
		else{
			this.scr_dyn.addEventListener(eui.UIEvent.CHANGE_END, this.asdas, this)	
		}
		if (this.dyndata_user && this.dyndata_user.length > 0) {
			let params = {
				users: this.dyndata_user.join(",")
			};
			MyRequest._post("game/getWechatImg", params, this, this.Req_getWechatImg.bind(this,this.euiArr), this.onGetIOError);
		}
		// this.euiArr.addItem({state:true,createDate:"2018-11-30 10:41:44"});
		this.line.height = this.euiArr.length * 300;
		this.isLastPage = Data.data.isLastPage;
	}

	private Req_getWechatImg(euiArr:eui.ArrayCollection,data) {
		if(!data){
			return;
		}
		data = data.data;
		if( data && typeof data === "string"){
			data = JSON.parse(data)
		}
		Help.savedynIcon(data);
		this.list_dyn.dataProvider = euiArr;
		this.list_dyn.itemRenderer = dynList_item;
	}

	//数组去重
	private uniq(array) {
		var temp = []; //一个新的临时数组
		for (var i = 0; i < array.length; i++) {
			if (temp.indexOf(array[i]) == -1) {
				temp.push(array[i]);
			}
		}
		return temp;
	}


	private map: { [key: string]: boolean } = {};//创建一个map,用于存放时间
	private initData(data: Array<Dynamic>): Array<Dynamic> {
		if (!data) {
			return null;
		}
		for (let a = 0; a < data.length; a++) {
			let time = data[a].createDate.split(" ")[0];	//取出日期
			let hasTime = this.map[time]
			if (!hasTime) {
				this.map[time] = true
				data[a].showDate = true;
			} else {
				data[a].showDate = false;
			}
		}
		return data;
	}

	//请求错误
	private onGetIOError(event: egret.IOErrorEvent): void {
		console.log("get error : " + event);
	}

	private setItemState(list) {
		for (let i = 0; i < list.length; i++) {
			for (let j = 0; j < list.length - 1; j++) {

			}
		}
	}


	//数组排序
	private arrsort(arr) {
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr.length - i - 1; j++) {
				let t = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = t;
			}
		}
	}

	private onComplete(): void {
		console.log("onComplete");
	}


	//关闭该场景
	private closeScene() {
		this.perNum = 1;
		this.euiArr.removeAll();
		if(this.perNum == 1){
			this.map={}
		}
		this.list_dyn.scrollV = 0;
		let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
		this.parent.dispatchEvent(Removemask);
		SceneManager.toMainScene();
	}


}


class dynList_item extends eui.ItemRenderer {
	private dyn_day: eui.Label;						//日期
	private user_icon: eui.Image;					//头像
	private dyn_bg: eui.Image;						//背景
	private dyn_label: eui.Label;					//动态消息
	private dyn_time: eui.Label;						//时间
	private dyn_des: eui.Label;						//描述
	private dynList_State: dynList_State;			//item状态
	private dyn_toother: eui.Group;					//去他人果园
	private dyn_icon: eui.Image;						//图标

	public constructor() {
		super()
		// 把这个类和皮肤联系起来
		this.skinName = 'resource/skins/DynamicListSkins.exml'
		// 当组件创建完成的时候触发
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
		this.dyn_label.addEventListener(egret.TextEvent.LINK, function (evt: egret.TextEvent) {
			this.toother(evt.text)
		}, this);
		this.dyn_toother.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.toother(this.data.mainUser)
		}, this)

	}
	private onComplete() {

	}

	// 当数据改变时，更新视图
	protected dataChanged() {
		if (this.data.showDate) {
			this.currentState = "day"
			this.dyn_day.text = Help.getTime(this.data.createDate, "day");
		} else {
			this.currentState = "noday"
		}
		if (this.data.state) {
			this.currentState = "nomore"
		}
		// if(this.dyn_label.text.length>18){//如果大于18个字符串则需要换行
		// 	let lineNum = this.dyn_label.text.length/18		//要换行多少每行35
		// 	this.dyn_bg.height = this.dyn_bg.height + 35 * lineNum
		// 	this.height = this.height + 35 * lineNum
		// 	this.dyn_time.y = this.dyn_time.y + 35 * lineNum
		// 	this.dyn_toother.y = this.dyn_toother.y + 35 * lineNum
		// }
		this.dyn_time.text = Help.getTime(this.data.createDate, "hours");
		if (this.data.type == 0) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = "我的" + this.data.treeName + this.data.stageName + "了!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-ly-xt");
			HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
		}
		else if (this.data.type == 1) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "领取了" + this.data.treeName + "!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-ly-xt");
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);

			}
		}
		else if (this.data.type == 2) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "拜访你的农场" }
			);
			this.dyn_des.text = "拜访TA";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 3) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "来偷水"+this.data.num+"g" }
			);
			this.dyn_des.text = "拜访TA";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 4) {
			let info = ""
			if (Number(this.data.num) > 0) {
				info = "帮你的小树浇了" + this.data.num + "g水"
			} else {
				info = "来帮你浇水啦，每日帮浇水已达上限，没有获得成长值哦"
			}
			this.dyn_bg.height = this.dyn_label.height+92;
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: info }
			);
			this.dyn_des.text = "拜访TA";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 5) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-ly-icon");
			this.dyn_bg.texture = RES.getRes("dyn-ly-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你留言" }
			);
			this.dyn_des.text = "给TA留言";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 6) {
			this.dyn_toother.visible = false;
			this.dyn_bg.texture = RES.getRes("dyn-ly-xt");
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "签到";
			this.dyn_des.text = "";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}

		}
		else if (this.data.type == 7) {
			this.dyn_toother.visible = false;
			this.dyn_bg.texture = RES.getRes("dyn-ly-xt");
			this.dyn_label.text = "您获得了" + this.data.num + "个" + this.getpropname(this.data.propType);
			this.dyn_des.text = "";
			this.user_icon.texture = RES.getRes("gamelogo")
		}
		else if (this.data.type == 10) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你放了杂草爱神的箭熬枯受淡卡刷卡的哈桑单卡的很卡仕达" }
			);
			this.dyn_des.text = "给TA捣蛋";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 11) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你放了虫子" }
			);
			this.dyn_des.text = "给TA捣蛋";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 20) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "帮你除草" }
			);
			this.dyn_des.text = "拜访TA";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 21) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "帮你除虫" }
			);
			this.dyn_des.text = "拜访TA";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 50) {
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg");
			let info = ""
			if (this.data.num > 0) {
				info = "帮你摘了" + this.data.num + "个果子哦";
			} else {
				info = "手气不佳，没有帮您摘到果子哦"
			}
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: info }
			);
			this.dyn_des.text = "去TA农场";
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}
		else if (this.data.type == 100) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "兑换了水果";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-ly-xt");
			if (this.data.mainUserIcon) {
				HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon);
			}
		}

		this.dyn_bg.height = this.dyn_label.height+92;

	}


	private getpropname(data) {
		if (data == 0) {
			return "水滴"
		}
		else if (data == 1) {
			return "果篮"
		}
		else if (data == 2) {
			return "爱心值"
		}
		else if (data == 3) {
			return "化肥"
		}
		else if (data == 4) {
			return "成长值"
		}
		else if (data == 5) {
			return "果子"
		}
	}

	// 去他人花园
	private toother(user) {
		var data = Help.getUserFriendData();
		var userid = Help.getUserIdByUser(user, data);
		Help.passAnm();
		let evt: PuticonEvent = new PuticonEvent(PuticonEvent.TOFRIEND);
		evt.userid = userid;
		SceneManager.sceneManager.mainScene.dispatchEvent(evt);
		SceneManager.sceneManager.dynamicScene.dispatchEvent(evt);
	}


	private setState(dynList_State) {
		if (dynList_State == 0) {
			this.currentState = "day";
		}
		else if (dynList_State == 1) {
			this.currentState = "noday";
		}
		else if (dynList_State == 2) {
			this.currentState = "nomore";
		}
	}
}
enum dynList_State { day, noday, nomore }