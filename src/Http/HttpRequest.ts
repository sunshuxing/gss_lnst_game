class HttpRequest {
    public static map: { [key: string]: egret.Texture } = {};//创建一个map,用于存放用户头像，减少加载
    public static errMap:{[key: string]:Boolean} ={};//IO错误，除非刷新页面，否则
    //加载网络图片
    public static imageloader(url, image, user?: string, success?: Function, _this?: Object):number {
        try {
            if (user && this.map[user]) {
                image.texture = this.map[user];
                if (_this) {
                    success.call(_this)
                } else {
                    success
                }
                return;
            }
            let imgLoader = new egret.ImageLoader();
            imgLoader.crossOrigin = "anonymous";// 跨域请求
            if (url == Config.picurl || url == Config.picurl + "undefined") {
                return;
            }
            if(this.errMap[url]){//加载错误，当次不加载
                return 1;
            }
            imgLoader.load(url);// 去除链接中的转义字符‘\’        
            imgLoader.once(egret.Event.COMPLETE, function (evt: egret.Event) {
                if (evt.currentTarget.data) {
                    let texture = new egret.Texture();
                    texture.bitmapData = evt.currentTarget.data;
                    image.texture = texture;
                    if (_this) {
                        success.call(_this)
                    } else {
                        success
                    }
                    if (user && !this.map[user]) {//保存用户初次头像
                        this.map[user] = texture;
                    }
                }
            }, this);
            imgLoader.once(egret.IOErrorEvent.IO_ERROR, function (evt: egret.Event) {
                this.errMap[url] = true;
            }, this)
        } catch (e) { console.log("图片加载错误", e); return 1; }
    }
}