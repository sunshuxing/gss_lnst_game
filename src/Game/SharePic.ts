class SharePic extends eui.Component implements eui.UIComponent{
	public constructor(func:Function,data) {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/SharePicSkins.exml";
        this.action = func;
        if(data.needTake == "true"){
            this.share_label.text = "我的"+data.treeName+"结果了!"
        }
        else{
            this.share_label.text = "我的"+data.treeName+data.stageObj.name+"了!"
        }
	}

    private action:Function;
	private img_tree:eui.Image;
    private share_label:eui.Label;
    private btn_share:eui.Image;
    private btn_cancel:eui.Image;
    public minsharegro:eui.Group;

    protected childrenCreated():void{
		super.childrenCreated();
        var renderTexture:egret.RenderTexture = new egret.RenderTexture();
			renderTexture.drawToTexture(SceneManager.sceneManager.mainScene.tree);
        this.img_tree.texture = renderTexture;
    }


    private onComplete():void{
        SceneManager.sceneManager.mainScene.enabled = false;
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP,this.goshare,this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this)
    }

    private remove(){
        SceneManager.sceneManager.mainScene.enabled = true;
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    private goshare(){
        SceneManager.sceneManager.mainScene.enabled = true;
        if(this.parent){
            this.parent.removeChild(this);
        }
        this.action();
    }
}


