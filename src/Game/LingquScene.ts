class LingquScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/LingquSkins.exml";
	}
    private libao_btn:eui.Group;

	private onComplete(){
        this.libao_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tomain,this)
        console.log("onComplete")
    }

    private tomain(){
        this.parent.removeChild(this);
    }
}