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
    private gro_tree: eui.Group                 //果树点击区域
    private btn_seed: eui.Button;               //领种子按钮
    public getduck_btn: eui.Image;
    private gamestore: eui.Image;                //商店
    private jishi_gro: eui.Group;               //化肥计时
    private jishi_text: eui.Label;               //化肥计时文字
    public duckjishi: eui.Group;
    public gro_prop: eui.Group;
    private logo: eui.Image;

    private info_img1: eui.Image;
    private info_img2: eui.Image;
    private infodata;
    private goods_name1: eui.Label;
    private goods_img1: eui.Image;
    private goods_name2: eui.Label;
    private goodsGroup: eui.Group;   //水果轮播的group
    private goods_img2: eui.Image;
    private goods_bg1: eui.Image;
    private goods_bg2: eui.Image;
    private goodsdata;
    private gro_duck: eui.Group;                 //鸭子区域

    public duckegg_img: eui.Image;             //鸭蛋图片
    public left_receive_info: eui.Label;        //领取鸭蛋倒计时
    private info_gro: eui.Group;                 //广告牌
    public duck_language_gro: eui.Group;         //鸭语区域
    private info_label1: eui.Label;
    private info_label2: eui.Label;
    public gro_eggduck: eui.Group;
    private timer

    protected childrenCreated(): void {
        super.childrenCreated();
        // NewHelp.duck_hungryTwn();
        this.logorot();
        this.duck_language_gro.touchThrough = true;
    }

    private onComplete(): void {
        SceneManager.instance.landId = 2;                       //当前土地id为2
        this.showinit();                                        //无关数据初始化显示
        // this.getOwnTree();                                      //获取自己当前土地果树数据并显示
        this.gro_tree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.treeTouch, this);
        this.warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { SceneManager.toWarehouseScene() }, this)
        this.gro_eggduck.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ducktouch, this)
        this.gamestore.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { SceneManager.addNotice("商店暂未开放") }, this)
        this.info_gro.addEventListener(egret.TouchEvent.TOUCH_TAP, this.infotouch, this);
        // this.info_img1.scrollRect = new egret.Rectangle(0, 0, 240, 100);
        // this.info_img2.scrollRect = new egret.Rectangle(0, 0, 240, 100);
        this.info_label1.scrollRect = new egret.Rectangle(0, 0, 240, 100);
        this.info_label2.scrollRect = new egret.Rectangle(0, 0, 240, 100);
        this.goods_name1.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_img1.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_name2.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goodsGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpDetail, this);
        this.goods_img2.scrollRect = new egret.Rectangle(0, 0, 66, 88);
        this.goods_bg1.scrollRect = new egret.Rectangle(0, 0, 66, 66);
        this.goods_bg2.scrollRect = new egret.Rectangle(0, 0, 66, 66);
        this.gro_prop.touchThrough = true;
        // this.getSystemInfo();
        // this.getTopGoods();
    }




    //风车动画
    private logorot() {
        egret.Tween.get(this.logo, { loop: true })
            .to({ rotation: 360 }, 10000);
    }

    /**
     * 广告详情
     */
    private infotouch() {
        let guanggao = new GuanggaoScene(this.infodata[this.n - 1])
        SceneManager.sceneManager._stage.addChild(guanggao);
    }

    /**
     * 跳转水果详情
     */
    private jumpDetail() {
        //修改详情跳转错误问题
        const fruit = this.goodsdata[(this.m - 1) < 0 ? 0 : (this.m - 1)]
        if (fruit) {
            const fruitId = fruit.id
            if (SceneManager.instance.isMiniprogram) {
                wx.miniProgram.navigateTo({
                    url: "/pages/gssIndex/detail?id=" + fruitId
                })
            } else {
                location.href = Config.webHome + "view/detail.html?id=" + fruitId
            }
        }

    }

    /*
     * 点击鸭子区域事件
     */
    public ducktouch() {
        if (!Datamanager.getnowDuckdata()) {                          //当前用户无鸭子
            return
        }
        else {                                                       //当前用户有鸭子
            if (Datamanager.getnowDuckdata().user != SceneManager.instance.weixinUtil.login_user_id) {        //当前所在的是好友菜园
                if (Datamanager.getnowDuckdata().obtainNum) {
                    if (Datamanager.getnowDuckdata().obtainNum > 0) {
                        NewHelp.stealDuckEgg();                                                 //偷鸭蛋
                    }
                }
            }
            else {                                                                      //当前所在的是自己菜园
                if (Datamanager.getOwnDuckdata().needTake) {
                    NewHelp.recevieDuckEgg();                                                   //收鸭蛋
                }
            }
        }
        console.log(Datamanager.getnowDuckdata(), "当前鸭子数据")
    }

    private ducktimer;

    /**
     * 更新鸭子
     * duckdata:鸭子数据
     */
    public updateduck(duckdata) {
        console.log("更新鸭子")
        if (duckdata) {
            NewHelp.checkDuckNowStatus(duckdata)                //检查鸭子当前状态
            NewHelp.getDuckLanguage(duckdata)
            NewHelp.showducklanguage();
            if (this.ducktimer) {
                clearInterval(this.ducktimer)
            }
            if (duckdata.needTake) {
                if (duckdata.layEggTime) {
                    let duck_language_gro = SceneManager.sceneManager.newmain2Scene.duck_language_gro;
                    NewHelp.ducktimer.reset();
                    NewHelp.ducklanguageTimer.reset();
                    duck_language_gro.removeChildren()
                    let time = new Date(duckdata.layEggTime).getTime()
                    time = time + Number(duckdata.receiveDelay * 1000 * 60)
                    let nowtime = new Date().getTime();
                    if (time > nowtime) {
                        NewHelp.addduckmovie(DuckMoiveType.layingegg, DuckType.big, -1);          //鸭子下蛋状态
                        this.duckegg_img.visible = false;
                    }
                    else {
                        this.duckegg_img.visible = true;
                    }
                    let that = this;
                    this.ducktimer = setInterval(() => {
                        let text = SceneManager.instance.getTaskScene().dateDif(time, this.ducktimer)
                        text = text.slice(3);
                        SceneManager.sceneManager.newmain2Scene.left_receive_info.text = text;
                        if (text) {
                            if (!SceneManager.sceneManager.newmain2Scene.duckjishi.visible) {
                                SceneManager.sceneManager.newmain2Scene.duckjishi.visible = true;
                            }
                        }
                        else {
                            if (SceneManager.sceneManager.newmain2Scene.duckjishi.visible) {
                                SceneManager.sceneManager.newmain2Scene.duckjishi.visible = false;
                            }
                            NewHelp.addnoduck_language("可收取");
                            if (this.ducktimer) {
                                NewHelp.checkDuckNowStatus(duckdata)                //检查鸭子当前状态
                                clearInterval(this.ducktimer)
                            }
                        }
                    }, 1000);
                }
            }
            else {
                SceneManager.sceneManager.newmain2Scene.duckjishi.visible = false;
                this.duckegg_img.visible = false;
            }


        }
        else {
            NewHelp.removeAllDuckMovie();
            SceneManager.sceneManager.newmain2Scene.duckegg_img.visible = false;
            SceneManager.sceneManager.newmain2Scene.duckjishi.visible = false;
        }
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
        for (let i = 0; i < data.data.length; i++) {
            this.goodsdata.push(data.data[i]);
        }
    }

    private m = 0

    public goodscr1() {
        if (this.goodsdata && this.goodsdata.length == 1) {
            if (this.goodsdata[this.m].sourceUrl) {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].sourceUrl, this.goods_img1);
            }
            else {
                this.goods_name1.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].thumbnail, this.goods_img1);
            }
            return
        }
        else if (this.goodsdata && this.goodsdata.length > 0) {
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
                this.goods_name2.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].sourceUrl, this.goods_img2);
            }
            else {
                this.goods_name2.text = this.goodsdata[this.m].title;
                HttpRequest.imageloader(Config.picurl + this.goodsdata[this.m].thumbnail, this.goods_img2);
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
	 * 查询系统消息
	 */

    public getSystemInfo() {
        MyRequest._post("game/getSystemInfo", null, this, this.Req_getSystemMsg.bind(this), null)
    }

    private Req_getSystemMsg(data) {
        if (data) {
            console.log(data, "系统消息");
            this.infodata = data.data;
            this.scr1();
        }
    }

    private n = 0;

    public scr1() {
        // if (this.infodata && this.infodata.length == 1) {
        //     HttpRequest.imageloader(Config.picurl + this.infodata[this.n].icon, this.info_img1);
        //     return;
        // }
        // else if (this.infodata && this.infodata.length > 0) {
        //     if (this.n >= this.infodata.length) {
        //         this.n = 0;
        //     }
        //     HttpRequest.imageloader(Config.picurl + this.infodata[this.n].icon, this.info_img1);
        //     this.n++
        //     var rect: egret.Rectangle = this.info_img1.scrollRect;
        //     egret.Tween.get(rect)
        //         .set({ y: -100 })
        //         .to({ y: 0 }, 1000)
        //         .wait(2000).call(this.scr2, this)
        //         .to({ y: 100 }, 1000);
        // }

        let title

        if (this.infodata && this.infodata.length == 1) {
            title = this.infodata[this.n].title;
            this.info_label1.textFlow = <Array<egret.ITextElement>>[
                { text: "公告", style: { size: 26 } },
                { text: "\n" },
                { text: title },
            ]
            return;
        }
        else if (this.infodata && this.infodata.length > 0) {
            if (this.n >= this.infodata.length) {
                this.n = 0;
            }
            title = this.infodata[this.n].title;
            this.info_label1.textFlow = <Array<egret.ITextElement>>[
                { text: "公告", style: { size: 26 } },
                { text: "\n" },
                { text: title },
            ]
            this.n++
            var rect: egret.Rectangle = this.info_label1.scrollRect;
            egret.Tween.get(rect)
                .set({ y: -100 })
                .to({ y: 0 }, 1000)
                .wait(2000).call(this.scr2, this)
                .to({ y: 100 }, 1000);
        }
    }

    private scr2() {
        // if (this.infodata && this.infodata.length > 0) {
        //     if (this.n >= this.infodata.length) {
        //         this.n = 0;
        //     }
        //     HttpRequest.imageloader(Config.picurl + this.infodata[this.n].icon, this.info_img2);
        //     this.n++
        //     var rect: egret.Rectangle = this.info_img2.scrollRect;
        //     egret.Tween.get(rect)
        //         .set({ y: -100 })
        //         .to({ y: 0 }, 1000)
        //         .wait(2000).call(this.scr1, this)
        //         .to({ y: 100 }, 1000);
        // }

        let title
        if (this.infodata && this.infodata.length > 0) {
            if (this.n >= this.infodata.length) {
                this.n = 0;
            }
            title = this.infodata[this.n].title;
            this.info_label2.textFlow = <Array<egret.ITextElement>>[
                { text: "公告", style: { size: 28 } },
                { text: "\n" },
                { text: title },
            ]
            this.n++
            var rect: egret.Rectangle = this.info_label2.scrollRect;
            egret.Tween.get(rect)
                .set({ y: -100 })
                .to({ y: 0 }, 1000)
                .wait(2000).call(this.scr1, this)
                .to({ y: 100 }, 1000);
        }
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
        NewHelp.getOwnDuck();                                                       //获取自己鸭子
    }


    //查询自己菜园果树回调
    private requestgetOwnTree(data): void {
        Datamanager.savenowfrienddata(null);                //清空当前好友数据
        if (data.data[0]) {
            if (data.data[0].canReceive == "true") {
                Datamanager.saveOwncaiyuandata(data.data[0])
                let peisonglabel = "免费获得" + "\n" + data.data[0].treeName + "一箱!"
                SceneManager.sceneManager._stage.removeChildren();
                let image = new eui.Image();
                image.texture = RES.getRes("bgday_caiyuan_png");
                image.height = 1344;
                let prompt = new PromptJump(peisonglabel);
                SceneManager.sceneManager._stage.addChild(image);
                SceneManager.sceneManager._stage.addChild(prompt);
                return
            }
        }
        SceneManager.sceneManager.StageItems.currentState = "havetree"              //表现为自己农场
        console.log("自己果树", data)
        let treedata = data.data[0];
        Datamanager.saveOwncaiyuandata(treedata);                                   //保存自己菜园果树数据
        Datamanager.saveNowtreedata(treedata);                                      //保存当前果树数据
        NewHelp.showpickgro(treedata);                                              //是否显示摘果按钮
        this.datainit(treedata);                                                    //数据初始化显示
        if (treedata) {
            HttpRequest.imageloader(Config.picurl + treedata.seedIcon, SceneManager.sceneManager.StageItems.fruit_img);
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
            SceneManager.notreePropmt("还没有种树哦，点击种树");
            NewHelp.getseed();
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
        if (Datamanager.getNowtreedata()) {
            let frienddata = Datamanager.getfrienddataByuser(Datamanager.getNowtreedata().userName)
            if (frienddata) {
                Datamanager.savenowfrienddata(frienddata);
            }
        }
        NewHelp.CheckStealGood();                                                   //检查是否能偷果
        NewHelp.checkSteal(data);                                                   //检查是否能偷水
        this.progress.slideDuration = 0;
        this.progress.value = 0;
        this.datainit(data);                                                        //数据初始化显示
        NewHelp.getDuckByUserId();                                              //获取好友鸭子
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

        // //   好友列表定位
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
            this.bg.texture = RES.getRes("bgnight_caiyuan_png");               //背景图片
        } else if (hour < 18 || hour > 5) {
            this.bg.texture = RES.getRes("bgday_caiyuan_png");             //背景图片
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


}