class NewFriendScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/NewfriendSkins.exml";
    }

    private friend_invite: eui.Group;		 //邀请好友按钮
    private friend_scr: eui.Scroller;        //好友列表滑动区域
    public friend_list: eui.List;           //好友列表
    public friend_toself: eui.Group;         //回家按钮
    private page: number = 1;
    private friend_user = [];               //用户名字
    public friendsdata: eui.ArrayCollection = new eui.ArrayCollection();               //好友数据
    private isLastPage: boolean = false;

    protected childrenCreated(): void {
        super.childrenCreated();
        this.friend_invite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.invite, this);
        this.friend_toself.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toSelfTree, this)
        this.y = SceneManager.sceneManager._stage.height - this.height;
        this.friend_scr.verticalScrollBar = null;
        this.friend_list.useVirtualLayout = false;
        this.friend_list.dataProvider = this.friendsdata;
        this.friend_list.itemRenderer = NewFriendList_item;
        this.friend_list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.toOtherTree, this);
    }


    private onComplete(): void {
    }

    /**
     * 邀请好友
     */
    private invite() {
        let treedata														//果树数据
        if (SceneManager.instance.landId == 1) {								//当前为果园数据
            treedata = Datamanager.getOwnguoyuandata();						//自己果园果树数据
        }
        else if (SceneManager.instance.landId == 2) {							//当前为菜园数据
            treedata = Datamanager.getOwncaiyuandata();						//自己菜园果树数据
        }
        SceneManager.addJump("sharetextwater_png");
        if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
            let url = SceneManager.instance.weixinUtil.shareData.shareUrl
            let addFriend = MyRequest.geturlstr("addFriend", url)
            if (!addFriend) {
                SceneManager.instance.weixinUtil.shareData.shareUrl = url + "&addFriend=true"
            }
            if (treedata && Number(treedata.friendCanObtain) > 0) {
                SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
                SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
            } else {
                SceneManager.instance.weixinUtil.shareData.titles = "【说说农场】邀请你一起种水果，亲手种，免费送到家"
                SceneManager.instance.weixinUtil.shareData.describes = "种上一棵树，经营一座农场，开启舌尖上的旅行--果说说"
            }
            SceneManager.instance.weixinUtil._openShare();

        } else {
            let info
            if (treedata && Number(treedata.friendCanObtain) > 0) {
                info = "【果实熟了】快来、快来帮我摘水果。"
            } else {
                info = "【说说农场】一起种水果，亲手种，免费送到家。"
            }
            let data = {
                addFriend: true,
                title: info
            }
            SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
        }
    }

    //数组去重
    private uniq(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    }

    //查询好友列表
    public getFriends(userid?) {
        if (SceneManager.sceneManager.StageItems.currentState != "havetree") {
            this.friend_toself.visible = true;
        }
        else {
            this.friend_toself.visible = false;
        }

        let params = {
            pageNo: this.page,
            numPerPage: 6
        };
        MyRequest._post("game/getFriends", params, this, this.Req_getFriends.bind(this, userid), null);

    }

    //查询好友列表成功后处理
    private Req_getFriends(userid, data): void {
        console.log("好友数据", data)
        var Data = data;
        let friend_data = Data.data.list;
        for (let i = 0; i < friend_data.length; i++) {
            this.friend_user.push(friend_data[i].friendUser)
            this.friend_user = this.uniq(this.friend_user);
        }
        if (this.friend_user && this.friend_user.length > 0) {
            let params = {
                users: this.friend_user.join(",")
            };
            MyRequest._post("game/getWechatImg", params, this, this.Req_getWechatImg.bind(this, userid, friend_data), null);
        }
        if (!Data.data.isLastPage) {                                        //不是最后一页
            this.friend_scr.addEventListener(eui.UIEvent.CHANGE_END, this.friend_next, this)
        }
        this.isLastPage = Data.data.isLastPage;
    }

    private Req_getWechatImg(userid, friend_data, data) {
        if (!data) {
            return;
        }
        data = data.data;
        if (data && typeof data === "string") {
            data = JSON.parse(data)
        }
        Help.savefriendIcon(data);										//保存好友头像数据
        for (let i = 0; i < friend_data.length; i++) {
            this.friendsdata.addItem(friend_data[i]);
        }
    }

    public friend_next() {
        if (this.friend_list.scrollV >= this.friend_list.contentHeight - this.friend_list.height) {
            if (!this.isLastPage) {
                this.page++
                this.getFriends();
            }
            else {
                this.friend_scr.removeEventListener(eui.UIEvent.CHANGE_END, this.friend_next, this)
            }
        }
    }


    public closeScene() {
        if (this.parent) {
            this.page = 1;
            this.friendsdata.removeAll();
            this.isLastPage = false;
            NewHelp.removemask();
            this.parent.removeChild(this);
        }
    }

    /**
     * 回到自己农场
     */
    private toSelfTree() {
        if (SceneManager.sceneManager.StageItems.currentState != "havetree") {
            SceneManager.treepromptgro.removeChildren();											//清空显示树语
            SceneManager.treetimer.reset();															//重置树语定时器
            this.friend_list.selectedIndex = -1;
            this.nowseleceindex = -1;
            Help.passAnm();																			//过场动画
            if (SceneManager.instance.landId == 1) {												//果园
                SceneManager.sceneManager.newmainScene.progress.slideDuration = 0;					//成长值进度条缓动速度
                SceneManager.sceneManager.newmainScene.progress.value = 0;							//成长值进度条值
                SceneManager.sceneManager.newmainScene.getOwnTree();								//查询自己果树数据
            }
            else if (SceneManager.instance.landId == 2) {											//菜园
                SceneManager.sceneManager.newmain2Scene.progress.slideDuration = 0;					//成长值进度条缓动速度
                SceneManager.sceneManager.newmain2Scene.progress.value = 0;							//成长值进度条值
                SceneManager.sceneManager.newmain2Scene.getOwnTree();								//查询自己果树数据
            }
            NewHelp.closescene();                                                                   //关闭二级场景
        }
    }


    /**
	 * 进入好友果园
	 */
    private nowseleceindex = -1;												//当前选中的好友索引
    private toOtherTree() {
        if (SceneManager.instance.weixinUtil.login_user_id == this.friend_list.selectedItem.friendUser) {         //选中数据为自己
            //回到自己农场
            this.toSelfTree();
            return;
        }
        if (this.friend_list.selectedIndex != this.nowseleceindex) {			//点击的不是选中的好友
            Datamanager.savenowfrienddata(this.friend_list.selectedItem);		//保存当前好友数据
            //查询好友果树数据
            if (!this.friend_list.selectedItem.trees || this.friend_list.selectedItem.trees.length <= 0) {							//首先确定该好友不是两块地都没有数据
                //分享弹窗
                SceneManager.addJump("sharetexttree_png");
                return;
            }
            let nowuser = this.friend_list.selectedItem.friendUser;
            let treeid = NewHelp.getTreeIdByLandId(this.friend_list.selectedItem, SceneManager.instance.landId);				//获取果树id
            if (nowuser) {														    //当前土地选中好友有果树数据
                NewHelp.closescene();                                                                   //关闭二级场景                
                if (nowuser != Datamanager.getnowfrienddata().user) {				//选中好友果树和当前果树不是同一个
                    if (treeid) {
                        NewHelp.getTreeInfoByid(treeid);
                    }
                    else {
                        if (SceneManager.sceneManager.landId == 1) {
                            SceneManager.sceneManager.newmainScene.updateBytreedata(null);
                        }
                        else if (SceneManager.sceneManager.landId == 2) {
                            SceneManager.sceneManager.newmain2Scene.updateBytreedata(null);
                        }
                    }
                }
                Help.passAnm();
            }
            else {																//当前好友当前土地没有果树
                this.friend_list.selectedIndex = this.nowseleceindex;
                NewHelp.addmask();
                // let invite = new Invitefriend();
                // SceneManager.sceneManager._stage.addChild(invite);
            }
        }
        console.log("好友点击")
        this.nowseleceindex = this.friend_list.selectedIndex;
    }




    /**
     * 移除场景
     */
    private remove() {
        if (this.parent) {
            NewHelp.removemask()
            this.parent.removeChild(this);
        }
    }
}


