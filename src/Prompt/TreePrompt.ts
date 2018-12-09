class TreePrompt extends eui.Component implements eui.UIComponent{
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/skins/TreePromptSkins.exml";
		
	}

	private tree_label:eui.Label;			//弹出消息
	private background:eui.Image;			//背景
	private background2:eui.Image;


    protected childrenCreated():void{
		super.childrenCreated();
		this.background2.y = this.background.height - 3;
    }

    private onComplete():void{

    }

	public setPrompt(content){
		this.tree_label.maxWidth = 340;
		this.tree_label.text = content;
		this.width = this.tree_label.width + 40;
		this.background.height = this.tree_label.height+40;
		this.background2.y = this.background.height - 3;
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height;
	}

}

