class TaskScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(MaskEvent.REMOVED_FROM_STAGE, this.closeScene, this)
        this.skinName = "resource/skins/TaskSkins.exml";
    }

    private scr_task: eui.Scroller;      //任务列表滑动框
    private list_task: eui.List;         //任务列表
    private btn_close: eui.Image;        //关闭按钮  
    private taskdata;                    //任务数据（经过修改的）
    public timerList: Array<any> = []              //定时器列表
    private common_problem: eui.Label       //常见问题



    protected childrenCreated(): void {
        super.childrenCreated()
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeScene, this)
        this.common_problem.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clickCommonProblem,this)
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
    private clickCommonProblem(){
        console.log("常见问题")
    }


    //关闭该场景
    private closeScene() {
        let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
        if (this.timerList && this.timerList.length > 0) {
            for (let a = 0; a < this.timerList.length; a++) {
                clearInterval(this.timerList[a]);
            }
        }
    }



    /**
     * 初始化任务数据
     */
    public taskDataInit(func?:Function) {
        MyRequest._post("game/getTaskList", null, this, this.Req_getTaskList.bind(this,func), null);//获取任务列表
    }



    /**
     * 初始化任务数据
     */
    private Req_getTaskList(func:Function,data): void {
        var Data = data;
        this.taskdata = Data.data
        MyRequest._post("game/getTaskFinish", null, this, this.Req_initFinishTask.bind(this,func), null);//获取完成任务列表（包含领取/未领取任务），用于显示按钮状态
    }


    /**
     * 遍历完成任务，统计完成数量，如果有可领取奖励任务，则标记
     */
    private Req_initFinishTask(func:Function,data): void {
        var Data = data;
        let finishList: Array<TaskFinished> = Data.data;
        let map: { [key: string]: Task } = {};//创建一个map，用于存放任务列表
        let mapKey: string[] = []; //和map一起使用的数组


        if (finishList) {//当有完成数据时遍历
            for (let a = 0; a < finishList.length; a++) {
                let tf = map[finishList[a].taskCode]
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
                    map[finishList[a].taskCode] = task
                    mapKey.push(finishList[a].taskCode) //遍历map用的数组
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
            if (mapKey && mapKey.length > 0) {//有的时候才循环map
                for (let a = 0; a < mapKey.length; a++) {
                    let finishCode = mapKey[a];
                    let completeTask = map[mapKey[a]];//完成的任务记录
                    for (let b = 0; b < taskList.length; b++) {
                        let nowTask = taskList[b]
                        if (nowTask.code == finishCode) {
                            //当前完成的任务就是该任务
                            nowTask.finishCount = map[mapKey[a]].finishCount
                            nowTask.needReceive = map[mapKey[a]].needReceive

                            //判断按钮状态
                            if (nowTask.needReceive) {//可领取//*** */
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
                                } else {
                                    nowTask.btnStatus = 0
                                }

                            }
                            else {
                                nowTask.btnStatus = 0
                            }
                            break;
                        }
                    }
                }
                this.taskdata = taskList

            }
            if(hasFinish){
                func(true)
            }
        }
        console.log("构建数据", this.taskdata)
        this.init();//构建好数据后初始化
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
    private bg_task: eui.Image;              //任务背景
    private icon_task: eui.Image;            //任务icon
    private name_task: eui.Label;            //任务名称
    private description_task: eui.Label;     //任务说明
    private can_finish: eui.Image;           //任务按钮(去完成)
    private receive: eui.Image;              //任务按钮(去领取)
    private ban: eui.Image;                  //任务按钮(不可完成)
    private can_look: eui.Image;             //任务按钮（再逛逛）
    private interval_time: eui.Label          //任务冷却

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/TaskListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
        this.can_finish.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.completetask(this.data.code)
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
        } else if (data.propType == "0") {
            info = "个";
        } else if (data.propType == "0") {
            info = "个"
        } else if (data.propType == "0") {
            info = "袋"
        }
        SceneManager.addNotice("获得" + data.propName + data.propNum + info, 2000)
        SceneManager.instance.taskScene.taskDataInit()
        let evt: PuticonEvent = new PuticonEvent(PuticonEvent.TASKFINSHED);
        SceneManager.instance.mainScene.dispatchEvent(evt)
    }

    // 当数据改变时，更新视图
    protected dataChanged() {
        this.bg_task.texture = RES.getRes(this.getbgBycode(this.data.code));
        this.icon_task.texture = RES.getRes(this.geticonBycode(this.data.code));
        this.name_task.text = this.data.name;
        this.description_task.text = "赠送" + this.data.rewardRule.name + "," + this.getlimitTime(this.data.limitTime);
        // this.can_finish.texture = RES.getRes(this.getbtnBycode(this.data.code));
        this.currentState = this.getItemBtnStatus(this.data.btnStatus, this.data.code)
        let parent = SceneManager.instance.taskScene
        if (this.data.btnStatus == 3) {
            //以500毫秒的速度执行（可以避免方法执行速度慢会影响展示效果的情况）
            var time = 1000;
            let nowTask = this.data
            let that = this
            //预先执行一次
            let text = parent.dateDif(nowTask.intervalCancleTime, null)
            if (text == "-1") {
                this.currentState = "can_finish"
            } else {
                this.interval_time.text = text + "后可开启"
            }
            let timer = setInterval(() => {
                let text = parent.dateDif(nowTask.intervalCancleTime, timer)
                if (text == "-1") {
                    this.currentState = "can_finish"
                } else {
                    that.interval_time.text = text + "后可开启"
                }
            }, time);
            SceneManager.instance.taskScene.timerList.push(timer)
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
    private completetask(code) {
        switch (code) {
            case 'browse_goods': {
                location.href = Config.webHome + "view/game-browse-goods.html?listType=1&isFinished=false"
            }
                break;
            case 'Invitation_friend': {
                SceneManager.instance.taskScene.dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
                this.tojump(true)
            }
                break;
            case 'share_orchard': {
                SceneManager.instance.taskScene.dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
                this.tojump(true)
            }
                break;
            case 'any_order': {
                location.href = Config.webHome + "view/game-browse-goods.html?listType=2"
            }
                break;
            case 'specifiy_order': {
                location.href = Config.webHome + "view/game-browse-goods.html?listType=0"
            }
                break;
        }
    }

    private look(code) {
        switch (code) {
            case 'browse_goods': {
                location.href = Config.webHome + "view/game-browse-goods.html?listType=1&isFinished=true"
            }
                break;
        }
    }

    //跳转场景
    private tojump(needCloseTask: boolean) {
        if (needCloseTask) {
            SceneManager.instance.taskScene.dispatchEventWith(MaskEvent.REMOVEMASK)
        }
        SceneManager.addJump();
    }

    //获得背景图片
    private getbgBycode(code) {
        if (code == "browse_goods") {
            return "task-bg-blue"
        }
        if (code == "share_orchard") {
            return "task-bg-red"
        }
        if (code == "Invitation_friend") {
            return "task-bg-zi"
        }
        if (code == "any_order") {
            return "task-bg-green"
        }
        if (code == "specifiy_order") {
            return "task-bg-fen"
        }

    }
    //获得任务图标
    private geticonBycode(code) {
        if (code == "browse_goods") {
            return "icon-liulan"
        }
        if (code == "share_orchard") {
            return "icon-share"
        }
        if (code == "Invitation_friend") {
            return "icon-friend"
        }
        if (code == "any_order") {
            return "icon-anyorder"
        }
        if (code == "specifiy_order") {
            return "icon-order"
        }
    }

}