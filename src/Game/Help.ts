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



    //根据阶段获取和种类果树图片
    public static getTreeIconBystage(stage,type,istake){
            // if(stage == 1){
            //     return "treemiao"               //苗
            // }
             if(stage == 1){
                if(type == 1){
                    return "appletree1"     //树
                }
                else if(type == 2){
                    return "baletree1_png"
                }
            
            }
            else if(stage == 2){
                if(type == 1){
                    return "appletree2"     //大树
                }
                else if(type == 2){
                    return "baletree2"
                }
            }
            else if(stage == 3){
                if(type == 1){
                    return "appletree3"     //开花
                }
                else if(type == 2){
                    return "baletree3"
                }
            }
            else if(stage == 4){
                if(type == 1 && istake == "false"){
                    return "appletree4"             //结果(绿)
                }
                else if(type == 1 && istake == "true"){
                    return "appletree5"             //半红半绿
                }
                else if(type == 2 && istake == "false"){
                    return "baletree4"
                }
                else if(type == 5 && istake == "true"){
                    return "baletree5"             //半红半绿
                }
            }
            else if(stage == 5){
                if(type == 1 && istake == "false"){
                    return "appletree4"                 //结果(绿)
                }
                else if(type == 1 && istake == "true"){
                    return "appletree6"                 //半红半绿
                }
                else if(type == 2 && istake == "false"){
                    return "baletree4"                 //半红半绿
                }
                else if(type == 2 && istake == "true"){
                    return "baletree6"                 //半红半绿
                }
            }   
            else if(stage ==6){
                 if(type == 1 && istake == "false"){
                    return "appletree4"                 //结果(绿)
                }
                else if(type == 1 && istake == "true"){
                    return "appletree7"                 
                }
                else if(type == 1 && istake == "false"){
                    return "baletree4"                 
                }
                else if(type == 1 && istake == "true"){
                    return "baletree7"                 
                }
                
            } 
            else if(type == 1&&stage ==7){
                    return "appletree7"                 
            }
            else if(type == 2&&stage ==7){
                    return "baleree7"                 
            } 
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
        .to({x:324,y:1178,height:34,width:29},1400).call(()=>{SceneManager.sceneManager.mainScene.removeChild(fruit)},SceneManager.sceneManager.mainScene)
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
    
    //落花动画
    // public static flower(){
    //     let data:any = RES.getRes("flower_json");
    //     let txtr:egret.Texture = RES.getRes("flower_png");
    //     let flower:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,txtr);
    //     let flowerdown:egret.MovieClip = new egret.MovieClip(flower.generateMovieClipData("flower"));
    //     SceneManager.sceneManager.mainScene.addChild(flowerdown);
    //     flowerdown.x = 220;
	// 	flowerdown.y = 600;
    //     flowerdown.gotoAndPlay(1,1);
    //     flowerdown.addEventListener(egret.Event.COMPLETE, function (e:egret.Event):void {
           
    //     }, this);
    //     var count:number = 0;
    //     flowerdown.addEventListener(egret.Event.LOOP_COMPLETE, function (e:egret.Event):void {
          
    //     }, this);
    //     flowerdown.addEventListener(egret.MovieClipEvent.FRAME_LABEL, function (e:egret.MovieClipEvent):void {
           
    //     }, this);
    // }

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
}
	