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




    protected childrenCreated(): void {
        super.childrenCreated();
        this.getSignInInfo();
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2
    }

    private onComplete(): void {
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
        var Data = data;
        if (Data.status == 0) {
            if (!this.qiandao_data.data) {
                this.renderingInit(0)
            } else {
                this.qiandao_data.data.continueDay++;
            }
            // this.init(true);
            this.currentState = "today-is-sign"; //更换已经签到
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
        } else {
            this.renderingInit(this.qiandao_data.data.continueDay);
        }
        this.addSginlisten(this.qiandao_data.data.continueDay)

    }


    /**
     * 添加签到监听
     */
    private addSginlisten(dayNum) {
        let items = [this.sgin1, this.sgin2, this.sgin3, this.sgin4, this.sgin5, this.sgin6, this.sgin7]
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
