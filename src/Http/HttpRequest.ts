class HttpRequest {

    //加载网络图片
    public static imageloader(url, image) {
        try {
            let imgLoader = new egret.ImageLoader();
            imgLoader.crossOrigin = "anonymous";// 跨域请求
            imgLoader.load(url);// 去除链接中的转义字符‘\’        
            imgLoader.once(egret.Event.COMPLETE, function (evt: egret.Event) {
                if (evt.currentTarget.data) {
                    let texture = new egret.Texture();
                    texture.bitmapData = evt.currentTarget.data;
                    let bitmap = new egret.Bitmap(texture);
                    image.texture = texture;
                }
            }, this);
        } catch (e) { console.log("图片加载错误",e) }
    }
}