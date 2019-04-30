class DynamicScene extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/DynamicSkins.exml";
	}

	private scr_dyn: eui.Scroller;
	private list_dyn: eui.List;
	private line: eui.Rect;
	private perNum = 1;
	private isLastPage = "false";
	private treeUserId;
	private euiArr: eui.ArrayCollection = new eui.ArrayCollection();

	protected childrenCreated(): void {
		super.childrenCreated();
		this.addEventListener(PuticonEvent.TOFRIEND, this.closeScene, this);
		this.addEventListener(MaskEvent.INITEUIARR, () => {
			this.perNum = 1;
			this.euiArr.removeAll();
			this.list_dyn.scrollV = 0;
			if (this.perNum == 1) {
				this.map = {}
			}
		}
			, this);
		this.scr_dyn.verticalScrollBar = null;
		this.scr_dyn.bounces = null;
		this.list_dyn.useVirtualLayout = true;
		this.list_dyn.dataProvider = this.euiArr;
		this.list_dyn.itemRenderer = dynList_item;
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
		if (this.perNum == 1) {
			localStorage.setItem("dyn_red", data.data.list[0].id);
		}
		var dyndata = Data.data.list;
		var dyndata_user = [];
		if (!dyndata || dyndata.length == 0) {
			return;
		}
		let dyn_data = this.initData(dyndata)
		for (let i = 0; i < dyndata.length; i++) {
			if (dyndata[i].mainUser != "") {
				dyndata_user.push(dyndata[i].mainUser);
			}
		}
		dyndata_user = this.uniq(dyndata_user);
		for (let i = 0; i < dyn_data.length; i++) {
			this.euiArr.addItem(dyn_data[i])
		}
		if (Data.data.isLastPage == "true") {
			this.euiArr.addItem({ state: true, createDate: "2018-11-30 10:41:44" });
		}
		else {
			this.scr_dyn.addEventListener(eui.UIEvent.CHANGE_END, this.asdas, this)
		}

		if (dyndata_user && dyndata_user.length > 0) {

			let params = {
				users: dyndata_user.join(",")
			};
			MyRequest._post("game/getWechatImg", params, this, this.Req_getWechatImg.bind(this, Data), this.onGetIOError);
		}
	}

	private Req_getWechatImg(Data, data) {
		console.log(data, "动态")
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		if (data) {
			var size = this.euiArr.source.length
			for (var a = 0; a < size; a++) {
				var obj = this.euiArr.source[a]
				if (obj.mainUser && data[obj.mainUser]) {
					this.euiArr.source[a].userIcon = data[obj.mainUser]
					this.euiArr.itemUpdated(this.euiArr.source[a])
				}
			}
		}

		// this.euiArr.addItem({state:true,createDate:"2018-11-30 10:41:44"});
		console.log(this.euiArr, "动态数据")
		this.line.height = this.euiArr.length * 120;
		this.isLastPage = Data.data.isLastPage;
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



	private onComplete(): void {
	}


	//关闭该场景
	public closeScene() {
		this.perNum = 1;
		this.euiArr.removeAll();
		if (this.perNum == 1) {
			this.map = {}
		}
		this.list_dyn.scrollV = 0;
		// let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
		// this.parent.dispatchEvent(Removemask);
		// SceneManager.toMainScene();
		NewHelp.removemask()
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}


}


