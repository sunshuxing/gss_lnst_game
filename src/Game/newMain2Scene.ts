class newMain2Scene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/MainScene2Skins.exml";
    }

    private warehouse: eui.Image;
    private bg: eui.Image;                  //场景背景
    public tree: eui.Image;				    //果树图片
    private tree_name: eui.Label;		    //果树名称
    private gro_fastpic: eui.Group;         //快照区域
    public progress: eui.ProgressBar         //果树成长进度条
    public progress_label: eui.Label;        //果树成长进度条说明文字
    private progress1: eui.ProgressBar;	     //果子进度条
    public pick_num: eui.Label;			     //篮子数量
    private distribution: eui.Label;         //篮子文字
    private distribution_label: eui.Label    //当前果子个数
    private fruit_img: eui.Image;             //果实图片
    private fruit_num: eui.Label;             //所需果实总个数
    private gro_progress1: eui.Group;          //收果进度条组
    private gro_tree: eui.Group                 //果树点击区域
    private toguoyuan: eui.Image;                //去果园按钮
    private btn_seed: eui.Button;               //领种子按钮
    private info1: eui.Group;
    private info2: eui.Group;
    private usericon1: eui.Image;
    private usericon2: eui.Image;
    private str1: eui.Label;
    private str2: eui.Label;
    private usericonbg1: eui.Image;
    private usericonbg2: eui.Image;
    private infopage = 0;
    private infodata;
    private goods_name1: eui.Label;
    private goods_img1: eui.Image;
    private goods_name2: eui.Label;
    private goods_img2: eui.Image;
    private goods_bg1: eui.Image;
    private goods_bg2: eui.Image;
    private goodsdata;
    private gro_duck: eui.Group;                 //鸭子区域
    private duck_img: eui.Image;                 //鸭子图片


    protected childrenCreated(): void {
        super.childrenCreated();
    }

    private onComplete(): void {
        SceneManager.instance.landId = 2;                       //当前土地id为2
        this.showinit();                                        //无关数据初始化显示
        // this.getOwnTree();                                      //获取自己当前土地果树数据并显示
        this.gro_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.treeTouch, this);
        this.toguoyuan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toGuoyuan, this);
        this.warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { SceneManager.toWarehouseScene() }, this)
        this.gro_duck.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ducktouch, this)
        this.str1.scrollRect = new egret.Rectangle(0, 0, 190, 65);
        this.str2.scrollRect = new egret.Rectangle(0, 0, 190, 65);
        this.usericon1.scrollRect = new egret.Rectangle(0, 0, 50, 50);
        this.usericon2.scrollRect = new egret.Rectangle(0, 0, 50, 50);
        this.usericonbg1.scrollRect = new egret.Rectangle(0, 0, 50, 50);
        this.usericonbg2.scrollRect = new egret.Rectangle(0, 0, 50, 50);
        this.goods_name1.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_img1.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_name2.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_img2.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_bg1.scrollRect = new egret.Rectangle(0, 0, 66, 66);
        this.goods_bg2.scrollRect = new egret.Rectangle(0, 0, 66, 66);
        this.getDeliveryInfo();
        this.getTopGoods();
    }

    /**
     * 点击鸭子区域事件
     */
    private ducktouch() {
        NewHelp.getDuckList();
    }



    /**
	 * 获取最新10个商品
	 */
    public getTopGoods() {
        MyRequest._post("fruit/getTopGoods", null, this, this.Req_getTopGoods.bind(this), null)
    }

    private Req_getTopGoods(data) {
        console.log("最新10个商品", data);
        this.goodsdata = data.data;
        this.goodscr1();
        this.getAttachList();
    }

    public getAttachList() {
        let params = {
            bizType: "advertisement",
            bizId: "advertisement"
        }
        MyRequest._post("attachment/getAttachList", params, this, this.Req_attachment.bind(this), null)
    }

    private Req_attachment(data) {
        console.log(data, "advertisement")
        for (let i = 0; i < data.data.length; i++) {
            this.goodsdata.push(data.data[i]);
        }
    }


    private m = 0

    public goodscr1() {
        if (this.goodsdata && this.goodsdata.length > 0) {
            if (this.m >= this.goodsdata.length) {
                this.m = 0;
            }
            if (this.goodsdata[this.m].sourceUrl) {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].sourceUrl, this.goods_img1);
            }
            else {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].thumbnail, this.goods_img1);
            }
            this.m++
            var rect: egret.Rectangle = this.goods_name1.scrollRect;
            egret.Tween.get(rect)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000).call(this.goodscr2, this)
                .to({ x: 66 }, 1000);

            var rect1: egret.Rectangle = this.goods_img1.scrollRect;
            egret.Tween.get(rect1)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000)
                .to({ x: 66 }, 1000);

            var rect2: egret.Rectangle = this.goods_bg1.scrollRect;
            egret.Tween.get(rect2)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000)
                .to({ x: 66 }, 1000);
        }
        else {
            this.getTopGoods();
        }
    }

    private goodscr2() {
        if (this.goodsdata && this.goodsdata.length > 0) {
            if (this.m >= this.goodsdata.length) {
                this.m = 0;
            }
            if (this.goodsdata[this.m].sourceUrl) {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].sourceUrl, this.goods_img1);
            }
            else {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].thumbnail, this.goods_img1);
            }
            this.m++
            var rect: egret.Rectangle = this.goods_name2.scrollRect;
            egret.Tween.get(rect)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000).call(this.goodscr1, this)
                .to({ x: 66 }, 1000);

            var rect1: egret.Rectangle = this.goods_img2.scrollRect;
            egret.Tween.get(rect1)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000)
                .to({ x: 66 }, 1000);

            var rect2: egret.Rectangle = this.goods_bg2.scrollRect;
            egret.Tween.get(rect2)
                .set({ x: -66 })
                .to({ x: 0 }, 1000)
                .wait(2000)
                .to({ x: 66 }, 1000);
        }
        else {
            this.getTopGoods();
        }
    }





    /**
	 * 查询配送记录
	 */
    public getDeliveryInfo() {
        this.infopage = this.infopage + 1
        let params = {
            pageNo: this.infopage,
            numPerPage: 10
        };
        MyRequest._post("game/getDeliveryInfo", params, this, this.Req_getDeliveryInfo.bind(this), null)
    }

    private Req_getDeliveryInfo(data) {
        let maxPage = parseInt(data.data.lastPage)
        if (this.infopage == maxPage) {
            //如果是最后一页，则下一次从首页开始
            this.infopage = 0
        }
        this.infodata = data.data.list;
        this.scr1();
    }

    private n = 0;

    public scr1() {
        let info;
        if (this.infodata && this.infodata.length > 0) {
            if (this.n >= this.infodata.length) {
                this.n = 0;
                this.getDeliveryInfo();
                return
            }
            let username = Help.getcharlength(this.infodata[this.n].mainUserName, 5)
            info = username + "\n" + this.infodata[this.n].treeName + "正在配送！"
            let params = {
                users: this.infodata[this.n].mainUser
            }
            MyRequest._post("game/getWechatImg", params, this, NewHelp.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.usericon1), null);
            this.n++
            this.str1.text = info

            var rect: egret.Rectangle = this.str1.scrollRect;
            egret.Tween.get(rect)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000).call(this.scr2, this)
                .to({ y: 65 }, 1000);

            var rect1: egret.Rectangle = this.usericon1.scrollRect;
            egret.Tween.get(rect1)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000)
                .to({ y: 65 }, 1000);

            var rect2: egret.Rectangle = this.usericonbg1.scrollRect;
            egret.Tween.get(rect2)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000)
                .to({ y: 65 }, 1000);

        }
        else {
            this.getDeliveryInfo();
        }
    }

    private scr2() {
        let info;
        if (this.infodata && this.infodata.length > 0) {
            if (this.n >= this.infodata.length) {
                this.n = 0;
                this.getDeliveryInfo();
                return
            }
            let username = Help.getcharlength(this.infodata[this.n].mainUserName, 5)
            info = username + "\n" + this.infodata[this.n].treeName + "正在配送！"
            let params = {
                users: this.infodata[this.n].mainUser
            }
            MyRequest._post("game/getWechatImg", params, this, NewHelp.Req_WechatImg.bind(this, this.infodata[this.n].mainUser, this.usericon2), null);
            this.n++
            this.str2.text = info

            var rect: egret.Rectangle = this.str2.scrollRect;
            egret.Tween.get(rect)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000).call(this.scr1, this)
                .to({ y: 65 }, 1000);

            var rect1: egret.Rectangle = this.usericon2.scrollRect;
            egret.Tween.get(rect1)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000)
                .to({ y: 65 }, 1000);

            var rect2: egret.Rectangle = this.usericonbg2.scrollRect;
            egret.Tween.get(rect2)
                .set({ y: -65 })
                .to({ y: 0 }, 1000)
                .wait(2000)
                .to({ y: 65 }, 1000);
        }
        else {
            this.getDeliveryInfo();
        }
    }

    /**
     * 去到果园
     */
    private toGuoyuan() {
        SceneManager.instance.landId = 1;
        SceneManager.toNewMainScene();
        if (SceneManager.sceneManager.StageItems.currentState == "havetree") {            //自己农场
            SceneManager.sceneManager.newmainScene.getOwnTree();
        }
        else if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {         //好友农场
            if (Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1]) {
                let friendtreedataid = Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1].id;
                NewHelp.getTreeInfoByid(friendtreedataid);
            }
            else {
                SceneManager.sceneManager.newmainScene.updateBytreedata(null);
                NewHelp.addmask();
                let invite = new Invitefriend();
                SceneManager.sceneManager._stage.addChild(invite);
            }
        }
        Help.passAnm();
    }

    /**
     * 果树图片点击事件
     */
    private treeTouch() {
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
        SceneManager.sceneManager.StageItems.currentState = "havetree"              //表现为自己农场
        console.log("自己果树", data)
        let treedata = data.data[0];
        Datamanager.saveOwncaiyuandata(treedata);                                   //保存自己菜园果树数据
        Datamanager.saveNowtreedata(treedata);                                      //保存当前果树数据
        NewHelp.showpickgro(treedata);                                              //是否显示摘果按钮
        this.datainit(treedata);                                                    //数据初始化显示
        SceneManager.sceneManager.getTaskScene().taskDataInit(this.checktask);
        if (treedata) {
            if (Number(treedata.friendCanObtain) > 0) {                                             //判断是否显示邀请帮摘果按钮
                SceneManager.sceneManager.StageItems.share_friend.visible = true;
            }
            else {
                SceneManager.sceneManager.StageItems.share_friend.visible = false;
            }
        }
        else {
            SceneManager.sceneManager.StageItems.share_friend.visible = false;
            NewHelp.getseed();
        }
    }



    public checktask(flag) {
        if (flag) {
            SceneManager.sceneManager.StageItems.task_gro.visible = true;
        }
        else if (!flag) {
            SceneManager.sceneManager.StageItems.task_gro.visible = false;
        }
    }

    /**
     * 由果树信息更新显示(好友)
     */
    public updateBytreedata(data) {
        console.log("好友果树数据", data);
        SceneManager.sceneManager.StageItems.currentState = "friendtree";
        NewHelp.getfriendlike(data);                                                //查询好友点赞数
        Datamanager.saveNowtreedata(data);
        NewHelp.checkSteal(data);                                                   //检查是否能偷水
        this.datainit(data);                                                        //数据初始化显示
        NewHelp.checkHelpTakeFruit(data);                                           //检查是否能帮摘果
        // //好友列表定位
        // let index = Help.getContains(Datamanager.getfriendsdata(), Datamanager.getfriendByid(data.id));
        // let friend_list = SceneManager.sceneManager.StageItems.friend_list;
        // friend_list.selectedIndex = index;
        // if (index * 110 > friend_list.width - 10) {
        //     if (index * 110 <= (friend_list.contentWidth - friend_list.width)) {
        //         friend_list.scrollH = index * 110;
        //     }
        //     else {
        //         friend_list.scrollH = friend_list.contentWidth - friend_list.width;
        //     }
        // }
        this.progress.slideDuration = 0;
        this.progress.value = 0;
        //果树更新显示
        SceneManager.treepromptgro.removeChildren();
        SceneManager.treetimer.reset();
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
        let friend_list = SceneManager.sceneManager.StageItems.friend_list;
        friend_list.selectedIndex = index;
        if (index * 110 > friend_list.width - 10) {
            if (index * 110 <= (friend_list.contentWidth - friend_list.width)) {
                friend_list.scrollH = index * 110;
            }
            else {
                friend_list.scrollH = friend_list.contentWidth - friend_list.width;
            }
        }
    }


    /**
     * 无关数据初始化显示
     */
    private showinit() {
        let now = new Date();
        let hour = now.getHours();
        if (hour > 17 || hour < 6) {
            this.bg.texture = RES.getRes("bg-nightcai_png");               //背景图片
        } else if (hour < 18 || hour > 5) {
            this.bg.texture = RES.getRes("bg-daycai_png");             //背景图片
        }
    }

    /**
     * 数据初始化显示
     */
    private datainit(data) {
        if (!data) {
            this.tree_name.text = "";
        } else {
            this.tree_name.text = data.treeName;                                //果树名称
        }
        NewHelp.getTreeLanguage(data);                                          //获取并保存树语数据
        this.treeupdate(data);                                                  //果树更新显示
        NewHelp.progressupdate(data, this.progress);                            //成长值进度条更新显示
        NewHelp.progresslabelupdate(data, this.progress_label);                 //成长进度条说明文字更新显示
        this.progress1update(data);                                             //收果进度条更新显示
        NewHelp.getTreeLeaveMsg(data);                                          //显示留言
        NewHelp.getTreeProp(data);                                              //显示果园放置道具(虫草)
    }

    /**
     * 收果进度条更新显示
     * treedata:果树数据
     */
    private progress1update(treedata) {
        if (!treedata) {
            this.gro_progress1.visible = false;
            return;
        }
        else {
            if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
                this.pick_num.visible = true;
            }
            else {
                this.pick_num.visible = false;
            }
            if (treedata.stageObj.canHarvest == "true") {
                this.progress1.maximum = treedata.exchangeNum;							    //装箱需要的果子总数
                this.progress1.minimum = 0;
                this.progress1.value = treedata.obtainFruitNum; 						    //当前收获果子数
                this.distribution_label.text = treedata.obtainFruitNum + "个";               //当前收果个数
                HttpRequest.imageloader(Config.picurl + treedata.goodsIcon, this.fruit_img);
                this.fruit_num.text = treedata.exchangeNum + "个";                          //所需要果子总个数
                this.gro_progress1.visible = true;                                          //收果进度条组显示
            }
            else {
                this.gro_progress1.visible = false;                                         //收果进度条隐藏
            }
        }
    }


    /**
     * 果树更新显示
     * data      果树数据
     * isself    是否是自己果树
     */
    private OwntreeStage                            //果树阶段
    private Oldneedtake                             //之前是否需要摘果
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
                        if (!SceneManager.instance.isMiniprogram) {                 //当前环境不是小程序
                            let share = new SharePic(() => {
                                Help.Screencapture(this.gro_fastpic, data);
                            }, data)
                            SceneManager.sceneManager._stage.addChild(share)
                        }
                        else {                                                      //当前环境是小程序
                            let share = new SharePic(null, data)
                            SceneManager.sceneManager._stage.addChild(share)
                        }
                    }
                    if (isself) {
                        this.OwntreeStage = data.stage;
                        this.Oldneedtake = data.needTake;
                    }
                }, this);
            }
            else {
                HttpRequest.imageloader(Config.picurl + data.stageObj.stageImage, this.tree, null, () => {
                    if (isself && (Number(data.stage) >= 5) && ((this.OwntreeStage && this.OwntreeStage != data.stage) || (this.Oldneedtake && this.Oldneedtake != data.needTake))) {
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


}