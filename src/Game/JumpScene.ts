class JumpScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TaskJumpSkins.exml";
	}

	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
        console.log("onComplete")
    }

	private remove(){
		if(this.parent){
			this.parent.removeChild(this);
		}
	}
}