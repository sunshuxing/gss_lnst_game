class SeedRewardScene extends eui.Component implements eui.UIComponent {
    public constructor(data) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/SeedRewardSkins.exml";
        this.rewarddata = data;
    }

    private reward_list: eui.List;                               //奖励列表
    private reward_btn: eui.Image;                               //奖励按钮
    private rewarddata                                           //奖励数据
    private rewardbg: eui.Image;

    protected childrenCreated(): void {
        super.childrenCreated();
        let data = [];
        if (this.rewarddata) {
            for (let i = 0; i < this.rewarddata.length; i++) {
                data.push(this.rewarddata[i]);
            }
            let euiArr: eui.ArrayCollection = new eui.ArrayCollection(data);
            this.reward_list.dataProvider = euiArr;
            // 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
            this.reward_list.itemRenderer = RewardList_item;
        }
    }

    private onComplete(): void {
        if (SceneManager.instance.landId == 1) {
            this.rewardbg.texture = RES.getRes("rewardbg2_png");
        }
        else if (SceneManager.instance.landId == 2) {
            this.rewardbg.texture = RES.getRes("rewardbg1_png")
        }
        this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this)
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        if (this.rewarddata) {
            console.log(this.rewarddata);
        }
    }

    private close() {
        if (this.parent) {
            this.parent.removeChild(this);
            NewHelp.updateprop();
            NewHelp.removemask();
        }
    }

}



class RewardList_item extends eui.ItemRenderer {

    private propimg: eui.Image;			    //道具图片
    private propnum: eui.Label;			    //道具名称与数量

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/SeedRewardListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }
    private onComplete() {

    }
    // 当数据改变时，更新视图
    protected dataChanged() {
        if (this.data.propType != 50) {
            this.propimg.texture = RES.getRes(NewHelp.gettextrueBypropid(this.data.propId));
        }
        this.propnum.text = this.data.propName + "x" + this.data.propNum;

    }
}




