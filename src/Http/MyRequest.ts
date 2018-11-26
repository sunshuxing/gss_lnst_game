class MyRequest{

    /**
     * _url 接口地址，如game/getTree
     * _params 请求参数对象，如果没有则传null
     * _this 当前对象，用于绑定请求回调
     * _success 请求成功回调事件
     * _err 请求失败回调
     */
    public static _post(_url:string,_params: Object,_this: Object,_success: Function,_err: Function):void{
        let request = new egret.HttpRequest();
        let _paramStr = "";
        request.responseType = egret.HttpResponseType.TEXT;
        request.withCredentials = true;
        request.open(Config.wxhttpServer + _url,egret.HttpMethod.POST);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        if(_params){
            _paramStr =WeixinUtil.prototype.urlEncode(_params,null,null,null)
            request.send(_paramStr);
        }else{
            request.send();
        }
        //成功回调
        function sussessHandle(event:egret.Event){
            var request = <egret.HttpRequest>event.currentTarget;
		    var data = JSON.parse(request.response);
            if(data.status == 1){//错误
                console.log("错误:",data.msg)
                SceneManager.addNotice(data.msg)
            }else{
                if(_success){
                    if(_success)
                    _success.call(_this,data);
                }
            }
        }
        request.addEventListener(egret.Event.COMPLETE,sussessHandle,_this);
        if(_err){
		    request.addEventListener(egret.IOErrorEvent.IO_ERROR,_err,_this);
        }
    }

    /**
 * 从url获取某个属性的值,如果不传，则获取当前url，否则检索传入url
 */
public static geturlstr(name:string,url?){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r; 
        if(!url){
            r =window.location.search.substr(1).match(reg);
        }else{
            r = url.split("?")[1].substr(1).match(reg);
        }
        if (r!=null) return decodeURI((r[2])); return '';
    }
}