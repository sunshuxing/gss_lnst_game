class TaskScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(MaskEvent.REMOVED_FROM_STAGE, this.closeScene, this)
        this.skinName = "resource/skins/TaskSkins.exml";
    }

    private scr_task: eui.Scroller;      //任务列表滑动框
    private list_task: eui.List;         //任务列表
    public taskdata;                    //任务数据（经过修改的）
    public timerList: Array<any> = []       //定时器列表
    private common_problem: eui.Group       //常见问题



    protected childrenCreated(): void {
        super.childrenCreated()
        this.common_problem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickCommonProblem, this)
        this.scr_task.verticalScrollBar = null;
    }

    /**
     * 显示阶段
     */
    private onAdded(): void {
    }

    /**
     * 
     */
    private clickCommonProblem() {
        sessionStorage.setItem("fromgame", "true");
        location.href = Config.webHome + "view/common-problem.html"
    }


    //关闭该场景
    private closeScene() {
        // let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        // this.parent.dispatchEvent(Removemask);
        // SceneManager.toMainScene();
        NewHelp.removemask()
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this.timerList && this.timerList.length > 0) {
            for (let a = 0; a < this.timerList.length; a++) {
                clearInterval(this.timerList[a]);
            }
        }
    }



    /**
     * 初始化任务数据
     */
    public taskDataInit(func?: Function) {
        MyRequest._post("game/getTaskList", null, this, this.Req_getTaskList.bind(this, func), null);//获取任务列表
    }



    /**
     * 初始化任务数据
     */
    private Req_getTaskList(func: Function, data): void {
        var Data = data;
        this.taskdata = Data.data
        MyRequest._post("game/getTaskFinish", null, this, this.Req_initFinishTask.bind(this, func), null);//获取完成任务列表（包含领取/未领取任务），用于显示按钮状态
    }

    private hasTimer = false;


    /**
     * 遍历完成任务，统计完成数量，如果有可领取奖励任务，则标记
     */
    private Req_initFinishTask(func: Function, data): void {
        var Data = data;
        let finishList: Array<TaskFinished> = Data.data;
        let map: { [key: string]: Task } = {};//创建一个map，用于存放任务列表
        let mapKey: string[] = []; //和map一起使用的数组


        if (finishList) {//当有完成数据时遍历
            for (let a = 0; a < finishList.length; a++) {
                if (!finishList[a].taskId) {
                    continue;
                }
                let tf = map[finishList[a].taskId]
                if (!tf) {
                    let test = new BodyMenuShareAppMessage()
                    var Task = function () { };         //防止报错写法
                    let task = new Task()
                    task.finishCount = 1;
                    if (!(finishList[a].beenReceive == "true" ? true : false)) {//如果某个任务可以领取，则标记
                        task.needReceive = true;
                        task.finishedId = finishList[a].id//领取用的任务完成id
                    }
                    task.lastFinishedTime = finishList[a].createDate
                    map[finishList[a].taskId] = task
                    mapKey.push(finishList[a].taskId) //遍历map用的数组
                } else {
                    tf.finishCount++    //增加完成任务次数
                    if (!(finishList[a].beenReceive == "true" ? true : false)) {//如果某个任务可以领取，则标记
                        tf.needReceive = true;
                        tf.finishedId = finishList[a].id//领取用的任务完成id
                    }

                }
            }
            //判断统计出来的次数有没有>=限制，并且判断当前按钮为（0可完成1可领取2无法完成）
            let taskList: Array<Task> = this.taskdata
            let hasFinish = false;
            let hasShare = false;
            if (mapKey && mapKey.length > 0) {//有的时候才循环map
                for (let a = 0; a < mapKey.length; a++) {
                    let finishId = mapKey[a];
                    let completeTask = map[mapKey[a]];//完成的任务记录
                    for (let b = 0; b < taskList.length; b++) {
                        let nowTask = taskList[b]
                        if (nowTask.id == finishId) {
                            //当前完成的任务就是该任务
                            nowTask.finishCount = map[mapKey[a]].finishCount
                            nowTask.needReceive = map[mapKey[a]].needReceive

                            //判断按钮状态
                            if (nowTask.needReceive) {
                                nowTask.btnStatus = 1
                                hasFinish = true;
                                nowTask.finishedId = completeTask.finishedId    //领取奖励用的id
                            } else if (nowTask.limitTime && parseInt(nowTask.limitTime) > 0 && nowTask.finishCount >= nowTask.limitTime) {
                                nowTask.btnStatus = 2
                            }
                            //如果当前的任务存在限制次数并且有间隔时间
                            else if (nowTask.timeInterval && parseInt(nowTask.timeInterval) > 0 && nowTask.limitTime && parseInt(nowTask.limitTime) > 1) {
                                nowTask.lastFinishedTime = map[mapKey[a]].lastFinishedTime
                                //计算出还有多少秒，并且展示xx：xx：xx后可领取
                                let finishTime = nowTask.lastFinishedTime.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
                                nowTask.intervalCancleTime = new Date(new Date(finishTime).getTime() + 60 * nowTask.timeInterval * 1000).getTime()//用于元素自己遍历处理
                                let str = this.dateDif(nowTask.intervalCancleTime, null)


                                if (str != "-1") {
                                    nowTask.btnStatus = 3
                                    if (!this.hasTimer) {
                                        //创建一个定时器，当任务被隐藏后刷新、完成直接领取任务
                                        this.hasTimer = true;
                                        setTimeout(() => {
                                            let isHide = !SceneManager.instance._stage.contains(SceneManager.instance.getTaskScene())//判断任务列表是否被隐藏
                                            this.hasTimer = false;
                                            if (isHide) {
                                                SceneManager.instance.getTaskScene().taskDataInit(SceneManager.instance.StageItems.checktask)
                                            }
                                        }, parseInt(nowTask.intervalCancleTime) - new Date().getTime())

                                    }
                                } else {
                                    nowTask.btnStatus = 0
                                }
                            }
                            else {
                                nowTask.btnStatus = 0
                            }
                            //如果当前任务是分享任务，则默认完成（目前不分享，直接完成）
                            if (nowTask.code == "share_orchard") {
                                hasShare = true;
                                if (nowTask.btnStatus == 0) {
                                    this.completeShareTask();
                                    hasFinish = true;
                                }
                            }
                            break;
                        }
                    }
                }
                this.taskdata = taskList
                Datamanager.savetaskdata(this.taskdata);
            }
            //如果还未完成分享任务（当前不分享，直接完成）则直接完成
            if (!hasShare) {
                this.completeShareTask();
                hasFinish = true;
            }
            if (func && typeof func === "function") {
                func(hasFinish)
            }
        }
        this.init();//构建好数据后初始化
        // SceneManager.instance.getSigninScene().checkLookReward();                                   //重新检查阅读奖励
    }
    private canPost = true;
    public completeShareTask() {
        let data = {
            taskCode: "share_orchard",
        }
        if (this.canPost) {
            let that = this
            MyRequest._post("game/completeTask", data, this, () => {
                that.canPost = true;
                that.taskDataInit()
            }, null);
            this.canPost = false;
        }
    }

    //计算时间相差
    dateDif(timeInterval: number, timer: any): string {
        var date = timeInterval - new Date().getTime();
        var days = date / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days);
        var hours = date / 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound = Math.floor(hours);
        var minutes = date / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound = Math.floor(minutes);
        var seconds = date / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        var secondsRound = Math.floor(seconds);
        let timeStr = "";

        let hoursStr
        let minutesStr
        let secondsStr
        if (hoursRound >= 0 && hoursRound < 10) {
            hoursStr = "0" + hoursRound
        } else {
            hoursStr = hoursRound
        }
        if (minutesRound >= 0 && minutesRound < 10) {
            minutesStr = "0" + minutesRound
        } else {
            minutesStr = minutesRound
        }
        if (secondsRound >= 0 && secondsRound < 10) {
            secondsStr = "0" + secondsRound
        } else {
            secondsStr = secondsRound
        }

        if (date <= 0) {
            if (timer) {
                clearInterval(timer)
            }
            return "-1"
        } else if (hoursRound >= 0) {
            timeStr = hoursStr + ":" + minutesStr + ":" + secondsStr
        } else if (minutesRound >= 0) {
            timeStr = "00:" + minutesStr + ":" + secondsStr;
        } else if (secondsStr > 0) {
            timeStr = "00:00:" + secondsStr;
        } else {
            return "-1"
        }
        return timeStr

    }

    //请求错误
    private onGetIOError(event: egret.IOErrorEvent): void {
        console.log("get error : " + event);
    }

    //初始化页面
    private init() {
        let euiArr: eui.ArrayCollection = new eui.ArrayCollection(this.taskdata)
        // 把list_hero数据源设置成euiArr
        this.list_task.dataProvider = euiArr;
        // 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
        this.list_task.itemRenderer = taskList_item;
    }

}


