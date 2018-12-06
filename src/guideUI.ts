class guideUI extends eui.Component {
    private a = 0;
    private imagebg = new eui.Image();
    private image = new eui.Image();
    private bgmask = new eui.Image();
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.createView,this)
    }
    private createView(): void {
       
       this.imagebg.texture = RES.getRes("guidebg1_jpg");
       this.image.texture = RES.getRes("image1_png");
       this.bgmask.texture = RES.getRes("panel-bg")
       var rect:egret.Rectangle = new egret.Rectangle(4,4,24,24);
       this.bgmask.scale9Grid =rect;
       this.image.y = this.stage.stageHeight - this.image.height;
       this.imagebg.y = this.stage.stageHeight - this.imagebg.height;
       this.bgmask.height = this.stage.stageHeight;
       this.bgmask.width = this.stage.stageWidth;
       this.bgmask.alpha = 0.7;
       this.addChild(this.imagebg);
       this.addChild(this.bgmask)
       this.addChild(this.image);
       this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.changeimage,this)
    }

    private changeimage(){
        this.a = this.a+1;
        if(this.a == 1){
            this.image.texture = RES.getRes("image2_png")
        }
        else if(this.a == 2){
            this.image.texture = RES.getRes("image3_png")
        }
        else if(this.a == 3){
           this.image.texture = RES.getRes("image4_png")
        }
        else if(this.a == 4){
            this.imagebg.texture = RES.getRes("guidebg2_jpg");
            this.image.texture = RES.getRes("image5_png")
        }
        else if(this.a == 5){
            this.image.texture = RES.getRes("image6_png")
        }
        else if(this.a == 6){
            this.imagebg.texture = RES.getRes("guidebg3_jpg");
            this.image.texture = RES.getRes("image7_png")
        }
        else if(this.a == 7){
            this.image.texture = RES.getRes("image8_png")
        }
        else if(this.a == 8){
            this.image.texture = RES.getRes("image9_png")
        }
        else{
            if(this.parent){
                this.parent.removeChild(this);
            }
        }
    }
}
