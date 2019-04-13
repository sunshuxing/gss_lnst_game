class NewFriendList_item extends eui.ItemRenderer {

    private friend_icon: eui.Image;			//好友头像
    private friend_name: eui.Label;			//好友名称
    private fruit1: eui.Image;              //好友水果图标1
    private fruit2: eui.Image;              //好友水果图标2
    private friend_heart: eui.Group;        //好友爱心
    private friend_hand: eui.Image;         //好友手
    private heart_num: eui.Label;           //好友爱心数值

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/Newfriendlsit.exml'
        this.friend_hand.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.hand(this.data), this)
        this.friend_hand.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => { e.stopImmediatePropagation() }, this)
        this.friend_heart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchheart, this)
        this.friend_heart.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => { e.stopImmediatePropagation() }, this)
        SceneManager.sceneManager.getNewfriendScene().friend_list.scrollV = SceneManager.sceneManager.friendlist_scrollV;
    }


    private touchheart() {
        NewHelp.dianzan(this.data.friendUser);
    }

    /**
     * 帮摘果/偷果
     */
    private hand(data) {
        for (let i = 0; i < data.trees.length; i++) {
            if (data.trees[i].friendCanObtain > 0) {
                let treeid = data.trees[i].id;
                let nowday = new Date().toLocaleDateString();
                if (String(nowday) != localStorage.getItem(String(treeid))) {               //判断今日是否已经帮该树摘果
                    SceneManager.sceneManager.landId = data.trees[i].landId                 //选定当前是哪块地
                    if (SceneManager.sceneManager.landId == 1) {                              //果园
                        SceneManager.toNewMainScene();
                    }
                    else if (SceneManager.sceneManager.landId == 2) {                         //菜园
                        SceneManager.toNewMain2Scene();
                    }
                    Datamanager.savenowfrienddata(data);                                    //保存好友数据
                    NewHelp.getTreeInfoByid(treeid)                                         //去到当前果园
                    NewHelp.closescene();
                    Help.passAnm();
                    return
                }
            }
        }
    }


    // 当数据改变时，更新视图
    protected dataChanged() {
        let user = this.data.friendUser
        HttpRequest.imageloader(Config.picurl + Help.getfriendIcon()[user], this.friend_icon, user);
        if (SceneManager.instance.weixinUtil.login_user_id == this.data.friendUser) {                 //当前数据是自己的数据
            this.friend_name.text = Help.getcharlength(this.data.friendUserName, 6) + "（我自己）";
            this.friend_hand.visible = false;                                                         //隐藏帮摘果
        }
        else {                                                                                       //当前数据不是自己数据
            this.friend_name.text = Help.getcharlength(this.data.friendUserName, 6);
            if (this.data.trees && this.data.trees.length > 0) {                                     //选中好友有果树
                for (let i = 0; i < this.data.trees.length; i++) {
                    if (this.data.trees[i].friendCanObtain > 0) {
                        let treeid = this.data.trees[i].id;
                        let nowday = new Date().toLocaleDateString();
                        if (String(nowday) != localStorage.getItem(String(treeid))) {               //判断今日是否已经帮该树摘果
                            this.friend_hand.visible = true;
                        }
                    }
                }
            }
        }
        this.heart_num.text = this.data.praises;
        if (!this.data.trees || this.data.trees.length == 0) {
            this.fruit1.texture = null
            this.fruit2.texture = null
        }
        else {
            if (this.data.trees.length == 1) {
                HttpRequest.imageloader(Config.picurl + this.data.trees[0].seedIcon, this.fruit2);
                this.fruit1.texture = null
            }
            else if (this.data.trees.length == 2) {
                HttpRequest.imageloader(Config.picurl + this.data.trees[0].seedIcon, this.fruit1);
                HttpRequest.imageloader(Config.picurl + this.data.trees[1].seedIcon, this.fruit2);
            }
        }
    }

}