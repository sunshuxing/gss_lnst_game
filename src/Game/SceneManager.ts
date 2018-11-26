class SceneManager {
	private _stage:egret.DisplayObjectContainer // 设置所有场景所在的舞台(根)

	public mainScene:MainScene                  //主场景
    public interactiveScene:InteractiveScene    //互动场景
    public taskScene:TaskScene                  //任务场景
    public dynamicScene:DynamicScene            //动态场景
    public signinScene:SigninScene              //领取种子场景
    public huafeiScene:HuafeiScene              //化肥场景
    public treePrompt:TreePrompt                //弹出消息框
    public friendSign:string                    //转发用户的标识，可以用于奖励道具
    public weixinUtil:WeixinUtil                //微信操作类


	constructor() {
        this.mainScene = new MainScene()
        this.interactiveScene = new InteractiveScene()
        this.taskScene = new TaskScene()
        this.dynamicScene = new DynamicScene()
        this.signinScene = new SigninScene()
        this.huafeiScene = new HuafeiScene()
        this.treePrompt = new TreePrompt()
        this.weixinUtil = new WeixinUtil()
        this.friendSign = MyRequest.geturlstr("friendSign")
    }

	/**
     * 获取实例
     */
    static sceneManager:SceneManager
    static get instance(){
        if(!this.sceneManager) {
            this.sceneManager =  new SceneManager()
        } 
        return this.sceneManager
    }
    /**
     * 设置根场景
     */
    public setStage(s:egret.DisplayObjectContainer) {
        this._stage = s
    }

    public  checkAddFriend(){
        let addFriend = MyRequest.geturlstr("addFriend")
        if(addFriend && addFriend == "true" && this.friendSign){
            if(this.friendSign != this.weixinUtil.login_user_id){
                //如果分享的用户和当前用户不一样，又需要加好友，则处理加好友
                let data = {
                    friendUser: this.friendSign
                }
                MyRequest._post("game/addFriend",data,this,this.loadFirend.bind(this),null)
            }
        }
    }
    private loadFirend(){
        this.mainScene.getFriends();  //加好友成功需要刷新好友列表
    }

    /**
     * 提示消息显示在主场景
     * msg  消息
     * stage 要展示的舞台对象
     * time 显示持续时间（1000为1秒），不传默认1.5秒
     */
    static addNotice(msg:string,time?) {

        let notice: Notice = new Notice();

        if(!time){
            time = 1500
        }
        let timer: egret.Timer = new egret.Timer(time, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            this.instance._stage.removeChild(notice)
        }
            , this);
        notice.msgInfo(msg);
        this.instance._stage.addChild(notice);
        timer.start();
    }

    /**
     * 删除其他场景
     * @param scene 不需要删除的场景
     */
    private removeOther(scene) {
        let arr = [this.interactiveScene,this.taskScene,this.dynamicScene,this.signinScene,this.huafeiScene]
        arr.forEach((item)=> {
            if(scene === item) {
                return 
            }
            if(item.parent) {
                this.mainScene.removeChild(item)
            }
        })
    }

    /**
     * 主场景
     */
    static toMainScene() {
        let stage:egret.DisplayObjectContainer = this.instance._stage // (根) 舞台
        let mainScene = SceneManager.instance.mainScene // 主场景
        mainScene.y = -140
        // 判断主场景是否有父级(如果有,说明已经被添加到了场景中)
        if(!mainScene.parent){
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(mainScene)
        } 
        SceneManager.instance.removeOther(SceneManager.instance.mainScene)
    }

    /**
     * 互动场景
     */
    static toInteractiveScene() {
        this.instance.removeOther(this.instance.interactiveScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.interactiveScene)
        egret.Tween.get(this.instance.interactiveScene)
        .set(this.instance.interactiveScene.y = 1208)
        .to({y:0},500); 
    }

    /**
     * 任务场景
     */
    static toTaskScene() {
        this.instance.removeOther(this.instance.taskScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.taskScene)
         egret.Tween.get(this.instance.taskScene)
        .set(this.instance.taskScene.y = 1208)
        .to({y:0},500);
    }

    /**
     * 动态场景
     */
    static toDynamicScene() {
        this.instance.removeOther(this.instance.dynamicScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.dynamicScene)
         egret.Tween.get(this.instance.dynamicScene)
        .set(this.instance.dynamicScene.y = 1208)
        .to({y:0},500);
    }


    /**
     * 领取种子场景
     */
    static toSigninScene() {
        this.instance.removeOther(this.instance.signinScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.signinScene)
    }

    static tohuafeiScene(){
        this.instance.removeOther(this.instance.huafeiScene)
        // 把互动场景添加到主场景中
        this.instance.mainScene.addChild(this.instance.huafeiScene)
    }

    
    /**
     * 添加弹窗
     */
    static addtreePrompt(info){
        let treeprompt = new TreePrompt();
        treeprompt.y = 656;
        treeprompt.x = 208;
        let timer:egret.Timer = new egret.Timer(3000,1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,()=>{
            this.instance.mainScene.removeChild(treeprompt)
        } 
        ,this);
        treeprompt.setPrompt(info);
        this.instance.mainScene.addChild(treeprompt);
        timer.start();
    }


    /**
     * 添加提示框
     */

    static addPrompt(content,btn,ti){
        let prompt = new Prompt();
        prompt.x = 85;
        prompt.y = 430;
        prompt.setPrompt(content,btn,ti);
        this.instance._stage.addChild(prompt);
    }

    static addJump(){
        let jump = new JumpScene();
        this.instance.mainScene.addChild(jump);
    }
}