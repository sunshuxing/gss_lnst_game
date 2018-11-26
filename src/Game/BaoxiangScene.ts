class BaoxiangScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/BaoxiangSkins.exml";
	}

	private baoxbg:eui.Image;			//宝箱背景图片

	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this);
		this.bgTwn();
        console.log("onComplete")
    }

	private bgTwn(){
		egret.Tween.get(this.baoxbg,{loop:true})
		.to({rotation:360},10000);
	}

	private remove(){
		if(this.parent){
			let lingqu = new LingquScene();
            this.parent.addChild(lingqu);
			this.parent.removeChild(this); 
		}
	}
}