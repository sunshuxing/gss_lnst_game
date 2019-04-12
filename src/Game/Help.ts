class Help {

    private static TreeUserData         //用户果树数据
    private static UserFriendData
    private static OwnData              //自己果树数据
    private static friendIcon          //好友头像
    private static dynIcon              //动态头像  
    private static friendData           //好友数据
    private static landData                 //土地数据


    private static buling = new eui.Image();
    private static bulingstar1 = new eui.Image();
    private static bulingstar2 = new eui.Image();
    private static bulingstar3 = new eui.Image();
    private static bulingstar4 = new eui.Image();




    //查询土地数据
    public static getland() {
        MyRequest._post("game/getLands", null, this, this.Req_getLands.bind(this), null)
    }

    //查询土地成功后保存数据
    private static Req_getLands(data) {
        console.log("土地数据", data)
        this.landData = data;
    }

    //获取土地数据
    public static getlandData() {
        return this.landData;
    }

    //保存用户果树数据
    public static saveTreeUserData(data) {
        this.TreeUserData = data;
    }
    //获取用户果树数据
    public static getTreeUserData() {
        return this.TreeUserData;
    }

    //保存好友头像数据
    public static savefriendIcon(data) {
        this.friendIcon = data;
    }
    //获取好友头像数据
    public static getfriendIcon() {
        return this.friendIcon;
    }

    //保存好友数据
    public static savefriendData(data) {
        this.friendData = data;
    }
    //获取好友数据
    public static getfriendData() {
        return this.friendData;
    }

    /**
     *  通过用户id获取朋友果树id
     */
    public static getfriendtreeUseridByUser(User) {
        if (this.friendData) {
            for (let i = 0; i < this.friendData.length; i++) {
                if (this.friendData[i].friendUser == User) {
                    return this.friendData[i].trees[0].id;
                }
            }
        }
    }

    /**
     * 通过果树id获取朋友数据
     */
    public static getfriendByid(treeid) {
        if (this.friendData) {
            for (let i = 0; i < this.friendData.length; i++) {
                if (this.friendData[i].trees[0].id == treeid) {
                    return this.friendData[i];
                }
            }
        }
    }

    //保存动态头像数据
    public static savedynIcon(data) {
        this.dynIcon = data;
    }
    //获取动态头像数据
    public static getdynIcon() {
        return this.dynIcon;
    }

    //保存用户果树数据
    public static saveOwnData(data) {
        this.OwnData = data;
    }
    //获取用户果树数据
    public static getOwnData() {
        return this.OwnData;
    }


    public static saveUserFriendData(data) {
        this.UserFriendData = data;
    }

    public static getUserFriendData() {
        return this.UserFriendData;
    }


    //根据元素获取数组下标
    public static getContains(arrays, obj) {
        var i = arrays.length;
        while (i--) {
            if (arrays[i] == obj) {
                return i;
            }
        }
        return false;
    }


    /**
     * 通过用户获得果树id
     */

    public static getUserIdByUser(user, data) {
        for (let i = 0; i < data.length; i++) {
            if (user == data[i].friendUser) {
                return data[i].treeUserId
            }
        }
    }

    //限制字符串长度
    public static getcharlength(_str, _length) {
        if (_str) {
            var reg = /[^\x00-\xff]/g,    //专业匹配中文
                slice = _str.substring(0, _length),
                chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
                realen = slice.length * 2 - chineseCharNum;
            return _str.substr(0, realen) + (realen < _str.length ? "..." : "");
        }
    }


    public static pushInfoarr(arr, Infoarr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            Infoarr.push(arr[i]);
        }
        return Infoarr;
    }

    public static getPropById(data, propId) {
        //propId   1：水滴   2：爱心值  3:道具  4：有机肥  5:复合肥  6：水溶肥
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].propId == propId) {
                    return data[i];				//水滴数据
                }
            }
        }
    }

    //随机生成整数
    public static random_num(min: number, max: number) {
        let Range = max - min;
        let Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }


    //获取阶段果树锚点长宽等
    public static getTreeHWBystage(stage, img: eui.Image) {
        if (SceneManager.instance.landId == 1) {
            if (stage < 2) {
                img.width = 250;
                img.height = 257;
            }
            if (stage > 1) {
                img.width = 420;
                img.height = 433;
            }
        }
        else if (SceneManager.instance.landId == 2) {
            img.width = 250;
            img.height = 257;
        }
        img.anchorOffsetX = img.width * 0.5;
        img.anchorOffsetY = img.height;
    }

    //延迟time执行  restart_num
    public static waitFun(time: number, ComFun: Function, TimerFun) {
        let timer: egret.Timer = new egret.Timer(1000, time);
        timer.addEventListener(egret.TimerEvent.TIMER, TimerFun, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, ComFun, this);
        timer.start();
    }

    //摘果动画
    public static pickTwn(num) {
        let timer: egret.Timer = new egret.Timer(150, num);
        timer.addEventListener(egret.TimerEvent.TIMER, this.fruitTwn, this);
        timer.start();
    }

    //果子动画
    public static fruitTwn() {
        let fruit = new eui.Image()
        if (SceneManager.instance.landId == 1) {
            fruit.x = 398;
            fruit.y = 605;
        }
        else if (SceneManager.instance.landId == 2) {
            fruit.x = 350;
            fruit.y = 800;
        }
        fruit.width = 44;
        fruit.height = 50;
        HttpRequest.imageloader(Config.picurl + Datamanager.getNowtreedata().seedIcon, fruit)
        SceneManager.sceneManager.StageItems.addChild(fruit);
        if (SceneManager.instance.landId == 1) {
            egret.Tween.get(fruit)
                .to({ x: 368, y: 505 }, 300)
                .to({ x: 200, y: 1153, height: 34, width: 29 }, 1400).call(() => { SceneManager.sceneManager.StageItems.removeChild(fruit) }, SceneManager.sceneManager.StageItems)
        }
        else if (SceneManager.instance.landId == 2) {
            egret.Tween.get(fruit)
                .to({ x: 320, y: 700 }, 300)
                .to({ x: 200, y: 1153, height: 34, width: 29 }, 1400).call(() => { SceneManager.sceneManager.StageItems.removeChild(fruit) }, SceneManager.sceneManager.StageItems)
        }
    }

    /**
     * 摘果动画完成之后更新
     */
    public static pickTwnupdata(Func) {
        let timer: egret.Timer = new egret.Timer(2150, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, Func, this)
        timer.start();
    }


    //获取日期时间
    public static getTime(date, Type?: string) {
        //如果createDate为后台传入的Date类型，这里直接转化为毫秒数
        date = date.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
        let time = new Date(date);
        if (Type) {
            if (Type == "day") {
                return time.getMonth() + 1 + "月" + time.getDate() + "日";
            } else if (Type == "hours") {
                if (time.getMinutes() < 10) {
                    return time.getHours() + ":0" + time.getMinutes();
                }
                else {
                    return time.getHours() + ":" + time.getMinutes();
                }
            }
        }
        else {
            return date
        }
    }

    //浇水气泡动画
    public static waters() {

    }


    //过场动画
    public static passAnm() {
        let left = new eui.Image;
        let right = new eui.Image;
        left.height = SceneManager.sceneManager._stage.height;
        right.height = SceneManager.sceneManager._stage.height;
        left.x = 0;
        left.y = 0;
        right.skewY = 180;
        right.x = 750;
        right.y = 0;
        left.texture = RES.getRes("pass_png");
        right.texture = RES.getRes("pass_png");
        SceneManager.sceneManager._stage.addChild(left);
        SceneManager.sceneManager._stage.addChild(right);
        egret.Tween.get(left)
            .wait(200)
            .to({ x: -1089 }, 1000)
        egret.Tween.get(right)
            .wait(200)
            .to({ x: 1839 }, 1000)
    }

    public static grapos(n, icon) {
        if (n == 1) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 230, icon.y = 950;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 217, icon.y = 1005;
            }
        }
        else if (n == 2) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 362, icon.y = 956;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 293, icon.y = 1021;
            }
        }
        else if (n == 3) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 504, icon.y = 938;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 377, icon.y = 1012;
            }
        }
    }

    public static inspos(n, icon) {
        if (n == 1) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 536, icon.y = 872;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 247, icon.y = 1005;
            }
        }
        else if (n == 2) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 295, icon.y = 932;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 340, icon.y = 1005;
            }
        }
        else if (n == 3) {
            if (SceneManager.instance.landId == 1) {
                return icon.x = 436, icon.y = 930;
            }
            else if (SceneManager.instance.landId == 2) {
                return icon.x = 438, icon.y = 990;
            }
        }
    }


    public static stealshow(num) {
        let img_water = new eui.Image();
        img_water.texture = RES.getRes("shuidi");
        img_water.x = 420;
        img_water.y = 797;
        SceneManager.sceneManager.StageItems.addChild(img_water);
        let label_water = new eui.Label();
        label_water.text = "+" + num + "g";
        label_water.textColor = 0x5AD0EC;
        label_water.x = 464;
        label_water.y = 815;
        SceneManager.sceneManager.StageItems.addChild(label_water);
        egret.Tween.get(img_water)
            .to({ y: img_water.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(img_water) }, this);
        egret.Tween.get(label_water)
            .to({ y: label_water.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(label_water) }, this);
    }

    /**
     * 帮摘果之后奖励动画
     */

    public static helppickTwn(data) {
        let img_fruit = new eui.Image();            //果实图片
        img_fruit.width = 61.6;
        img_fruit.height = 70;
        img_fruit.x = 356;
        img_fruit.y = 610;
        HttpRequest.imageloader(Config.picurl + Datamanager.getnowfrienddata().seedIcon, img_fruit);
        let label_fruit = new eui.Label();              //果实数量
        label_fruit.x = 434;
        label_fruit.y = 640;
        label_fruit.text = "+" + data.takeNum;
        let img_love = new eui.Image();                 //爱心图片
        img_love.x = 350;
        img_love.y = 626;
        img_love.texture = RES.getRes("shuidi");
        let label_love = new eui.Label;
        label_love.x = 426;
        label_love.y = 640;
        label_love.text = "+" + data.loveCount
        if (Number(data.takeNum) == 0) {
            SceneManager.addNotice("手气不佳，没有为好友摘到果子", 1000),

                this.waitFun(1, function () {
                    if (data.loveCount && Number(data.loveCount) > 0) {
                        SceneManager.sceneManager.StageItems.addChild(img_love);
                        SceneManager.sceneManager.StageItems.addChild(label_love);
                        egret.Tween.get(img_love)
                            .to({ y: img_love.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(img_love) }, this);
                        egret.Tween.get(label_love)
                            .to({ y: label_love.y - 60 }, 800).call(() => {
                                SceneManager.sceneManager.StageItems.removeChild(label_love);
                            }, this);
                    }
                    else {
                        SceneManager.addNotice("每日爱心值已达上限！");
                    }
                    SceneManager.sceneManager.StageItems.enabled = true;
                }, this)
        }
        else {
            SceneManager.sceneManager.StageItems.addChild(img_fruit);
            SceneManager.sceneManager.StageItems.addChild(label_fruit);
            egret.Tween.get(img_fruit)
                .to({ y: img_fruit.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(img_fruit) }, this);
            egret.Tween.get(label_fruit)
                .to({ y: label_fruit.y - 60 }, 800).call(() => {
                    SceneManager.sceneManager.StageItems.removeChild(label_fruit);
                    if (data.loveCount && Number(data.loveCount) > 0) {
                        SceneManager.sceneManager.StageItems.addChild(img_love);
                        egret.Tween.get(img_love)
                            .to({ y: img_love.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(img_love) }, this);
                        SceneManager.sceneManager.StageItems.addChild(label_love);
                        egret.Tween.get(label_love)
                            .to({ y: label_love.y - 60 }, 800).call(() => {
                                SceneManager.sceneManager.StageItems.removeChild(label_love);
                            }, this);
                    }
                    else {
                        SceneManager.addNotice("每日爱心值已达上限！");
                    }
                    SceneManager.sceneManager.StageItems.enabled = true;
                }, this);
        }
        NewHelp.updateprop()
    }

    public static helpwaterLove(data) {
        if (data.loveCount && Number(data.loveCount) > 0) {
            SceneManager.sceneManager.StageItems.enabled = false;
            let img_love = new eui.Image();                 //爱心图片
            img_love.x = 350;
            img_love.y = 626;
            img_love.texture = RES.getRes("shuidi");
            let label_love = new eui.Label;                 //水滴数量
            label_love.x = 426;
            label_love.y = 640;
            label_love.text = "+" + data.loveCount;
            SceneManager.sceneManager.StageItems.addChild(img_love);
            SceneManager.sceneManager.StageItems.addChild(label_love);
            egret.Tween.get(img_love)
                .to({ y: img_love.y - 60 }, 800).call(() => { SceneManager.sceneManager.StageItems.removeChild(img_love) }, this);
            egret.Tween.get(label_love)
                .to({ y: label_love.y - 60 }, 800).call(() => {
                    SceneManager.sceneManager.StageItems.removeChild(label_love);
                    SceneManager.sceneManager.StageItems.enabled = true;
                }, this);
        }
        else {
            SceneManager.addNotice("每日爱心值已达上限！")
        }
    }

   
    public static removebuling() {
        if (this.buling.parent) {
            this.buling.parent.removeChild(this.buling)
        }
        if (this.bulingstar1.parent) {
            this.bulingstar1.parent.removeChild(this.bulingstar1)
        }
        if (this.bulingstar2.parent) {
            this.bulingstar2.parent.removeChild(this.bulingstar2)
        }
        if (this.bulingstar3.parent) {
            this.bulingstar3.parent.removeChild(this.bulingstar3)
        }
        if (this.bulingstar4.parent) {
            this.bulingstar4.parent.removeChild(this.bulingstar4)
        }
    }

    //爱心动画
    private static lovebuling() {
        this.buling.texture = RES.getRes("bulingbg_png")
        this.buling.x = 90;
        this.buling.y = 480;
        SceneManager.sceneManager.StageItems.addChild(this.buling);
        this.bulingstar1.texture = RES.getRes("bulingstar_png")
        this.bulingstar1.x = 270;
        this.bulingstar1.y = 620;
        SceneManager.sceneManager.StageItems.addChild(this.bulingstar1);
        this.bulingstar2.texture = RES.getRes("bulingstar_png")
        this.bulingstar2.rotation = 20;
        this.bulingstar2.width = 44
        this.bulingstar2.height = 54
        this.bulingstar2.x = 370;
        this.bulingstar2.y = 590;
        SceneManager.sceneManager.StageItems.addChild(this.bulingstar2);
        this.bulingstar3.texture = RES.getRes("bulingstar_png")
        this.bulingstar3.x = 480;
        this.bulingstar3.y = 540;
        SceneManager.sceneManager.StageItems.addChild(this.bulingstar3);
        this.bulingstar4.texture = RES.getRes("bulingstar_png")
        this.bulingstar4.rotation = 330;
        this.bulingstar4.width = 44;
        this.bulingstar4.height = 54;
        this.bulingstar4.x = 530;
        this.bulingstar4.y = 620;
        SceneManager.sceneManager.StageItems.addChild(this.bulingstar4);

        egret.Tween.get(this.bulingstar1)
            .to({ alpha: 0.8 }, 100).call(() => {
                egret.Tween.get(this.bulingstar2, { loop: true })
                    .to({ alpha: 0 }, 800)
                    .wait(300)
                    .to({ alpha: 1 }, 800)
            }, this)
            .to({ alpha: 0.6 }, 100)
            .to({ alpha: 0.4 }, 100)
            .to({ alpha: 0.2 }, 100).call(() => {
                egret.Tween.get(this.bulingstar3, { loop: true })
                    .to({ alpha: 0 }, 700)
                    .wait(100)
                    .to({ alpha: 1 }, 700)
            }, this)
            .to({ alpha: 0 }, 100)
            .to({ alpha: 0.2 }, 100)
            .to({ alpha: 0.4 }, 100).call(() => {
                egret.Tween.get(this.bulingstar4, { loop: true })
                    .to({ alpha: 0 }, 400)
                    .wait(100)
                    .to({ alpha: 1 }, 400)
            }, this)
            .to({ alpha: 0.6 }, 100)
            .to({ alpha: 0.8 }, 100)
            .to({ alpha: 1 }, 100).call(() => {
                egret.Tween.get(this.bulingstar1, { loop: true })
                    .to({ alpha: 1 }, 500)
                    .wait(200)
                    .to({ alpha: 0 }, 500)
            }, this)
    }


    //果树名称过长滚动
    public static labelRect(label: eui.Label) {
        label.scrollRect = new egret.Rectangle(0, 0, 74, 24);
        var rect: egret.Rectangle = label.scrollRect;
        egret.Tween.get(rect, { loop: true })
            .set({ x: -74 })
            .to({ x: label.width }, 28.7 * label.width);
    }



    //截屏功能
    public static Screencapture(DisplayObject: eui.Group, data, isPick?: boolean) {
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        // let buling = new eui.Image();
        // buling.texture = RES.getRes("");
        // buling.x = 148;
        // buling.y = DisplayObject.height - buling.height - 588;
        // DisplayObject.addChild(buling);
        let capture
        if (!SceneManager.instance.isMiniprogram) {
            let toppai = new eui.Image();
            toppai.texture = RES.getRes("toppaisnow_png");
            toppai.x = 165;
            toppai.y = 20;
            let toptext = new eui.Label();
            toptext.y = toppai.y + 98;
            toptext.x = toppai.x + 57;
            toptext.size = 30;
            toptext.fontFamily = "Microsoft YaHei";
            toptext.height = 40;
            toptext.width = 340;
            toptext.verticalAlign = "middle";
            toptext.textAlign = "center";
            if (data.needTake == "true") {
                toptext.text = "我的" + data.treeName + "果子成熟了!"
            }
            else {
                toptext.text = "我的" + data.treeName + data.stageObj.name + "了!"
            }
            let erweima = new eui.Image();
            erweima.texture = RES.getRes("erweima_png");
            erweima.y = DisplayObject.height - erweima.height;
            DisplayObject.addChild(toppai);
            DisplayObject.addChild(toptext);
            DisplayObject.addChild(erweima);
            renderTexture.drawToTexture(DisplayObject);
            capture = renderTexture.toDataURL("image/png", new egret.Rectangle(0, 0, DisplayObject.width, DisplayObject.height));
            // if(buling.parent){
            //     buling.parent.removeChild(buling)
            // }
            if (erweima.parent) {
                erweima.parent.removeChild(erweima)
            }
            if (toppai.parent) {
                toppai.parent.removeChild(toppai)
            }
            if (toptext.parent) {
                toptext.parent.removeChild(toptext)
            }
        }
        else {
            renderTexture.drawToTexture(DisplayObject);
            capture = renderTexture.toDataURL("image/png", new egret.Rectangle(0, 0, DisplayObject.width, DisplayObject.height));
        }
        let treeUserId = data.id;
        let treeId = data.treeId;
        let stage = data.stage;
        let params = {
            imgData: capture,
            treeUserId: treeUserId,
            treeId: treeId,
            stage: stage
        }
        MyRequest._post("game/uploadBase64Img", params, this, this.Req_uploadBase64Img.bind(this, isPick), this.onGetIOError);
    }

    private static onGetIOError() {
        console.log("错误回调")
    }


    private static Req_uploadBase64Img(isPick, data) {
        let imagename = data.data.imgName;
        console.log(imagename, "name")
        if (!SceneManager.instance.isMiniprogram) {
            let param = WeixinUtil.prototype.urlEncode(imagename, "imgName", null, null)
            location.href = Config.webHome + "view/longTapShare.html?" + param;
            console.log(param, "ImageName")
        }
        else {
            let info
            if (isPick) {
                SceneManager.addJump("sharetextwater_png");
                if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
                    info = "【果实熟了】快来、快来帮我摘水果。"
                } else {
                    info = "【说说农场】一起种水果，亲手种，免费送到家。"
                }
            }
            else {
                SceneManager.addJump("sharetextfriend_png");
                info = "快来看看我的果树吧！"
            }
            let data = {
                addFriend: true,
                title: info,
                imageUrl: Config.picurl + imagename
            }
            SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
            console.log(Config.picurl + imagename, "imageUrl")
        }

    }
}
