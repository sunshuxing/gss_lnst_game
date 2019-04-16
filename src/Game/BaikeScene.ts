class BaikeScene extends eui.Component implements eui.UIComponent {

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/BaikeSkins.exml";
    }

    private baike_btn: eui.Image;       //确定按钮
    private baike_title: eui.Label;       //标题
    private baike_scr: eui.Scroller;
    private baike_disc: eui.Label;       //详情
    private friut_img: eui.Image;        //水果图片
    private friut_name: eui.Label;       //水果名称
    private buy_btn: eui.Image;          //购买按钮
    private price1: eui.Label;           //水果价格
    private price2: eui.Label;           //水果会员价格

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    private onComplete(): void {
        this.y = SceneManager.sceneManager._stage.height - this.height;
        this.baike_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.searchKnowledgePage();
    }

    private close() {
        if (this.parent) {
            NewHelp.checkActRed();
            let State = Datamanager.getlooktask().btnStatus ? Datamanager.getlooktask().btnStatus : 0
            if (State == 0) {                             //可完成
                let data = {
                    taskCode: "read_knowledge",
                }
                let that = this
                MyRequest._post("game/completeTask", data, this, () => {
                    SceneManager.instance.getTaskScene().taskDataInit(SceneManager.instance.StageItems.checktask) //更新任务数据
                }, null);
            }
            this.parent.removeChild(this);
        }
    }

    /**
     * 获取百科知识
     */
    private searchKnowledgePage() {
        let params = {
            pageNo: 1,
            numPerPage: 10000
        }
        MyRequest._post("game/searchKnowledgePage", params, this, this.Req_searchKnowledgePage.bind(this), null)
    }

    private Req_searchKnowledgePage(data) {
        console.log(data, "百科知识")
        let baikedata = data.data.list;
        let num = Help.random_num(0, baikedata.length - 1)
        let nowdata = data.data.list[num];

        if (nowdata) {
            if (nowdata.goodsId) {
                this.currentState = "friut";
                HttpRequest.imageloader(Config.picurl + nowdata.goodsIcon, this.friut_img);
                this.friut_name.text = nowdata.goodsName;
                this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    const fruitId = nowdata.goodsId
                    if (SceneManager.instance.isMiniprogram) {
                        wx.miniProgram.navigateTo({
                            url: "/pages/gssIndex/detail?id=" + fruitId
                        })
                    } else {
                        location.href = Config.webHome + "view/detail.html?id=" + fruitId
                    }
                }, this)
            }
            else {
                this.currentState = "label";
            }
            this.baike_title.text = nowdata.title;
            this.baike_disc.text = nowdata.text;
        }
    }
}