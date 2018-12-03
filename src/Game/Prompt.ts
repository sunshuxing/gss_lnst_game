class Prompt extends eui.Component implements eui.UIComponent{
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
    }


    private onComplete():void{
        SceneManager.sceneManager.mainScene.enabled = false;
    }

	public setPrompt(content,btn,tishi){
		this.prompt_label.text = content;
        this.btn_label.text = btn;
        this.prompt_ti.text = tishi;
	}

    private remove(){
        if(this.parent){
        SceneManager.sceneManager.mainScene.enabled = true;
           this.parent.removeChild(this);
           let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
           SceneManager.sceneManager.mainScene.dispatchEvent(Removemask);
           SceneManager.toMainScene();
        }
    }
}


