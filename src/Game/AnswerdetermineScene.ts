class AnswerdetermineScene extends eui.Component implements eui.UIComponent {
    public constructor(Fun) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/AnswerdetermineSkins.exml";
        this.Fun = Fun;
    }

    private btn_determine: eui.Group;
    private btn_cancel: eui.Group;
    private Fun;

    protected childrenCreated(): void {
        super.childrenCreated();

        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
    }


    private onComplete() {
        this.btn_determine.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeanswer,this)
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this);
    }

    private closeanswer(){
        this.remove()
        this.Fun();
    }


    private remove() {
        NewHelp.removemaskwithoutcolse();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

}