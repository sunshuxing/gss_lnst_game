class PromptJump extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/PromptSkins.exml";
	}

	private prompt_label:eui.Label;			//提示内容
    private btn_label:eui.Label;            //按钮文字
    private prompt_btn:eui.Group;           //提示按钮
    private prompt_ti:eui.Label;            //

    protected childrenCreated():void{
		super.childrenCreated();
        this.prompt_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
        this.prompt_label.text = "您已可以兑换水果！";
        this.btn_label.text = "去兑换";
        this.prompt_ti.text = "";
    }


    private onComplete():void{
        SceneManager.sceneManager.mainScene.enabled = false;
    }

	// public setPrompt(content,btn,tishi){
	// 	this.prompt_label.text = content;
    //     this.btn_label.text = btn;
    //     this.prompt_ti.text = tishi;
	// }

    private remove(){
       let params = {
                    treeUserId: Help.getOwnData().id,
					treeId: Help.getOwnData().treeId
				};
				let _str = WeixinUtil.prototype.urlEncode(params, null, null, null);
				window.location.href = Config.webHome + "/view/game-exchange.html?" + _str;
    }
}


