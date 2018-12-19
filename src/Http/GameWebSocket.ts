/**
 * 下面的示例使用 WebSocketExample 类创建新 WebSocket 对象，然后与服务器通讯。
 */
class GameWebSocket extends egret.DisplayObjectContainer {

    public constructor(url:string) {
        super();
        this.initWebSocket(url);
    }

    private stateText:egret.TextField;
    private text:string = "TestWebSocket";


    private socket:egret.WebSocket;

    private initWebSocket(url:string):void {
        //创建 WebSocket 对象
        this.socket = new egret.WebSocket();
        //设置数据格式为二进制，默认为字符串
        this.socket.type = egret.WebSocket.TYPE_STRING;
        //添加收到数据侦听，收到数据会调用此方法
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        //添加链接打开侦听，连接成功会调用此方法
        this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //添加异常侦听，出现异常会调用此方法
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //连接服务器
        this.socket.connectByUrl(url)
    }

    /**
     * 发送数据
     */
    public sendData(data:string):void {
        //写入字符串信息
        this.socket.writeUTF(data)
    }
    /**
     * 是否连接
     */
    public connected(){
        return this.socket.connected;
    }

    private onSocketOpen():void {
        //心跳，保持连接
        let that = this
        this.trace("WebSocketOpen");
    }

    private onSocketClose():void {
        this.trace("WebSocketClose");
    }

    private onSocketError():void {
        this.trace("WebSocketError");
    }

    private onReceiveMessage(e:egret.Event):void {
        let msg = this.socket.readUTF()
        //读取字符串信息
        this.trace(JSON.parse(msg));
        if(msg){
            let pushMsg = JSON.parse(msg);
            if(typeof pushMsg == 'string' ){
                pushMsg = JSON.parse(pushMsg)   //如果还是字符串则需要再进行一次转换
            }
            //处理推送消息
            if(pushMsg.type == "1" ||pushMsg.type == 1){
                //动态推送
                let code = pushMsg.code
                let info = "";
                switch(code){
                    case "visit" : {
                        info = "来拜访了你。"
                    }
                    break;
                    case "makeTrouble" : {
                        info = "来捣乱了！"
                        SceneManager.instance.mainScene.getTreeProp(Help.getOwnData().id);
                    }
                    break;
                    case "leaveMsg" : {
                        info = "给你留言了，快看看吧。"
                    }
                    break;
                    case "help" : {
                        info = "来农场帮忙了哦！"
                        SceneManager.instance.mainScene.getTreeProp(Help.getOwnData().id);
                    }
                    break;
                    case "water" : {
                        info = "来农场帮浇水了哦！"
                        SceneManager.instance.mainScene.getOwnTree();
                    }
                    break;
                    case "thiefWater" : {
                        info = "来偷水啦！"
                        SceneManager.instance.mainScene.getOwnProp();
                    }
                    break;
                    case "flushTake" : {
                        info = "帮你摘果了哦！"
                        SceneManager.instance.mainScene.getOwnTree();
                    }
                    break;
                }
                let userName = pushMsg.userName;
                let userId = pushMsg.userId;
                SceneManager.instance.mainScene.showDynamicMsg(info,userName,userId)
            }else if(pushMsg.type == "0"){//顶部推送,暂时用刷新，实际直接构建数据即可
                if(pushMsg.code =="systemInfo"){//系统推送
                    SceneManager.instance.mainScene.getSystemMsg(true)
                }else if(pushMsg.code == "topInfo"){//成长周期推送
                    SceneManager.instance.mainScene.getTopMsg(true)
                }
            }else if(pushMsg.type == "2"){//刷新好友请求
                SceneManager.instance.mainScene.getFriends();
            }
        }
    }


    private trace(msg:any):void {
        console.log("收到推送",msg)
    }
}