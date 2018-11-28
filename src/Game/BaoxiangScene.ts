class BaoxiangScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/BaoxiangSkins.exml";
	}

	private baoxbg:eui.Image;			//宝箱背景图片

	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.bxopen,this);
		this.bgTwn();
		this.currentState = "close"
        console.log("onComplete")
    }

	private bgTwn(){
		egret.Tween.get(this.baoxbg,{loop:true})
		.to({rotation:360},10000);
	}

	private bxopen(){
		if(this.currentState == "close"){
			this.currentState = "open"
		}
		else if(this.currentState == "open"&&this.parent){
			this.parent.removeChild(this);
		}
	}
}