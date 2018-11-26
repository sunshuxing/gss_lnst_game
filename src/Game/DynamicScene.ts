class DynamicScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/DynamicSkins.exml";
	}

	private btn_close:eui.Image;
	private scr_dyn:eui.Scroller;
	private list_dyn:eui.List;
	private line:eui.Image;
	private arr:any[] = []


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.searchDynamic(Help.getTreeUserData().id)
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeScene,this)
		this.scr_dyn.addEventListener(eui.UIEvent.CHANGE_END,this.asdas,this)
        this.scr_dyn.verticalScrollBar = null;
		this.scr_dyn.bounces = null;
        let dyndata:any[] = [
			{day:"11.02",icon:"bg",bg:"dynamic-bg-lv",label:"我的苹果树长大啦。",time:"7:20",state:0},
			{day:"11.02",icon:"bg",bg:"dynamic-bg-ju",label:"xxx给你留言",time:"9:20",des:"给TA留言",state:0},
			{day:"",icon:"bg",bg:"dynamic-bg-ju",label:"xxx拜访了你的果园",time:"20：00",des:"拜访TA",state:1},
			{day:"11.03",icon:"bg",bg:"dynamic-bg-huang",label:"某某某给你捣蛋，送你一个颗小野草。",time:"16:00",des:"给TA捣蛋",state:0},
            ]
		for(let i =0;i<dyndata.length;i++){
			this.arr.push(dyndata[i]);
		}
		this.arrsort(dyndata);
        // 转成eui数据
		let euiArr:eui.ArrayCollection = new eui.ArrayCollection(this.arr)
		this.line.height = euiArr.length*220;
		if(euiArr.length>4){
			this.line.height = 780;
		}
		euiArr.addItemAt({state:2},euiArr.length);
		// 把list_hero数据源设置成euiArr
		this.list_dyn.dataProvider = euiArr;
		// 设置list_hero的项呈视器 (这里直接写类名,而不是写实例)
		this.list_dyn.itemRenderer = dynList_item;
		 
		console.log("childrenCreated");
	}

	private asdas(){
		if(this.list_dyn.scrollV == this.list_dyn.contentHeight - this.list_dyn.height){
			console.log("滑动到了底部")
		}
		
	}

	//查询动态
	private searchDynamic(treeUserId){
		let params = {	
			treeUserId:treeUserId,
			pageNo:2
			};
		MyRequest._post("game/searchDynamic",params,this,this.Req_searchDynamic.bind(this),this.onGetIOError)
	}

	//查询动态信息成功后处理
	private Req_searchDynamic(data):void{
		var Data = data;
		if(Data.status == 0){
			var dyndata = Data.data.list;
		}
		console.log("动态数据:",Data)
	}

	//请求错误
	private onGetIOError(event:egret.IOErrorEvent):void {
    	console.log("get error : " + event);
	}

	
	//数组排序
	private arrsort(arr){
		for(let i=0;i<arr.length;i++){
			for(let j = 0;j < arr.length-i-1;j++){
					let t = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = t;
			}
		}
	}

    private onComplete():void{
        console.log("onComplete"); 
    }


	//关闭该场景
    private closeScene(){
        let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
        this.parent.dispatchEvent(Removemask);
        SceneManager.toMainScene();
    }


}


class dynList_item extends eui.ItemRenderer{
    private dyn_day:eui.Label;						//日期
	private user_icon:eui.Image;					//头像
	private dyn_bg:eui.Image;						//背景
	private dyn_label:eui.Label;					//动态消息
	private dyn_time:eui.Label;						//时间
	private dyn_des:eui.Label;						//描述
	private dynList_State:dynList_State;			//item状态
	private dyn_toother:eui.Group;					//去他人果园

    public constructor() {
		super()
		// 把这个 类和皮肤 联系起来
		this.skinName = 'resource/skins/DynamicListSkins.exml'
		// 当组件创建完成的时候触发
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
		this.dyn_toother.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
            this.toother(this.data.day)
		}, this)
	}
	private onComplete() {
		
	}
	// 当数据改变时，更新视图
	protected dataChanged() {
		this.setState(this.data.state);
		this.dyn_day.text = this.data.day;
		this.user_icon.texture = RES.getRes(this.data.icon+"_png");
		this.dyn_bg.texture = RES.getRes(this.data.bg);
		this.dyn_label.text = this.data.label;
		this.dyn_time.text = this.data.time;
		this.dyn_des.text = this.data.des;
	}

	// 去他人花园
	private toother(id){
		console.log(id);
	}


	private setState(dynList_State){
		if(dynList_State == 0){
			this.currentState = "day";
		}
		else if(dynList_State == 1){
			this.currentState = "noday";
		}
		else{
			this.currentState = "nomore";
		}
	}
}
enum dynList_State{day,noday,nomore}