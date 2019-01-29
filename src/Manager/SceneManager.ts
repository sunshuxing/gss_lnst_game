class SceneManager {
    public _stage: egret.DisplayObjectContainer // 设置所有场景所在的舞台(根)

    public landId: number                            //当前土地id
    public isDistribution: boolean;                 //是否配送
    public isduckDistribution: boolean;              //是否是鸭子配送
    private interactiveScene: InteractiveScene    //互动场景
    private taskScene: TaskScene                  //任务场景
    private dynamicScene: DynamicScene            //动态场景
    private signinScene: SigninScene              //领取种子场景
    private huafeiScene: HuafeiScene              //化肥场景
    public friendSign: string                    //转发用户的标识，可以用于奖励道具
    public weixinUtil: WeixinUtil                //微信操作类
    private webSocket: GameWebSocket                  //推送类
    private userid = MyRequest.geturlstr("friendSign");
    public connectTime: number = 0;                  //重连次数
    private interval                            //定时器
    public jumpMark: JumpScene                       //分享遮罩

    public isMiniprogram: Boolean;                //当前是否是小程序运行
    public isPresent: boolean;
    public duihuanScene: DuihuanScene;
    public warehouseScene: WarehouseScene;

    //-----------------------------------------------------------------------------------------------------------------------------//
    public newmainScene: newMainScene;
    public StageItems: newStageItems;
    public newmain2Scene: newMain2Scene;


    constructor() {
        this.weixinUtil = WeixinUtil.getInstance();
        this.friendSign = MyRequest.geturlstr("friendSign")
    }

    public getInteractiveScene(): InteractiveScene {
        if (!this.interactiveScene) {
            this.interactiveScene = new InteractiveScene()
        }
        return this.interactiveScene;
    }

    public getTaskScene(): TaskScene {
        if (!this.taskScene) {
            this.taskScene = new TaskScene()
        }
        return this.taskScene;
    }

    public getDynamicScene(): DynamicScene {
        if (!this.dynamicScene) {
            this.dynamicScene = new DynamicScene();
        }
        return this.dynamicScene;
    }

    public getSigninScene(): SigninScene {
        if (!this.signinScene) {
            this.signinScene = new SigninScene()
        }
        return this.signinScene;
    }

    public getHuafeiScene(): HuafeiScene {
        if (!this.huafeiScene) {
            this.huafeiScene = new HuafeiScene();
        }
        return this.huafeiScene;
    }

    public getDuihuanScene(): DuihuanScene {
        if (!this.duihuanScene) {
            this.duihuanScene = new DuihuanScene();
        }
        return this.duihuanScene;
    }

    public getWarehouseScene(): WarehouseScene {
        if (!this.warehouseScene) {
            this.warehouseScene = new WarehouseScene();
        }
        return this.warehouseScene;
    }


	/**
     * 获取实例
     */
    static sceneManager: SceneManager
    static get instance() {
        if (!this.sceneManager) {
            this.sceneManager = new SceneManager()
        }
        return this.sceneManager
    }
    /**
     * 设置根场景
     */
    public setStage(s: egret.DisplayObjectContainer) {
        this._stage = s
    }

    public checkAddFriend() {
        let addFriend = MyRequest.geturlstr("addFriend")
        if (addFriend && addFriend == "true" && this.friendSign) {
            if (this.friendSign != this.weixinUtil.login_user_id) {
                //如果分享的用户和当前用户不一样，又需要加好友，则处理加好友
                let data = {
                    friendUser: this.friendSign
                }
                MyRequest._post("game/addFriend", data, this, this.loadFirend.bind(this), null)
            }
        } else {
            // if (this.friendSign != this.weixinUtil.login_user_id) {
            //     //如果分享的用户和当前用户不一样
            //     this.mainScene.getFriends(this.userid)
            //     this.userid = null;
            // }
        }
    }
    private loadFirend() {
        if (WeixinUtil.prototype._friendSign == MyRequest.geturlstr("friendSign")) {
            this.StageItems.getFriends();  //加好友成功需要刷新好友列表
        }
        else {
            this.StageItems.getFriends();
            // this.StageItems.getFriends(this.userid)
            // this.userid = null;
        }
    }

    /**
     * 提示消息显示在主场景
     * msg  消息
     * stage 要展示的舞台对象
     * time 显示持续时间（1000为1秒），不传默认1.5秒
     */
    static addNotice(msg: string, time?, msgflow?) {
        let notice: Notice = new Notice();

        if (!time) {
            time = 1500
        }
        let timer: egret.Timer = new egret.Timer(time, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.instance._stage.removeChild(notice)
        }
            , this);
        notice.msgInfo(msg, msgflow);
        this.instance._stage.addChild(notice);
        timer.start();
    }


    /**
     * 主场景（新）
     */
    static toNewMainScene() {
        if (this.instance.newmain2Scene && this.instance.newmain2Scene.parent) {
            this.instance.newmain2Scene.parent.removeChild(this.instance.newmain2Scene);
        }
        if (!this.instance.newmainScene) {
            this.instance.newmainScene = new newMainScene();
        }
        if (!this.instance.StageItems) {
            this.instance.StageItems = new newStageItems();
        }
        let stage: egret.DisplayObjectContainer = this.instance._stage // (根) 舞台
        let newmainScene = SceneManager.instance.newmainScene; // 主场景
        newmainScene.y = stage.height - newmainScene.height;
        // 判断主场景是否有父级(如果有,说明已经被添加到了场景中)
        if (!newmainScene.parent) {
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(newmainScene);
        }
        let newstageItems = SceneManager.instance.StageItems;   //
        newstageItems.y = stage.height - newstageItems.height;
        if (!newstageItems.parent) {
            stage.addChild(newstageItems);
        }
        else if (stage.getChildIndex(newstageItems) < stage.getChildIndex(newmainScene)) {
            stage.swapChildren(newstageItems, newmainScene);
        }
    }


    /**
     * 主场景2(新)
     */
    static toNewMain2Scene() {
        if (this.instance.newmainScene && this.instance.newmainScene.parent) {
            this.instance.newmainScene.parent.removeChild(this.instance.newmainScene);
        }
        if (!this.instance.newmain2Scene) {
            this.instance.newmain2Scene = new newMain2Scene();
        }
        if (!this.instance.StageItems) {
            this.instance.StageItems = new newStageItems();
        }
        let stage: egret.DisplayObjectContainer = this.instance._stage // (根) 舞台
        let newmain2Scene = SceneManager.instance.newmain2Scene; // 主场景
        newmain2Scene.y = stage.height - newmain2Scene.height;
        // 判断主场景是否有父级(如果有,说明已经被添加到了场景中)
        if (!newmain2Scene.parent) {
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(newmain2Scene);
        }
        let newstageItems = SceneManager.instance.StageItems;   //
        newstageItems.y = stage.height - newstageItems.height;
        if (!newstageItems.parent) {
            stage.addChild(newstageItems);
        }
        else if (stage.getChildIndex(newstageItems) < stage.getChildIndex(newmain2Scene)) {
            stage.swapChildren(newstageItems, newmain2Scene);
        }

    }

    /**
     * 判断进入哪个场景
     */

    static toWhereScene() {
        MyRequest._post("game/getOwnTree", null, this, this.requestgetOwnTree.bind(this), null);
    }

    static requestgetOwnTree(data) {
        console.log("所有果树数据", data)
        if (data.data.length == 0) {                                      //两块地都没有数据
            this.toNewMainScene();
            this.instance.newmainScene.getOwnTree();
        }
        else if (data.data.length == 2) {                     //两块地都有数据
            this.toNewMainScene();
            this.instance.newmainScene.getOwnTree();
        }
        else if (data.data.length == 1) {                     //只有一块地有数据
            if (data.data[0].landId == 1) {                   //果园有数据                      
                this.toNewMainScene();
                this.instance.newmainScene.getOwnTree();
            }
            else if (data.data[0].landId == 2) {              //菜园有数据
                this.toNewMain2Scene();
                this.instance.newmain2Scene.getOwnTree();
            }
        }
    }


    /**
     * 点赞兑换页面
     */

    static toDuihuanScene() {
        if (!this.instance.duihuanScene) {
            this.instance.duihuanScene = new DuihuanScene();
        }
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.duihuanScene)
    }

    /**
     * 仓库页面
     */

    static toWarehouseScene() {
        if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
            if (Datamanager.getPropdata()) {
                if (!this.instance.warehouseScene) {
                    this.instance.warehouseScene = new WarehouseScene();
                }
                else {
                    this.instance.warehouseScene.showprop();
                }
                NewHelp.addmask();
                this.instance._stage.addChild(this.instance.warehouseScene);
            }
        }
        else {
            SceneManager.addNotice("好友仓库暂未开放");
        }
    }


    /**
     * 互动场景
     */
    static toInteractiveScene() {
        if (!this.instance.interactiveScene) {
            this.instance.interactiveScene = new InteractiveScene();
        }
        // 把互动场景添加到主场景中
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.interactiveScene)
        let new_y = this.instance._stage.height - this.instance.interactiveScene.height;
        egret.Tween.get(this.instance.interactiveScene)
            .set(this.instance.interactiveScene.y = 1208)
            .to({ y: new_y }, 500);
    }


    /**
     * 任务场景
     */
    static toTaskScene() {
        this.instance.taskScene = this.instance.getTaskScene()
        // 把互动场景添加到主场景中
        this.instance.taskScene.y = 1208
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.taskScene)
        this.instance.taskScene.taskDataInit();
        this.instance.taskScene.cacheAsBitmap = true;
        let new_y = this.instance._stage.height - this.instance.taskScene.height;
        egret.Tween.get(this.instance.taskScene)
            .to({ y: new_y }, 500);
    }

    /**
     * 动态场景
     */
    static toDynamicScene(treedata) {
        if (!treedata) {
            SceneManager.addNotice("您还没有种树哦！");
            return;
        }
        this.instance.dynamicScene = this.instance.getDynamicScene()
        // 把互动场景添加到主场景中
        this.instance.dynamicScene.searchDynamic(treedata.id)
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.dynamicScene)
        let new_y = this.instance._stage.height - this.instance.dynamicScene.height;
        egret.Tween.get(this.instance.dynamicScene)
            .set({ y: 1208 })
            .to({ y: new_y }, 500);
        SceneManager.sceneManager.StageItems.dyn_red.visible = false;
    }


    /**
     * 签到场景
     */
    static toSigninScene() {
        this.instance.signinScene = this.instance.getSigninScene()
        // 把互动场景添加到主场景中
        this.instance.signinScene.y = (this.instance._stage.height - this.instance.signinScene.height) / 2;
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.signinScene)
    }


    //化肥场景
    static tohuafeiScene() {
        // 把互动场景添加到主场景中
        NewHelp.addmask();
        this.instance._stage.addChild(this.instance.huafeiScene)
        SceneManager.sceneManager.StageItems.huafei_red.visible = false;
    }


    /**
     * 添加弹窗，如果文字过多，则调整高度
     */
    // static addtreePrompt(info: string) {
    //     let treeprompt = new TreePrompt();
    //     treeprompt.y = 656;
    //     treeprompt.x = 208;
    //     if (info.length > 14) {
    //         let a = info.length / 14
    //         treeprompt.height = 66 + a * 30
    //         treeprompt.setBackHeight(a)
    //     }
    //     let timer: egret.Timer = new egret.Timer(3000, 1);
    //     timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
    //     }
    //         , this);
    //     treeprompt.setPrompt(info);
    //     timer.start();
    // }

    public static treetimer: egret.Timer = new egret.Timer(3000, 1);
    private static treeprompt: TreePrompt
    public static treepromptgro: eui.Group = new eui.Group();

    static addtreePrompt(info: string) {
        if (!this.treeprompt) {
            this.treeprompt = new TreePrompt();
        }
        this.treepromptgro.width = 750;
        this.treepromptgro.height = 1344;
        this.treepromptgro.touchThrough = true;
        this.instance.StageItems.addChild(this.treepromptgro);
        this.treetimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.treepromptgro.removeChildren()
        }, this);

        this.treeprompt.setPrompt(info);

        if (SceneManager.instance.landId == 1) {
            this.treeprompt.x = 400;
            if (Datamanager.getNowtreedata().stage == "1") {
                this.treeprompt.y = 900;
            }
            else {
                this.treeprompt.y = 580;
            }
        }
        else if (SceneManager.instance.landId == 2) {
            this.treeprompt.x = 350;
            if (Datamanager.getNowtreedata().stage == "1") {
                this.treeprompt.y = 1000;
            }
            else {
                this.treeprompt.y = 700;
            }
        }
        this.treepromptgro.addChild(this.treeprompt);
        this.treetimer.start();
    }

    /**
     * 添加提示框
     */

    static addPrompt(content, btn, ti) {
        NewHelp.addmask()
        let prompt = new Prompt();
        prompt.x = 85;
        prompt.y = 430;
        prompt.setPrompt(content, btn, ti);
        this.instance._stage.addChild(prompt);
    }

    static addJump(image: string) {
        this.instance.jumpMark = new JumpScene(image, SceneManager.instance.isMiniprogram)
        this.instance._stage.addChild(this.instance.jumpMark);
    }

    static async guiedResource() {
        try {
            const loadingView = new guideLoading();
            this.instance._stage.addChild(loadingView)
            loadingView.y = this.instance._stage.height - loadingView.height
            await RES.loadGroup("guide", 0, loadingView)
            this.instance._stage.removeChild(loadingView)
            const guideView = new guideUI();
            this.instance._stage.addChild(guideView);
            guideView.y = this.instance._stage.height - guideView.height;
        }
        catch (e) {
            console.error(e);
        }
    }

    public initWebSocket() {
        let user = this.weixinUtil.login_user_id
        let url = Config.socketHome + "?userId=" + user;
        this.webSocket = new GameWebSocket(url)
        let that = this
        if (!this.interval) {
            this.interval = setInterval(() => {
                if (this.webSocket.connected()) {
                    that.webSocket.sendData("1")
                } else {
                    this.connectTime = this.connectTime + 1
                    this.initWebSocket();
                }
            }, 10000)
        }

    }
}