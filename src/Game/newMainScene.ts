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
    private gro_fastpic: eui.Group;         //快照区域
    private gro_tree: eui.Group;             //果树点击区域
    public progress: eui.ProgressBar         //果树成长进度条
    public progress_label: eui.Label;        //果树成长进度条说明文字
    public present1: eui.Image;			//礼包点击区域
    public present2: eui.Image;			//
    private jishi_gro: eui.Group;
    private jishi_text: eui.Label;
    public gro_prop: eui.Group;

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    private onComplete(): void {
        SceneManager.instance.landId = 1;                       //当前土地id为1
        MyRequest._post("fruit/getNowDateTime", null, this, this.Req_getNowDateTime.bind(this), null)		//获取服务器当前时间
        this.showinit();
        this.logorot();
        this.addEvent();
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
        if (data.data[0]) {
            if (data.data[0].canReceive == "true") {
                Datamanager.saveOwnguoyuandata(data.data[0])
                let peisonglabel = "免费获得" + "\n" + data.data[0].treeName + "一箱!"
                SceneManager.sceneManager._stage.removeChildren();
                let image = new eui.Image();
                image.texture = RES.getRes("bg-day_png");
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
            if (treedata.fertilizerRecord) {
                let starttime = treedata.fertilizerRecord.createDate;
                let usedtime = treedata.fertilizerRecord.timeLimit;
                let endtime = Number(starttime) + Number(usedtime * 60 * 1000)
                let timer = setInterval(() => {
                    let text = SceneManager.instance.getTaskScene().dateDif(endtime, timer)
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
        console.log("好友果树数据", data);
        SceneManager.sceneManager.StageItems.currentState = "friendtree";
        Datamanager.saveNowtreedata(data);                                              //保存当前果树数据
        NewHelp.getfriendlike(data);                                                    //查询好友点赞数
        NewHelp.checkSteal(data);                                                       //检查是否能偷水
        this.progress.slideDuration = 0;
        this.progress.value = 0;
        this.datainit(data);                                                         //数据初始化显示
        NewHelp.checkHelpTakeFruit(data);                                            //检查是否能帮摘果
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
        let index = Help.getContains(Datamanager.getfriendsdata(), Datamanager.getnowfrienddata());
        let friend_list = SceneManager.sceneManager.getNewfriendScene().friend_list;
        friend_list.selectedIndex = index;
        if (index * 150 > friend_list.height - 10) {
            if (index * 150 <= (friend_list.contentHeight - friend_list.height)) {
                SceneManager.sceneManager.friendlist_scrollV = index * 150;

            }
            else {
                SceneManager.sceneManager.friendlist_scrollV = friend_list.contentHeight - friend_list.height;
            }
        }
        else {
            SceneManager.sceneManager.friendlist_scrollV = 0
        }
    }


    /**
     * 无关数据初始化显示
     */
    private showinit() {
        let now = new Date();
        let hour = now.getHours();
        if (hour > 17 || hour < 6) {
            this.logo.texture = RES.getRes("logo-night")            //风车图片
            this.bg.texture = RES.getRes("bgsnownight_png");        //背景图片
        } else if (hour < 18 || hour > 5) {
            this.logo.texture = RES.getRes("logo")                  //风车图片
            this.bg.texture = RES.getRes("bgsnow_png");             //背景图片
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
    private OwntreeStage                            //果树阶段
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
            if (data.needTake == "true") {
                HttpRequest.imageloader(Config.picurl + data.stageObj.harvestImage, this.tree, null, () => {
                    if (isself && (Number(data.stage) >= 5) && ((this.OwntreeStage && this.OwntreeStage != data.stage) || (this.Oldneedtake && this.Oldneedtake != data.needTake))) {
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
            } else {
                HttpRequest.imageloader(Config.picurl + data.stageObj.stageImage, this.tree, null, () => {
                    if (isself && (Number(data.stage) >= 5) && ((this.OwntreeStage && this.OwntreeStage != data.stage) || (this.Oldneedtake && this.Oldneedtake != data.needTake))) {
                        if (Number(data.stage >= 6) && (this.OwntreeStage && this.OwntreeStage == data.stage)) {
                            console.log("阶段截图2")
                            if (!SceneManager.instance.isMiniprogram) {
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
                    }
                    if (isself) {
                        this.OwntreeStage = data.stage;
                        this.Oldneedtake = data.needTake;
                    }
                }, this);
            }
            //果树图片显示更新
            Help.getTreeHWBystage(data.stage, this.tree);
        }
    }

    //-----------------------------------------------------------------------------礼包----------------------------------------------------------------------------//

    private nowDate  					//当前时间

    private Req_getNowDateTime(data) {
        this.nowDate = data.data;
        MyRequest._post("game/getSysReward", null, this, this.Req_getSysReward.bind(this), null)		//获取当前是否有礼包抽奖规则		
    }

    //点击礼包事件
    private presenttouch() {
        if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {
            return;
        }
        if (Datamanager.getNowtreedata()) {
            let params = {
                treeUserId: Datamanager.getNowtreedata().id
            }
            MyRequest._post("game/receiveSysReward", params, this, this.Req_receiveSysReward.bind(this), null)
            this.present1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
            this.present2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
            console.log("点击礼包")
        }
    }


    private startpresentTwn() {
        if (!localStorage.getItem("present") || localStorage.getItem("present") == "true") {
            egret.Tween.get(this.present1, { loop: true })
                .to({ y: this.present1.y + 80 }, 1500)
                .to({ y: this.present1.y }, 1500)
            egret.Tween.get(this.present2, { loop: true })
                .to({ rotation: -30 }, 100)
                .to({ rotation: 0 }, 100)
                .to({ rotation: 30 }, 100)
                .to({ rotation: 0 }, 100)
                .wait(500)
            this.present1.touchEnabled = true;
            this.present2.touchEnabled = true;
        }
    }

    private stoppresentTwn() {
        if (!localStorage.getItem("present") || localStorage.getItem("present") == "true") {
            this.present1.y = 228;
            this.present2.rotation = 0;
            egret.Tween.removeTweens(this.present1)
            egret.Tween.removeTweens(this.present2)
            this.present1.touchEnabled = false;
            this.present2.touchEnabled = false;
        }
    }

	/**
	 * 获取礼包规则回调
	 */
    private Req_getSysReward(data) {
        console.log("礼包抽奖规则:", data);
        let starttime			//活动开始时间
        let endtime				//活动结束时间
        let that = this
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].isOpened == "true") {
                that.stoppresentTwn();
            }
            else {
                starttime = data.data[i].startTime.replace(new RegExp(/-/gm), "/")
                starttime = Date.parse(starttime)
                endtime = data.data[i].endTime.replace(new RegExp(/-/gm), "/")
                endtime = Date.parse(endtime)
                if (starttime > this.nowDate) {
                    console.log("活动时间之前")
                    setTimeout(function () {
                        console.log("礼包点击动画和事件开始");
                        localStorage.setItem("present", "true");
                        that.startpresentTwn();
                    }, Number(starttime) - Number(this.nowDate));
                }
                if (endtime > this.nowDate) {
                    console.log("活动时间之间")
                    setTimeout(function () {
                        console.log("礼包点击动画和事件结束")
                        that.stoppresentTwn();
                        localStorage.setItem("present", "false");
                    }, Number(endtime) - Number(this.nowDate));
                }
                if (starttime < this.nowDate && endtime > this.nowDate) {
                    this.startpresentTwn();
                    localStorage.setItem("present", "true");
                    console.log("在活动时间内")
                }
                if (endtime < this.nowDate) {
                    console.log("在活动时间之后")
                }
            }
        }
    }

    private addEvent() {
        this.present1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
        this.present2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
        this.present1.touchEnabled = false;
        this.present2.touchEnabled = false;
    }

    private Req_receiveSysReward(data) {
        console.log("领取礼包数据:", data);
        let info: string;				//文字
        let imgname: string;		    //图片名称
        let orderId: any;				//礼包id
        let info2: string;				//文字2
        if (data.data) {
            let rewaredata = data.data[0];
            if (rewaredata.status == "0") {
                if (rewaredata.giftType == "0") {
                    console.log("领取礼包")
                    orderId = rewaredata.orderId;
                    info = "恭喜您获得礼包！"
                    info2 = rewaredata.fruitInfo + "一件";
                }
                else {
                    info = "恭喜您获得礼包！"
                    info2 = "恭喜您获得" + rewaredata.reward.propName + "x" + rewaredata.reward.propNum;
                }
            }
            else if (rewaredata.status == "1") {
                info = "很遗憾,您没中奖哦~";
                imgname = "presentimgsor_png"
            }
            else if (rewaredata.status == "2") {
                info = "您已经领过了哦~";
                imgname = "presentimgobtained_png"
                this.stoppresentTwn();
                localStorage.setItem("present", "false")
            }
            else if (rewaredata.status == "-1") {
                info = "已抢光~";
                imgname = "presentimgnomore_png"
                this.stoppresentTwn();
                localStorage.setItem("present", "false")
            }
            else if (rewaredata.status == "-2") {
                info = "领礼包次数已达上限~";
                imgname = "presentimgfull_png"
                this.stoppresentTwn();
                localStorage.setItem("present", "false")
            }
            MyRequest._post("fruit/getNowDateTime", null, this, this.Req_getNowDateTime.bind(this), null)		//获取服务器当前时间
        }
        let share = new Sharepresent(info, imgname, orderId, info2);
        SceneManager.sceneManager._stage.addChild(share);

        this.present1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
        this.present2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
    }


    //风车动画
    private logorot() {
        egret.Tween.get(this.logo, { loop: true })
            .to({ rotation: 360 }, 10000);
    }
}