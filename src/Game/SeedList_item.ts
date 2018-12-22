class SeedList_item extends eui.ItemRenderer{
	
	private icon:eui.Image;			    //种子头像
	private label:eui.Label;			//种子名称

    public constructor() {
		super()
		// 把这个 类和皮肤 联系起来
		this.skinName = 'resource/skins/SeedListSkins.exml'
		// 当组件创建完成的时候触发
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
	}
	private onComplete() {
		
	}
	// 当数据改变时，更新视图
	protected dataChanged() {
        this.icon.width = 60;
        this.icon.height = 60; 
		HttpRequest.imageloader(Config.picurl+this.data.seedIcon,this.icon);
        this.label.text = this.data.name;
	}
}