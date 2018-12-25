class PromptHuafei extends eui.Component implements eui.UIComponent{
	public constructor(func?:Function) {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/PromptHuafeiSkins.exml";
        if(func){
            this.action = func
        }
	}
    private action:Function;

	private prompt_label:eui.Label;			//提示内容
    private label_btn:eui.Label;            //按钮文字
    private use_btn:eui.Group;              //使用按钮
    private close_btn:eui.Group;            //取消按钮
    private prompt_ti:eui.Label;            //
    private use:Function;

    protected childrenCreated():void{
		super.childrenCreated();
        if(this.action){
            this.use_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.action,this);
        }else{
            this.use_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.use,this);
        }
        this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.remove,this);
        }

    public setPrompt(label,tishi,btn){
        this.prompt_label.text = label;
        this.prompt_ti.text = tishi;
        this.label_btn.text = btn;
	}

    public setUse(type){
        if(type == 1){
                this.use = ()=>{
                this.remove();
                SceneManager.sceneManager.getHuafeiScene().useProp(type+3,type)
            }
        }
        if(type == 2){
                this.use = ()=>{
                this.remove();
                SceneManager.sceneManager.getHuafeiScene().useProp(type+3,type)
            }
        }
        if(type == 3){
                this.use = ()=>{
                this.remove();
                SceneManager.sceneManager.getHuafeiScene().useProp(type+3,type)
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


