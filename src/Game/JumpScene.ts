class JumpScene extends eui.Component implements eui.UIComponent{
	public constructor(image:string) {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TaskJumpSkins.exml";
		this.share_img.texture = RES.getRes(image);
	}

	private share_img:eui.Image;

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