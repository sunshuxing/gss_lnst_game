class newMainScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/MainSceneSkins.exml";
    }

    private bg: eui.Image;                  //场景背景
    private logo: eui.Image;   			    //风车图片
    public tree: eui.Image;				    //果树图片
    private tree_name: eui.Label;		    //果树名称
    public gro_fastpic: eui.Group;         //快照区域
    private gro_tree: eui.Group;             //果树点击区域
    public progress: eui.ProgressBar         //果树成长进度条
    public progress_label: eui.Label;        //果树成长进度条说明文字
    public present1: eui.Image;			//礼包点击区域
    public present2: eui.Image;			//
    private jishi_gro: eui.Group;
    private jishi_text: eui.Label;
    public gro_prop: eui.Group;
    private timer

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    private onComplete(): void {
        SceneManager.instance.landId = 1;                       //当前土地id为1
        this.showinit();
        this.logorot();
        this.gro_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.treeTouch, this);
        this.gro_prop.touchThrough = true;

    }



    /**
     * 果树图片点击事件
     */
    public treeTouch() {
        this.gro_tree.touchEnabled = false;
        egret.Tween.get(this.tree)
            .to({ scaleX: 1.05, scaleY: 1.05 }, 200)
            .wait(150)
            .to({ scaleX: 1, scaleY: 1 }, 200)
            .to({ scaleX: 1.02, scaleY: 1.02 }, 200)
            .to({ scaleX: 1, scaleY: 1 }, 200).call(() => {
                this.gro_tree.touchEnabled = true;
            }, this);

        // 所有树语中随机一个
        if (Datamanager.gettreelanguagedata()) {
            let n = Help.random_num(0, Datamanager.gettreelanguagedata().length - 1)
            SceneManager.treepromptgro.removeChildren();
            SceneManager.treetimer.reset();
            SceneManager.addtreePrompt(Datamanager.gettreelanguagedata()[n].msg);
        }
    }

    /**
     * 查询自己果树
     */
    public getOwnTree() {
        // landId :1  果园    landId:2   菜园
        let params = {
            landId: SceneManager.instance.landId
        }
        MyRequest._post("game/getOwnTree", params, this, this.requestgetOwnTree.bind(this), null);
    }


    //查询自己果园果树回调
    private requestgetOwnTree(data): void {
        Datamanager.savenowfrienddata(null);                //清空当前好友数据
        if (data.data[0]) {
            if (data.data[0].canReceive == "true") {
                Datamanager.saveOwnguoyuandata(data.data[0])
                let peisonglabel = "免费获得" + "\n" + data.data[0].treeName + "一箱!"
                SceneManager.sceneManager._stage.removeChildren();
                let image = new eui.Image();
                image.texture = RES.getRes("bgday_guoyuan_png");
                image.height = 1344;
                let prompt = new PromptJump(peisonglabel);
                SceneManager.sceneManager._stage.addChild(image);
                SceneManager.sceneManager._stage.addChild(prompt);
                return
            }
        }
        SceneManager.sceneManager.StageItems.currentState = "havetree"              //表现为自己果园
        console.log("自己果树", data)
        let treedata = data.data[0];
        Datamanager.saveOwnguoyuandata(treedata);               //保存自己果园果树数据
        Datamanager.saveNowtreedata(treedata);                  //保存当前果树数据
        NewHelp.showpickgro(treedata);                          //是否显示摘果按钮
        this.datainit(treedata);                                //数据初始化显示
        if (treedata) {
            HttpRequest.imageloader(Config.picurl + treedata.seedIcon, SceneManager.sceneManager.StageItems.fruit_img);
            console.log(Config.picurl + treedata.seedIcon)
            let fruitNum = treedata.obtainFruitNum ? Number(treedata.obtainFruitNum) : 0;
            let needNum = Number(treedata.exchangeNum);
            SceneManager.sceneManager.StageItems.fruit_label.text = fruitNum + "/" + needNum;
            NewHelp.Dyn_loc_red(treedata.id);
            if (this.timer) {
                clearInterval(this.timer)
            }
            if (treedata.fertilizerRecord) {
                let starttime = treedata.fertilizerRecord.createDate;
                let usedtime = treedata.fertilizerRecord.timeLimit;
                let endtime = Number(starttime) + Number(usedtime * 60 * 1000)
                this.timer = setInterval(() => {
                    let text = SceneManager.instance.getTaskScene().dateDif(endtime, this.timer)
                    text = text.slice(3);
                    this.jishi_text.text = text;
                    if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
                        if (!this.jishi_gro.visible) {
                            this.jishi_gro.visible = true;
                        }
                        if (!text) {
                            this.jishi_gro.visible = false;
                        }
                    }
                    else {
                        this.jishi_gro.visible = false;
                    }
                }, 1000);
            }
            else {
                this.jishi_gro.visible = false;
            }


            if (Number(treedata.friendCanObtain) > 0) {                                             //判断是否显示邀请帮摘果按钮
                SceneManager.sceneManager.StageItems.share_friend.visible = true;
            }
            else {
                SceneManager.sceneManager.StageItems.share_friend.visible = false;
            }
        }
        else {
            SceneManager.sceneManager.StageItems.share_friend.visible = false;
            NewHelp.getseed()                                           //领取种子   
        }
    }

    /**
     * 由果树信息更新显示(好友)
     */
    public updateBytreedata(data) {
        NewHelp.removeEffect();
        console.log("好友果树数据", data);
        SceneManager.sceneManager.StageItems.currentState = "friendtree";
        Datamanager.saveNowtreedata(data);                                              //保存当前果树数据
        NewHelp.getfriendlike(data);                                                    //查询好友点赞数
        if (Datamanager.getNowtreedata()) {
            let frienddata = Datamanager.getfrienddataByuser(Datamanager.getNowtreedata().userName)
            if (frienddata) {
                Datamanager.savenowfrienddata(frienddata);
            }
        }
        NewHelp.CheckStealGood();                                                       //检查是否能偷果
        NewHelp.checkSteal(data);                                                       //检查是否能偷水
        this.progress.slideDuration = 0;
        this.progress.value = 0;
        this.datainit(data);                                                         //数据初始化显示
        //果树更新显示
        SceneManager.treepromptgro.removeChildren();
        SceneManager.treetimer.reset();
        if (!data) {
            NewHelp.Invite();
            SceneManager.notreePropmt("好友还没有种树哦，点击邀请种树");
        }
        if (data) {
            SceneManager.addtreePrompt("欢迎来到我的农场！")
        }
        Help.removebuling();                                                //移除果树爱心值兑换效果

        if (data) {
            //推送拜访消息
            let params = {
                userId: Datamanager.getnowfrienddata().friendUser
            }
            MyRequest._post("game/visit", params, this, null, null);
        }

        //   好友列表定位
        // let index = Help.getContains(Datamanager.getfriendsdata(), Datamanager.getnowfrienddata());
        // let friend_list = SceneManager.sceneManager.getNewfriendScene().friend_list;
        // friend_list.selectedIndex = index;
        // if (index * 150 > friend_list.height - 10) {
        //     if (index * 150 <= (friend_list.contentHeight - friend_list.height)) {
        //         SceneManager.sceneManager.friendlist_scrollV = index * 150;

        //     }
        //     else {
        //         SceneManager.sceneManager.friendlist_scrollV = friend_list.contentHeight - friend_list.height;
        //     }
        // }
        // else {
        //     SceneManager.sceneManager.friendlist_scrollV = 0
        // }
    }


    /**
     * 无关数据初始化显示
     */
    private showinit() {
        let now = new Date();
        let hour = now.getHours();
        if (hour > 17 || hour < 6) {
            this.bg.texture = RES.getRes("bgnight_guoyuan_png");        //背景图片
        } else if (hour < 18 || hour > 5) {
            this.bg.texture = RES.getRes("actbg_guoyuan_png");             //背景图片
        }
    }

    /**
     * 数据初始化显示
     */
    private datainit(data) {
        if (SceneManager.sceneManager.StageItems.currentState == "havetree") {    //自己果园
            NewHelp.getNowUserInfo(SceneManager.instance.weixinUtil.login_user_id)  //显示头像
            SceneManager.sceneManager.StageItems.farm_name.text = "我的农场"
        } else if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {
            NewHelp.getNowUserInfo(Datamanager.getnowfrienddata().friendUser)       //显示头像
            SceneManager.sceneManager.StageItems.farm_name.text = (Datamanager.getnowfrienddata().friendUserName) + "的农场"
        }
        if (!data) {
            this.tree_name.text = "";
        } else {
            this.tree_name.text = data.treeName;                                //果树名称
        }
        NewHelp.getTreeLanguage(data);                                          //获取并保存树语数据
        if (data) {
            if (data.isReceive == "true") {
                this.tree.texture = RES.getRes("notree_png");
                this.tree.width = this.tree.width * 0.8;
                this.tree.height = this.tree.height * 0.8;
                this.tree.anchorOffsetX = this.tree.width * 0.5;
                this.tree.anchorOffsetY = this.tree.height;
                this.progress.visible = true;
                this.progress.value = 0;
                NewHelp.progressupdate(null, this.progress);                            //成长值进度条更新显示
                NewHelp.progresslabelupdate(null, this.progress_label);                 //成长进度条说明文字更新显示
                SceneManager.sceneManager.StageItems.chanzi_btn.visible = true;
                egret.Tween.get(SceneManager.sceneManager.StageItems.chanzi_btn, { loop: true })
                    .to({ y: SceneManager.sceneManager.StageItems.chanzi_btn.y - 20 }, 500)
                    .to({ y: SceneManager.sceneManager.StageItems.chanzi_btn.y }, 500)
                    .to({ y: SceneManager.sceneManager.StageItems.chanzi_btn.y + 20 }, 500)
                    .to({ y: SceneManager.sceneManager.StageItems.chanzi_btn.y }, 500)
            }
            else {
                this.treeupdate(data);                                                  //果树更新显示
                SceneManager.sceneManager.StageItems.chanzi_btn.visible = false;
                NewHelp.progressupdate(data, this.progress);                            //成长值进度条更新显示
                NewHelp.progresslabelupdate(data, this.progress_label);                 //成长进度条说明文字更新显示
            }
        }
        else {
            this.treeupdate(data);
            SceneManager.sceneManager.StageItems.chanzi_btn.visible = false;
        }
        NewHelp.getTreeLeaveMsg(data);                                          //显示留言
        NewHelp.getTreeProp(data);                                              //显示果园放置道具(虫草)
    }

    /**
     * 果树更新显示
     * data      果树数据
     * isself    是否是自己果树
     */
    private OwntreeStage                           //果树阶段
    private Oldneedtake
    private treeupdate(data) {
        if (!data) {
            this.tree.visible = false;
            return;
        }
        else {
            this.tree.visible = true;
            let isself: boolean;                                                           //判断是否是自己果树
            if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
                isself = true;
            }
            else {
                isself = false;
            }
            console.log(data, "更新果树的数据")
            let treeimgurl
            if (data.needTake == "false") {
                treeimgurl = data.stageObj.stageImage
            }
            else {
                treeimgurl = data.harvestImage
            }
            HttpRequest.imageloader(Config.picurl + treeimgurl, this.tree, null, () => {
                if (isself && ((this.OwntreeStage && this.OwntreeStage != data.stage) || (this.Oldneedtake && this.Oldneedtake == "false" && this.Oldneedtake != data.needTake))) {
                    if (!SceneManager.instance.isMiniprogram) {
                        console.log("2")
                        let share = new SharePic(() => {
                            Help.Screencapture(this.gro_fastpic, data);
                        }, data)
                        SceneManager.sceneManager._stage.addChild(share)
                    }
                    else {
                        let share = new SharePic(null, data)
                        SceneManager.sceneManager._stage.addChild(share)
                    }
                }
                if (isself) {
                    this.OwntreeStage = data.stage;
                    this.Oldneedtake = data.needTake;
                }
            }, this);
            //果树图片显示更新
            Help.getTreeHWBystage(data.stage, this.tree);
        }
    }

    //风车动画
    private logorot() {
        egret.Tween.get(this.logo, { loop: true })
            .to({ rotation: 360 }, 10000);
    }
}