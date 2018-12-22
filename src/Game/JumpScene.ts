class JumpScene extends eui.Component implements eui.UIComponent{
	public constructor(image:string,IsMiniprogram?:Boolean) {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TaskJumpSkins.exml";
		this.textImg.texture = RES.getRes(image)
		if(IsMiniprogram){
			this.arrow.x = 375;
			this.arrow.visible = true;
		}
		else{
			this.arrow.x = 490;
			this.arrow.visible = true;
		}
	}

	private textImg:eui.Image;
	private arrow:eui.Image;
	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
		this.addEventListener(MaskEvent.SHARECLOSE,this.remove, this);
    }

	public remove(){
		if(SceneManager.instance.jumpMark){
			SceneManager.instance._stage.removeChild(SceneManager.sceneManager.jumpMark)
		}
	}
}