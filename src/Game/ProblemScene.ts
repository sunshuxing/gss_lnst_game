class ProblemScene extends eui.Component implements eui.UIComponent {

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/ProblemSkins.exml";
    }

    public canreward: boolean;                //能否获得奖励
    private allprombledata;
    private problemlist: eui.List;
    private nowNum: number = 1;
    private problemnum: eui.Label;
    private problemlable: eui.Label;
    private submit_btn: eui.Image;
    private next_btn: eui.Image;
    private nowrightnum: number = 0;
    private allright: number = 0;
    private isplural: boolean;
    private listenable: eui.Rect;
    private user_icon: eui.Image;
    private right_label: eui.Label;
    private reward_label: eui.Label;
    private detailslist: eui.List;
    private answer_label: eui.Label;


    private answer_scr: eui.Scroller;
    private reward_right: eui.Label;
    private reward_num_label: eui.Label;     //奖励个数文字
    private reward_img: eui.Image;           //奖励物品图片
    private receive_btn: eui.Image;          //领取按钮
    private timer_label: eui.Label;
    private gro_reward: eui.Group;
    private label_reward: eui.Label;


    protected childrenCreated(): void {
        super.childrenCreated();
        this.answer_scr.horizontalScrollBar = null;
    }

    private onComplete(): void {
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.next_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
        this.submit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submit, this);
        this.problemlist.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouch, this);
        this.receive_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.getOwnavatar(SceneManager.instance.weixinUtil.login_user_id);
        this.checkAnswerReward();
    }

    /**
	 * 获取用户头像
	 * treedata   userId
	 */
    private getOwnavatar(userId) {
        let params = {
            users: userId
        }
        MyRequest._post("game/getWechatImg", params, this, NewHelp.Req_WechatImg.bind(this, userId, this.user_icon), null);
    }

    private next() {
        if (this.currentState == "details") {
            this.getPromble();
        }
        else if (this.currentState == "normal") {
            SceneManager.addNotice("请选择答案")
        }
    }

    private onTouch(e: eui.PropertyEvent): void {
        if (this.isplural) {                 //当前选中的是多选题

            if (this.problemlist.selectedIndices.length == this.nowrightnum) {            //当前选中个数和正确答案个数相同结束该道答题
                let selecteddata = this.problemlist.selectedItems
                console.log(this.problemlist.selectedItems);
                let rightnum = 0;
                for (let i = 0; i < selecteddata.length; i++) {
                    if (selecteddata[i].isRight) {                    //获取当前选中的正确选项个数
                        rightnum++;
                    }
                }
                if (rightnum == this.nowrightnum) {                  //当前正确选项和该题正确选项个数相同
                    console.log("回答正确")
                    SceneManager.addNotice("恭喜回答正确！", 1000);
                    var that = this
                    setTimeout(function () {
                        that.getPromble()                               //进入下一题
                    }, 1000);
                    this.allright++;
                }
                else {
                    this.showdetails();
                    console.log("回答错误 进入解析")
                }
                this.nowNum++;
            }
        }
        else {                                                           //当前是单选题
            let selecteddata = this.problemlist.selectedItem;
            if (selecteddata.isRight) {                                   //答题正确
                console.log("回答正确")
                SceneManager.addNotice("恭喜回答正确！", 1000);
                var that = this
                setTimeout(function () {
                    that.getPromble()                               //进入下一题
                }, 1000);
                this.allright++;
            }
            else {
                this.showdetails();
                console.log("回答错误 进入解析")
            }
            this.nowNum++;
        }
    }

    /**
     * 获取答题奖励
     */
    private answerReward(rightNum) {
        let params = {
            rightNum: rightNum
        }
        MyRequest._post("game/answerReward", params, this, this.Req_answerReward.bind(this), null)
    }

    private Req_answerReward(data) {
        console.log(data, "获得奖励数据");
        if (data.data) {
            this.label_reward.visible = false;
            this.gro_reward.visible = true;
            let rewarddata = data.data;
            let imgtextrue = NewHelp.getimgByType(rewarddata);
            this.reward_img.texture = RES.getRes(imgtextrue);
            this.reward_num_label.text = rewarddata.propName + "x" + rewarddata.propNum
            SceneManager.sceneManager.StageItems.canreward = false;
            NewHelp.updateprop();
        }
        else {
            this.label_reward.visible = true;
            this.gro_reward.visible = false;
        }
        NewHelp.checkActRed();
    }

    /**
     * 检查是否能通过答题获得奖励
     */
    private checkAnswerReward() {
        MyRequest._post("game/checkAnswerReward", null, this, this.Req_checkAnswerReward.bind(this), null)
    }

    private Req_checkAnswerReward(data) {
        if (data.data == "true") {
            this.canreward = true;
        }
        else if (data.data == "false") {
            this.canreward = false;
        }
        this.getAnswerList();
        console.log(data, "能否答题获奖")
    }

    /**
	 * 获取百科题目
	 */
    public getAnswerList() {
        MyRequest._post("game/getAnswerList", null, this, this.Req_getAnswerList.bind(this), null)
    }

    private Req_getAnswerList(data) {
        this.allprombledata = data.data
        console.log(data, "答题列表")
        this.getPromble();
    }

    private getPromble() {
        if (this.nowNum > 5) {
            if (this.canreward) {
                if (this.currentState != "reward") {     //奖励状态
                    this.currentState = "reward"
                }
                this.reward_right.text = "正确率：" + this.allright + "/5";
                this.answerReward(this.allright);
            }

            else {
                SceneManager.addNotice("完成本次答题")
                let that = this
                setTimeout(function () {
                    that.close();
                }, 1500);
            }
        }
        else {
            if (this.currentState != "normal") {
                this.currentState = "normal";                                   //切换至答题状态
            }
            this.right_label.text = "答对：" + this.allright + "/5";
            if (this.canreward) {
                if (this.allright == 0) {                                       //当前一题都没有回答正确
                    this.reward_label.text = "";
                } else {
                    let reward = NewHelp.getrewardByNum(this.allright);         //获取当前奖励信息
                    this.reward_label.text = reward;
                }
            }
            else {
                this.reward_label.text = "今日已完成答题，本次答题无奖励"
            }
            if (this.nowNum == 1) {
                this.problemnum.text = "第一题"
            } else if (this.nowNum == 2) {
                this.problemnum.text = "第二题"
            } else if (this.nowNum == 3) {
                this.problemnum.text = "第三题"
            } else if (this.nowNum == 4) {
                this.problemnum.text = "第四题"
            } else if (this.nowNum == 5) {
                this.problemnum.text = "第五题"
            }
            if (this.allprombledata[this.nowNum - 1].type == 0) {           //单选题
                this.problemlist.allowMultipleSelection = false;        //关闭多选状态
                this.isplural = false;                                  //不是多选题
                this.problemlable.text = this.allprombledata[this.nowNum - 1].exerciseProblems;
            }
            else if (this.allprombledata[this.nowNum - 1].type == 1) {      //多选题
                this.nowrightnum = 0;
                this.problemlist.allowMultipleSelection = true;         //开启多选状态
                this.isplural = true;                                       //是多选题
                let options = this.allprombledata[this.nowNum - 1].options
                for (let i = 0; i < options.length; i++) {
                    if (options[i].isRight) {
                        this.nowrightnum++
                    }
                }
                this.problemlable.text = this.allprombledata[this.nowNum - 1].exerciseProblems + "(请选择" + this.nowrightnum + "个选项)";
            }
            let euiArr = new eui.ArrayCollection(this.allprombledata[this.nowNum - 1].options);
            this.problemlist.dataProvider = euiArr;
            this.problemlist.itemRenderer = ProblemList_item;
            this.problemlist.selectedIndex = -1;
            this.problemlist.selectedIndices = [];
        }
    }

    private showdetails() {
        if (this.currentState != "details") {
            this.currentState = "details"                                       //切换至详情状态
        }
        this.next_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
        this.timer_label.text = "3秒后可继续"
        this.timer_label.visible = true;
        let that = this
        let time = 3
        let timer = setInterval(() => {
            that.timer_label.text = time + "秒后可继续"
            time--;
            if (time < 0) {
                clearInterval(timer)
                that.next_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, that.next, that)
                that.timer_label.visible = false;
            }
        }, 1000)
        this.answer_label.text = this.allprombledata[this.nowNum - 1].info;
        let euiArr = new eui.ArrayCollection(this.allprombledata[this.nowNum - 1].options);
        this.detailslist.dataProvider = euiArr;
        this.detailslist.itemRenderer = DetailsList_item;
    }



    /**
     * 提交按钮点击事件
     */
    private submit() {
        if (this.canreward) {
            if (this.currentState != "reward") {     //奖励状态
                this.currentState = "reward"
            }
            this.reward_right.text = "正确率：" + this.allright + "/5";
            this.answerReward(this.allright);
        }
        else {
            SceneManager.addNotice("完成本次答题")
            let that = this
            setTimeout(function () {
                that.close();
            }, 1500);
        }
    }

    private close() {
        if (this.parent) {
            this.parent.removeChild(this);
            SceneManager.sceneManager.getSigninScene().checkAnswerReward();
        }
    }

}


