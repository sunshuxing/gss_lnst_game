class guideLoading extends eui.Component {
    private image = new eui.Image();
    private bgmask = new eui.Image();
    private logo = new eui.Image();
    private textField = new egret.TextField();
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.createView,this)
    }
    private createView(): void {
        this.bgmask.texture = RES.getRes("panel-bg")
        var rect:egret.Rectangle = new egret.Rectangle(4,4,24,24);
        this.bgmask.scale9Grid =rect;
        this.bgmask.height = this.stage.stageHeight;
        this.bgmask.width = this.stage.stageWidth;
        this.bgmask.alpha = 0.7;
        this.addChild(this.bgmask)
        this.logo.texture = RES.getRes("logo_png");
        this.logo.width = 152;
        this.logo.height = 152;
        this.logo.anchorOffsetX = this.logo.width/2;
        this.logo.anchorOffsetY = this.logo.height/2;
        this.logo.x = SceneManager.sceneManager.mainScene.width/2
        this.logo.y = SceneManager.sceneManager.mainScene.height/2 - 80
        this.addChild(this.logo);
        this.addChild(this.textField);
        this.textField.y = SceneManager.sceneManager.mainScene.height/2 + 62;
        this.textField.width = 250;
        this.textField.x = (SceneManager.sceneManager.mainScene.width - this.textField.width)/2;
        this.textField.size = 28;
        this.textField.bold = true;
        this.textField.textAlign = "center";
        this.textField.textColor = 0xFFFFFF;
        egret.Tween.get(this.logo,{loop:true})
        .to({rotation:360},5000)
    }
 
    public onProgress(current: number, total: number): void {
        this.textField.text = "加载中..."+Math.floor((current / total) * 100) + "%";
    }
}
