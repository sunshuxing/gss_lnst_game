class BaoxiangScene extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/skins/BaoxiangSkins.exml";
	}

	private baoxbg: eui.Image;			//宝箱背景图片
	private bx: eui.Image;				//开宝箱的字
	private reward1Num: eui.Label;
	private reward2Num: eui.Label;
	private reward3Num: eui.Label;
	private reward1icon: eui.Image;
	private reward2icon: eui.Image;
	private reward3icon: eui.Image;


	private onComplete() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bxopen, this);
		this.bgTwn();
		this.currentState = "close"
		this.y = SceneManager.instance._stage.height - this.height;

	}

	private bgTwn() {
		egret.Tween.get(this.baoxbg, { loop: true })
			.to({ rotation: 360 }, 10000);
	}

	public seticon(data) {
		var Data = data.data
		if (Data[0]) {
			this.reward2Num.text = Data[0].propName + "x" + Data[0].propNum + "g";
			if (Data[0].propId == 1) {
				this.reward2icon.texture = RES.getRes("icon_water_png");
			} else if (Data[0].propId == 4) {
				this.reward2icon.texture = RES.getRes("szhuafei_png");
			}
			else if (Data[0].propId == 5) {
				this.reward2icon.texture = RES.getRes("jshuafei_png");
			}
			else if (Data[0].propId == 6) {
				this.reward2icon.texture = RES.getRes("zghuafei_png");
			}
		}
		if (Data[1]) {
			this.reward1Num.text = Data[1].propName + "x" + Data[2].propNum + "g";
			if (Data[1].propId == 1) {
				this.reward1icon.texture = RES.getRes("icon_water_png");
			} else if (Data[1].propId == 4) {
				this.reward1icon.texture = RES.getRes("szhuafei_png");
			}
			else if (Data[1].propId == 5) {
				this.reward1icon.texture = RES.getRes("jshuafei_png");
			}
			else if (Data[1].propId == 6) {
				this.reward1icon.texture = RES.getRes("zghuafei_png");
			}
		}

		if (Data[2]) {
			this.reward3Num.text = Data[2].propName + "x" + Data[2].propNum + "g";
			if (Data[2].propId == 1) {
				this.reward3icon.texture = RES.getRes("icon_water_png");
			} else if (Data[2].propId == 4) {
				this.reward3icon.texture = RES.getRes("szhuafei_png");
			}
			else if (Data[2].propId == 5) {
				this.reward3icon.texture = RES.getRes("jshuafei_png");
			}
			else if (Data[2].propId == 6) {
				this.reward3icon.texture = RES.getRes("zghuafei_png");
			}
		}

	}

	private bxopen() {
		if (this.currentState == "close") {
			this.currentState = "open"
		}
		else if (this.currentState == "open" && this.parent) {
			NewHelp.removemask();
			NewHelp.updateprop();
			this.parent.removeChild(this);
		}
	}
}