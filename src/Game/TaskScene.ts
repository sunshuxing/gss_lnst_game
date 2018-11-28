class TaskScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this)
        this.addEventListener(MaskEvent.REMOVED_FROM_STAGE,this.closeScene,this)
        this.skinName = "resource/skins/TaskSkins.exml";
    }

    private scr_task: eui.Scroller;      //任务列表滑动框
    private list_task: eui.List;         //任务列表
    private btn_close: eui.Image;        //关闭按钮  
    private taskdata;                    //任务数据（经过修改的）



    protected childrenCreated(): void {
        super.childrenCreated()
    }

    /**
     * 显示阶段
     */
    private onAdded(): void {
        this.taskDataInit();
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeScene, this)
        this.scr_task.verticalScrollBar = null;
    }


    //关闭该场景
    private closeScene() {
        let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        this.parent.removeChild(this);
    }



    /**
     * 初始化任务数据
     */
    public taskDataInit() {
        MyRequest._post("game/getTaskList", null, this, this.Req_getTaskList.bind(this), null);//获取任务列表
    }



    /**
     * 初始化任务数据
     */
    private Req_getTaskList(data): void {
        var Data = data;
        this.taskdata = Data.data
        MyRequest._post("game/getTaskFinish", null, this, this.Req_initFinishTask.bind(this), null);//获取完成任务列表（包含领取/未领取任务），用于显示按钮状态
    }


    /**
     * 遍历完成任务，统计完成数量，如果有可领取奖励任务，则标记
     */
    private Req_initFinishTask(data): void {
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
            if (mapKey && mapKey.length > 0) {//有的时候才循环map
                for (let a = 0; a < mapKey.length; a++) {
                    let finishCode = mapKey[a];
                    let completeTask = map[mapKey[a]];//完成的任务记录
                    for (let b = 0; b < taskList.length; b++) {
                        if (taskList[b].code == finishCode) {
                            //当前完成的任务就是该任务
                            taskList[b].finishCount = map[mapKey[a]].finishCount
                            taskList[b].needReceive = map[mapKey[a]].needReceive
                            //判断按钮状态
                            if (taskList[b].needReceive) {//可领取
                                taskList[b].btnStatus = 1
                                taskList[b].finishedId = completeTask.finishedId    //领取奖励用的id
                            } else if (taskList[b].limitTime > 0 && taskList[b].finishCount >= taskList[b].limitTime) {
                                taskList[b].btnStatus = 2
                            } else {
                                taskList[b].btnStatus = 0
                            }
                            break;
                        }
                    }
                }
                this.taskdata = taskList
            }
        }
        console.log("构建数据", this.taskdata)
        this.init();//构建好数据后初始化
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
    private receive: eui.Image;               //任务按钮(去领取)
    private ban: eui.Image;                   //任务按钮(不可完成)
    private can_look: eui.Image;             //任务按钮（再逛逛）

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
        SceneManager.instance.taskScene.dispatchEventWith(egret.Event.ADDED_TO_STAGE)   //使用manager获取场景并触发事件
    }

    // 当数据改变时，更新视图
    protected dataChanged() {
        this.bg_task.texture = RES.getRes(this.getbgBycode(this.data.code));
        this.icon_task.texture = RES.getRes(this.geticonBycode(this.data.code));
        this.name_task.text = this.data.name;
        this.description_task.text = "赠送" + this.data.rewardRule.name + "," + this.getlimitTime(this.data.limitTime);
        // this.can_finish.texture = RES.getRes(this.getbtnBycode(this.data.code));
        this.currentState = this.getItemBtnStatus(this.data.btnStatus,this.data.code)
    }

    /**
     * （0可完成1可领取2无法完成）
     */
    private getItemBtnStatus(btnStatus,code) {
        if (btnStatus == 0) {
            return "can_finish"
        } else if (btnStatus == 1) {
            return "receive"
        }else if(btnStatus == 2 &&  code == "browse_goods"){
            return "can_look"
        } else if (btnStatus == 2) {
            return "ban"
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
                location.href = Config.webHome + "view/index.html"
                console.log("任意下单")
            }
                break;
            case 'specifiy_order': {
                location.href = Config.webHome + "view/game-browse-goods.html?listType=0"
                console.log("指定下单")
            }
                break;
        }
    }

    private look(code){
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