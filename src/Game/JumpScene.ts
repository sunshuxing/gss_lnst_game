class JumpScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TaskJumpSkins.exml";
	}

	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
		this.addEventListener(MaskEvent.SHARECLOSE,this.remove, this);
        console.log("onComplete")
    }

	public remove(){
		if(SceneManager.instance.jumpMark){
			SceneManager.instance._stage.removeChild(SceneManager.sceneManager.jumpMark)
		}
	}
}