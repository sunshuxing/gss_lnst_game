class SceneManager {
    public _stage: egret.DisplayObjectContainer // 设置所有场景所在的舞台(根)

    public mainScene: MainScene                  //主场景
    private interactiveScene: InteractiveScene    //互动场景
    private taskScene: TaskScene                  //任务场景
    private dynamicScene: DynamicScene            //动态场景
    private signinScene: SigninScene              //领取种子场景
    private huafeiScene: HuafeiScene              //化肥场景
    private friendSign: string                    //转发用户的标识，可以用于奖励道具
    private weixinUtil: WeixinUtil                //微信操作类
    private webSocket: GameWebSocket                  //推送类
    private userid = MyRequest.geturlstr("friendSign");
    public connectTime: number = 0;                  //重连次数
    private interval                            //定时器
    public jumpMark: JumpScene                       //分享遮罩

    public isMiniprogram: Boolean;                //当前是否是小程序运行


    constructor() {
        this.weixinUtil = WeixinUtil.getInstance();
        this.friendSign = MyRequest.geturlstr("friendSign")
    }
    public getMainScene():MainScene{
        if(!this.mainScene){
            this.mainScene = new MainScene();
        }
        return this.mainScene;
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
            if (this.friendSign != this.weixinUtil.login_user_id) {
                //如果分享的用户和当前用户不一样
                this.mainScene.getFriends(this.userid)
                this.userid = null;
            }
        }
    }
    private loadFirend() {
        if (WeixinUtil.prototype._friendSign == MyRequest.geturlstr("friendSign")) {
            this.mainScene.getFriends();  //加好友成功需要刷新好友列表
        }
        else {
            this.mainScene.getFriends(this.userid)
            this.userid = null;
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
     * 删除其他场景
     * @param scene 不需要删除的场景
     */
    private removeOther(scene) {
        this.huafeiScene = this.getHuafeiScene()
        let arr = [this.interactiveScene, this.taskScene, this.dynamicScene, this.signinScene, this.huafeiScene]
        arr.forEach((item) => {
            if (scene === item) {
                return
            }
            if (item && item.parent) {
                this.mainScene.removeChild(item)
            }
        })
    }

    /**
     * 主场景
     */
    static toMainScene() {
        this.instance.mainScene = this.instance.getMainScene()
        let stage: egret.DisplayObjectContainer = this.instance._stage // (根) 舞台
        let mainScene = SceneManager.instance.mainScene; // 主场景
        mainScene.y = stage.height - mainScene.height;
        // 判断主场景是否有父级(如果有,说明已经被添加到了场景中)
        if (!mainScene.parent) {
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(mainScene)
        }
        SceneManager.instance.removeOther(SceneManager.instance.mainScene)
    }

    /**
     * 互动场景
     */
    static toInteractiveScene() {
        if (!this.instance.interactiveScene) {
            this.instance.interactiveScene = new InteractiveScene();
        }
        this.instance.removeOther(this.instance.interactiveScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.interactiveScene)
        egret.Tween.get(this.instance.interactiveScene)
            .set(this.instance.interactiveScene.y = 1208)
            .to({ y: 0 }, 500);
    }


    /**
     * 任务场景
     */
    static toTaskScene() {
        this.instance.taskScene = this.instance.getTaskScene()
        this.instance.removeOther(this.instance.taskScene)
        // 把互动场景添加到主场景中
        this.instance.taskScene.y = 1208
        this.instance.mainScene.addChild(this.instance.taskScene)
        this.instance.taskScene.taskDataInit();
        this.instance.taskScene.cacheAsBitmap = true;
        egret.Tween.get(this.instance.taskScene)
            .to({ y: 0 }, 500);
    }

    /**
     * 动态场景
     */
    static toDynamicScene(treeUserId: string) {
        this.instance.dynamicScene = this.instance.getDynamicScene()
        this.instance.removeOther(this.instance.dynamicScene)
        // 把互动场景添加到主场景中
        this.instance.dynamicScene.searchDynamic(treeUserId)
        this.instance.mainScene.addChild(this.instance.dynamicScene)
        egret.Tween.get(this.instance.dynamicScene)
            .set({ y: 1208 })
            .to({ y: 0 }, 500);
    }


    /**
     * 签到场景
     */
    static toSigninScene() {
        this.instance.signinScene = this.instance.getSigninScene()
        this.instance.removeOther(this.instance.signinScene)
        // 把互动场景添加到主场景中
        this.instance.signinScene.y = (this.instance.mainScene.height - this.instance.signinScene.height) / 2;
        this.instance.mainScene.addChild(this.instance.signinScene)
    }

    static tohuafeiScene() {
        this.instance.removeOther(this.instance.huafeiScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.huafeiScene)
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
    //         this.instance.mainScene.removeChild(treeprompt)
    //     }
    //         , this);
    //     treeprompt.setPrompt(info);
    //     this.instance.mainScene.addChild(treeprompt);
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
        this.instance.mainScene.addChild(this.treepromptgro);
        this.treetimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.treepromptgro.removeChildren()
        }, this);
        this.treeprompt.x = 400;
        this.treeprompt.setPrompt(info);

        if (Help.getTreeUserData().stage == "1") {
            this.treeprompt.y = 900;
        }
        else {
            this.treeprompt.y = 580;
        }
        this.treepromptgro.addChild(this.treeprompt);
        this.treetimer.start();
    }

    /**
     * 添加提示框
     */

    static addPrompt(content, btn, ti) {
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
            this.instance.mainScene.addChild(loadingView)
            loadingView.y = this.instance.mainScene.height - loadingView.height
            await RES.loadGroup("guide", 0, loadingView)
            this.instance.mainScene.removeChild(loadingView)
            const guideView = new guideUI();
            this.instance.mainScene.addChild(guideView);
            guideView.y = this.instance.mainScene.height - guideView.height;
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