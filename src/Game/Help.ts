class Help{
   
    private static TreeUserData         //用户果树数据
    private static UserFriendData

    //保存用户果树数据
    public static saveTreeUserData(data){
        this.TreeUserData = data;
    }
    //获取用户果树数据
    public static getTreeUserData(){
        return this.TreeUserData;
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
            
            }
            else if(stage == 2){
                if(type == 1){
                    return "appletree2"     //大树
                }
            }
            else if(stage == 3){
                if(type == 1){
                    return "appletree3"     //开花
                }
            }
            else if(stage == 4){
                if(type == 1 && istake == "false"){
                    return "appletree4"             //结果(绿)
                }
                else if(type = 1 && istake == "true"){
                    return "appletree5"             //半红半绿
                }
            }
            else if(stage == 5){
                if(type == 1 && istake == "false"){
                    return "appletree4"                 //结果(绿)
                }
                else if(type == 1 && istake == "true"){
                    return "appletree6"                 //半红半绿
                }
            }   
            else if(stage ==6){
                 if(type == 1 && istake == "false"){
                    return "appletree4"                 //结果(绿)
                }
                else if(type == 1 && istake == "true"){
                    return "appletree7"                 
                }
            } 
            else if(stage ==7){
                    return "appletree7"                 
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

    //使用水滴后动画
    public static usewaterTwn(){

        let water = new eui.Image()
    }


    public static pickTwn(num){
        let timer:egret.Timer = new egret.Timer(150,num);
        timer.addEventListener(egret.TimerEvent.TIMER,this.fruitTwn,this);
        timer.start();
    }

    public static fruitTwn(type){
        let fruit = new eui.Image()
        fruit.x = 398;
        fruit.y = 605;
        fruit.width = 44;
        fruit.height = 50;
        fruit.texture = RES.getRes("appleg1")
        SceneManager.sceneManager.mainScene.addChild(fruit);
        egret.Tween.get(fruit)
        .to({x:324,y:1178,height:34,width:29},1400).call(()=>{SceneManager.sceneManager.mainScene.removeChild(fruit)},SceneManager.sceneManager.mainScene)
    }

    public static pickTwnupdata(Func){
        let timer:egret.Timer = new egret.Timer(2150,1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,Func,SceneManager.sceneManager.mainScene)
        timer.start();
    }
}
	