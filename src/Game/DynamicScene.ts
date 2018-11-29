class DynamicScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/DynamicSkins.exml";
	}

	private btn_close:eui.Image;
	private scr_dyn:eui.Scroller;
	private list_dyn:eui.List;
	private line:eui.Image;
	private arr:any[] = []


	protected childrenCreated():void
	{
		super.childrenCreated();
		// this.searchDynamic(Help.getTreeUserData().id);
		this.addEventListener(PuticonEvent.TOFRIEND,this.closeScene,this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeScene,this)
		this.scr_dyn.addEventListener(eui.UIEvent.CHANGE_END,this.asdas,this)
        this.scr_dyn.verticalScrollBar = null;
		this.scr_dyn.bounces = null;
		console.log("childrenCreated");
	}

	private asdas(){
		if(this.list_dyn.scrollV == this.list_dyn.contentHeight - this.list_dyn.height){
			console.log("滑动到了底部")
		}
		
	}

	//查询动态
	public searchDynamic(treeUserId){
		let params = {	
			treeUserId:treeUserId,
			pageNo:1,
			numPerPage:10000
			};
		MyRequest._post("game/searchDynamic",params,this,this.Req_searchDynamic.bind(this),this.onGetIOError)
	}

	//查询动态信息成功后处理
	private Req_searchDynamic(data):void{
		var Data = data;
		var dyndata = Data.data.list;
		dyndata = this.initData(dyndata)
		console.log("动态数据:",Data)
		let euiArr:eui.ArrayCollection = new eui.ArrayCollection(dyndata);
		this.line.height = euiArr.length*300;
		this.list_dyn.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.list_dyn.itemRenderer = dynList_item;
	}

	private initData(data:Array<Dynamic>):Array<Dynamic>{
		if(!data){
			return null;
		}
		let map: { [key: string]: boolean } = {};//创建一个map
		for(let a = 0;a<data.length;a++){
			let time = data[a].createDate.split(" ")[0];	//取出日期
			let hasTime = map[time]
			if(!hasTime){
				map[time] = true
				data[a].showDate = true;
			}else{
				data[a].showDate = false;
			}
		}
		return data;
	}

	//请求错误
	private onGetIOError(event:egret.IOErrorEvent):void {
    	console.log("get error : " + event);
	}

	private setItemState(list){
		for(let i=0;i<list.length;i++){
			for(let j=0;j<list.length-1;j++){

			}
		}
	}


	//数组排序
	private arrsort(arr){
		for(let i=0;i<arr.length;i++){
			for(let j = 0;j < arr.length-i-1;j++){
					let t = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = t;
			}
		}
	}

    private onComplete():void{
        console.log("onComplete"); 
    }


	//关闭该场景
    private closeScene(){
        let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
    }


}


class dynList_item extends eui.ItemRenderer{
    private dyn_day:eui.Label;						//日期
	private user_icon:eui.Image;					//头像
	private dyn_bg:eui.Image;						//背景
	private dyn_label:eui.Label;					//动态消息
	private dyn_time:eui.Label;						//时间
	private dyn_des:eui.Label;						//描述
	private dynList_State:dynList_State;			//item状态
	private dyn_toother:eui.Group;					//去他人果园
	private dyn_icon:eui.Image;						//图标

    public constructor() {
		super()
		// 把这个类和皮肤联系起来
		this.skinName = 'resource/skins/DynamicListSkins.exml'
		// 当组件创建完成的时候触发
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
		this.dyn_label.addEventListener( egret.TextEvent.LINK, function( evt:egret.TextEvent ){
            this.toother(evt.text)
			}, this);
		this.dyn_toother.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            this.toother(this.data.mainUser)
		}, this)
		this.itemIndex
		
	}
	private onComplete() {
		
	}

	// 当数据改变时，更新视图
	protected dataChanged() {
		if(this.data.showDate){
			this.setState(0)
			this.dyn_day.text = Help.getTime(this.data.createDate,"day");
		}else{
			this.setState(1)
		}
		if(this.dyn_label.text.length>18){//如果大于18个字符串则需要换行
			let lineNum = this.dyn_label.text.length/18		//要换行多少每行35
			this.dyn_bg.height = this.dyn_bg.height + 35 * lineNum
			this.height = this.height + 35 * lineNum
			this.dyn_time.y = this.dyn_time.y + 35 * lineNum
			this.dyn_toother.y = this.dyn_toother.y + 35 * lineNum
		}
		this.dyn_time.text = Help.getTime(this.data.createDate,"hours");
		if(this.data.type == 0){
			this.dyn_toother.visible = false;
			this.dyn_label.text = "我的"+this.data.treeName+this.data.stageName+"了!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg");
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 1){
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName,4)+"领取了"+this.data.treeName+"!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg");
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 2){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"拜访你的果园"}
        );
			this.dyn_des.text = "拜访TA";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 3){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"来偷水"}
        );
			this.dyn_des.text = "拜访TA";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 4){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"帮你的小树浇了10g水"}
        );
			this.dyn_des.text = "拜访TA";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 5){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-ly-icon");
			this.dyn_bg.texture = RES.getRes("dyn-ly-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"给你留言"}
        );
			this.dyn_des.text = "给TA留言";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 6){
			this.dyn_toother.visible = false;
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg");
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName,4)+"签到";
			this.dyn_des.text = "";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}

		}
		else if(this.data.type == 7){
			this.dyn_toother.visible = false;
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg");
			this.dyn_label.text = "您获得了"+this.data.num+"个"+this.getpropname(this.data.propType);
			this.dyn_des.text = "";
			this.user_icon.texture = RES.getRes("logo")
		}
		else if(this.data.type == 10){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"给你放了杂草"}
        );
			this.dyn_des.text = "给TA捣蛋";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 11){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"给你放了虫子"}
        );
			this.dyn_des.text = "给TA捣蛋";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 20){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"帮你除草"}
        );
			this.dyn_des.text = "拜访TA";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 21){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg");
			this.dyn_label.textFlow = Array<egret.ITextElement>(
            { text:Help.getcharlength(this.data.mainUserName,4), style: { "href" : "event:"+this.data.mainUser,"underline":true} }
            ,{ text:"帮你除虫"}
        );
			this.dyn_des.text = "拜访TA";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 100){
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName,4)+"兑换了水果";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg");
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}

		
	}


	private getpropname(data){
		if(data == 0){
			return "水滴"
		}
		else if(data == 1){
			return "道具"
		}
		else if(data == 2){
			return "爱心值"
		}
		else if(data == 3){
			return "化肥"
		}
		else if(data == 4){
			return "成长值"
		}
		else if(data == 5){
			return "果子"
		}
	}

	// 去他人花园
	private toother(user){
		var data = Help.getUserFriendData();
		var userid = Help.getUserIdByUser(user,data);
		Help.passAnm();
		let evt:PuticonEvent = new PuticonEvent(PuticonEvent.TOFRIEND);
		evt.userid = userid;
		SceneManager.sceneManager.mainScene.dispatchEvent(evt);
		SceneManager.sceneManager.dynamicScene.dispatchEvent(evt);	
	}


	private setState(dynList_State){
		if(dynList_State == 0){
			this.currentState = "day";
		}
		else if(dynList_State == 1){
			this.currentState = "noday";
		}
		else{
			this.currentState = "nomore";
		}
	}
}
enum dynList_State{day,noday,nomore}