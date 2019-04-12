class GuanggaoScene extends eui.Component implements eui.UIComponent {

    public constructor(data) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/GuanggaoSkins.exml";
        this.infodata = data;
    }

    private infodata;
    private baike_btn: eui.Image;       //确定按钮
    private baike_title: eui.Label;       //标题
    private baike_scr: eui.Scroller;
    private baike_disc: eui.Label;       //详情

    protected childrenCreated(): void {
        super.childrenCreated();
        this.baike_scr.verticalScrollBar = null;
        if (this.infodata) {
            this.baike_title.text = this.infodata.title;
            this.baike_disc.text = this.infodata.detail;
        }
    }

    private onComplete(): void {
        this.y = SceneManager.sceneManager._stage.height - this.height;
        this.baike_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
    }

    private close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

}