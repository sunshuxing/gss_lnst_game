class DuckDetailScene extends eui.Component implements eui.UIComponent {
    public constructor(duckdata) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/DuckDetailSkins.exml";
        this.duckdata = duckdata;
    }

    private duckdata;
    private duck_img: eui.Image;
    private duck_stage: eui.Label;
    private duck_progress: eui.ProgressBar;
    private duck_detail_scr: eui.Scroller;
    private duck_detail_label: eui.Label;
    private progress_off: eui.Label;


    protected childrenCreated(): void {
        super.childrenCreated();
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
        this.duck_detail_scr.verticalScrollBar = null;
        this.Init();
    }


    private Init() {
        if (this.duckdata.stage == 1) {
            this.duck_stage.text = "第一阶段"
            this.duck_img.texture = RES.getRes("smallduck_png")
        }
        else if (this.duckdata.stage == 2) {
            this.duck_stage.text = "第二阶段"
            this.duck_img.texture = RES.getRes("midduck_png")
        }
        else if (this.duckdata.stage == 3) {
            this.duck_stage.text = "第三阶段"
            this.duck_img.texture = RES.getRes("bigduck_png")
        }
        this.duck_progress.maximum = this.duckdata.stageObj.energy;
        this.duck_progress.value = this.duckdata.growthValue;
        this.duck_detail_label.textFlow = <Array<egret.ITextElement>>[
            { text: "实物兑换：", style: { textColor: 0xF5AF5A } },
            { text: this.duckdata.goodsName +"\n"},
            { text: "生长周期：", style: { textColor: 0xF5AF5A } },
            { text: this.duckdata.info +"\n"},
            { text: "配送信息：", style: { textColor: 0xF5AF5A } },
            { text: this.duckdata.deliveryInfo },
        ]
        this.progress_off.text = ((this.duckdata.growthValue / this.duckdata.stageObj.energy) * 100).toFixed(2) + "%"
    }

    private onComplete() {

    }

    private remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}