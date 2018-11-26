class TreePrompt extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TreePromptSkins.exml";
	}

	private tree_label:eui.Label;			//弹出消息

    protected childrenCreated():void{
		super.childrenCreated();
    }


    private onComplete():void{

    }

	public setPrompt(content){
		this.tree_label.text = content;
	}

}

