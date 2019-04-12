class InteractiveScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/InteractiveSkins.exml";
    }

    private btn_grass: eui.Image;        //种草按钮
    private btn_insect: eui.Image;       //放虫按钮
    private list_barrage: eui.List;      //留言列表
    private scr_barrage: eui.Scroller;   //留言滚动组件

    protected childrenCreated(): void {
        super.childrenCreated();
        this.getLeaveMsgTemplate();
        this.btn_grass.addEventListener(egret.TouchEvent.TOUCH_TAP, this.putgrass, this)
        this.btn_insect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.putinsect, this)
        this.list_barrage.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.listTouch, this);
        this.scr_barrage.verticalScrollBar = null;
    }

    private onComplete(): void {

    }


    //关闭该场景
    private closeScene() {
        NewHelp.removemask()
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }


    //查询留言模板
    private getLeaveMsgTemplate() {
        MyRequest._post("game/getLeaveMsgTemplate", null, this, this.Req_getLeaveMsgTemplate.bind(this), this.onGetIOError)
    }

    //查询留言模板成功后处理
    private Req_getLeaveMsgTemplate(data): void {
        var Data = data;
        this.UpdateTemplate(Data.data);
    }

    //留言        //treeUserId 用户果树id   templateId 留言模板id
    private leaveMsg(treeUserId, templeteId) {
        let params = {
            treeUserId: treeUserId,
            templeteId: templeteId
        };
        MyRequest._post("game/leaveMsg", params, this, this.Req_leaveMsg.bind(this, templeteId), this.onGetIOError)
    }

    private Req_leaveMsg(templeteId, data): void {
        SceneManager.addNotice("留言成功！")
        var Data = data;
        NewHelp.addBarrageMsg(templeteId);
    }

    //点击留言列表事件
    private listTouch() {
        if (!Datamanager.getNowtreedata()) {
            NewHelp.Invite()
            this.closeScene()
            // SceneManager.addNotice("该好友还没有种树哦！");
            return;
        }
        else {
            let treeUserId = Datamanager.getNowtreedata().id;
            let templeteId = this.list_barrage.selectedItem.id;
            this.leaveMsg(treeUserId, templeteId);
            this.closeScene()
        }
    }



    //请求错误
    private onGetIOError(event: egret.IOErrorEvent): void {
        console.log("get error : " + event);
    }

    //更新显示留言模板
    private UpdateTemplate(data) {
        // 转成eui数据
        let euiArr: eui.ArrayCollection = new eui.ArrayCollection(data)
        // 把list_hero数据源设置成euiArr
        this.list_barrage.dataProvider = euiArr;
        // 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
        this.list_barrage.itemRenderer = barrageList_item;
    }


    //放草
    private putgrass() {
        if (!Datamanager.getNowtreedata()) {
            NewHelp.Invite()
            this.closeScene()
            // SceneManager.addNotice("该好友还没有种树哦！");
            return;
        }
        else {
            var treeUserId = Datamanager.getNowtreedata().id;
            this.puticon(treeUserId, 1)
        }
    }

    //放虫
    private putinsect() {
        if (!Datamanager.getNowtreedata()) {
            NewHelp.Invite()
            this.closeScene()
            // SceneManager.addNotice("该好友还没有种树哦！");
            return;
        } else {
            var treeUserId = Datamanager.getNowtreedata().id;
            this.puticon(treeUserId, 0)
        }

    }


    private puticon(treeUserId, type) {
        let params = {
            treeUserId: treeUserId,
            type: type
        };
        MyRequest._post("game/interaction", params, this, this.Req_puticon.bind(this, type), this.onGetIOError)
    }


    private Req_puticon(type, data): void {
        var Data = data;
        if (type == 1) {              //放草
            NewHelp.putgrass(-1);
        }
        else if (type == 0) {         //放虫
            NewHelp.putinsect(-1);
        }
        this.closeScene()
    }

}

class barrageList_item extends eui.ItemRenderer {
    private barrage_lable: eui.Label;

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/BarrageListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }
    private onComplete() {

    }
    // 当数据改变时，更新视图
    protected dataChanged() {
        this.barrage_lable.text = this.data.msg;
    }
}
