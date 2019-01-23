class FriendList_item extends eui.ItemRenderer{
	
	private friend_icon:eui.Image;			//好友头像
	private friend_name:eui.Label;			//好友名称
	private tree_icon:eui.Image;			//好友果树图标

    public constructor() {
		super()
		// 把这个 类和皮肤 联系起来
		this.skinName = 'resource/skins/FriendListSkins.exml'
		// 当组件创建完成的时候触发
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
	}
	private onComplete() {
		
	}
	// 当数据改变时，更新视图
	protected dataChanged() {
		let user = this.data.friendUser
		HttpRequest.imageloader(Config.picurl+Help.getfriendIcon()[user],this.friend_icon,user);
		this.friend_name.text = Help.getcharlength(this.data.friendUserName,2);
		if(this.data.trees.length == 0){
			this.tree_icon.texture = RES.getRes("shuidi");
			this.tree_icon.visible = true;
		}
		else{
			this.tree_icon.visible = false;
		}
		// if(this.data.friendTreeIcon){
		// 	HttpRequest.imageloader(Config.picurl+this.data.friendTreeIcon,this.tree_icon);
		// }else{
		// 	this.tree_icon.texture = RES.getRes("shuidi")
		// }
	}

}