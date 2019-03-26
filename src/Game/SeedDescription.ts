class SeedDescription extends eui.Component implements eui.UIComponent {
    public constructor(data) {
        super();
        this.seed_data = data;
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/SeedDescriptionSkins.exml";
    }

    private seed_data;                       //所选种子数据
    private btn_cancel: eui.Label;           //取消按钮
    private btn_determine: eui.Label;        //确定按钮
    private seed_namespec: eui.Label;        //实物名称和规格
    private seed_info: eui.Label;            //生长周期
    private delivery_info: eui.Label;        //配送说明
    private seed_name: eui.Label;            //种子名称
    private scr_delivery_info: eui.Scroller;
    private scr_seed_info: eui.Scroller;
    private scr_namespec: eui.Scroller;

    private onComplete() {
        this.seed_info.maxWidth = 300;
        this.delivery_info.maxWidth = 300;
        this.seed_namespec.text = this.seed_data.fruitName + "\n" + "规格:" + this.seed_data.specName + "\n" + "摘果道具:" + this.seed_data.basketNum + "个果篮";
        this.seed_info.text = this.seed_data.treeInfo;
        this.delivery_info.text = this.seed_data.deliveryInfo;
        this.seed_name.text = this.seed_data.name;
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.scr_namespec.verticalScrollBar = null;
        this.scr_namespec.viewport.scrollV = 10;
        this.scr_seed_info.verticalScrollBar = null;
        this.scr_delivery_info.verticalScrollBar = null;
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this);
        this.btn_determine.addEventListener(egret.TouchEvent.TOUCH_TAP, this.determine, this);
    }

    //获取种子
    private determine() {
        let params = {
            treeId: this.seed_data.id,
            friendSign: SceneManager.instance.friendSign	//分享标识，如果有，则是通过分享进入
        };
            MyRequest._post("game/receiveTree", params, this, this.requestreceiveTree.bind(this), this.onGetIOError)
    }

    //获取种子成功
    private requestreceiveTree(data): void {
        console.log("领取种子", data)
        if (this.parent.parent) {
            this.parent.parent.removeChild(this.parent)
        }
        var Data = data;
        if (SceneManager.instance.landId == 1) {
            SceneManager.sceneManager.newmainScene.getOwnTree();
        }
        else if (SceneManager.instance.landId == 2) {
            SceneManager.sceneManager.newmain2Scene.getOwnTree();
        }
        if (!Datamanager.getPropdata()) {                 //该用户为新用户
            let baoxiang = new BaoxiangScene();
            baoxiang.seticon(data);
            SceneManager.sceneManager._stage.addChild(baoxiang);
        }
        else {
            if (Datamanager.getPropNumByid(3)) {         //该用户有果篮 
                let reward = new SeedRewardScene(data.data);
                SceneManager.sceneManager._stage.addChild(reward);
            }
            else {                                       //该用户为新用户
                let baoxiang = new BaoxiangScene();
                baoxiang.seticon(data);
                SceneManager.sceneManager._stage.addChild(baoxiang);
            }
        }
    }


    private onGetIOError() {
        console.log("请求失败")
    }


    //取消按钮
    private remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}