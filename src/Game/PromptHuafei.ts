class PromptHuafei extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/PromptHuafeiSkins.exml";
	}

	private prompt_label:eui.Label;			//提示内容
    private btn_label:eui.Label;            //按钮文字
    private use_btn:eui.Group;              //使用按钮
    private close_btn:eui.Group;            //取消按钮
    private prompt_ti:eui.Label;            //
    private use:Function;

    protected childrenCreated():void{
		super.childrenCreated();
        this.use_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.use,this);
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this);
        this.prompt_label.text = "您使用的化肥不适合当前阶段";
    }

    public setPrompt(tishi){
        this.prompt_ti.text = tishi;
	}

    public setUse(type){
        if(type == 1){
                this.use = ()=>{
                SceneManager.sceneManager.huafeiScene.useProp(type+3,type)
            }
        }
        if(type == 2){
                this.use = ()=>{
                SceneManager.sceneManager.huafeiScene.useProp(type+3,type)
            }
        }
        if(type == 3){
                this.use = ()=>{
                SceneManager.sceneManager.huafeiScene.useProp(type+3,type)
            }
        }
    }

    private onComplete():void{
        SceneManager.sceneManager.mainScene.enabled = false;
    }

    private remove(){
       if(this.parent){
           SceneManager.sceneManager.mainScene.enabled = true;
           this.parent.removeChild(this);
           let Removemask:MaskEvent = new MaskEvent(MaskEvent.REMOVEMASK);
           SceneManager.sceneManager.mainScene.dispatchEvent(Removemask);
           SceneManager.toMainScene();
       }
    }

    
}


