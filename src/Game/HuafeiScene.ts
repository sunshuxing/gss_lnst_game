class HuafeiScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/HuafeiSkins.exml";
	}

    private youji_btn:eui.Group;
    private fuhe_btn:eui.Group;
    private shuirong_btn:eui.Group;
    public youji_num:eui.Label;
    public fuhe_num:eui.Label;
    public shuirong_num:eui.Label;
    private prop_scr:eui.Scroller;
    private grass_btn:eui.Group
    private insect_btn:eui.Group
    public grass_num:eui.Label;
    public insect_num:eui.Label;
    private duckfood_btn:eui.Image;
    public duckfood_num:eui.Label;

    protected childrenCreated():void
	{
		super.childrenCreated();
        this.prop_scr.horizontalScrollBar = null;
        localStorage.setItem("huafeisee","true");
    }

    private onComplete():void{
        this.y = SceneManager.sceneManager._stage.height - this.height - 230;
        this.x = 120;
        this.youji_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useyouji,this);
        this.fuhe_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.usefuhe,this)
        this.shuirong_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useshuirong,this)
        this.grass_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.usegrass,this)
        this.insect_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useinsect,this)
        this.duckfood_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.useduckfood,this)
    }


    private useduckfood(){
        if(Number(this.duckfood_num.text) >= 1){
            let treedata = Datamanager.getNowtreedata()
            NewHelp.useProp(8,treedata);
        }
        else{
            let content = "您的鸭食用完了哦~"
			let btn = "确定"
			let ti = "(可以通过任务获得哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
            this.colseScene()
    }

    private usegrass(){
        if(Number(this.grass_num.text) >= 1){
            let treedata = Datamanager.getNowtreedata()
            NewHelp.useProp(10,treedata);
        }
        else{
            let content = "您的草用完了哦~"
			let btn = "确定"
			let ti = "(可以通过除草获得哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
            this.colseScene()
    }

    private useinsect(){
        if(Number(this.insect_num.text) >= 1){
            let treedata = Datamanager.getNowtreedata()
            NewHelp.useProp(9,treedata);
        }
        else{
            let content = "您的虫用完了哦~"
			let btn = "确定"
			let ti = "(可以通过除虫获得哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
            this.colseScene()
    }

    private useyouji(){
        if(Number(this.youji_num.text) >= 1){
            let treedata = Datamanager.getNowtreedata()
            NewHelp.useProp(4,treedata);
        }
        else{
            let content = "您的有机肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
            this.colseScene()
    }

    private usefuhe(){
        if(Number(this.fuhe_num.text) >= 1){
                let treedata = Datamanager.getNowtreedata()
                NewHelp.useProp(5,treedata);
        }
        else{
            let content = "您的复合肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
            this.colseScene()
    }

    private useshuirong(){
        if(Number(this.shuirong_num.text) >= 1){
            let treedata = Datamanager.getNowtreedata()
                NewHelp.useProp(6,treedata);
        }
         else{
            let content = "您的水溶肥用完了哦~"
			let btn = "确定"
			let ti = "(可以通过完成任务和签到获取哦！)"
			SceneManager.addPrompt(content, btn, ti);
        }
        this.colseScene()
    }

    private colseScene(){
        NewHelp.removemask()
        if(this.parent){
            this.parent.removeChild(this);
        }
    }
}