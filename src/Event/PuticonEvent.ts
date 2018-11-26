class PuticonEvent extends egret.Event {
		public static PUTGRASS:string = "放草";
		public static PUTINSECT:string = "放虫";
		public static USEHUAFEI:string = "使用化肥";
		public Type:Number;
		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
			
        super(type, bubbles, cancelable);
    }
    
}