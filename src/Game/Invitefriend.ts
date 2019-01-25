class Invitefriend extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/InvitefriendSkins.exml";
    }

    private invitebtn: eui.Image;                                //邀请好友
    private toother: eui.Image;                                  //去其他地
    private onComplete() {
        if(SceneManager.instance.landId == 1){
            this.toother.texture = RES.getRes("tocaiyuan_png");
        }
        else if(SceneManager.instance.landId == 2){
            this.toother.texture = RES.getRes("toguoyuan_png")
        }
        this.x = (SceneManager.sceneManager._stage.width - this.width)/2;
        this.y = (SceneManager.sceneManager._stage.height - this.height)/2 - 100;
        this.invitebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Invite, this);               //邀请好友点击监听
        this.toother.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Toother, this)
    }


    /**
     * 邀请好友
     */
    private Invite() {
        this.remove();
        SceneManager.addJump("sharetexttree_png");
    }

    /**
     * 去其他地
     */
    private Toother() {
        this.remove();
        if (SceneManager.instance.landId == 1) {                                    //果园去菜园
            SceneManager.instance.landId = 2;
            SceneManager.toNewMain2Scene();
            if (Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1]) {
                let friendtreedataid = Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1].id;
                NewHelp.getTreeInfoByid(friendtreedataid);
            }
            else {
                SceneManager.sceneManager.newmain2Scene.updateBytreedata(null);
            }
            Help.passAnm();
        }
        else if (SceneManager.instance.landId == 2) {                                   //菜园去果园
            SceneManager.instance.landId = 1;
            SceneManager.toNewMainScene();
            if (Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1]) {
                let friendtreedataid = Datamanager.getnowfrienddata().trees[SceneManager.instance.landId - 1].id;
                NewHelp.getTreeInfoByid(friendtreedataid);
            }
            else {
                SceneManager.sceneManager.newmainScene.updateBytreedata(null);
            }
            Help.passAnm();
        }
    }

    public remove() {
        NewHelp.removemask();
        if(this.parent){
            this.parent.removeChild(this);
        }
    }
}