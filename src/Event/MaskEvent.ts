class MaskEvent extends egret.Event {
		public static ADDMASK:string = "添加遮罩";
		public static REMOVEMASK:string = "移除遮罩";
		public static REMOVEMASKWITH:string = "移除遮罩刷新页面";
		public static INITEUIARR:string = "重置动态数据"
		public static SHARECLOSE:string = "分享页关闭"

		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
    
}