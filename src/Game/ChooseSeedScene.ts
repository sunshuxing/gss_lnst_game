class ChooseSeedScene extends eui.Component implements eui.UIComponent {

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/ChooseseedSkins.exml";

    }

    private seedlistgro: eui.Group;
    private list_seed: eui.List;
    private scr_seed: eui.Scroller;
    private close_btn: eui.Image;

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    private onComplete(): void {
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
        if (SceneManager.instance.landId == 2) {
            this.close_btn.visible = true;
        }
        else if (SceneManager.instance.landId == 1) {
            this.close_btn.visible = false;
        }
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this)
        this.getSeenId(SceneManager.instance.landId);
        this.seedlistgro.y = (SceneManager.sceneManager._stage.height - this.seedlistgro.height) / 2;
        this.scr_seed.verticalScrollBar = null;
    }


    private close() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        NewHelp.removemask();
        SceneManager.instance.landId = 1;
        SceneManager.toNewMainScene();
        SceneManager.sceneManager.newmainScene.getOwnTree();
        Help.passAnm();
    }

    //查詢可以領取的果樹id
    private getSeenId(landId) {
        let params = {
            landId: landId
        }
        MyRequest._post("game/getTree", params, this, this.requestGetTree.bind(this), null)
    }

    //查询可领取果树成功
    private requestGetTree(data): void {
        console.log(data, "可领取果树数据")
        var treedata = data;
        let tree_data = [];
        for (let i = 0; i < treedata.data.length; i++) {
            tree_data.push(treedata.data[i]);
        }
        let euiArr: eui.ArrayCollection = new eui.ArrayCollection(tree_data);

        this.list_seed.dataProvider = euiArr;
        // 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
        this.list_seed.itemRenderer = SeedList_item;
        this.list_seed.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onChange, this);
    }

    // 种子列表点击事件
    private onChange(e: eui.PropertyEvent): void {
        let seed_des = new SeedDescription(this.list_seed.selectedItem);
        console.log(this.list_seed.selectedItem, "所选种子数据")
        seed_des.y = (SceneManager.sceneManager._stage.height - seed_des.height) / 2;
        seed_des.x = (this.width - seed_des.width) / 2
        this.addChild(seed_des);
    }


}