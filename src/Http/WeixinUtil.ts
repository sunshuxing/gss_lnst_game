class WeixinUtil {

    private static weixinUtil: WeixinUtil;

    public _commGetValueFromUrlByKey(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI((r[2])); return '';

    }

    public login_user_id;

    public shareData;

    public isMember;

    public _friendSign;

    public sharedata: BodyMenuShareTimeline;

    public user_name;
    /**
     * 初始化数据
     */
    public _initShareData() {
        this.shareData = {
            shareUrl: "",
            titles: "",
            describes: "",
            iconUrl: "",
            success: function () {
                SceneManager.instance.closeJumpMark();
                console.log("success share")
            }
        }
    }

    /**
     * 获得工具类实例
     */
    public static getInstance(): WeixinUtil {
        if (!this.weixinUtil) {
            this.weixinUtil = new WeixinUtil();
        }
        return this.weixinUtil;
    }

    /**
     * 从url获取某个属性的值
     */
    public geturlstr(name: string) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI((r[2])); return '';
    }


    //从url获取分享标识

    public geturlshare() {
        if (this.geturlstr("friendSign")) {
            this._friendSign = this.geturlstr("friendSign");
            sessionStorage.setItem("friendSign", this._friendSign);
        } else {
            var storageItem = sessionStorage.getItem("friendSign");
            if (storageItem) {
                this._friendSign = storageItem;
            }
        }
    }

    /**
     * 开启分享功能
     */
    public _openShare() {
        let that = this
        wx.ready(function () {
            wx.showMenuItems({
                menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:setFont', 'menuItem:copyUrl'] // 要显示的菜单项，所有menu项见附录3
            });
            let shareUrl = that.shareData.shareUrl;
            let addFriend = MyRequest.geturlstr("addFriend", shareUrl)
			if (!addFriend) {
				shareUrl = shareUrl + "&addFriend=true"
			}
            let titles = that.shareData.titles;
            let describes = that.shareData.describes;
            var iconUrl = that.shareData.iconUrl;
            shareUrl = Config.wxhttpServer + 'tokenHandle/toShare?shareUrl=' + encodeURIComponent(shareUrl);
            let obj = new BodyMenuShareTimeline();
            obj.title = titles;
            obj.link = shareUrl
            obj.imgUrl = iconUrl;
            obj.success = function () {
                // 用户确认分享后执行的回调函数
                if (that.shareData.success && typeof that.shareData.success == 'function') {
                    that.shareData.success()
                }
            }
            wx.onMenuShareTimeline(obj);

            let shareFriend = new BodyMenuShareAppMessage();
            shareFriend.title = titles
            shareFriend.desc = describes
            shareFriend.link = shareUrl
            shareFriend.imgUrl = iconUrl
            shareFriend.type = 'link'
            shareFriend.dataUrl = ''
            shareFriend.success = function () {
                // 用户确认分享后执行的回调函数
                if (that.shareData.success && typeof that.shareData.success == 'function') {
                    that.shareData.success()
                }
            }
            //发送给朋友
            wx.onMenuShareAppMessage(shareFriend);
        });
    }

    /**
     * 初始化分享
     */
    public _getShareData(result) {
        this._initShareData();
        this.shareData.titles = document.title;
        var code = this.geturlstr("code");
        var href = location.href;
        var friendSign;//要分享出去的自身标识
        if (code && code.length > 0) {
            href = href.replace(code, "");
        }
        friendSign = result.data.unionId;
        if (!friendSign) {//没有就置空
            friendSign = "";
        }
        if (location.href.split("?").length >= 2) {
            var uri = location.href.split("?")[0];
            this.shareData.shareUrl = uri + "?friendSign=" + friendSign;//分享id
        } else {
            this.shareData.shareUrl = href + "?friendSign=" + friendSign;//分享id
        }
        this.shareData.describes = "种上一棵树，恋上一座城，开启舌尖上的旅行--果说说"
    }
    /**
     * 微信初始化
     * mustLogin    是否必须登陆
     * callback     登陆成功回调
     * needShare    是否开启分享
     * jsApiList    
     * isOverdue    是否是过期请求，如果是，则code不发送到后台
     */
    async  _commWxInit(serverUrl: string, mustLogin: string, callback: Function, needShare: boolean, jsApiList, isOverdue: boolean) {
        //判断是否是在小程序web-view中，如果是，则不能使用默认的分享
        let that = this
        let _url = location.href
        let code = ""
        if (!isOverdue) {
            code = this._commGetValueFromUrlByKey("code");
        } else {
            //如果请求过期，并且url还包含code、state都要删除
            let code = this.geturlstr("code")
            let state = this.geturlstr("state")
            let contant = location.href.charAt((location.href.indexOf("code") - 1))  //code前面的字符 ？或者&如果是&则要删除
            if (contant == "&") {
                _url = _url.replace("&code=" + code, "")
            } else {
                _url = _url.replace("code=" + code, "")
            }
            _url = _url.replace("&state=" + state, "")
            code = ""//code过期时不能再传code，需要置空
        }
        wx.miniProgram.getEnv(function (e) {
            if (e.miniprogram) {
                SceneManager.instance.isMiniprogram = true
                //检查是否有登陆标识或者session
                let memberNum = that._commGetValueFromUrlByKey("memberNum")
                let data = {
                    memberNum: "",
                    pageUrl: _url
                }
                if (memberNum || sessionStorage.getItem("memberNum")) {
                    console.log("使用memberNum登陆")
                    data.memberNum = memberNum ? memberNum : sessionStorage.getItem("memberNum");
                    sessionStorage.setItem("memberNum", data.memberNum)
                    MyRequest._post("tokenHandle/webLogin", data, that, that.onGetComplete.bind(that, callback, needShare, jsApiList), that.onGetIOError)
                } else {
                    console.log("旧版登陆")
                    //支持旧版登陆，不然更新上去旧的小程序无法使用
                    that.webH5Login(code, _url, mustLogin, callback, needShare, jsApiList, isOverdue)
                }
            } else {
                SceneManager.instance.isMiniprogram = false
                //如果是h5页面，不是web-view则使用默认跳转验证登陆
                that.webH5Login(code, _url, mustLogin, callback, needShare, jsApiList, isOverdue)
            }
        })



    }
    /**
     * 使用微信JSSDK网页授权登陆
     */
    private webH5Login(code: string, _url: string, mustLogin: string, callback: Function, needShare: boolean, jsApiList, isOverdue: boolean): void {
        var data = {
            pageUrl: _url,
            mustLogin: mustLogin,
            code: code
        }
        MyRequest._post("tokenHandle/gameLogin", data, this, this.onGetComplete.bind(this, callback, needShare, jsApiList), this.onGetIOError)
    }

    /**
     * 向小程序推送分享
     */
    public toPostMessageShare(type, data) {
        let title = ""
        if (!data) {
            data = {}
        }
        if (data && data.titles) {
            title = data.titles
        } else {
            title = "【说说农场】你的专属农场，亲手种，包邮送到家"
        }
        data.titles = title;
        data.friendSign = localStorage.getItem("friendSign");    //自身标识
        data.type = type
        wx.miniProgram.postMessage({ data })
    }

    public onGetComplete(callback, needShare, jsApiList, data) {
        let that = this
        if (data.status == 3) {//强制登录,重定向鉴权
            location.replace(data.data);
        } else if (data.status == 0) {
            localStorage.setItem("sessionid", data.data.sessionId);//放入sessionid
            this.login_user_id = data.data.unionId;
            this.user_name = data.data.name;
            localStorage.setItem("isMember", data.data.isMember);//存放是否是会员的标志
            localStorage.setItem("friendSign", data.data.unionId)
            this.isMember = (data.data.isMember == "true" ? true : false);
            if (needShare) {
                //判断是否是在小程序web-view中，如果是，则不能使用默认的分享
                if (SceneManager.instance.isMiniprogram) {
                    SceneManager.instance.isMiniprogram = true
                    //通知小程序分享
                    that.toPostMessageShare(0, {})
                } else {
                    SceneManager.instance.isMiniprogram = false
                    that._getShareData(data);//***
                    that.shareData.iconUrl = "http://www.guoss.net/wefruitmall/images/game_share.png";
                    that.shareData.titles = "【果说说农场】你的专属农场，亲手种，包邮送到家！";
                    that._openShare();
                }
            }
            if (callback && typeof callback === 'function') {//回调函数
                callback(data);//需要在回调函数中初始化shareData
            }
            var wxJsapiSignature = data.data;
            var apiList = null;
            if (jsApiList && typeof jsApiList === 'object' && jsApiList.length != 0) {
                apiList = jsApiList;
                apiList.push('onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showMenuItems', 'checkJsApi');//'chooseWXPay'
            } else if (jsApiList && typeof jsApiList === 'string') {
                apiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showMenuItems', 'checkJsApi'];
                apiList.push(jsApiList);
            } else {
                apiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showMenuItems', 'checkJsApi'];
            }
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxJsapiSignature.appId, // 必填，公众号的唯一标识
                timestamp: wxJsapiSignature.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxJsapiSignature.noncestr, // 必填，生成签名的随机串
                signature: wxJsapiSignature.signature,// 必填，签名，见附录1
                jsApiList: apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.hideOptionMenu;
            });
        }
        else if (data.status == 2) {
            console.log("请求过期sessionId", data.data.sessionId)
            // localStorage.setItem("sessionid",data.data.sessionId);//放入sessionid
        }
    }

    public onGetIOError() {

    }



    /** 
    * param 将要转为URL参数字符串的对象
    * key URL参数字符串的前缀
    * encode true/false 是否进行URL编码,默认为true
    *  
    * return URL参数字符串
    */
    public urlEncode(param, key, encode, inside) {
        if (param == null) return ''
        let paramStr = ''
        const t = typeof (param)
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
        } else {
            for (let i in param) {
                const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += this.urlEncode(param[i], k, encode, true)
                // if (!inside && paramStr.indexOf("?") < 0) {
                // paramStr = "?" + paramStr.substring(1, paramStr.length)
                // }
            }
        }
        return paramStr
    }


}