class ProblemList_item extends eui.ItemRenderer {

    private answer_tips: eui.Image;
    private problem_text: eui.Label;

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/ProblemListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }
    private onComplete() {

    }
    // 当数据改变时，更新视图
    protected dataChanged() {
        this.problem_text.text = this.data.text;
        if (this.itemIndex == 0) {
            this.answer_tips.texture = RES.getRes("answer_a_png");
        }
        else if (this.itemIndex == 1) {
            this.answer_tips.texture = RES.getRes("answer_b_png");
        }
        else if (this.itemIndex == 2) {
            this.answer_tips.texture = RES.getRes("answer_c_png");
        }
        else if (this.itemIndex == 3) {
            this.answer_tips.texture = RES.getRes("answer_d_png");
        }
    }
}


class DetailsList_item extends eui.ItemRenderer {

    private answer_end: eui.Image;
    private answer_tips: eui.Image;
    private problem_text: eui.Label;
    private answer_bg: eui.Image;

    public constructor() {
        super()
        // 把这个 类和皮肤 联系起来
        this.skinName = 'resource/skins/ProblemListSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }
    private onComplete() {

    }
    // 当数据改变时，更新视图
    protected dataChanged() {
        this.problem_text.text = this.data.text;
        if (this.itemIndex == 0) {
            this.answer_tips.texture = RES.getRes("answer_a_png");
        }
        else if (this.itemIndex == 1) {
            this.answer_tips.texture = RES.getRes("answer_b_png");
        }
        else if (this.itemIndex == 2) {
            this.answer_tips.texture = RES.getRes("answer_c_png");
        }
        else if (this.itemIndex == 3) {
            this.answer_tips.texture = RES.getRes("answer_d_png");
        }
        if (this.data.isRight) {                    //该选项正确
            this.answer_bg.texture = RES.getRes("answer_right_png");
            this.answer_end.texture = RES.getRes("right_png");
        }
        else {                                      //该选项错误
            this.answer_bg.texture = RES.getRes("answer_wrong_png");
            this.answer_end.texture = RES.getRes("wrong_png");
        }
    }
}