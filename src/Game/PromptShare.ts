class PromptShare extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/PromptSkins.exml";
    }

    private prompt_label: eui.Label;			//提示内容
    private btn_label: eui.Label;            //按钮文字
    private prompt_btn: eui.Group;           //提示按钮
    private prompt_ti: eui.Label;            //

    protected childrenCreated(): void {
        super.childrenCreated();
        this.prompt_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toshare, this)
        this.prompt_label.text = "您的果树上还有成熟的果子";
        this.btn_label.text = "确定";
        this.prompt_ti.text = "(快去邀请好友帮忙摘果吧！)";
    }


    private onComplete(): void {
        SceneManager.sceneManager.mainScene.enabled = false;
        let close = new eui.Image();
        close.texture = RES.getRes("close1")
        close.x = 504;
        close.y = 24;
        this.addChild(close);
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this)
    }

    // public setPrompt(content,btn,tishi){
    // 	this.prompt_label.text = content;
    //     this.btn_label.text = btn;
    //     this.prompt_ti.text = tishi;
    // }

    private remove() {
        if (this.parent) {
            this.parent.removeChild(this);
            SceneManager.sceneManager.mainScene.enabled = true;
        }
    }

    private toshare() {
        if (this.parent) {
            this.parent.removeChild(this);
            SceneManager.sceneManager.mainScene.enabled = true;
            SceneManager.addJump("sharetextpick_png");
            if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
                let url = SceneManager.instance.weixinUtil.shareData.shareUrl
                let addFriend = MyRequest.geturlstr("addFriend", url)
                if (!addFriend) {
                    SceneManager.instance.weixinUtil.shareData.shareUrl = url + "&addFriend=true"
                }
                SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
                SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
                SceneManager.instance.weixinUtil._openShare();
            }
        } else {
            // let sharegroup = new eui.Group();
            // sharegroup.width = 500;
            // sharegroup.height = 400;
            // let bg = new eui.Image();
            // bg.texture = RES.getRes("sharebg_jpg");
            // sharegroup.addChild(bg);
            // let img = new eui.Image();
            // img.horizontalCenter = 0;
            // img.width = 275;
            // img.height = 275;
            // img.y = 49;
            // HttpRequest.imageloader(Config.picurl + Help.getOwnData().stageObj.stageImage, img, null, () => {
            //     sharegroup.addChild(img);
            //     let name = new eui.Label();
            //     name.y = 247;
            //     name.horizontalCenter = -87;
            //     name.textColor = 0x7a6934;
            //     name.fontFamily = "Microsoft YaHei";
            //     name.bold = true;
            //     name.size = 16;
            //     name.text = Help.getOwnData().treeName;
            //     sharegroup.addChild(name);
            //     name.textAlign = "center";
            //     name.verticalAlign = "middle";
            //     Help.Screencapture(sharegroup, Help.getOwnData(), true)
            // }, this)

            let info = "【果实熟了】快来、快来帮我摘水果。"
            let data = {
                addFriend: true,
                title: info
            }
            SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
        }
    }
}


