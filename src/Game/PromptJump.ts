class PromptJump extends eui.Component implements eui.UIComponent {
    public constructor(label?:string) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/PeisongSkins.exml";
        this.peisonglabel.text = label
    }

    private prompt_btn: eui.Group;           //提示按钮
    private peisonglabel: eui.Label;         //文字

    protected childrenCreated(): void {
        super.childrenCreated();
        this.prompt_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this)
    }


    private onComplete(): void {
    }

    // public setPrompt(content,btn,tishi){
    // 	this.prompt_label.text = content;
    //     this.btn_label.text = btn;
    //     this.prompt_ti.text = tishi;
    // }

    private remove() {
        SceneManager.addJump("sharetextfriend_png");
        if (!SceneManager.instance.isMiniprogram) {
            SceneManager.instance.weixinUtil.shareData.titles = "【果实配送】我的水果已经在路上了。"
            SceneManager.instance.weixinUtil.shareData.describes = "快来和我一起种果树吧！"
            SceneManager.instance.weixinUtil.shareData.success = function () {
                let evt: MaskEvent = new MaskEvent(MaskEvent.SHARECLOSE);
                SceneManager.instance.jumpMark.dispatchEvent(evt);
                let params = {
                    treeUserId: Help.getOwnData().id,
                    treeId: Help.getOwnData().treeId
                };
                let _str = WeixinUtil.prototype.urlEncode(params, null, null, null);
                window.location.href = Config.webHome + "/view/game-exchange.html?" + _str;
            }
            SceneManager.instance.weixinUtil._openShare();
        }
        else{
            SceneManager.instance.isDistribution = true;
            let info = "【果实配送】我的水果已经在路上了。"
            let data = {
                addFriend: false,
                title: info
            }
            SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
        }
    }
}


