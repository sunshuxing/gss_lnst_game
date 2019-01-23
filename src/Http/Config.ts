class Config{
    // public static wxhttpServer = "http://www.guoss.net/test_gsswe/"
    public static wxhttpServer = "http://192.168.3.19:8337/gsswe/"
    
    /**
     * 后台图片服务
     */
    // public static imgServer = "http://192.168.3.10:8080/gssmanage/"
    public static imgServer = "http://m.guoss.net/gssmanage/"

    //测试线上的web主页，正式版去除test
    public static webHome = "http://www.guoss.net/wefruitmall/"

    public static socketHome = "ws://www.guoss.net/test_gsswe/websocket"

    public static projectName = '/gsswe';// /roadshow  线上配置 空字符
    public static homeServer = location.protocol + '//' + location.host+ Config.projectName;
    public static apiServer = location.protocol + '//' + location.host+ Config.projectName +"/";
    public static picurl = 'http://192.168.3.10:8080/gssmanage';
    // public static picurl = 'http://s.guoss.net';
    public static config = {
		// 项目根名称
		projectName : Config.projectName,
		// 项目根目录
		serverPath : Config.homeServer,
		staticPath: Config.homeServer + "/res/web/",
		//访问根目录resource
		resPath: Config.homeServer + "/resources/roadshow/web/",
		// web端服务器请求地址
		server : Config.homeServer +  "/web/",
		// 静态页面跳转地址
		jumpServer : Config.homeServer + '/',
		back : Config.homeServer + "/back/",
		// 微信端服务器请求地址
		wechat : Config.homeServer + "/wechat/",
		apiServer : Config.apiServer,
		isLoadFlexible:true,
		// 获取本地静态图片路径的!!!
		staticImgs : Config.homeServer +"/resources/roadshow/web/images/"
    };
        // 本地像静态文件路径
        public static localStaticImg = Config.config.staticImgs; // 直接加图片名称


        /************************************ 登录注册开始 ***************************************************/
        //手机密码登录
        public static loginByPassword = Config.config.apiServer + "login/loginByPassword";
        //获取短信验证码
        public static getAuthCode = Config.config.apiServer + "common/sendAuthCode";
        // 获取图片验证码
        public static setImageCode = Config.config.apiServer + "user/setImageCode.html";
        // 验证码登录接口
        public static authcodeLogin = Config.config.apiServer + "login/loginByAuthCode";

}