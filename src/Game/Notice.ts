class Notice extends eui.Component implements eui.UIComponent {
    
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/skins/Notice.exml";
    }

    private notice_label:eui.Label;       //提示信息
    private notice_background:eui.Rect;

    protected childrenCreated():void{
		super.childrenCreated();
    }

    private onComplete():void{

    }


    /**
     * 提示消息
     */
        public msgInfo(msg:string,msgFlow?){
        if(msgFlow){
            this.notice_label.textFlow = msgFlow;
        }
        else{
            this.notice_label.text = msg;
        }
        
        this.notice_background.height = this.notice_label.height + 30;
        this.notice_background.width = this.notice_label.width + 50;

        this.verticalCenter = 0
        this.horizontalCenter = 0
    }
}