class taskList_item extends eui.ItemRenderer {
    private old_data: any;
    private icon_task: eui.Image;            //任务icon
    private name_task: eui.Label;            //任务名称
    private description_task: eui.Label;     //任务说明
    private can_finish: eui.Group;           //任务按钮(去完成)
    private receive: eui.Image;              //任务按钮(去领取)
    private ban: eui.Group;                  //任务按钮(不可完成)
    private can_look: eui.Group;             //任务按钮（再逛逛）
    private interval_time: eui.Label          //任务冷却

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/TaskListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
        this.can_finish.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.completetask(this.data.code, this.data.id)
        }, this)
        this.receive.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.receiveTask(this.data.finishedId)
        }, this)
        this.ban.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.banFinish()
        }, this)
        this.can_look.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.look(this.data.code)
        }, this)
    }
    private onComplete() {

    }

    /**
     * 禁止执行任务
     */
    private banFinish() {
        SceneManager.addNotice("今天已经完成限定次数了哦！")
    }

    /**
     * 点击领取按钮触发事件
     */
    private receiveTask(taskFinishedId) {
        let data = {
            taskFinishedId: taskFinishedId
        }

        MyRequest._post("game/receiveTask", data, this, this.completeReceive.bind(this), null)
    }
    /**
     * 领取完成更新父组件数据
     */
    private completeReceive(data) {
        data = data.data;
        //0水滴1道具2爱心值3化肥 获取称呼
        let info = "";
        if (data.propType == "0") {
            info = "g";
        } else if (data.propType == "1") {
            info = "个";
        } else if (data.propType == "2") {
            info = "个"
        } else if (data.propType == "3") {
            info = "袋"
        }
        SceneManager.addNotice("获得" + data.propName + data.propNum + info, 2000)
        SceneManager.instance.getTaskScene().taskDataInit(SceneManager.instance.StageItems.checktask)
        SceneManager.instance.getSigninScene().checkLookReward();
        NewHelp.updateprop();
    }

    // 当数据改变时，更新视图
    protected dataChanged() {
        HttpRequest.imageloader(Config.picurl + this.data.icon, this.icon_task);
        this.name_task.text = this.data.name;
        this.description_task.text = "赠送" + this.data.rewardRule.name + "," + this.getlimitTime(this.data.limitTime);
        // this.can_finish.texture = RES.getRes(this.getbtnBycode(this.data.code));
        this.currentState = this.getItemBtnStatus(this.data.btnStatus, this.data.code)
        let parent = SceneManager.instance.getTaskScene()
        if (this.data.btnStatus == 3) {
            //以500毫秒的速度执行（可以避免方法执行速度慢会影响展示效果的情况）
            var time = 1000;
            let nowTask = this.data
            let that = this
            //预先执行一次
            let text = parent.dateDif(nowTask.intervalCancleTime, null)
            if (text == "-1") {
                if (this.data.code == "share_orchard") {
                    parent.completeShareTask()
                }
                this.currentState = "can_finish"
            } else {
                this.interval_time.text = text + "可领取"
            }
            let timer = setInterval(() => {
                let text = parent.dateDif(nowTask.intervalCancleTime, timer)
                if (text == "-1") {
                    if (this.data.code == "share_orchard") {
                        parent.completeShareTask()
                    }
                    this.currentState = "can_finish"
                } else {
                    that.interval_time.text = text + "可领取"
                }
            }, time);
            SceneManager.instance.getTaskScene().timerList.push(timer)
        }
    }

    /**
     * （0可完成1可领取2无法完成）
     */
    private getItemBtnStatus(btnStatus, code) {
        if (btnStatus == 0) {
            return "can_finish"
        } else if (btnStatus == 1) {
            return "receive"
        } else if (btnStatus == 2 && code == "browse_goods") {
            return "can_look"
        } else if (btnStatus == 2) {
            return "ban"
        } else if (btnStatus == 3) {
            return "interval"
        }
    }


    //获得次数
    private getlimitTime(limittime) {
        if (limittime == 0) {
            return "次数不限"
        }
        else {
            return "限领" + limittime + "次"
        }
    }

    //Invitation_friend(邀请朋友),share_orchard(分享果园),browse_goods(浏览商品),any_order(任意下单),specifiy_order(指定下单)
    /**
     * 点击去完成按钮事件
     */
    private completetask(code, id?) {
        switch (code) {
            case 'browse_goods': {
                if (SceneManager.instance.isMiniprogram) {
                    wx.miniProgram.navigateTo({
                        url: "/pages/game/browseGoods?listType=1&isFinished=false"
                    })
                } else {
                    sessionStorage.setItem("fromgame", "true");
                    location.href = Config.webHome + "view/game-browse-goods.html?listType=1&isFinished=false"
                }
            }
                break;
            case 'Invitation_friend': {
                SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
                this.tojump(true, "sharetexttree_png");

                if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
                    let url = SceneManager.instance.weixinUtil.shareData.shareUrl
                    let addFriend = MyRequest.geturlstr("addFriend", url)
                    if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
                        SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
                        SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
                    } else {
                        SceneManager.instance.weixinUtil.shareData.titles = "【果说说农场】邀请你一起种水果，亲手种，免费送到家"
                        SceneManager.instance.weixinUtil.shareData.describes = "种上一棵树，经营一座农场，开启舌尖上的旅行--果说说"
                    }
                    SceneManager.instance.weixinUtil._openShare();
                } else {
                    let info
                    if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
                        info = "【果实熟了】快来、快来帮我摘水果。"
                    } else {
                        info = "【说说农场】一起种水果，亲手种，免费送到家。"
                    }
                    let data = {
                        addFriend: true,
                        title: info
                    }
                    SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
                    // let sharegroup = new eui.Group();
                    // sharegroup.width = 500;
                    // sharegroup.height = 400;
                    // let bg = new eui.Image();
                    // bg.texture = RES.getRes("sharebg_jpg");
                    // sharegroup.addChild(bg);
                    // let img = new eui.Image();
                    // img.horizontalCenter = 0;
                    // img.width = 275;
                    // img.height = 275;
                    // img.y = 49;
                    // HttpRequest.imageloader(Config.picurl + Help.getOwnData().stageObj.stageImage, img, null, () => {
                    //     sharegroup.addChild(img);
                    //     let name = new eui.Label();
                    //     name.y = 247;
                    //     name.horizontalCenter = -87;
                    //     name.textColor = 0x7a6934;
                    //     name.fontFamily = "Microsoft YaHei";
                    //     name.bold = true;
                    //     name.size = 16;
                    //     name.text = Help.getOwnData().treeName;
                    //     sharegroup.addChild(name);
                    //     name.textAlign = "center";
                    //     name.verticalAlign = "middle";
                    //     Help.Screencapture(sharegroup, Help.getOwnData(), true)
                    // }, this)
                }
            }
                break;
            case 'share_orchard': {
                SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
                this.tojump(true, "share_png")
            }
                break;
            case 'any_order': {
                if (SceneManager.instance.isMiniprogram) {
                    //小程序端口taskCode要做参数发送
                    wx.miniProgram.navigateTo({
                        url: "/pages/game/browseGoods?listType=2&backGame=true&taskCode=" + id
                    })
                } else {
                    sessionStorage.setItem("fromgame", "true");
                    sessionStorage.setItem("taskCode", id);
                    location.href = Config.webHome + "view/game-browse-goods.html?listType=2"
                }
            }
                break;
            case 'specifiy_order': {
                if (SceneManager.instance.isMiniprogram) {
                    //小程序端口taskCode要做参数发送
                    wx.miniProgram.navigateTo({
                        url: "/pages/game/browseGoods?listType=0&backGame=true&taskCode=" + id
                    })
                } else {
                    sessionStorage.setItem("fromgame", "true");
                    sessionStorage.setItem("taskCode", id);
                    location.href = Config.webHome + "view/game-browse-goods.html?listType=0"
                }
            }
                break;
            case 'read_knowledge': {
                let baikeScene = new BaikeScene();
                SceneManager.sceneManager._stage.addChild(baikeScene)
            }
                break
        }
    }

    private look(code) {
        switch (code) {
            case 'browse_goods': {
                if (SceneManager.instance.isMiniprogram) {
                    wx.miniProgram.navigateTo({
                        url: "/pages/game/browseGoods?listType=1&isFinished=true"
                    })
                } else {
                    location.href = Config.webHome + "view/game-browse-goods.html?listType=1&isFinished=true"
                }
            }
                break;
        }
    }

    //跳转场景
    private tojump(needCloseTask: boolean, image: string) {
        if (needCloseTask) {
            SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVEMASK)
        }
        SceneManager.addJump(image);
    }

}