class ActRewardScene extends eui.Component implements eui.UIComponent {
    public constructor(rewarddata) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/ActRewardSkins.exml";
        this.rewarddata = rewarddata;
    }

    private reward_group: eui.Group;
    private reward_btn: eui.Image;
    private rewarddata;

    protected childrenCreated(): void {
        super.childrenCreated();
        this.addrewarditem()
        this.y = (SceneManager.sceneManager._stage.height - this.height) / 2;
        this.x = (SceneManager.sceneManager._stage.width - this.width) / 2;
    }


    private onComplete() {
        this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.remove, this);
    }


    private addrewarditem() {
        if (this.rewarddata) {
            let group = new eui.Group;
            let itembg = new eui.Image;
            let itemicon = new eui.Image;
            let itemname = new eui.Image;
            let itemnum = new eui.BitmapLabel;
            let itemtxtname = new eui.Label


            itembg.width = 190;
            itembg.height = 250;
            itembg.texture = RES.getRes("act_reward_itembg_png");

            itemicon.width = 80;
            itemicon.height = 90;
            let texture = NewHelp.gettextrueBypropid(this.rewarddata.propId, this.rewarddata.propType)
            if (texture != "close") {
                itemicon.texture = RES.getRes(texture);
            }
            else {
                if (this.rewarddata.seedIcon) {
                    HttpRequest.imageloader(Config.picurl + this.rewarddata.seedIcon, itemicon);
                }
            }
            itemicon.horizontalCenter = -20;
            itemicon.top = 55;

            let nametexture = NewHelp.getnameBypropid(this.rewarddata.propId)
            if (nametexture != "close") {
                itemname.texture = RES.getRes(nametexture);
            }
            else {
                itemtxtname.text = this.rewarddata.propName;
            }

            itemtxtname.horizontalCenter = 0;
            itemtxtname.bottom = 24;
            itemtxtname.size = 24;
            itemtxtname.strokeColor = 0xA44802;   
            itemtxtname.stroke = 2;              
            itemtxtname.fontFamily = "Microsoft YaHei";     

            itemname.scaleX = 0.7;
            itemname.scaleY = 0.7;
            itemname.horizontalCenter = 0;
            itemname.bottom = 20;

            itemnum.x = 120;
            itemnum.font = "waternum_fnt";
            itemnum.text = "x" + this.rewarddata.propNum;
            itemnum.y = 118;

            group.addChild(itembg);
            group.addChild(itemicon);
            group.addChild(itemname);
            group.addChild(itemtxtname);
            group.addChild(itemnum);
            this.reward_group.addChild(group);
        }
    }


    private remove() {
        NewHelp.removemaskwithoutcolse();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

}