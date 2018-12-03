class BaoxiangScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/BaoxiangSkins.exml";
	}

	private baoxbg:eui.Image;			//宝箱背景图片
	private bx:eui.Image;				//开宝箱的字
	private shuidiNum:eui.Label;		//水滴数量
	private daojuNum:eui.Label;			//道具数量
	private huafeiNum:eui.Label;		//化肥数量
	private huafeiIcon:eui.Image;		//化肥种类

	private onComplete(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.bxopen,this);
		this.bgTwn();
		this.currentState = "close"
		this.bx.y = this.height - SceneManager.sceneManager._stage.height;
        console.log("onComplete")
    }

	private bgTwn(){
		egret.Tween.get(this.baoxbg,{loop:true})
		.to({rotation:360},10000);
	}

	public seticon(data){
		console.log(data,"道具数据")
		// for(let i=0;i<data.length;i++){
		// 	if(data.id = 0){
		// 		this.shuidiNum.text = data.name+"x"+data.num+"g";
		// 	}
		// 	else if(data.id = 1){

		// 	}
		// }
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