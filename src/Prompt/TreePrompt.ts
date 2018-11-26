class TreePrompt extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TreePromptSkins.exml";
	}

	private tree_label:eui.Label;			//弹出消息
	private background: eui.Image;			//背景

    protected childrenCreated():void{
		super.childrenCreated();
    }

	/**
	 * 根据字体，调整背景高度
	 */
	public setBackHeight(multiple: number){
		this.background.height = multiple * 30 + 66
	}


    private onComplete():void{

    }

	public setPrompt(content){
		this.tree_label.text = content;
	}

}

