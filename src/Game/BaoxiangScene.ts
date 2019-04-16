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
		this.y = SceneManager.instance._stage.height - this.height;
		
    }

	private bgTwn(){
		egret.Tween.get(this.baoxbg,{loop:true})
		.to({rotation:360},10000);
	}

	public seticon(data){
		var Data = data.data
		for(let i=0;i<Data.length;i++){
			if(Data[i].propId == 1){
				this.shuidiNum.text = Data[i].propName+"x"+Data[i].propNum+"g";
			}
			else if(Data[i].propId == 2){
				//爱心值
			}
			else if(Data[i].propId == 4){
				this.huafeiIcon.texture = RES.getRes("szhuafei_png");
				this.huafeiNum.text = Data[i].propName+"x"+Data[i].propNum+"袋";
			}
			else if(Data[i].propId == 5){
				this.huafeiIcon.texture = RES.getRes("jshuafei_png");
				this.huafeiNum.text = Data[i].propName+"x"+Data[i].propNum+"袋";				
			}
			else if(Data[i].propId == 6){
				this.huafeiIcon.texture = RES.getRes("zghuafei_png");
				this.huafeiNum.text = Data[i].propName+"x"+Data[i].propNum+"袋";				
			}
		}
	}

	private bxopen(){
		if(this.currentState == "close"){
			this.currentState = "open"
		}
		else if(this.currentState == "open"&&this.parent){
			NewHelp.removemask();
			NewHelp.updateprop();
			this.parent.removeChild(this);
		}
	}
}