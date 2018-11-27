class HuafeiScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/HuafeiSkins.exml";
	}

    private youji_btn:eui.Button;
    private fuhe_btn:eui.Button;
    private shuirong_btn:eui.Button;
    private youji_num:eui.Label;
    private fuhe_num:eui.Label;
    private shuirong_num:eui.Label;

    protected childrenCreated():void
	{
		super.childrenCreated();
        this.getOwnProp();
    }

    private onComplete():void{
        console.log("onComplete");
        this.youji_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useyouji,this);
        this.fuhe_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.usefuhe,this)
        this.shuirong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useshuirong,this)
    }


    private useyouji(){
        if(Number(this.youji_num.text) >= 1){
            this.useProp(4,1);
        }
        else{
            this.colseScene()
            let content = "您的有机肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
    }

    private usefuhe(){
        if(Number(this.fuhe_num.text) >= 1){
            this.useProp(5,2);
        }
        else{
            this.colseScene()
            let content = "您的复合肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
    }

    private useshuirong(){
        if(Number(this.shuirong_num.text) >= 1){
            this.useProp(6,3);
        }
         else{
            this.colseScene()
            let content = "您的水溶肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
    }

    private colseScene(){
        let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
    }

    private useProp(propId,type){
        let canUseProp = Help.getTreeUserData().canReceive ==null?"false":Help.getTreeUserData().canReceive;
		if(canUseProp == 'true'){
			console.log("果树已经可以兑换啦，不用再使用道具了。")
			return;
		}
		let params = {	
			propId:propId
			};
		MyRequest._post("game/useProp",params,this,this.Req_useProp.bind(this,type),this.onGetIOError);
	}


	//使用道具成功后处理
	private Req_useProp(type,data):void{
        this.getOwnProp();
		let evt:PuticonEvent = new PuticonEvent(PuticonEvent.USEHUAFEI);
        evt.Type = type
        this.parent.dispatchEvent(evt);
        this.colseScene()
	}


    public getOwnProp(){
		MyRequest._post("game/getOwnProp",null,this,this.Req_getOwnProp.bind(this),this.onGetIOError)
	}

	//查询自己的道具成功后处理
	private Req_getOwnProp(Data):void{
        this.youji_num.text = Help.getPropById(Data.data,4)?Help.getPropById(Data.data,4).num:0;
        this.fuhe_num.text = Help.getPropById(Data.data,5)?Help.getPropById(Data.data,5).num:0;
        this.shuirong_num.text = Help.getPropById(Data.data,6)?Help.getPropById(Data.data,6).num:0;
		console.log(Data,"自己道具数据")
	}



    //请求错误
	private onGetIOError(event:egret.IOErrorEvent):void {
    	console.log("get error : " + event);
	}
    
}