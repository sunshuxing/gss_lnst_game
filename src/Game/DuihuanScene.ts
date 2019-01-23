class DuihuanScene extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/DuihuanSkins.exml";
    }

    private duihuanscr: eui.Scroller;
    private duihuanlist: eui.List;
    private euiArr: eui.ArrayCollection = new eui.ArrayCollection();                    //列表数据
    private duihuanfriendscr: eui.Scroller;
    private duihuanfriendlist: eui.List;
    private euifriendarr: eui.ArrayCollection = new eui.ArrayCollection();               //点赞好友
    private close_btn:eui.Image;

    private onComplete() {
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.close,this)
        this.searchPraiseExchange();
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.duihuanscr.verticalScrollBar = null;
        this.duihuanlist.dataProvider = this.euiArr;
        this.duihuanlist.itemRenderer = DuihuanList_item;
        this.duihuanfriendscr.horizontalScrollBar = null;
        this.duihuanfriendlist.dataProvider = this.euifriendarr;
        this.duihuanfriendlist.itemRenderer = DuihuanfriendList_item;
    }


    private perNum = 1;

    
    /**
     * 关闭场景
     */
    private close(){
        NewHelp.removemask();
        if(this.parent){
            this.parent.removeChild(this);
        }
    }


    /**
	 * 查询点赞记录
	 */

	public searchOwnPraise() {
		let params = {
			pageNo: 1,
			numPerPage: 10000
		};
		MyRequest._post("game/searchOwnPraise", params, this, this.Req_searchOwnPraise.bind(this), null)
	}

	private Req_searchOwnPraise(data) {
		console.log("别人给你点赞数据", data);
        let listdata = data.data.list
        this.euifriendarr.removeAll();
        for (let i = 0; i < listdata.length; i++) {
            this.euifriendarr.addItem(listdata[i]);
        }
	}



    /**
     * 查询奖励兑换规则
     */
    public searchPraiseExchange() {
        let params = {
            pageNo: this.perNum,
            numPerPage: 10000
        };
        MyRequest._post("game/searchPraiseExchange", params, this, this.Req_searchPraiseExchange.bind(this), null)
    }

    private Req_searchPraiseExchange(data) {
        //useType:0   固定道具      useType:1    随机道具          useType:2     种子
        console.log(data.data.list, "奖励规则道具");
        let listdata = data.data.list
        this.euiArr.removeAll();
        for (let i = 0; i < listdata.length; i++) {
            this.euiArr.addItem(listdata[i]);
        }

    }

}



class DuihuanList_item extends eui.ItemRenderer {
    public constructor() {
        super()
        // 把这个类和皮肤联系起来
        this.skinName = 'resource/skins/DuihuanlistSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }
    private likeneed: eui.Label;                     //自己获得点赞数/兑换所需点赞数
    private prop: eui.Image;                         //道具图片
    private propname: eui.Label;                     //道具数量和名称   
    private duihuanbtn: eui.Image;                   //兑换按钮图片


    private onComplete() {
        this.duihuanbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.duihuan, this)
    }

    // 当数据改变时，更新视图
    protected dataChanged() {
        this.likeneed.text = SceneManager.sceneManager.StageItems.like_num.text + "/" + this.data.num;
        if (this.data.isExchanged == "false") {
            this.duihuanbtn.texture = RES.getRes("duihuanno_png");
        }
        else if (this.data.isExchanged == "true") {
            this.duihuanbtn.texture = RES.getRes("duihuancan_png");
        }
        this.prop.texture = RES.getRes("smallshui_png");
        this.propname.text = this.data.rewardRule.name;
    }

    private duihuan() {
        console.log(this.data.id)
        if (Number(SceneManager.sceneManager.StageItems.like_num.text) < this.data.num) {
            SceneManager.addNotice("点赞数不够兑换哦！")
        }
        else {
            if (this.data.isExchanged == "false") {
                NewHelp.duihuan(this.data.id);
            }
            else {
                SceneManager.addNotice("您已经兑换过了哦！")
            }
        }
    }
}



class DuihuanfriendList_item extends eui.ItemRenderer {
    public constructor() {
        super()
        // 把这个类和皮肤联系起来
        this.skinName = 'resource/skins/DuihuanfriendlistSkins.exml'
        // 当组件创建完成的时候触发
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
    }

    private friend_icon: eui.Image;                  //好友头像


    private onComplete() {

    }

    // 当数据改变时，更新视图
    protected dataChanged() {
        let params = {
            users: this.data.user
        }
        MyRequest._post("game/getWechatImg", params, this, NewHelp.Req_WechatImg.bind(this, this.data.user, this.friend_icon), null);
    }
}