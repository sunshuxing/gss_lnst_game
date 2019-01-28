class PromptJump extends eui.Component implements eui.UIComponent {
    public constructor(label?: string, isduck?: boolean) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/PeisongSkins.exml";
        this.peisonglabel.text = label
        if (isduck) {
            this.isduck = true
        }
        else {
            this.isduck = false;
        }
    }

    private prompt_btn: eui.Group;           //提示按钮
    private peisonglabel: eui.Label;         //文字
    private isduck: boolean;

    protected childrenCreated(): void {
        super.childrenCreated();
        this.prompt_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this)
    }


    private onComplete(): void {
        SceneManager.sceneManager.StageItems.enabled = false;
    }

    // public setPrompt(content,btn,tishi){
    // 	this.prompt_label.text = content;
    //     this.btn_label.text = btn;
    //     this.prompt_ti.text = tishi;
    // }

    private remove() {
        SceneManager.addJump("sharetextfriend_png");
        if (this.isduck) {                                //是鸭子配送
            if (!SceneManager.instance.isMiniprogram) {
                SceneManager.instance.weixinUtil.shareData.titles = "【鸭蛋配送】我的鸭蛋已经在路上了。"
                SceneManager.instance.weixinUtil.shareData.describes = "快来和我一起吧！"
                SceneManager.instance.weixinUtil.shareData.success = function () {
                    let evt: MaskEvent = new MaskEvent(MaskEvent.SHARECLOSE);
                    SceneManager.instance.jumpMark.dispatchEvent(evt);
                    let params = {
                        duckUserId: Datamanager.getOwnDuckdata().duckId,
                    };
                    let _str = WeixinUtil.prototype.urlEncode(params, null, null, null);
                    window.location.href = Config.webHome + "/view/game-logistics.html" + _str;
                }
                SceneManager.instance.weixinUtil._openShare();
            }
            else {
                SceneManager.instance.isduckDistribution = true;                        //是否是配送
                let info = "【鸭蛋配送】我的鸭蛋已经在路上了。"
                let data = {
                    addFriend: false,
                    title: info
                }
                SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
            }
        }
        else {                                                              //水果配送
            if (!SceneManager.instance.isMiniprogram) {
                SceneManager.instance.weixinUtil.shareData.titles = "【果实配送】我的水果已经在路上了。"
                SceneManager.instance.weixinUtil.shareData.describes = "快来和我一起种果树吧！"
                SceneManager.instance.weixinUtil.shareData.success = function () {
                    let evt: MaskEvent = new MaskEvent(MaskEvent.SHARECLOSE);
                    SceneManager.instance.jumpMark.dispatchEvent(evt);
                    let params
                    if (SceneManager.instance.landId == 1) {                      //果园
                        params = {
                            treeUserId: Datamanager.getOwnguoyuandata().id,
                            treeId: Datamanager.getOwnguoyuandata().treeId
                        };
                    }
                    else if (SceneManager.instance.landId == 2) {               //菜园
                        params = {
                            treeUserId: Datamanager.getOwncaiyuandata().id,
                            treeId: Datamanager.getOwncaiyuandata().treeId
                        };
                    }
                    let _str = WeixinUtil.prototype.urlEncode(params, null, null, null);
                    window.location.href = Config.webHome + "/view/game-exchange.html?" + _str;
                }
                SceneManager.instance.weixinUtil._openShare();
            }
            else {
                SceneManager.instance.isDistribution = true;                        //是否是配送
                let info = "【果实配送】我的水果已经在路上了。"
                let data = {
                    addFriend: false,
                    title: info
                }
                SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
            }
        }
    }
}


