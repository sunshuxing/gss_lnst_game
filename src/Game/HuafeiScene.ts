class HuafeiScene extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/HuafeiSkins.exml";
	}

    private youji_btn:eui.Button;
    private fuhe_btn:eui.Button;
    private shuirong_btn:eui.Button;
    public youji_num:eui.Label;
    public fuhe_num:eui.Label;
    public shuirong_num:eui.Label;
    private prop_scr:eui.Scroller;

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