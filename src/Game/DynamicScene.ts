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
		this.searchDynamic(Help.getTreeUserData().id);
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
	private searchDynamic(treeUserId){
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
		if(Data.status == 0){
			var dyndata = Data.data.list;
		}
		console.log("动态数据:",Data)
		let euiArr:eui.ArrayCollection = new eui.ArrayCollection(data.data.list);
		this.line.height = euiArr.length*220;
		this.list_dyn.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.list_dyn.itemRenderer = dynList_item;
	}

	//请求错误
	private onGetIOError(event:egret.IOErrorEvent):void {
    	console.log("get error : " + event);
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
	}
	private onComplete() {
		
	}
	// 当数据改变时，更新视图
	protected dataChanged() {
		console.log(this.data)
		this.dyn_day.text = Help.getTime(this.data.createDate,"day");
		this.dyn_time.text = Help.getTime(this.data.createDate,"hours");
		if(this.data.type == 0){
			this.dyn_toother.visible = false;
			this.dyn_label.text = "我的"+this.data.treeName+this.data.stageName+"了!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg_png");
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 1){
			this.dyn_toother.visible = false;
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName,4)+"领取了"+this.data.treeName+"!";
			this.dyn_des.text = "";
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg_png");
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 2){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-ly-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-ly-bg_png");
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
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg_png");
			this.dyn_label.text = Help.getcharlength(this.data.mainUserName,4)+"签到";
			this.dyn_des.text = "";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}

		}
		else if(this.data.type == 7){
			this.dyn_toother.visible = false;
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg_png");
			this.dyn_label.text = "您获得了"+this.data.num+"个"+this.getpropname(this.data.propType);
			this.dyn_des.text = "";
			if(this.data.mainUserIcon){
				HttpRequest.imageloader(this.data.mainUserIcon,this.user_icon);
			}
		}
		else if(this.data.type == 10){
			this.dyn_toother.visible = true;
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-dd-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-dd-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg_png");
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
			this.dyn_icon.texture = RES.getRes("dyn-bf-icon_png");
			this.dyn_bg.texture = RES.getRes("dyn-bf-bg_png");
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
			this.dyn_bg.texture = RES.getRes("dyn-xt-bg_png");
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