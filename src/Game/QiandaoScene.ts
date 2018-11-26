class SigninScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/QiandaoSkins.exml";
    }

    private qiandao_btn: eui.Image;
    private qiandao_data;               //签到数据
    private qiandao_btn_signed: eui.Image;   //已签到按钮
    private close_btn: eui.Image;       //关闭按钮
    private day1: eui.Image;
    private day2: eui.Image;
    private day3: eui.Image;
    private day4: eui.Image;
    private day5: eui.Image;
    private day6: eui.Image;
    private day7: eui.Image;




    protected childrenCreated(): void {
        super.childrenCreated();
        this.qiandao_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Signin, this)
        this.qiandao_btn_signed.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeScene, this)
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeScene, this)
        this.getSignInInfo();
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
        var Data = data;
        console.log(Data, "签到数据")
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
            SceneManager.addNotice("签到成功！获得" + data.propName + data.propNum + info, 2000)
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
        console.log(Data, "签到奖励数据")
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
        let days = [this.day1, this.day2, this.day3, this.day4, this.day5, this.day6, this.day7]
        for (let a = 0; a < days.length; a++) {
            if (a >= continueDay) {
                days[a].visible = false
            } else {
                days[a].visible = true
            }
        }
    }

    private init() {
        if (this.qiandao_data && this.qiandao_data.data) {
            console.log("累计签到对象", this.qiandao_data.data)
        }
        let day = new Date();
        let flag = false;
        let yesterday = new Date(day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + (day.getUTCDate() - 1))
        let today = new Date(day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + (day.getUTCDate()))
        let hasData = this.qiandao_data.data ? true : false;    //是否从来没有签到过
        let lastSignDay = hasData ? (new Date(this.qiandao_data.data.lastSignDay.split(" ")[0].replace(new RegExp(/-/gm), "/")).getTime()) : null; //最后签到时间的时间戳 如果没有则是null
        let todaySigned = hasData && (lastSignDay == today.getTime());     //判断当天是否已经签到
        let isContinue = !(hasData && new Date(lastSignDay).getTime() < yesterday.getTime())  //判断是否是连续签到

        if (todaySigned) {
            this.currentState = "today-is-sign"
        } else {
            this.currentState = "today-un-sign"
        }
        if (!hasData || !isContinue || this.qiandao_data.data.continueDay == 0) {
            this.renderingInit(0)
        } else {
            this.renderingInit(this.qiandao_data.data.continueDay);
        }
    }




    //关闭该场景
    private closeScene() {
        let Removemask: MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
    }
}