class dynList_item extends eui.ItemRenderer {
	private dyn_day: eui.Label;						//日期
	private user_icon: eui.Image;					//头像
	private dyn_label: eui.Label;					//动态消息
	private dyn_time: eui.Label;					//时间
	private dyn_toother: eui.Label;					//去他人果园

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
		this.dyn_toother.visible = false;
		this.currentState = "day"
		this.user_icon.texture = RES.getRes("noicon_png");
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
		this.dyn_time.text = Help.getTime(this.data.createDate, "hours");
		if (this.data.type == 7) {
			this.user_icon.texture = RES.getRes("gamelogo")
		}
		else if (this.data.type == 50) {
			if (this.data.mainUserIcon) {
				var err = HttpRequest.imageloader(Config.picurl + this.data.userIcon, this.user_icon, this.data.mainUser);
				if (err && err == 1) {
					this.user_icon.texture = RES.getRes("noicon_png")
				}
			} else {
				let params = {
					users: SceneManager.instance.weixinUtil.login_user_id
				}
				MyRequest._post("game/getWechatImg", params, this, NewHelp.Req_WechatImg.bind(this, SceneManager.instance.weixinUtil.login_user_id, this.user_icon), null);
			}
		}
		else if (this.data.mainUserIcon) {
			// HttpRequest.imageloader(Config.picurl + Help.getdynIcon()[this.data.mainUser], this.user_icon, this.data.mainUser);
			if (this.data.userIcon) {
				var err = HttpRequest.imageloader(Config.picurl + this.data.userIcon, this.user_icon, this.data.mainUser);
				if (err && err == 1) {
					this.user_icon.texture = RES.getRes("noicon_png")
				}
			} else {
				this.user_icon.texture = RES.getRes("gamelogo")
			}
		}
		if (this.data.type == 0) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = "我的" + this.data.treeName + this.data.stageName + "了!";
		}
		else if (this.data.type == 1) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "领取了" + this.data.treeName + "!";

		}
		else if (this.data.type == 2) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "拜访你的农场" }
			);
			this.dyn_toother.text = "拜访TA>";
		}
		else if (this.data.type == 3) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "来偷水" + this.data.num + "g" }
			);
			this.dyn_toother.text = "拜访TA>";
		}
		else if (this.data.type == 4) {
			let info = ""
			if (Number(this.data.num) > 0) {
				info = "帮你的小树浇了" + this.data.num + "g水"
			} else {
				info = "来帮你浇水啦，每日帮浇水已达上限，没有获得成长值哦"
			}
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: info }
			);
			this.dyn_toother.text = "拜访TA>";
		}
		else if (this.data.type == 5) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你留言" }
			);
			this.dyn_toother.text = "给TA留言>";
		}
		else if (this.data.type == 6) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "签到";

		}
		else if (this.data.type == 7) {
			this.dyn_toother.visible = false;
			if (this.data.getType && this.data.getType != "") {
				if (this.data.getType == 0) {									//道具
					this.dyn_label.text = "我" + this.getWayByTypecode(this.data.typeCode) + "获得了" + this.data.num + "个" + this.getpropname(this.data);
				}
				else if (this.data.getType == 1) {								//种子
					this.dyn_label.text = "我" + this.getWayByTypecode(this.data.typeCode) + "获得了" + this.data.num + "个" + this.data.treeName + "种子";
				}
				else if (this.data.getType == 2) {								//鸭子
					this.dyn_label.text = "我" + this.getWayByTypecode(this.data.typeCode) + "获得了" + this.data.num + "个领取鸭子次数";
				}
				else if (this.data.getType == 3) {								//订单
					this.dyn_label.text = "我" + this.getWayByTypecode(this.data.typeCode) + "获得了" + this.data.num + "个" + this.data.treeName + "订单";
				}
				else if (this.data.getType == 4) {								//果实
					this.dyn_label.text = "我" + this.getWayByTypecode(this.data.typeCode) + "获得了" + this.data.num + "个" + this.data.treeName + "果子";
				}
			}
		}
		else if (this.data.type == 10) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你放了杂草" }
			);
			this.dyn_toother.text = "给TA捣蛋>";
		}
		else if (this.data.type == 11) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "给你放了虫子" }
			);
			this.dyn_toother.text = "给TA捣蛋>";
		}
		else if (this.data.type == 20) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "帮你除草" }
			);
			this.dyn_toother.text = "拜访TA>";
		}
		else if (this.data.type == 21) {
			this.dyn_toother.visible = true;
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: "帮你除虫" }
			);
			this.dyn_toother.text = "拜访TA>";
		}
		else if (this.data.type == 50) {
			let info = ""
			if (this.data.mainUserName && this.data.mainUserName != "") {
				this.dyn_toother.visible = true;
				if (this.data.num > 0) {
					info = "帮你摘了" + this.data.num + "个果子哦";
				} else {
					info = "手气不佳，没有帮我摘到果子哦"
				}
				this.dyn_label.textFlow = Array<egret.ITextElement>(
					{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
					, { text: info }
				);
				this.dyn_toother.text = "去TA农场>";
			}
			else {
				this.dyn_toother.visible = false;
				if (this.data.treeName)
					info = "帮别人摘了" + this.data.num + "个" + this.data.treeName + "哦";
				this.dyn_label.text = info;
			}
		}
		else if (this.data.type == 100) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName, 4) + "兑换了水果";
		}
		else if (this.data.type == 101) {
			let info = ""
			if (this.data.mainUserName && this.data.mainUserName != "") {
				this.dyn_toother.visible = true;
				if (this.data.num > 0) {
					info = "来偷了" + this.data.num + "个我的果子哦";
				} else {
					info = "手气不佳，没有偷到我的果子哦"
				}
				this.dyn_label.textFlow = Array<egret.ITextElement>(
					{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
					, { text: info }
				);
				this.dyn_toother.text = "去TA农场>";
			}
		}
		else if (this.data.type == 201) {
			this.dyn_toother.visible = false;
			this.dyn_label.text = "我领取了鸭子！"

		}
		else if (this.data.type == 202) {
			this.dyn_toother.visible = true;
			let info
			if (this.data.num > 0) {
				info = "偷了" + this.data.num + "个鸭蛋"
			}
			else {
				info = "没有偷到你的蛋"
			}
			this.dyn_label.textFlow = Array<egret.ITextElement>(
				{ text: Help.getcharlength(this.data.mainUserName, 4), style: { "href": "event:" + this.data.mainUser, "underline": true } }
				, { text: info }
			);
		}
	}


	private getpropname(data) {
		if (this.data.propType == 0) {
			return "水滴"
		}
		else if (this.data.propType == 50) {       //种子
			return "种子"
		}
		else if (this.data.propType == 51) {
			return "鸭子"
		}
		else if (this.data.propType == 7) {
			return "鸭蛋"
		}
		else if (this.data.propType == 6) {
			return "鸭食"
		}
		else {
			if (this.data.propId == 3) {          //果篮
				return "果篮"
			}
			else if (this.data.propId == 4) {     //有机肥
				return "生长肥"
			}
			else if (this.data.propId == 5) {     //复合肥
				return "加速肥"
			}
			else if (this.data.propId == 6) {     //水溶肥
				return "增果肥"
			}
			else if (this.data.propId == 7) {     //剪刀
				return "剪刀"
			}
			else if (this.data.propId == 9) {      //虫
				return "虫"
			}
			else if (this.data.propId == 10) {      //草
				return "草"
			}

		}
	}

	// 去他人农场
	private toother(user) {
		console.log(user, "用户")
		let evt: PuticonEvent = new PuticonEvent(PuticonEvent.TOFRIEND);
		SceneManager.sceneManager.getDynamicScene().dispatchEvent(evt);
		if (Datamanager.getfriendsdata()) {
			let frienddata = Datamanager.getfrienddataByuser(user)
			if (frienddata) {
				Datamanager.savenowfrienddata(frienddata);
			}
			else {
				return;
			}
			let treeid = Datamanager.getfriendtreeUseridByUser(user);
			if (!treeid) {
				if (SceneManager.sceneManager.landId == 1) {
					SceneManager.sceneManager.newmainScene.updateBytreedata(null);
				}
				else if (SceneManager.sceneManager.landId == 2) {
					SceneManager.sceneManager.newmain2Scene.updateBytreedata(null);
				}
			}
			else {
				NewHelp.getTreeInfoByid(treeid);
			}
			Help.passAnm();
		}
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


	private getWayByTypecode(code) {
		if (code == "water") {
			return "通过帮浇水"
		}
		else if (code == "sign_in") {
			return "通过签到"
		}
		else if (code == "system_give") {
			return "通过惊喜礼包"
		}
		else if (code == "friend_take") {
			return "通过帮摘果"
		}
		else if (code == "help_feed_duck") {
			return "通过帮喂鸭子"
		}
		else if (code == "receive_tree") {
			return "通过领取果树"
		}
		else if (code == "receive_duck") {
			return "通过领取鸭子"
		}
		else if (code == "receive_task") {
			return "通过领取任务"
		}
		else if (code == "answer") {
			return "通过答题"
		}
		else if (code == "praise_exchange") {
			return "通过点赞兑换"
		}
		else if (code == "order") {
			return "通过商城下单"
		}
		else {
			return ""
		}
	}
}
enum dynList_State { day, noday, nomore }