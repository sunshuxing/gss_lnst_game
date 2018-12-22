class PromptJump extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/PeisongSkins.exml";
	}

    private prompt_btn:eui.Group;           //提示按钮

    protected childrenCreated():void{
		super.childrenCreated();
        this.prompt_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
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


