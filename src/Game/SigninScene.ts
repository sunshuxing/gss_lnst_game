class SigninScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/QiandaoSkins.exml";
    }

    private qiandao_data;               //签到数据
    private itembg1: eui.Image;
    private itembg2: eui.Image;
    private itembg3: eui.Image;
    private itembg4: eui.Image;
    private itembg5: eui.Image;
    private itembg6: eui.Image;
    private signined1: eui.Group;
    private signined2: eui.Group;
    private signined3: eui.Group;
    private signined4: eui.Group;
    private signined5: eui.Group;
    private signined6: eui.Group;
    private signined7: eui.Group;
    private sgin1: eui.Group;
    private sgin2: eui.Group;
    private sgin3: eui.Group;
    private sgin4: eui.Group;
    private sgin5: eui.Group;
    private sgin6: eui.Group;
    private sgin7: eui.Group;
    private btn_answer: eui.Group;
    private btn_sign: eui.Group;
    private answer_btn1: eui.Image;
    private answer_btn2: eui.Image;
    private answer_look: eui.Group;
    private answer_dis1: eui.Label;
    private answer_dis2: eui.Label;
    private scr_gro: eui.Group;
    private answer_scr: eui.Scroller;
    private answer_problem: eui.Image;
    private close_btn: eui.Image;
    public answer_red: eui.Rect;
    public sign_red: eui.Rect;


    public canreward: boolean = true;


    protected childrenCreated(): void {
        super.childrenCreated();
        this.answer_scr.verticalScrollBar = null;
        this.getSignInInfo();
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2
        this.btn_sign.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeState, this)
        this.btn_answer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeState, this)
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { NewHelp.closescene() }, this)
        this.checkAnswerReward();
        // this.checkLookReward();
        this.addActItem();
    }

    private onComplete(): void {
        this.currentState = "sgin"
    }


    public addActItem() {
        this.scr_gro.removeChildren();
        this.scr_gro.addChild(this.answer_problem)
        let Taskdata = Datamanager.gettaskdataBytype(1)
        if (Taskdata) {
            let Actdata: Array<any> = Taskdata;
            for (let i = 0; i < Actdata.length; i++) {
                let act_group = new eui.Group;                  //活动容器
                let act_bg = new eui.Rect;                      //活动背景
                let act_name = new eui.Label;                   //活动名称
                let act_reward = new eui.Image;                 //活动奖励
                let act_btn = new eui.Image;                    //活动按钮
                let act_dis = new eui.Label;                    //活动描述

                act_bg.left = 0;
                act_bg.right = 0;
                act_bg.bottom = 0;
                act_bg.top = 0;
                act_bg.fillColor = 0xefebbc;
                act_bg.ellipseWidth = 20;
                act_bg.ellipseHeight = 20;


                act_name.left = 16;
                act_name.top = 16;
                act_name.textColor = 0xb44728;
                act_name.fontFamily = "Microsoft YaHei";
                act_name.size = 22;
                act_name.lineSpacing = 6;
                act_name.bold = true;
                act_name.maxWidth = 390;
                act_name.text = Actdata[i].name;

                if (Actdata[i].rewardRule) {
                    if (Actdata[i].rewardRule.propId) {
                        let texture = NewHelp.gettextrueBypropid(Actdata[i].rewardRule.propId)
                        act_reward.texture = RES.getRes(texture)
                    }
                    else {
                        if (Actdata[i].rewardRule.propType == 3) {
                            act_reward.texture = RES.getRes("allhuafei_png")
                        }
                        else if (Actdata[i].rewardRule.propType == 51) {                      //鸭子
                            act_reward.texture = RES.getRes("duck_png")
                        }
                        else if (Actdata[i].rewardRule.propType == 50) {                      //种子
                            if (Actdata[i].rewardRule.propIcon) {
                                HttpRequest.imageloader(Config.picurl + Actdata[i].rewardRule.propIcon, act_reward);
                            }
                        }
                    }
                    act_reward.width = 42;
                    act_reward.left = 16;
                    act_reward.top = act_name.height + 29;
                    act_reward.height = 48;
                }

                act_btn.width = 120;
                act_btn.height = 48;
                act_btn.right = 16;
                act_btn.top = act_name.height + 29;
                act_btn.left = 420;
                if (Actdata[i].btnStatus && Actdata[i].btnStatus == 1) {
                    act_btn.texture = RES.getRes("answer_receive_png")   //可领取
                }
                else if (Actdata[i].btnStatus && Actdata[i].btnStatus == 2) {
                    act_btn.texture = RES.getRes("answer_torrow_png")   //已完成
                    switch (Actdata[i].code) {
                        case 'browse_goods': {
                            act_btn.texture = RES.getRes("answer_togo_png")   //已完成
                        }
                            break;
                    }
                }
                else {
                    act_btn.texture = RES.getRes("answer_togo_png")    //可完成
                }
                act_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.actbtnTouch(act_btn, Actdata[i]) }, this);

                act_dis.size = 20;
                act_dis.fontFamily = "Microsoft YaHei";
                act_dis.left = 16;
                act_dis.top = act_name.height + 16 + 77;
                act_dis.bottom = 15;
                act_dis.textColor = 0xb44728;
                act_dis.maxWidth = 472;
                act_dis.lineSpacing = 10;
                act_dis.text = Actdata[i].info;

                act_group.addChild(act_bg);
                act_group.addChild(act_name);
                act_group.addChild(act_reward);
                act_group.addChild(act_btn);
                act_group.addChild(act_dis);
                this.scr_gro.addChild(act_group);
            }
        }


    }

    /**
     * act_btn 活动按钮
     * actdata 活动数据
     */
    private actbtnTouch(act_btn: eui.Image, actdata) {
        if (actdata.btnStatus == 1) {                 //可领取
            let data = {
                taskFinishedId: actdata.finishedId
            }
            MyRequest._post("game/receiveTask", data, this, this.completeReceive.bind(this), null)
        }
        else if (actdata.btnStatus == 2) {            //已完成
            switch (actdata.code) {
                case 'browse_goods': {
                    let baikeScene = new BaikeScene();
                    SceneManager.sceneManager._stage.addChild(baikeScene)
                }
                    break;
            }
        }
        else {                                       //可完成
            NewHelp.completetask(actdata.code, actdata.id)
        }
        console.log(actdata, "活动数据")
    }





    /**
     * 检查是否能通过阅读获得奖励
     */
    public checkLookReward() {
        if (Datamanager.getlooktask()) {
            this.answer_dis2.text = Datamanager.getlooktask().info;
            this.answer_look.visible = true;
            let looktaskdata = Datamanager.getlooktask()
            console.log(looktaskdata, "阅读数据")
            if (looktaskdata.btnStatus == 1) {          //领取
                this.answer_btn2.texture = RES.getRes("answer_receive_png");
                this.answer_btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tolook, this);
                this.answer_btn2.once(egret.TouchEvent.TOUCH_TAP, this.toreceive.bind(this, looktaskdata), this)
            }
            else {                                      //前往
                this.answer_btn2.texture = RES.getRes("answer_togo_png");
                this.answer_btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tolook, this)
            }
        }
        else {
            this.answer_look.visible = false;
        }
    }

    private toreceive(taskdata) {
        let data = {
            taskFinishedId: taskdata.finishedId
        }
        MyRequest._post("game/receiveTask", data, this, this.completeReceive.bind(this), null)
    }

    private completeReceive(data) {
        data = data.data;
        console.log(data, "奖励数据")
        //0水滴1道具2爱心值3化肥 获取称呼
        NewHelp.addmaskwithoutcolse();
        let reward = new ActRewardScene(data);
        SceneManager.sceneManager._stage.addChild(reward);
        SceneManager.instance.getTaskScene().taskDataInit()
        NewHelp.updateprop();
    }


    //去阅读
    private tolook() {
        let baikeScene = new BaikeScene();
        SceneManager.sceneManager._stage.addChild(baikeScene)
    }



    /**
	* 检查是否能通过答题获得奖励
	*/
    public checkAnswerReward() {
        MyRequest._post("game/checkAnswerReward", null, this, this.Req_checkAnswerReward.bind(this), null)

    }

    private Req_checkAnswerReward(data) {
        console.log(data, "检查答题")
        if (data.data == "true") {
            this.canreward = true;
            this.answer_btn1.texture = RES.getRes("answer_togo_png");
            this.answer_btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toproblem, this)					//进入答题
        }
        else {
            this.canreward = false;
            this.answer_btn1.texture = RES.getRes("answer_torrow_png");
            this.answer_btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.toproblem, this)					//进入答题
        }
    }


    //去答题
    private toproblem() {
        if (this.canreward) {
            let problemScene = new ProblemScene();
            SceneManager.sceneManager._stage.addChild(problemScene)
        }
        else {
            SceneManager.addNotice("今日已经答过题了哦！")
        }
    }



    private changeState() {
        if (this.currentState == "sgin") {
            this.currentState = "answer"
        }
        else if (this.currentState == "answer") {
            this.currentState = "sgin"
        }
    }


    //签到
    private Signin() {
        MyRequest._post("game/signIn", null, this, this.Req_SignIn.bind(this), this.onGetIOError)
        // this.getSignReward();
    }


    /**
     * 签到成功的处理
     */
    private Req_SignIn(data): void {
        SceneManager.sceneManager.StageItems.sign_gro.visible = false;
        this.sign_red.visible = false;
        var Data = data;
        if (Data.status == 0) {
            if (!this.qiandao_data.data) {
                this.renderingInit(0)
            } else {
                this.qiandao_data.data.continueDay++;
            }
            // this.init(true);
            this.getSignInInfo();
            // let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
            // this.parent.dispatchEvent(Removemask);
            // SceneManager.toMainScene();

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
            //显示签到成功奖励
            SceneManager.addNotice("签到成功！获得" + data.propName + data.propNum + info, 2000);
            NewHelp.updateprop();
        }
        else {
            console.log(Data, "错误")
        }
    }

    //查询签到奖励规则
    private getSignReward() {
        MyRequest._post("game/getSignReward", null, this, this.Req_getSignReward.bind(this), this.onGetIOError)
    }

    //查询签到奖励规则成功的处理
    private Req_getSignReward(data): void {
        var Data = data;
    }



    //请求错误
    private onGetIOError(event: egret.IOErrorEvent): void {
        console.log("get error : " + event);
    }

    //查询签到信息
    private getSignInInfo() {
        MyRequest._post("game/getSignInInfo", null, this, this.Req_getSignInInfo.bind(this), this.onGetIOError)
    }

    //查询成功的处理
    private Req_getSignInInfo(data): void {
        if (data.data) {
            let Signdate = data.data.lastSignDay;
            Signdate = Signdate.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
            let nowdate = new Date();
            let time = new Date(Signdate);
            if (time.getDate() == nowdate.getDate() && time.getMonth() == nowdate.getMonth()) {
                SceneManager.sceneManager.StageItems.sign_gro.visible = false;
                this.sign_red.visible = false;
            }
            else {
                SceneManager.sceneManager.StageItems.sign_gro.visible = true;
                this.sign_red.visible = true;
            }
        }
        else {
            SceneManager.sceneManager.StageItems.sign_gro.visible = true;
            this.sign_red.visible = true;
        }
        var Data = data;
        this.qiandao_data = Data;
        this.init();
    }

    private renderingInit(continueDay) {
        let days = [this.signined1, this.signined2, this.signined3, this.signined4, this.signined5, this.signined6, this.signined7]
        for (let a = 0; a < days.length; a++) {
            if (a >= continueDay) {
                days[a].visible = false
            } else {
                days[a].visible = true
            }
        }
        let items = [this.itembg1, this.itembg2, this.itembg3, this.itembg4, this.itembg5, this.itembg6]
        for (let a = 0; a < items.length; a++) {
            if (a + 1 == continueDay) {
                items[a].texture = RES.getRes("unsign_png")
            } else {
                items[a].texture = RES.getRes("itembg_png")
            }
        }
    }

    private init() {
        if (this.qiandao_data && this.qiandao_data.data) {
            console.log("累计签到对象", this.qiandao_data.data)
        }
        let day = new Date();
        let flag = false;
        let yesterday = new Date(day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + (day.getDate() - 1))
        let today = new Date(day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + (day.getDate()))
        let hasData = this.qiandao_data.data ? true : false;    //是否从来没有签到过
        let lastSignDay = hasData ? (new Date(this.qiandao_data.data.lastSignDay.split(" ")[0].replace(new RegExp(/-/gm), "/")).getTime()) : null; //最后签到时间的时间戳 如果没有则是null
        let todaySigned = hasData && (lastSignDay == today.getTime());     //判断当天是否已经签到
        let isContinue = !(hasData && new Date(lastSignDay).getTime() < yesterday.getTime())  //判断是否是连续签到

        //判断什么时候显示所有未签到样式（没有签过到、没有连续、连续天数为0、连续签到且已经签到7天且当天是第8天）
        if (!hasData || !isContinue || this.qiandao_data.data.continueDay == 0 ||
            (!todaySigned && isContinue && this.qiandao_data.data.continueDay == 7)) {
            this.renderingInit(0)
            //已经签到，就没必要绑定监听
            if (!todaySigned || !hasData) {
                this.addSginlisten(0, true)
            }
        } else {
            this.renderingInit(this.qiandao_data.data.continueDay);
            //已经签到，就没必要绑定监听
            if (!todaySigned) {
                this.addSginlisten(this.qiandao_data.data.continueDay, false)
            }
        }

    }


    /**
     * 签到监听
     * dayNum 连续签到天数
     * activeOne 是否绑定第一天
     */
    private addSginlisten(dayNum: number, activeOne?) {
        let items = [this.sgin1, this.sgin2, this.sgin3, this.sgin4, this.sgin5, this.sgin6, this.sgin7]
        //如果不是连续签到，直接绑定第一天
        if (activeOne) {
            items[0].addEventListener(egret.TouchEvent.TOUCH_TAP, this.Signin, this);
            return;
        }
        for (let a = 0; a < items.length; a++) {
            if (a == dayNum) {
                items[a].addEventListener(egret.TouchEvent.TOUCH_TAP, this.Signin, this)
            } else {
                items[a].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Signin, this)
            }
        }
    }





    //关闭该场景
    public closeScene() {
        // let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        // this.parent.dispatchEvent(Removemask);
        // SceneManager.toMainScene();
        NewHelp.removemask();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
