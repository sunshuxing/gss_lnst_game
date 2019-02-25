class Sharepresent extends eui.Component implements eui.UIComponent{
	public constructor(info:string,imgname?:string,orderId?:any,info2?:string) {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/PresentSkins.exml";
        this.orderId = orderId;
        this.imgname = imgname;
        if(imgname){
            this.present_img.texture = RES.getRes(imgname);
            this.btn_share.texture = RES.getRes("sharepicdr_png")
        }
        else{
            let a = Help.random_num(1,5);
            this.present_img.texture = RES.getRes("presentimg"+a+"_png");
            this.btn_share.texture = RES.getRes("sharepicbtn_png");
        }
        if(info2){
            this.present_label1.y = 648;
            this.present_label1.size = 28;
            this.present_label1.textColor = 0xBA171D;
            this.present_label2.visible = true;
            this.present_label2.text = info2;
            this.present_label2.y = 690;
        }
        else{
            this.present_label1.y = 660;
            this.present_label1.size = 32;
            this.present_label1.textColor = 0x343433;
            this.present_label2.visible = false;
        }
        this.present_label1.text = info;
	}
    private present_img:eui.Image;              //礼包图片
    private present_label1:eui.Label;            //礼包文字  
    private btn_share:eui.Image;                //分享按钮
    public orderId;
    private imgname;
    private present_label2:eui.Label;


    protected childrenCreated():void{
		super.childrenCreated();
    }


    private onComplete():void{
        SceneManager.sceneManager.StageItems.enabled = false;
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP,this.goshare,this);
    }

    private remove(){
        SceneManager.sceneManager.StageItems.enabled = true;
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    private goshare(){
        if(!this.imgname){
            let orderId  = this.orderId;
            SceneManager.addJump("sharetextpick_png");
            if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
                SceneManager.instance.weixinUtil.shareData.iconUrl = "http://www.guoss.net/wefruitmall/images/game_share1.png"
                SceneManager.instance.weixinUtil.shareData.titles = "【礼包惊喜】获得一个惊喜大礼包。"
                if(orderId){
                    SceneManager.instance.weixinUtil.shareData.success = function(){
                        location.href = Config.webHome +"/view/confirm.html?orderid=" + orderId;
                    }
                }
                SceneManager.instance.weixinUtil._openShare();
            } else {
                if(orderId){
                    SceneManager.instance.isPresent = true;
                }
                let info = "【礼包惊喜】获得一个惊喜大礼包。"
                let data = {
                    addFriend: true,
                    title: info,
                    imageUrl: "http://www.guoss.net/wefruitmall/images/game_share1.jpg"
                }
                SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
            }    
        }
        this.remove();
    }
}


