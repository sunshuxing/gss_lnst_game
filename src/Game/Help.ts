class Help{
   
    private static TreeUserData         //用户果树数据
    private static UserFriendData
    private static OwnData              //自己果树数据

    //保存用户果树数据
    public static saveTreeUserData(data){
        this.TreeUserData = data;
    }
    //获取用户果树数据
    public static getTreeUserData(){
        return this.TreeUserData;
    }

    //保存用户果树数据
    public static saveOwnData(data){
        this.OwnData = data;
    }
    //获取用户果树数据
    public static getOwnData(){
        return this.OwnData;
    }


    public static saveUserFriendData(data){
        this.UserFriendData = data;
    }

    public static getUserFriendData(){
        return this.UserFriendData;
    }

    /**
     * 通过用户获得果树id
     */

    public static getUserIdByUser(user,data){
        for(let i=0;i<data.length;i++){
            if(user == data[i].friendUser){
                return data[i].treeUserId
            }
        }
    }

    //限制字符串长度
    public static getcharlength(_str,_length){
        var reg = /[\u4e00-\u9fa5]/g,    //专业匹配中文
        slice = _str.substring(0, _length),
        chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
        realen = slice.length*2 - chineseCharNum;
        return _str.substr(0, realen) + (realen < _str.length ? "..." : "");
    }


    public static pushInfoarr(arr,Infoarr:any[]){
        for(let i=0;i<arr.length;i++){
            console.log(i);
            Infoarr.push(arr[i]);
        }
        return Infoarr;
    }

    public static getPropById(data,propId){
		//propId   1：水滴   2：爱心值  3:道具  4：有机肥  5:复合肥  6：水溶肥
		if(data){
			for (let i = 0; i < data.length;i++){
				if(data[i].propId == propId){
					return data[i];				//水滴数据
				}
			}
		}
	}

    //随机生成整数
    public static random_num(min:number,max:number){
        let Range = max - min;  
        let Rand = Math.random();  
        return (min + Math.round(Rand * Range));  
    }


    //获取阶段果树锚点长宽等
    public static getTreeHWBystage(stage,img:eui.Image){
        if(stage<2){
            img.width = 250;
            img.height = 257;
        }
        if(stage>1){
            img.width = 420;
            img.height = 433;
        }
        img.anchorOffsetX = img.width*0.5;
        img.anchorOffsetY = img.height;
    }

    //延迟time执行  restart_num
    public static waitFun(time:number,ComFun:Function,TimerFun){
        let timer:egret.Timer = new egret.Timer(1000,time);
        timer.addEventListener(egret.TimerEvent.TIMER,TimerFun,this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,ComFun,this);
        timer.start();
    }

    //摘果动画
    public static pickTwn(num){
        let timer:egret.Timer = new egret.Timer(150,num);
        timer.addEventListener(egret.TimerEvent.TIMER,this.fruitTwn,this);
        timer.start();
    }

    //果子动画
    public static fruitTwn(){
        let fruit = new eui.Image()
        fruit.x = 398;
        fruit.y = 605;
        fruit.width = 44;
        fruit.height = 50;
        HttpRequest.imageloader(Config.picurl+Help.getTreeUserData().seedIcon,fruit)
        SceneManager.sceneManager.mainScene.addChild(fruit);
        egret.Tween.get(fruit)
        .to({x:368,y:505},300)
        .to({x:200,y:1153,height:34,width:29},1400).call(()=>{SceneManager.sceneManager.mainScene.removeChild(fruit)},SceneManager.sceneManager.mainScene)
    }

    /**
     * 摘果动画完成之后更新
     */
    public static pickTwnupdata(Func){
        let timer:egret.Timer = new egret.Timer(2150,1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,Func,SceneManager.sceneManager.mainScene)
        timer.start();
    }


    //获取日期时间
    public static getTime(date,Type){
        //如果createDate为后台传入的Date类型，这里直接转化为毫秒数
        date = date.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
        let time = new Date(date);
        if(Type == "day"){
            return time.getMonth()+1+"."+time.getDate();
        }else if(Type == "hours"){
            if(time.getMinutes()<10){
                return time.getHours()+":0"+time.getMinutes();
            }
            else{
                return time.getHours()+":"+time.getMinutes();
            }
        }
    }

    //浇水气泡动画
    public static waters(){
        // let data:any = RES.getRes("waters_json");
        // let txtr:egret.Texture = RES.getRes("waters_png");
        // let water:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,txtr);
        // let waters:egret.MovieClip = new egret.MovieClip(water.generateMovieClipData("waters"));
        // SceneManager.sceneManager.mainScene.addChild(waters);
        // waters.x = 230;
		// waters.y = 650;
        // waters.gotoAndPlay(1,5);
        // waters.addEventListener(egret.Event.COMPLETE, function (e:egret.Event):void {
           
        // }, this);
        // var count:number = 0;
        // waters.addEventListener(egret.Event.LOOP_COMPLETE, function (e:egret.Event):void {
            
        // }, SceneManager.sceneManager.mainScene);
        // waters.addEventListener(egret.MovieClipEvent.FRAME_LABEL, function (e:egret.MovieClipEvent):void {
           
        // }, this);
    }
    

    //过场动画
    public static passAnm(){
        let left = new eui.Image;
        let right = new eui.Image;
        left.height = 1344;
        right.height = 1344;
        left.x = 0;
        left.y = 0;
        right.skewY = 180;
        right.x = 750;
        right.y = 0;
        left.texture = RES.getRes("pass_png");
        right.texture = RES.getRes("pass_png");
        SceneManager.sceneManager.mainScene.addChild(left);
        SceneManager.sceneManager.mainScene.addChild(right);
        egret.Tween.get(left)
        .wait(200)
        .to({x:-1089},1000)
        egret.Tween.get(right)
        .wait(200)
        .to({x:1839},1000)
    }

    public static grapos(n,icon){
        if(n == 1){
            return icon.x = 230,icon.y = 950;
		}
		else if(n == 2){
			return icon.x = 362,icon.y = 956;
		}
		else if(n == 3){
			return icon.x = 504,icon.y = 938;
		}
    }

    public static inspos(n,icon){
        if(n == 1){
			return icon.x = 536,icon.y = 872;
		}
		else if(n == 2){
			return icon.x = 295,icon.y = 932;
		}
		else if(n == 3){
			return icon.x = 436,icon.y = 930;
		}
    }


    public static stealshow(num){
        let img_water = new eui.Image();
        img_water.texture = RES.getRes("shuidi");
        img_water.x = 420;
        img_water.y = 797;
        SceneManager.sceneManager.mainScene.addChild(img_water);
        let label_water = new eui.Label();
        label_water.text = "+"+num + "g";
        label_water.textColor = 0x5AD0EC;
        label_water.x = 464;
        label_water.y = 815;
        SceneManager.sceneManager.mainScene.addChild(label_water);
        egret.Tween.get(img_water)
        .to({y:img_water.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(img_water)},this);
        egret.Tween.get(label_water)
        .to({y:label_water.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(label_water)},this);
    }

    /**
     * 帮摘果之后奖励动画
     */

    public static helppickTwn(data){
        let img_fruit = new eui.Image();            //果实图片
        img_fruit.width = 61.6;
        img_fruit.height = 70;
        img_fruit.x = 356;
        img_fruit.y = 700;
        HttpRequest.imageloader(Config.picurl+Help.getTreeUserData().seedIcon,img_fruit);
        let label_fruit = new eui.Label();              //果实数量
        label_fruit.x = 434;
        label_fruit.y = 712;
        label_fruit.text = "+"+data.takeNum;
        let img_love = new eui.Image();                 //爱心图片
        img_love.width = 72.8;
        img_love.height = 63.7;
        img_love.x = 350;
        img_love.y = 626;
        img_love.texture = RES.getRes("loveimg");   
        let label_love = new eui.Label;
        label_love.x = 426;
        label_love.y = 626;
        label_love.text = "+"+data.loveCount
        if(Number(data.takeNum) == 0){
            SceneManager.sceneManager.mainScene.enabled = false;
            SceneManager.addNotice("手气不佳，没有为好友摘到果子",1000),
            this.waitFun(1,function(){
                SceneManager.sceneManager.mainScene.addChild(img_love);
                SceneManager.sceneManager.mainScene.addChild(label_love);
                egret.Tween.get(img_love)
                .to({y:img_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(img_love)},this);
                egret.Tween.get(label_love)
                .to({y:label_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(label_love);
                    SceneManager.sceneManager.mainScene.enabled = true;
                },this);
            },this)
        }
        else{
            SceneManager.sceneManager.mainScene.enabled = false;
            SceneManager.sceneManager.mainScene.addChild(img_fruit);
            SceneManager.sceneManager.mainScene.addChild(label_fruit);
            egret.Tween.get(img_fruit)
            .to({y:img_fruit.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(img_fruit);
                SceneManager.sceneManager.mainScene.addChild(img_love);
                egret.Tween.get(img_love)
                .to({y:img_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(img_love)},this);
            },this);
            egret.Tween.get(label_fruit)
            .to({y:label_fruit.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(label_fruit);
                SceneManager.sceneManager.mainScene.addChild(label_love);
                egret.Tween.get(label_love)
                .to({y:label_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(label_love);
                    SceneManager.sceneManager.mainScene.enabled = true;    
                },this);
            },this);
        }
    }

    public static helpwaterLove(data){
        SceneManager.sceneManager.mainScene.enabled = false;
        let img_love = new eui.Image();                 //爱心图片
        img_love.width = 72.8;
        img_love.height = 63.7;
        img_love.x = 350;
        img_love.y = 626;
        img_love.texture = RES.getRes("loveimg");   
        let label_love = new eui.Label;
        label_love.x = 426;
        label_love.y = 626;
        label_love.text = "+"+data.loveCount;
        SceneManager.sceneManager.mainScene.addChild(img_love);
            SceneManager.sceneManager.mainScene.addChild(label_love);
            egret.Tween.get(img_love)
            .to({y:img_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(img_love)},this);
            egret.Tween.get(label_love)
            .to({y:label_love.y-60},800).call(()=>{SceneManager.sceneManager.mainScene.removeChild(label_love);
                SceneManager.sceneManager.mainScene.enabled = true;
            },this);
    }

    //爱心值兑换成长值动画
    public static useLoveTwn(){
        let img_love = new eui.Image();
        img_love.x = 615;
        img_love.y = 806;
        img_love.texture = RES.getRes("loveimg");
        SceneManager.sceneManager.mainScene.addChild(img_love);
        SceneManager.sceneManager.mainScene.enabled = false;
        egret.Tween.get(img_love)
        .to({x:615,y:730},500)
        .to({x:306,y:1138,scaleY:0.5,scaleX:0.5},1200).call(
            ()=>{SceneManager.sceneManager.mainScene.removeChild(img_love);
                 SceneManager.sceneManager.mainScene.getOwnTree();
                 SceneManager.sceneManager.mainScene.enabled = true;},this); 
    }

    //果树名称过长滚动
    public static labelRect(label:eui.Label){
        label.scrollRect = new egret.Rectangle(0, 0, 74, 24);
        var rect: egret.Rectangle = label.scrollRect;
        egret.Tween.get(rect,{loop:true})
					.set({x:-74})
                    .to({x:label.width},28.7*label.width);
    }

}
	