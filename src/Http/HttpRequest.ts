class HttpRequest {

    //加载网络图片
    public static imageByUrl(url, image) {
        try {
            let imgLoader = new egret.ImageLoader();
            imgLoader.crossOrigin = "anonymous";// 跨域请求
            imgLoader.load(url);// 去除链接中的转义字符‘\’        
            imgLoader.once(egret.Event.COMPLETE, function (evt: egret.Event) {
                if (evt.currentTarget.data) {
                    let texture = new egret.Texture();
                    texture.bitmapData = evt.currentTarget.data;
                    image.texture = texture;
                }
            }, this);
        } catch (e) { console.log("图片加载错误",e) }
    }

    public static imageloader(url,image:eui.Image){
         RES.getResByUrl(url,function(data){
            image.texture = data;
        },this,RES.ResourceItem.TYPE_IMAGE);
    }
}