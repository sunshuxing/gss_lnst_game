class FriendList_item extends eui.ItemRenderer{
	
	private friend_icon:eui.Image;			//好友头像
	private friend_name:eui.Label;			//好友名称
	private tree_icon:eui.Image;			//好友果树图标
	private tree_icon1:eui.Image;
	private tree_icon2:eui.Image;

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
		if(!this.data.trees||this.data.trees.length == 0){
			this.tree_icon.texture = RES.getRes("shuidi");
			this.tree_icon.visible = true;
		}
		else{
			this.tree_icon.visible = false;
		}
		if(this.data.trees){
			if(this.data.trees.length == 1){
				HttpRequest.imageloader(Config.picurl+this.data.trees[0].seedIcon,this.tree_icon1);
			}
			else if(this.data.trees.length == 2){
				HttpRequest.imageloader(Config.picurl+this.data.trees[0].seedIcon,this.tree_icon1);
				HttpRequest.imageloader(Config.picurl+this.data.trees[1].seedIcon,this.tree_icon2);
			}
		}
		// if(this.data.friendTreeIcon){
		// 	HttpRequest.imageloader(Config.picurl+this.data.friendTreeIcon,this.tree_icon);
		// }else{
		// 	this.tree_icon.texture = RES.getRes("shuidi")
		// }
	}

}