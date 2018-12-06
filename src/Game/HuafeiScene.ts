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
        localStorage.setItem("huafeisee","true");
    }

    private onComplete():void{
        console.log("onComplete");
        this.youji_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useyouji,this);
        this.fuhe_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.usefuhe,this)
        this.shuirong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useshuirong,this)
    }


    private useyouji(){
        if(Number(this.youji_num.text) >= 1){
            if(Help.getOwnData().stageObj.fitFeritilizer == 4){
                this.useProp(4,1);
            }
            else{
                let prompt = new PromptHuafei();
                let tishi = "(使用"+this.gethuafei(Help.getOwnData().stageObj.fitFeritilizer)+"能使小树更快生长!)"
                prompt.x = 85;
                prompt.y = 430;
                prompt.setUse(1);
                prompt.setPrompt(tishi);
                SceneManager.sceneManager._stage.addChild(prompt);
            }
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
            if(Help.getOwnData().stageObj.fitFeritilizer == 5){
                this.useProp(5,2);
            }
            else{
                let prompt = new PromptHuafei();
                let tishi = "(使用"+this.gethuafei(Help.getOwnData().stageObj.fitFeritilizer)+"能使小树更快生长!)"
                prompt.x = 85;
                prompt.y = 430;
                prompt.setUse(2);
                prompt.setPrompt(tishi);
                SceneManager.sceneManager._stage.addChild(prompt)
            }
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
            if(Help.getOwnData().stageObj.fitFeritilizer == 6){
                this.useProp(6,3);
            }
            else{
                let prompt = new PromptHuafei();
                let tishi = "(使用"+this.gethuafei(Help.getOwnData().stageObj.fitFeritilizer)+"能使小树更快生长!)"
                prompt.x = 85;
                prompt.y = 430;
                prompt.setUse(3);
                prompt.setPrompt(tishi);
                SceneManager.sceneManager._stage.addChild(prompt);
            }
        }
         else{
            this.colseScene()
            let content = "您的水溶肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
    }

    private gethuafei(propid){
        if(propid == 4){
            return "有机肥"
        }
        else if(propid ==5){
            return "复合肥"
        }
        else if(propid ==6){
            return "水溶肥"
        }
    }


    private colseScene(){
        let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
    }

    public useProp(propId,type){
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
        SceneManager.sceneManager.mainScene.dispatchEvent(evt);
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
        let huafeiNum = Number(Help.getPropById(Data.data, 4) ? Help.getPropById(Data.data, 4).num : 0)+Number(Help.getPropById(Data.data, 5) ? Help.getPropById(Data.data, 5).num : 0)+Number(Help.getPropById(Data.data, 6) ? Help.getPropById(Data.data, 6).num : 0);
		SceneManager.sceneManager.mainScene.huafei_red.visible = false;
        console.log(Data,"自己道具数据")
	}



    //请求错误
	private onGetIOError(event:egret.IOErrorEvent):void {
    	console.log("get error : " + event);
	}
    
}