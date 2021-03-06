class SharePic extends eui.Component implements eui.UIComponent {
    public constructor(func?: Function, data?) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/SharePicSkins.exml";
        this.sharedata = data;
        this.action = func;
        if (data.needTake == "true") {
            this.share_label.text = "我的" + data.treeName + "结果了!"
        }
        else {
            this.share_label.text = "我的" + data.treeName + data.stageObj.name + "了!"
        }
    }

    private action: Function;
    private img_tree: eui.Image;
    private share_label: eui.Label;
    private btn_share: eui.Image;
    private btn_cancel: eui.Image;
    public minsharegro: eui.Group;
    private sharedata
    
    protected childrenCreated(): void {
        super.childrenCreated();
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        if (SceneManager.instance.landId == 1) {
            renderTexture.drawToTexture(SceneManager.sceneManager.newmainScene.tree);
        }
        else if(SceneManager.instance.landId == 2){
            renderTexture.drawToTexture(SceneManager.sceneManager.newmain2Scene.tree);
        }
        this.img_tree.texture = renderTexture;
    }


    private onComplete(): void {
        SceneManager.sceneManager.StageItems.enabled = false;
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goshare, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this)
    }

    private remove() {
        SceneManager.sceneManager.StageItems.enabled = true;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    private goshare() {
        if (!SceneManager.instance.isMiniprogram) {
            this.action()
        }
        else {
            Help.Screencapture(this.minsharegro, this.sharedata);
        }
        console.log(this.minsharegro)
        SceneManager.sceneManager.StageItems.enabled = true;
        this.remove()
    }
}


