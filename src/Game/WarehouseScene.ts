class WarehouseScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/WarehouseSkins.exml";
    }

    private close_btn: eui.Image;
    private propname: eui.Label;
    private propdisc: eui.Label;
    private warehouselist: eui.List;
    private propimg: eui.Image;
    private warehousescr: eui.Scroller
    private use_btn: eui.Group;
    private nowselectPropId = -1;
    private nowselectPropNum = 0;

    private onComplete() {
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.warehouselist.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.showdic, this)
        this.use_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.useprop, this)
        this.showprop();
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.warehousescr.verticalScrollBar = null;

    }

    private useprop() {
        if (this.nowselectPropNum <= 0) {
            SceneManager.addNotice("数量不够哦！")
            return
        }
        if (this.nowselectPropId == 4 || this.nowselectPropId == 5 || this.nowselectPropId == 6) {                      //使用化肥
            NewHelp.useProp(this.nowselectPropId, Datamanager.getNowtreedata())
        } else if (this.nowselectPropId == 8 || this.nowselectPropId == 9 || this.nowselectPropId == 10) {              //喂鸭子
            if (SceneManager.sceneManager.landId == 1) {
                SceneManager.addNotice("只能在菜园使用哦！")
            }
            else {
                NewHelp.useProp(this.nowselectPropId, null)
            }
        }
    }

    private showdic(e: eui.PropertyEvent): void {
        this.nowselectPropId = -1;
        this.nowselectPropId = Number(this.warehouselist.selectedItem.propId);
        this.nowselectPropNum = 0;
        this.nowselectPropNum = Number(this.warehouselist.selectedItem.num);

        if (this.warehouselist.selectedItem.propId == 4 || this.nowselectPropId == 5 || this.nowselectPropId == 6 ||
            this.nowselectPropId == 8 || this.nowselectPropId == 9 || this.nowselectPropId == 10) {
            this.use_btn.visible = true;
        }
        else {
            this.use_btn.visible = false;
        }
        this.propname.text = this.warehouselist.selectedItem.propName;
        if (this.warehouselist.selectedItem.info) {
            this.propdisc.text = this.warehouselist.selectedItem.info;
        }
        else {
            this.propdisc.text = "";
        }
        if (this.warehouselist.selectedItem.propType == 50) {       //种子
            HttpRequest.imageloader(Config.picurl + this.warehouselist.selectedItem.propIcon, this.propimg);
        }
        else if (this.warehouselist.selectedItem.propType == 51) {
            this.propimg.texture = RES.getRes("duck_png")
        }
        else if (this.warehouselist.selectedItem.propType == 7) {
            this.propimg.texture = RES.getRes("duckegg_png")
        }
        else if (this.warehouselist.selectedItem.propType == 6) {
            this.propimg.texture = RES.getRes("duckfood_png")
        }
        else if (this.warehouselist.selectedItem.propType == 101) {                   //果实
            var err = HttpRequest.imageloader(Config.picurl + this.warehouselist.selectedItem.propIcon, this.propimg);
            if (err && err == 1) {
                this.propimg.texture = RES.getRes("noicon_png")
            }
        }
        else {
            if (this.warehouselist.selectedItem.propId == 3) {          //果篮
                this.propimg.texture = RES.getRes("lanzi")
            }
            else if (this.warehouselist.selectedItem.propId == 4) {     //有机肥
                this.propimg.texture = RES.getRes("szhuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 5) {     //复合肥
                this.propimg.texture = RES.getRes("jshuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 6) {     //水溶肥
                this.propimg.texture = RES.getRes("zghuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 7) {     //剪刀
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.warehouselist.selectedItem.prodId == 8) {     //鸭食
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.warehouselist.selectedItem.propId == 9) {      //虫
                this.propimg.texture = RES.getRes("usedinsect_png")
            }
            else if (this.warehouselist.selectedItem.propId == 10) {      //草
                this.propimg.texture = RES.getRes("usedgrass_png")
            }

        }
    }



    public showprop() {
        let propdata = Datamanager.getWarehousePropdata();
        if (!propdata) {
            return;
        }
        let euiArr: eui.ArrayCollection = new eui.ArrayCollection(propdata);
        this.warehouselist.dataProvider = euiArr;
        // 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
        this.warehouselist.itemRenderer = WarehouseList_item;
        this.warehouselist.selectedIndex = 0;
        this.propname.text = this.warehouselist.selectedItem.propName;
        if (this.warehouselist.selectedItem.info) {
            this.propdisc.text = this.warehouselist.selectedItem.info;
        }
        else {
            this.propdisc.text = "";
        }
        if (this.warehouselist.selectedItem.propType == 50) {       //种子
            HttpRequest.imageloader(Config.picurl + this.warehouselist.selectedItem.propIcon, this.propimg);
        }
        else if (this.warehouselist.selectedItem.propType == 51) {
            this.propimg.texture = RES.getRes("duck_png")
        }
        else if (this.warehouselist.selectedItem.propType == 7) {
            this.propimg.texture = RES.getRes("duckegg_png")
        }
        else if (this.warehouselist.selectedItem.propType == 6) {
            this.propimg.texture = RES.getRes("duckfood_png")
        }
        else if (this.warehouselist.selectedItem.propType == 101) {                   //果实
            var err = HttpRequest.imageloader(Config.picurl + this.warehouselist.selectedItem.propIcon, this.propimg);
            if (err && err == 1) {
                this.propimg.texture = RES.getRes("noicon_png")
            }
        }
        else {
            if (this.warehouselist.selectedItem.propId == 3) {          //果篮
                this.propimg.texture = RES.getRes("lanzi")
            }
            else if (this.warehouselist.selectedItem.propId == 4) {     //有机肥
                this.propimg.texture = RES.getRes("szhuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 5) {     //复合肥
                this.propimg.texture = RES.getRes("jshuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 6) {     //水溶肥
                this.propimg.texture = RES.getRes("zghuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.warehouselist.selectedItem.propId == 7) {     //剪刀
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.warehouselist.selectedItem.prodId == 8) {     //鸭食
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.warehouselist.selectedItem.propId == 9) {      //虫
                this.propimg.texture = RES.getRes("usedinsect_png")
            }
            else if (this.warehouselist.selectedItem.propId == 10) {      //草
                this.propimg.texture = RES.getRes("usedgrass_png")
            }
        }
    }



    /**
     * 关闭场景
     */
    private close() {
        NewHelp.removemask();
        if (this.parent) {
            this.parent.removeChild(this);
            Datamanager.getWarehousePropdata()
        }
    }
}


class WarehouseList_item extends eui.ItemRenderer {
    private propimg: eui.Image;			    //道具图片
    private propnum: eui.Label;			    //道具名称与数量
    private item_red: eui.Rect;             //红点

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/WarehouseListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addStorage, this)
    }

    private addStorage() {
        localStorage.setItem("prop" + (this.data.propId), this.data.num)
        this.item_red.visible = false;
    }

    private onComplete() {

    }
    // 当数据改变时，更新视图
    protected dataChanged() {
        this.item_red.visible = false;
        if (this.data.propType == 50) {       //种子
            HttpRequest.imageloader(Config.picurl + this.data.propIcon, this.propimg);
        }
        else if (this.data.propType == 51) {
            this.propimg.texture = RES.getRes("duck_png")
        }
        else if (this.data.propType == 7) {
            this.propimg.texture = RES.getRes("duckegg_png")
        }
        else if (this.data.propType == 6) {
            this.propimg.texture = RES.getRes("duckfood_png")
        }
        else if (this.data.propType == 101) {                   //果实
            var err = HttpRequest.imageloader(Config.picurl + this.data.propIcon, this.propimg);
            if (err && err == 1) {
                this.propimg.texture = RES.getRes("noicon_png")
            }
        }
        else {
            if (this.data.propId == 3) {          //果篮
                this.propimg.texture = RES.getRes("lanzi")
            }
            else if (this.data.propId == 4) {     //有机肥
                this.propimg.texture = RES.getRes("szhuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.data.propId == 5) {     //复合肥
                this.propimg.texture = RES.getRes("jshuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.data.propId == 6) {     //水溶肥
                this.propimg.texture = RES.getRes("zghuafei_png")
                this.propimg.width = 86;
                this.propimg.height = 94;
            }
            else if (this.data.propId == 7) {     //剪刀
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.data.prodId == 8) {     //鸭食
                this.propimg.texture = RES.getRes("youji")
            }
            else if (this.data.propId == 9) {      //虫
                this.propimg.texture = RES.getRes("usedinsect_png")
            }
            else if (this.data.propId == 10) {      //草
                this.propimg.texture = RES.getRes("usedgrass_png")
            }
        }
        this.propnum.text = this.data.num;
        let old = localStorage.getItem("prop" + (this.data.propId));
        if ((!old || this.data.num > old) && this.data.num != 0) {
            this.item_red.visible = true;
        }
        else {
            this.item_red.visible = false;
        }
    }
}