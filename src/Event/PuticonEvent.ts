class PuticonEvent extends egret.Event {
		public static PUTGRASS:string = "放草";
		public static PUTINSECT:string = "放虫";
		public static USEHUAFEI:string = "使用化肥";
		public static TOFRIEND:string = "进入他人花园";
		public static LEAVEMSG:string = "留言";

		public templateId:Number;
		public userid:Number;
		public Type:Number;
		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
			
        super(type, bubbles, cancelable);
    }
    
}