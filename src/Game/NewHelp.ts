class NewHelp {

	private static bgmask = new eui.Image();
	private static leaveMsgTemplateList: Array<LeaveMsgTemplate>;        //留言模板

	//云朵飘动动画
	public static cloudTwn() {
		let cloud1 = new eui.Image();
		let cloud2 = new eui.Image();
		let cloud3 = new eui.Image();
		cloud1.texture = RES.getRes("cloudnew_png");
		cloud2.texture = RES.getRes("cloud2");
		cloud3.texture = RES.getRes("cloudnew_png");
		cloud1.y = -62;
		cloud2.y = 119;
		cloud3.y = -7;
		cloud1.x = -63;
		cloud2.x = -3;
		cloud3.x = 332;
		SceneManager.sceneManager._stage.addChild(cloud1);
		SceneManager.sceneManager._stage.addChild(cloud2);
		SceneManager.sceneManager._stage.addChild(cloud3);

		// 云朵1
		egret.Tween.get(cloud1, { loop: true })
			.to({ x: cloud1.x + 80 }, 10000)
			.to({ x: cloud1.x }, 10000)

		// // 云朵2
		// egret.Tween.get(this.cloud2,{loop:true})
		// .to({x:this.cloud2.x+140},13000) 
		// .to({x:this.cloud2.x-40},13000)
		// .to({x:this.cloud2.x},2888)

		// 云朵3
		egret.Tween.get(cloud3, { loop: true })
			.to({ x: cloud3.x - 120 }, 8000)
			.to({ x: cloud3.x }, 8000)
	}

	//舞台上添加遮罩
	public static addmask() {
		this.bgmask.texture = RES.getRes("panel-bg")
		var rect: egret.Rectangle = new egret.Rectangle(4, 4, 24, 24);
		this.bgmask.scale9Grid = rect;
		this.bgmask.height = SceneManager.sceneManager._stage.height;
		this.bgmask.width = SceneManager.sceneManager._stage.width;
		this.bgmask.alpha = 0.7;
		SceneManager.sceneManager._stage.addChild(this.bgmask);
		this.bgmask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closescene, this)
	}

	//点击遮罩关闭场景
	private static closescene() {
		//关闭动态场景
		if (SceneManager.sceneManager.getDynamicScene().parent) {
			SceneManager.sceneManager.getDynamicScene().parent.removeChild(SceneManager.sceneManager.getDynamicScene())
			this.removemask();
			return;
		}
		//关闭任务场景
		if (SceneManager.sceneManager.getTaskScene().parent) {
			SceneManager.sceneManager.getTaskScene().parent.removeChild(SceneManager.sceneManager.getTaskScene())
			this.removemask();
			return;
		}
		//关闭化肥场景
		if (SceneManager.sceneManager.getHuafeiScene().parent) {
			SceneManager.sceneManager.getHuafeiScene().parent.removeChild(SceneManager.sceneManager.getHuafeiScene())
			this.removemask();
			return;
		}
		//关闭互动场景
		if (SceneManager.sceneManager.getInteractiveScene().parent) {
			SceneManager.sceneManager.getInteractiveScene().parent.removeChild(SceneManager.sceneManager.getInteractiveScene())
			this.removemask();
			return;
		}
		if (SceneManager.sceneManager.getDuihuanScene().parent) {
			SceneManager.sceneManager.getDuihuanScene().parent.removeChild(SceneManager.sceneManager.getDuihuanScene())
			this.removemask();
			return;
		}
		if (SceneManager.sceneManager.getWarehouseScene().parent) {
			SceneManager.sceneManager.getWarehouseScene().parent.removeChild(SceneManager.sceneManager.getWarehouseScene())
			this.removemask();
			return;
		}
	}

	// 移除遮罩
	public static removemask() {
		if (this.bgmask.parent) {
			this.bgmask.parent.removeChild(this.bgmask);
		}
	}



	//---------------------------------------------------------------------留言-----------------------------------------------------------------------------//
	/**
	 * 点击留言显示单条留言
	 */
	public static addBarrageMsg(templateId) {
		let BarGroup = SceneManager.sceneManager.StageItems.BarGroup
		let barragbg = new eui.Image;		//弹幕背景
		let barragicon = new eui.Image;		//弹幕头像
		let bariconmask = new eui.Rect;		//弹幕头像遮罩
		let barragegroup = new eui.Group;	//弹幕容器
		let barragetext = new eui.Label;	//弹幕内容
		let data
		if (SceneManager.instance.landId == 1) {
			data = Datamanager.getOwnguoyuandata()			//果园数据
		} else if (SceneManager.instance.landId == 2) {
			data = Datamanager.getOwncaiyuandata()			//菜园数据
		}
		barragegroup.x = 750;			//弹幕位置随机
		barragegroup.y = 300 + Help.random_num(1, 3) * 60;
		barragegroup.width = 414;
		barragegroup.height = 72;
		BarGroup.addChild(barragegroup);

		//添加弹幕背景
		barragbg.x = 0;
		barragbg.y = 0;
		barragbg.width = 414;
		barragbg.height = 72;
		barragbg.texture = RES.getRes('barragebg-green');
		barragegroup.addChild(barragbg);

		//添加弹幕头像
		barragicon.x = 7;
		barragicon.y = 16;
		barragicon.width = 46;
		barragicon.height = 46;
		if (data.userIcon) {
			let params = {
				users: data.user
			}
			MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, data.user, barragicon), null);
		}
		barragegroup.addChild(barragicon);

		//添加弹幕头像遮罩
		bariconmask.x = 7;
		bariconmask.y = 16;
		bariconmask.width = 46;
		bariconmask.height = 46;
		bariconmask.ellipseWidth = 46;
		bariconmask.ellipseHeight = 46;
		barragegroup.addChild(bariconmask);
		barragicon.mask = bariconmask;

		//添加弹幕内容
		barragetext.x = 78;
		barragetext.y = 28;
		barragetext.size = 24;
		barragetext.text = this.getLeaveMsgByTemplateId(templateId)
		barragetext.textColor = 0x0F3B00;
		barragetext.fontFamily = "SimHei";
		barragegroup.addChild(barragetext);

		//弹幕飘动
		egret.Tween.get(barragegroup)
			.to({ x: -430 }, 8000).call(() => {
				if (barragegroup.parent) {
					BarGroup.removeChild(barragegroup)
				}
			}, this)
	}


    /**
     * 获取果树留言并显示
     */
	public static getTreeLeaveMsg(treedata) {
		if (!treedata) {
			this.removeBarrage();
		}
		else {
			if (this.leaveMsgTemplateList) {
				//加载留言前先清空留言内容
				this.removeBarrage();
				let params = {
					treeUserId: treedata.id,
					pageNo: 1,
					numPerPage: 10000
				};
				MyRequest._post("game/getTreeLeaveMsg", params, this, this.Req_getTreeLeaveMsg.bind(this), null);
			}
			else {
				this.getLeaveMsgTemplate(treedata);
			}
		}
	}

	//获取果树留言成功后处理
	private static Req_getTreeLeaveMsg(data): void {
		var Data: Array<LeaveMsgUser> = data.data.list;
		this.addBarrage(Data)
	}


    /**
	 * 获取留言模板
	 */
	private static getLeaveMsgTemplate(treedata) {
		MyRequest._post("game/getLeaveMsgTemplate", null, this, this.Req_LeaveMsgTemplate.bind(this, treedata), null)
	}

	/**
	 * 留言模板回调
	 */
	private static Req_LeaveMsgTemplate(treedata, Data) {
		this.leaveMsgTemplateList = Data.data;
		if (treedata) {
			this.getTreeLeaveMsg(treedata)
		}
	}


    /**
	 * 通过模板id获取留言内容
	 */
	private static getLeaveMsgByTemplateId(templateId): string {
		if (this.leaveMsgTemplateList) {
			for (let a = 0; a < this.leaveMsgTemplateList.length; a++) {
				if (this.leaveMsgTemplateList[a].id == templateId) {
					return this.leaveMsgTemplateList[a].msg;
				}
			}
		}
		return null
	}


	// 弹幕滚动
	private static addBarrage(dataList: Array<LeaveMsgUser>) {
		let BarGroup = SceneManager.sceneManager.StageItems.BarGroup
		for (let i = 0; i < dataList.length; i++) {
			let barragbg = new eui.Image;		//弹幕背景
			let barragicon = new eui.Image;		//弹幕头像
			let bariconmask = new eui.Rect;		//弹幕头像遮罩
			let barragegroup = new eui.Group;	//弹幕容器
			let barragetext = new eui.Label;	//弹幕内容

			//添加单个弹幕容器 
			barragegroup.x = 750;			//弹幕位置随机
			barragegroup.y = 300 + Help.random_num(1, 3) * 60;
			barragegroup.width = 414;
			barragegroup.height = 72;
			BarGroup.addChild(barragegroup);

			//添加弹幕背景
			barragbg.x = 0;
			barragbg.y = 0;
			barragbg.width = 414;
			barragbg.height = 72;
			barragbg.texture = RES.getRes('barragebg-green');
			barragegroup.addChild(barragbg);

			//添加弹幕头像
			barragicon.x = 7;
			barragicon.y = 16;
			barragicon.width = 46;
			barragicon.height = 46;
			if (dataList[i].mainUserIcon) {
				let params = {
					users: dataList[i].mainUser
				}
				MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, dataList[i].mainUser, barragicon), null);
			}
			barragegroup.addChild(barragicon);

			//添加弹幕头像遮罩
			bariconmask.x = 7;
			bariconmask.y = 16;
			bariconmask.width = 46;
			bariconmask.height = 46;
			bariconmask.ellipseWidth = 46;
			bariconmask.ellipseHeight = 46;
			barragegroup.addChild(bariconmask);
			barragicon.mask = bariconmask;

			//添加弹幕内容
			barragetext.x = 78;
			barragetext.y = 28;
			barragetext.size = 24;
			barragetext.text = this.getLeaveMsgByTemplateId(dataList[i].templateId)
			barragetext.textColor = 0x0F3B00;
			barragetext.fontFamily = "SimHei";
			barragegroup.addChild(barragetext);

			barragegroup.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				if (Datamanager.getfriendsdata() && SceneManager.sceneManager.StageItems.currentState == "havetree") {
					Help.passAnm();
					let userdata = Datamanager.getfrienddataByuser(dataList[i].mainUser);
					Datamanager.savenowfrienddata(userdata);										//保存当前用户数据
					if (userdata.trees[SceneManager.instance.landId - 1]) {
						let friendtreedataid = userdata.trees[SceneManager.instance.landId - 1].id;
						NewHelp.getTreeInfoByid(friendtreedataid);
					}
					else {
						SceneManager.sceneManager.newmainScene.updateBytreedata(null);
					}
				}
			}, this)


			//弹幕飘动
			if (barragegroup) {
				egret.Tween.get(barragegroup)
					.wait(i * 3000)
					.to({ x: -430 }, 8000).call(() => {
						if (barragegroup.parent) {
							BarGroup.removeChild(barragegroup)
						}
					}, this)
			}
		}
	}



    /**
     * 清空弹幕
     */
	public static removeBarrage() {
		SceneManager.sceneManager.StageItems.BarGroup.removeChildren()
	}
	//--------------------------------------------------------------------------放置农场道具（虫，草）-----------------------------------------------------------//

	/**
	 * 查询果园道具并显示
	 * treedata：果树数据
	 */
	public static getTreeProp(treedata) {
		if (!treedata) {
			let gro_prop = SceneManager.sceneManager.StageItems.gro_prop;
			gro_prop.removeChildren();
			return;
		}
		else {
			let params = {
				treeUserId: treedata.id
			};
			MyRequest._post("game/getTreeProp", params, this, this.Req_getTreeProp.bind(this), null)
		}
	}

	//查询果园道具成功后处理
	private static Req_getTreeProp(data): void {
		let gro_prop = SceneManager.sceneManager.StageItems.gro_prop;
		gro_prop.removeChildren();
		var Data = data;
		this.showtreeprop(Data.data);					//显示虫和草
	}

	//显示果园道具
	private static showtreeprop(data) {
		let n = 0;
		let m = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i].propType == 1) {
				n++
				if (n < 4) {
					this.putgrass(data[i].id, n);
				}
			}
			if (data[i].propType == 0) {
				m++
				if (m < 4) {
					this.putinsect(data[i].id, m);
				}
			}
		}
	}


	/**
	 * 放置草
	 */
	public static putgrass(id, m?) {
		let gro_prop = SceneManager.sceneManager.StageItems.gro_prop;
		let grass = new eui.Image;
		grass.width = 74;
		grass.height = 60;
		grass.texture = RES.getRes("home-grass");
		grass.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(grass, id);
		}, this)
		if (!m) {
			m = Help.random_num(4, 6)
			if (m == 4) {
				gro_prop.addChild(grass);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 230 + Help.random_num(-2, 2) * 20;
					twn_y = 950 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 217 + Help.random_num(-2, 2) * 20;
					twn_y = 1005 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(grass)
					.set({ x: 210, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)
			}
			else if (m == 5) {
				gro_prop.addChild(grass);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 362 + Help.random_num(-2, 2) * 20;
					twn_y = 956 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 293 + Help.random_num(-2, 2) * 20;
					twn_y = 1021 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(grass)
					.set({ x: 210, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)
			}
			else if (m == 6) {
				gro_prop.addChild(grass);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 504 + Help.random_num(-2, 2) * 20;
					twn_y = 938 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 377 + Help.random_num(-2, 2) * 20;
					twn_y = 1012 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(grass)
					.set({ x: 210, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)
			}
		}
		else if (m) {
			Help.grapos(m, grass);
			gro_prop.addChild(grass);
		}
	}

	/**
	 * 放置虫
	 */
	public static putinsect(id, m?) {
		let gro_prop = SceneManager.sceneManager.StageItems.gro_prop;
		let insect = new eui.Image;
		insect.width = 76;
		insect.height = 95.75;
		insect.texture = RES.getRes("home-insect");
		insect.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(insect, id);
		}, this)
		if (!m) {
			m = Help.random_num(4, 6)
			if (m == 4) {
				gro_prop.addChild(insect);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 536 + Help.random_num(-2, 2) * 20;
					twn_y = 872 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 247 + Help.random_num(-2, 2) * 20;
					twn_y = 1005 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(insect)
					.set({ x: 530, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)

			}
			else if (m == 5) {
				gro_prop.addChild(insect);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 295 + Help.random_num(-2, 2) * 20;
					twn_y = 932 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 340 + Help.random_num(-2, 2) * 20;
					twn_y = 1005 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(insect)
					.set({ x: 530, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)
			}
			else if (m == 6) {
				gro_prop.addChild(insect);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 436 + Help.random_num(-2, 2) * 20;
					twn_y = 930 + Help.random_num(-2, 2) * 5;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 438 + Help.random_num(-2, 2) * 20;
					twn_y = 990 + Help.random_num(-2, 2) * 5;
				}
				egret.Tween.get(insect)
					.set({ x: 530, y: 720 })
					.to({ x: twn_x, y: twn_y }, 1000)
			}
		}
		else if (m) {
			Help.inspos(m, insect);
			gro_prop.addChild(insect);
		}
	}

	//除去果园(草，虫)    treePropId：果树id
	private static removeTreeProp(icon, id) {
		if (id < 0) {
			SceneManager.addNotice("不能清除自己放的哦！")
			return
		}
		let params = {
			treePropId: id
		};
		MyRequest._post("game/removeTreeProp", params, this, this.Req_removeTreeProp.bind(this, icon), null)
	}

	//除去果园成功后处理
	private static Req_removeTreeProp(icon, data): void {
		let gro_prop = SceneManager.sceneManager.StageItems.gro_prop;
		var Data = data;
		gro_prop.removeChild(icon);
		if (Data.data && Number(Data.data.loveCount) > 0) {
			// Help.helpwaterLove(Data.data);					//爱心值动画
			NewHelp.updateprop();
			// let text: string = SceneManager.sceneManager.StageItems.love_num.text
			// text = text.substring(0, text.length - 1)
			// SceneManager.sceneManager.StageItems.love_num.text = (String(Number(text) + Number(Data.data.loveCount))) + "%"
		} else {
			if (SceneManager.instance.landId == 1) {
				if (Datamanager.getNowtreedata().id == Datamanager.getOwnguoyuandata().id) {
					SceneManager.addNotice("清除成功")
				}
				else {
					SceneManager.addNotice("清除成功,每日爱心值已达上限！")
				}
			}
			else if (SceneManager.instance.landId == 2) {
				if (Datamanager.getNowtreedata().id == Datamanager.getOwncaiyuandata().id) {
					SceneManager.addNotice("清除成功")
				}
				else {
					SceneManager.addNotice("清除成功,每日爱心值已达上限！")
				}
			}
		}
	}


	//---------------------------------------------------------------------道具-----------------------------------------------------------------------------//

	//查询自己的道具
	public static updateprop() {
		MyRequest._post("game/getOwnProp", null, this, this.Req_getOwnProp.bind(this), null)
	}

	//查询自己的道具成功后处理
	private static Req_getOwnProp(data): void {
		console.log("自己道具", data)
		Datamanager.savePropdata(data.data);
		var Data = data;
		let likeNum = NewHelp.getNumByProptype(data.data, 4) ? NewHelp.getNumByProptype(Data.data, 4).num : "0";
		SceneManager.sceneManager.StageItems.like_num.text = likeNum;												//点赞数

		let loveNum = Help.getPropById(Data.data, 2) ? Help.getPropById(Data.data, 2).num : "0";
		// 显示自己道具数值
		SceneManager.sceneManager.StageItems.love_num.textFlow = <Array<egret.ITextElement>>[					//爱心值数量
			{ text: loveNum, style: { "size": 22 } }
			, { text: "%", style: { "size": 18 } }
		];
		SceneManager.sceneManager.StageItems.kettle_num.text = (Help.getPropById(Data.data, 1) ? Help.getPropById(Data.data, 1).num : 0) + "g";    //水滴数量
		if (SceneManager.instance.landId == 1) {
			SceneManager.sceneManager.newmainScene.pick_num.text = "x" + ((Help.getPropById(Data.data, 3) ? Help.getPropById(Data.data, 3).num : 0));  //篮子数量
		}
		else if (SceneManager.instance.landId == 2) {
			SceneManager.sceneManager.newmain2Scene.pick_num.text = "x" + ((Help.getPropById(Data.data, 3) ? Help.getPropById(Data.data, 3).num : 0));  //篮子数量
		}
		SceneManager.sceneManager.getHuafeiScene().youji_num.text = Help.getPropById(Data.data, 4) ? Help.getPropById(Data.data, 4).num : 0;			   //有机肥数量
		SceneManager.sceneManager.getHuafeiScene().fuhe_num.text = Help.getPropById(Data.data, 5) ? Help.getPropById(Data.data, 5).num : 0;			   //复合肥数量
		SceneManager.sceneManager.getHuafeiScene().shuirong_num.text = Help.getPropById(Data.data, 6) ? Help.getPropById(Data.data, 6).num : 0;		   //水溶肥数量
		let text: string = SceneManager.sceneManager.StageItems.love_num.text
		text = text.substring(0, text.length - 1)
		if (Number(text) >= 100) {
			egret.Tween.get(SceneManager.sceneManager.StageItems.img_love, { loop: true })
				.to({ scaleX: 1, scaleY: 1 }, 400)
				.to({ scaleX: 1.1, scaleY: 1.1 }, 400)
				.to({ scaleX: 1, scaleY: 1 }, 400)
		}
		/**
		 * 化肥红点判断
		 */
		let youji = Help.getPropById(Data.data, 4);																					//有机肥数量
		let fuhe = Help.getPropById(Data.data, 5);																					//复合肥数量
		let shuirong = Help.getPropById(Data.data, 6);																				//水溶肥数量
		let huafeiNum = Number(youji ? youji.num : 0) + Number(fuhe ? fuhe.num : 0) + Number(shuirong ? shuirong.num : 0);
		if (localStorage.getItem("huafeiNum")) {
			if (huafeiNum > Number(localStorage.getItem("huafeiNum")) || localStorage.getItem("huafeisee") == "false") {
				SceneManager.sceneManager.StageItems.huafei_red.visible = true;
				localStorage.setItem("huafeisee", "false");
			}
			else {
				SceneManager.sceneManager.StageItems.huafei_red.visible = false;
			}
		}
		else {
			if (huafeiNum > 0) {
				SceneManager.sceneManager.StageItems.huafei_red.visible = true;
				localStorage.setItem("huafeisee", "false");
			}
			else {
				SceneManager.sceneManager.StageItems.huafei_red.visible = false;
			}
		}
		localStorage.setItem("huafeiNum", String(huafeiNum));
	}

	/**
	 * 根据道具类型获取当前道具数量
	 * propType 0水滴1道具2爱心值3化肥4点赞数5剪刀6鸭食50高级种子（此时id对应treeId）
	 */
	private static getNumByProptype(data, propType) {
		if (data) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].propType == propType) {
					return data[i];				//水滴数据
				}
			}
		}
	}


	private static canPost: boolean = true;					//是否能请求接口

	/**
	 * 帮当前好友浇水
	 */

	public static friendWater() {
		let treedata = Datamanager.getNowtreedata();
		if (!treedata) {
			SceneManager.addNotice("该好友还没有种树哦！")
			return;
		}
		else {
			let params = {
				treeUserId: treedata.id
			};
			if (this.canPost) {
				this.canPost = false;
				MyRequest._post("game/friendWater", params, this, this.Req_friendWater.bind(this), this.postErr)
			}
		}
	}

	//帮好友浇水后的处理
	private static Req_friendWater(data): void {
		this.canPost = true;
		egret.Tween.get(SceneManager.sceneManager.StageItems.frimg_kettle)
			.to({ y: -130 }, 500)
			.to({ x: -29, y: -170, rotation: -54 }, 500).call(() => { this.waterTwn(data.data) }, this)
			.wait(1200)
			.to({ y: -130, rotation: 0 }, 500)
			.to({ y: 80, x: 100 }, 500)
		let text: string = SceneManager.sceneManager.StageItems.love_num.text;
		text = text.substring(0, text.length - 1);
		SceneManager.sceneManager.StageItems.love_num.text = (String(Number(text) + Number(data.data.loveCount))) + "%";
	}




	/**
	 * 使用道具
	 * propId    道具种类id		1：水滴   2：爱心值    3：篮子    4：有机肥   5：复合肥    6水溶肥
	 * treedata  使用道具的果树数据
	 */
	public static useProp(propId, treedata) {
		if (treedata) {
			let canUseProp = treedata.canReceive == null ? "false" : treedata.canReceive;
			if (canUseProp == 'true') {
				console.log("果树已经可以兑换啦，不用再使用道具了。")
				return;
			}
			if (treedata.needTake == "true" && propId != "3") {
				SceneManager.addNotice("果树已经长好了,快使用篮子去摘果吧！")
				return
			}
			if (treedata.stageObj.isLast == "true" && treedata.growthValue == treedata.stageObj.energy && treedata.needTake == "false") {
				SceneManager.addNotice("果树已经长好啦，您可以邀请好友帮忙摘果哦！")
				return
			}
			let params = {
				propId: propId,
				treeUserId: treedata.id
			};
			if (this.canPost) {
				this.canPost = false;
				SceneManager.sceneManager.StageItems.img_kettle.touchEnabled = false;
				MyRequest._post("game/useProp", params, this, this.Req_useProp.bind(this, propId), this.postErr.bind(this, propId));
			}
		}
		else {
			SceneManager.addNotice("您还没有种树哦！")
		}
	}

	//使用道具成功后处理
	private static Req_useProp(propId, data): void {
		SceneManager.sceneManager.StageItems.img_kettle.touchEnabled = true;
		this.canPost = true;
		SceneManager.sceneManager.newmainScene.progress.slideDuration = 6000;
		var Data = data;
		if (propId == 1) {										//使用水滴
			this.kettleTwn();					//使用水滴之后更新在动画中完成
		}
		else if (propId == 2) {									//使用爱心值
			egret.Tween.removeTweens(SceneManager.sceneManager.StageItems.img_love);
			Help.useLoveTwn();
			// let content = "您的爱心值已兑换成长值！"
			// let btn = "确定"
			// let ti = "(多多帮助好友可使您的小树更快成长哦！)"
			// SceneManager.addPrompt(content, btn, ti);
		}
		else if (propId == 3) {									//使用篮子
			Help.pickTwn(5);
			Help.pickTwnupdata(this.pickafter);
		}
		else {
			this.huafeiTwn(propId);
		}
	}

	private static pickafter() {
		if (SceneManager.instance.landId == 1) {
			SceneManager.sceneManager.newmainScene.getOwnTree();						//更新果园数据
		}
		else if (SceneManager.instance.landId == 2) {
			SceneManager.sceneManager.newmain2Scene.getOwnTree();						//更新菜园数据
		}
		SceneManager.sceneManager.newmainScene.enabled = true;
	}




	//化肥动画
	private static huafeiTwn(type) {
		let icon = new eui.Image();
		if (type == 4) {
			icon.texture = RES.getRes("youji");
			icon.x = 68;
			icon.y = 700;
		}
		else if (type == 5) {
			icon.texture = RES.getRes("fuhe");
			icon.x = 177.5;
			icon.y = 886;
		}
		else if (type == 6) {
			icon.texture = RES.getRes("shuirong");
			icon.x = 212;
			icon.y = 1006;
		}
		icon.anchorOffsetX = icon.width / 2;
		icon.anchorOffsetY = icon.height / 2;
		SceneManager.sceneManager._stage.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 540, y: 725 }, 1000)
			.wait(300)
			.to({ rotation: -60 }, 500).call(() => { this.huafeikeli(icon) }, this)
	}


	private static huafeikeli(icon1) {
		let icon = new eui.Image();
		icon.texture = RES.getRes("huafeili");
		icon.x = 460;			//355
		icon.y = 757;			//875
		icon.width = 35;
		icon.height = 57;
		SceneManager.sceneManager._stage.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 440, y: 785, alpha: 0.2 }, 500)
			.wait(200)
			.set({ x: 460, y: 757, alpha: 1 })
			.to({ x: 440, y: 785, alpha: 0.2 }, 500)
			.wait(200).call(() => { SceneManager.sceneManager._stage.removeChild(icon) }, this)
			.call(() => { SceneManager.sceneManager._stage.removeChild(icon1) }, this)
			.call(() => {
				if (SceneManager.instance.landId == 1) {
					SceneManager.sceneManager.newmainScene.getOwnTree();						//更新果园数据
				}
				else if (SceneManager.instance.landId == 2) {
					SceneManager.sceneManager.newmain2Scene.getOwnTree();						//更新菜园数据
				}
				NewHelp.updateprop()
			}, this)

	}





	private static a = 20;							//冷却计时
	private static b = 20;

	//水壶动画
	private static kettleTwn() {
		egret.Tween.get(SceneManager.sceneManager.StageItems.img_kettle)
			.to({ y: -130 }, 500)
			.to({ x: -29, y: -170, rotation: -54 }, 500).call(this.waterTwn, this)
			.wait(1200)
			.to({ y: -130, rotation: 0 }, 500)
			.to({ y: 85, x: 102 }, 500).call(this.tettleEad, this);
	}



	//水滴动画
	private static waterTwn(data?) {
		if (data && SceneManager.sceneManager.StageItems.currentState == "friendtree") {
			SceneManager.sceneManager.StageItems.img_water.visible = true;
		}
		else if (!data && SceneManager.sceneManager.StageItems.currentState == "havetree") {
			SceneManager.sceneManager.StageItems.img_water.visible = true;
		}
		egret.Tween.get(SceneManager.sceneManager.StageItems.img_water)
			.set({ y: 860, x: 386, alpha: 1 })
			.to({ y: 900, x: 366, alpha: 0.2 }, 500)
			.wait(200)
			.set({ y: 860, x: 386, alpha: 1 })
			.to({ y: 900, x: 366, alpha: 0.2 }, 500)
			.wait(200)
			.call(() => { this.waterVis(data) }, this)
	}

	// 水滴不可见
	private static waterVis(data?) {
		if (data) {																		//好友果园
			// Help.helpwaterLove(data);												//爱心值动画
			SceneManager.sceneManager.newmainScene.progress.slideDuration = 6000;
			this.getTreeInfoByid(Datamanager.getNowtreedata())								//更新好友果园数据
			SceneManager.sceneManager.StageItems.img_water.visible = false;
		}
		else {
			Help.waters();
			SceneManager.sceneManager.StageItems.img_water.visible = false;
		}
	}

	// 水壶冷却展现
	private static tettleEad() {
		if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
			if (SceneManager.instance.landId == 1) {
				SceneManager.sceneManager.newmainScene.getOwnTree();						//更新果园数据
				NewHelp.updateprop();														//更新道具数量
			}
			else if (SceneManager.instance.landId == 2) {
				SceneManager.sceneManager.newmain2Scene.getOwnTree();						//更新菜园数据
				NewHelp.updateprop();
			}
		} else if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {
			SceneManager.sceneManager.StageItems.img_water.visible = false;
		}
		SceneManager.sceneManager.StageItems.gro_kettle.visible = false;
		this.showtime(this.a);
		SceneManager.sceneManager.StageItems.gro_lq.visible = true;
		this.kettlelq(this.a);
	}

	private static lqTwn() {
		egret.Tween.get(SceneManager.sceneManager.StageItems.sanj, { loop: true })
			.set({ rotation: SceneManager.sceneManager.StageItems.sanj.rotation })
			.to({ rotation: SceneManager.sceneManager.StageItems.sanj.rotation + 360 }, 4000)
	}

	//水壶冷却
	private static kettlelq(time) {
		this.lqTwn();
		let timer: egret.Timer = new egret.Timer(1000, time);
		timer.addEventListener(egret.TimerEvent.TIMER, () => this.timelq(timer), this);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.kettleshow, this);
		timer.start();
	}


	private static showtime(time) {
		if (time > 3) {
			SceneManager.sceneManager.StageItems.gro_lq.touchEnabled = true;
		}
		else {
			SceneManager.sceneManager.StageItems.gro_lq.touchEnabled = false;
			SceneManager.sceneManager.StageItems.gro_lq.touchChildren = false;
		}

		if (time < 10) {
			SceneManager.sceneManager.StageItems.time_lq.text = "00:0" + time;
		}
		if (time >= 10) {
			SceneManager.sceneManager.StageItems.time_lq.text = "00:" + time;
		}
	}

	private static timelq(timer: egret.Timer) {
		this.a = this.a - 1;
		this.showtime(this.a);
		if (this.a <= 0) {
			this.b = this.b + 10
			if (this.b >= 40) {
				this.b = 40;
			}
			this.a = this.b
			SceneManager.sceneManager.StageItems.gro_kettle.visible = true;
			SceneManager.sceneManager.StageItems.gro_lq.visible = false;
			timer.reset();
		}
	}
	//冷却加速
	public static lqfast() {
		egret.Tween.pauseTweens(SceneManager.sceneManager.StageItems.sanj);
		egret.Tween.get(SceneManager.sceneManager.StageItems.sanj)
			.to({ rotation: SceneManager.sceneManager.StageItems.sanj.rotation + 120 }, 500).call(this.lqTwn, this)
		this.a = this.a - 1;
		this.showtime(this.a);
		let text = new eui.Label();
		text.text = "-1s";
		text.x = 625;
		text.y = 1000;
		text.textColor = 0x1B8399;
		text.size = 40;
		SceneManager.sceneManager.StageItems.addChild(text);
		egret.Tween.get(text)
			.to({ y: 960 }, 500).call(() => { SceneManager.sceneManager.StageItems.removeChild(text) }, this)
	}

	//水壶冷却完成
	private static kettleshow() {
		// this.gro_kettle.visible = true;
		// this.gro_lq.visible = false;
	}


	//请求接口失败回调
	private static postErr(propId?) {
		SceneManager.sceneManager.StageItems.img_kettle.touchEnabled = true;
		this.canPost = true;
		if (propId == "3") {										//篮子数量不够提示
			let jumpPrompt = new PromptHuafei(() => {
				if (SceneManager.instance.isMiniprogram) {
					//小程序端口taskCode要做参数发送
					wx.miniProgram.navigateTo({
						url: "/pages/game/browseGoods?listType=0&taskCode=specifiy_order&backGame=true"
					})
				} else {
					sessionStorage.setItem("fromgame", "true");
					sessionStorage.setItem("taskCode", "specifiy_order");
					location.href = Config.webHome + "view/game-browse-goods.html?listType=0"
				}
			})
			let label = "你的篮子装不下了";
			let tishi = "(指定商品下单，获取新果篮)"
			let btn = "确定";
			jumpPrompt.x = 85;
			jumpPrompt.y = 430;
			jumpPrompt.setPrompt(label, tishi, btn);
			NewHelp.addmask();
			SceneManager.sceneManager._stage.addChild(jumpPrompt)
		}
	}


	//------------------------------------------------------------------------树语----------------------------------------------------------------------------//

	/**
	 * 获取树语数据
	 */
	public static getTreeLanguage(data) {
		if (!data) {
			Datamanager.savetreelanguagedata(null);
			return;
		}
		else {
			let params = {
				stage: data.stage
			};
			MyRequest._post("game/getTreeLanguage", params, this, this.Req_getTreeLanguage.bind(this), null)
		}
	}


	//树语数据
	private static Req_getTreeLanguage(data): void {
		//保存树语数据
		Datamanager.savetreelanguagedata(data.data);
	}


	//------------------------------------------------------------------------头像----------------------------------------------------------------------------//

	//获取微信头像
	public static Req_WechatImg(user, image: eui.Image, data) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		let imgUrl = Config.picurl + data[user];
		HttpRequest.imageloader(imgUrl, image, user);
	}

	//-----------------------------------------------------------------------进度条-------------------------------------------------------------------------//
	/**
	 * 进度条更新显示
	 * data       	果树数据
	 * progress		进度条
	 */
	private static nowprogressvalue								//当前果树成长值进度条
	public static progressupdate(data, progress: eui.ProgressBar) {
		if (!data) {
			progress.visible = false;
			return;
		}
		else {
			progress.visible = true;
			let nowprogressvalue
			if (Number(data.stageObj.energy) < 100) {
				progress.maximum = Number(data.stageObj.energy) * 10
				progress.value = data.growthValue * 10;			//进度条当前值
				if (this.nowprogressvalue && this.nowprogressvalue > Number(data.growthValue)) {
					progress.value = 0;
					progress.slideDuration = 0;
					progress.value = 0.01;
					progress.value = data.growthValue * 10;
				}
			}
			else {
				progress.maximum = data.stageObj.energy;	//进度条最大值
				progress.value = data.growthValue;			//进度条当前值
				if (this.nowprogressvalue && this.nowprogressvalue > Number(data.growthValue)) {
					progress.value = 0;
					progress.slideDuration = 0;
					progress.value = 0.01;
					progress.value = data.growthValue;
				}
			}
			progress.minimum = 0;						//进度条最小值
			this.nowprogressvalue = Number(data.growthValue);
		}
	}


	/**
	 * 成长值进度条说明文字更新显示
	 */
	public static progresslabelupdate(data, progress_label: eui.Label) {
		if (!data) {
			progress_label.visible = false;
			return;
		}
		else {
			if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
				progress_label.textFlow = <Array<egret.ITextElement>>[
					{ text: data.stageObj.name },
					{ text: "还需要浇水" },
					{ text: (Number(data.stageObj.energy) - Number(data.growthValue)), style: { "textColor": 0xd67214 } },
					{ text: "g到" },
					{ text: data.nextStageName, style: { "textColor": 0xd67214 } },
					{ text: "了" }
				]
				if (data.needTake == "true") {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: "采摘", style: { "textColor": 0xd67214 } },
						{ text: "采摘了才能进入下一阶段" }
					]
				}
				else if (data.stageObj.canHarvest == "true") {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: data.stageObj.name },
						{ text: "还需要浇水" },
						{ text: (Number(data.stageObj.energy) - Number(data.growthValue)), style: { "textColor": 0xd67214 } },
						{ text: "g就可" },
						{ text: "采摘", style: { "textColor": 0xd67214 } },
						{ text: "了" }
					]
				}
				if (data.stageObj.isLast == "true" && data.growthValue == data.stageObj.energy) {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: "快让朋友来帮摘果吧！" },
					]
				}
				progress_label.visible = true;
			}
			else {
				progress_label.visible = false;
			}
		}
	}
	//-----------------------------------------------------------------进入他人果园-----------------------------------------------------------------------------//
	/**
     * 通过果树ID查询果树数据
     */
	public static getTreeInfoByid(treeUserId) {
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/getTreeInfo", params, this, this.Req_getTreeInfo.bind(this, treeUserId), null);
	}

	//查询果树数据后处理
	private static Req_getTreeInfo(treeUserId, data): void {
		let treedata = data.data												//果树数据
		if (SceneManager.instance.landId == 1) {								//当前是果园果树
			SceneManager.sceneManager.newmainScene.updateBytreedata(treedata);
		}
		else if (SceneManager.instance.landId == 2) {							//当前是菜园果树
			SceneManager.sceneManager.newmain2Scene.updateBytreedata(treedata);
		}
	}

	/**
	 * 可摘果文字和手显示
	 * treedata:果树数据
	 */
	public static showpickgro(treedata) {
		if (SceneManager.sceneManager.StageItems.currentState == "havetree") {			//自己农场
			if (!treedata) {
				SceneManager.sceneManager.StageItems.gro_pick.visible = false;
			}
			else {
				if (treedata.needTake == "true") {
					SceneManager.sceneManager.StageItems.gro_pick.visible = true;
					SceneManager.sceneManager.StageItems.pick_label.text = "可摘果";
					egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
						.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
						.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
						.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
						.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
				}
				else {
					SceneManager.sceneManager.StageItems.gro_pick.visible = false;
				}
			}
		}
	}

	/**
	 * 通过土地id获取果树id
	 * frienddata:好友数据
	 */
	public static getTreeIdByLandId(frienddata, landId) {
		let treedata = frienddata.trees;
		if (!treedata) {
			return ""
		}
		else {
			for (let i = 0; i < treedata.length; i++) {
				if (treedata[i].landId == landId) {
					return treedata[i].id;
				}
			}
		}
	}

	/**
	 * 显示动态消息
	 */
	public static showDynamicMsg(info: string, userName, userId) {
		SceneManager.sceneManager.StageItems.dynamic.visible = true
		SceneManager.sceneManager.StageItems.dynamic.alpha = 1;
		SceneManager.sceneManager.StageItems.dynamic_info.text = info;
		if (info.length > 4) {
			SceneManager.sceneManager.StageItems.dynamic_bg.width = 230 + (info.length - 4) * 25
		}
		let params = {
			users: userId
		}
		MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, userId, SceneManager.sceneManager.StageItems.dynamic_image), null);
		var timer: egret.Timer = new egret.Timer(2000, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
			egret.Tween.get(SceneManager.sceneManager.StageItems.dynamic)
				.to({ alpha: 0 }, 1500)
		}, this)
		timer.start()
	}

	//------------------------------------------------------------------------帮摘果-----------------------------------------------------------------------------//

	//检查是否可以帮摘果
	public static checkHelpTakeFruit(treedata) {
		if (!treedata) {
			SceneManager.sceneManager.StageItems.gro_pick.visible = false;
			return;
		}
		else {
			if (Number(treedata.friendCanObtain) > 0) {
				let params = {
					treeUserId: treedata.id
				};
				MyRequest._post("game/checkHelpTakeGoods", params, this, this.Req_checkHelpTakeFruit.bind(this), null)
			}
			else {
				SceneManager.sceneManager.StageItems.gro_pick.visible = false;
			}
		}
	}

	//检查是否可以帮摘果返回
	private static Req_checkHelpTakeFruit(data): void {
		if (data.data.canTake == "true") {
			SceneManager.sceneManager.StageItems.gro_pick.visible = true;
			SceneManager.sceneManager.StageItems.pick_label.text = "帮摘果";
			egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
		}
		else {
			SceneManager.sceneManager.StageItems.gro_pick.visible = false;
		}
	}

	/**
	 * 帮摘果请求
	 * treeUserId:果树id
	 */
	public static friendpick(treeUserId) {
		let params = {
			treeUserId: treeUserId
		};
		MyRequest._post("game/helpTakeGoods", params, this, this.Req_friendpick.bind(this), null);
	}

	//帮摘果之后请求
	private static Req_friendpick(data) {
		Help.pickTwn(5);
		Help.pickTwnupdata(() => {
			Help.helppickTwn(data.data);
			let text: string = SceneManager.sceneManager.StageItems.love_num.text;
			text = text.substring(0, text.length - 1);
			SceneManager.sceneManager.StageItems.love_num.text = (String(Number(text) + Number(data.data.loveCount))) + "%";
			this.getTreeInfoByid(Datamanager.getNowtreedata().id);
			SceneManager.sceneManager.StageItems.enabled = true;
		})
	}

	//------------------------------------------------------------------偷水-----------------------------------------------------------------------------//

	/**
	 * 检查是否可以偷水
	 * treedata:果树数据
	 */
	public static checkSteal(treedata) {
		if (!treedata) {
			SceneManager.sceneManager.StageItems.gro_steal.visible = false;
			return;
		}
		else {
			let data = {
				userId: treedata.user
			}
			MyRequest._post("game/checkSteal", data, this, this.Req_checkSteal.bind(this), null)
		}
	}

	/**
	 * 是否可以偷水回调
	 */
	private static Req_checkSteal(data) {
		console.log(data, "检查偷水数据")
		data = data.data
		if (data.canSteal == "true") {//可以偷水
			SceneManager.sceneManager.StageItems.gro_steal.visible = true;
			if (SceneManager.instance.landId == 1) {
				egret.Tween.get(SceneManager.sceneManager.StageItems.steal_btn, { loop: true })
					.set({ y: 781 })
					.to({ y: 789 }, 1000)
					.to({ y: 781 }, 1000)
			}
			else if (SceneManager.instance.landId == 2) {
				egret.Tween.get(SceneManager.sceneManager.StageItems.steal_btn, { loop: true })
					.set({ y: 841 })
					.to({ y: 849 }, 1000)
					.to({ y: 841 }, 1000)
			}
		} else {//不能偷水，隐藏水滴，并且把错误信息绑定
			SceneManager.sceneManager.StageItems.gro_steal.visible = false;
		}
	}

	/**
	 * 偷水请求
	 * stealUser : 被偷用户
	 */
	public static stealWater() {
		let params = {
			stealUser: Datamanager.getNowtreedata().user
		};
		MyRequest._post("game/stealWater", params, this, this.Req_stealWater.bind(this), null);
	}

	//偷水请求之后的处理
	private static Req_stealWater(data): void {
		var Data = data.data;
		// SceneManager.addNotice("偷到" + Data.stealNum + "g水滴", 2000)
		Help.stealshow(Data.stealNum);
		this.checkSteal(Datamanager.getNowtreedata());
	}




	//-----------------------------------------------------------------------------签到--------------------------------------------------------------------------//
	//查询签到信息
	public static getSignInInfo() {
		MyRequest._post("game/getSignInInfo", null, this, this.Req_getSignInInfo.bind(this), null)
	}

	//查询成功的处理
	private static Req_getSignInInfo(data): void {
		if (data.data) {
			let Signdate = data.data.lastSignDay;
			Signdate = Signdate.replace(new RegExp(/-/gm), "/"); //将所有的'-'转为'/'即可
			let nowdate = new Date();
			let time = new Date(Signdate);
			if (time.getDate() == nowdate.getDate() && time.getMonth() == nowdate.getMonth()) {
				SceneManager.sceneManager.StageItems.sign_gro.visible = false;
			}
			else {
				SceneManager.sceneManager.StageItems.sign_gro.visible = true;
			}
		}
		else {
			SceneManager.sceneManager.StageItems.sign_gro.visible = true;
		}

	}



	/**
     * 领取种子
     */
	public static getseed() {
		this.addmask();
		let chooseseed = new ChooseSeedScene();
		SceneManager.sceneManager._stage.addChild(chooseseed);
		Help.passAnm();
	}

	//--------------------------------------------------------------------点赞--------------------------------------------------------------------------------//

	/**
	 * 点赞数兑换奖励
	 * ruleId:兑换规则id
	 */

	public static duihuan(ruleId) {
		let params = {
			ruleId: ruleId
		};
		MyRequest._post("game/praiseExchange", params, this, this.Req_praiseExchange.bind(this), null)
	}

	private static Req_praiseExchange(data) {
		console.log("点赞兑换数据", data)
		if (data.data) {
			SceneManager.addNotice("获得" + data.data.propName + "x" + data.data.propNum);
		} else {
			SceneManager.addNotice("兑换成功！");
		}
		SceneManager.sceneManager.getDuihuanScene().searchPraiseExchange();								//更新点赞奖励列表
		NewHelp.updateprop();																			//更新道具
	}


	/**
	 * 给好友点赞
	 * friendUser:好友用户id
	 */
	public static dianzan(friendUser) {
		let params = {
			friend: friendUser
		};
		MyRequest._post("game/checkPraise", params, this, this.Req_checkPraise.bind(this, friendUser), null)
	}

	private static Req_checkPraise(friendUser, data) {
		console.log("是否能给好友点赞", data);
		if (data.data == "true") {			//能给好友点赞
			this.praise(friendUser);
		}
		else if (data.data == "false") {		//不能给好友点赞
			SceneManager.addNotice("今日已给该好友点过赞了哦！");
		}
	}

	private static praise(friendUser) {
		let params = {
			friend: friendUser
		};
		MyRequest._post("game/praise", params, this, this.Req_praise.bind(this), null)
	}

	private static Req_praise(data) {
		NewHelp.getfriendlike(Datamanager.getNowtreedata())
		SceneManager.addNotice("点赞成功");
		console.log("点赞返回数据", data)
	}

	/**
	 * 获取好友点赞数
	 * treedata:果树数据
	 */
	public static getfriendlike(treedata) {
		if (!treedata) {
			return;
		}
		else {
			let params = {
				user: treedata.user
			};
			MyRequest._post("game/getPraiseByUser", params, this, this.Req_getPraiseByUser.bind(this), null);
		}
	}

	private static Req_getPraiseByUser(data) {
		console.log(data.data, "点赞数")
		SceneManager.sceneManager.StageItems.friendlike_num.text = data.data							//好友点赞数
	}

	/**
	 * 铲除果树
	 * treedata:果树数据
	 */
	public static removeTree(treedata) {
		let params = {
			treeUserId: treedata.id
		};
		MyRequest._post("game/removeTree", params, this, this.Req_removeTree.bind(this), null)
	}

	private static Req_removeTree(data) {
		SceneManager.addNotice("铲除成功！");
		if (SceneManager.instance.landId == 1) {
			SceneManager.sceneManager.newmainScene.getOwnTree()
		}
		else if (SceneManager.instance.landId == 2) {
			SceneManager.sceneManager.newmain2Scene.getOwnTree()
		}
		console.log("铲除果树数据", data);
	}


	//--------------------------------------------------------------------获取道具图片-----------------------------------------------------------------------------//

	public static gettextrueBypropid(propid) {
		if (propid == propId.shuidi) {
			return "shuidi"
		}
		else if (propid == propId.lanzi) {
			return "lanzi"
		}
		else if (propid == propId.youjifei) {
			return "youji"
		}
		else if (propid == propId.fuhefei) {
			return "fuhe"
		}
		else if (propid == propId.shuirongfei) {
			return "shuirong"
		}
		else {
			return "close"
		}
	}
	//---------------------------------------------------------------------答题奖励-------------------------------------------------------------------------------//
	/**
	* 获取答题奖励列表
	*/
	public static searchAnswerStage() {
		MyRequest._post("game/searchAnswerStage", null, this, this.Req_searchAnswerStage.bind(this), null);
	}

	private static Req_searchAnswerStage(data) {
		Datamanager.saveAnswerrewarddata(data.data)
		console.log(data, "答题奖励规则")
	}

	public static getrewardByNum(num) {
		if (Datamanager.getAnswerrewarddata()) {
			for (let i = 0; i < Datamanager.getAnswerrewarddata().length; i++) {
				if (num == Datamanager.getAnswerrewarddata()[i].num) {
					return Datamanager.getAnswerrewarddata()[i].rewardInfo;
				}
			}
		}
	}

	/**
	 * 	通过道具Type和道具id获取道具图片
	 * 	data:道具数据
	 */
	public static getimgByType(data) {
		if (data.propType == 50) {       //种子
			return ""
		}
		else if (data.propType == 51) {     //鸭子
			return ""
		}
		else if (data.propType == 9) {      //草
			return ""
		}
		else if (data.propType == 8) {		//虫
			return ""
		}
		else if (data.propType == 7) {		//鸭蛋
			return ""
		}
		else if (data.propType == 6) {		//鸭食
			return ""
		}
		else if (data.propType == 5) {		//剪刀
			return ""
		}
		else if (data.propType == 4) {		//点赞数
			return ""
		}
		else if (data.propType == 3) {		//化肥
			if (data.propId == 4) {			//有机肥
				return "youji"
			}
			else if (data.propId == 5) {		//复合肥
				return "fuhe"
			}
			else if (data.propId == 6) {		//水溶肥
				return "shuirong"
			}
		}
		else if (data.propType == 2) {		//爱心值

		}
		else if (data.propType == 1) {		//果篮
			return "lanzi"
		}
		else if (data.propType == 0) {		//水滴
			return "shuidi"
		}
	}
	//---------------------------------------------------------------------------鸭子------------------------------------------------------------------------//

	/**
	 * 获取鸭子列表并领取
	 */
	public static getDuckList() {
		MyRequest._post("game/getDuckList", null, this, this.Req_getDuckList.bind(this), null);
	}

	private static Req_getDuckList(data) {
		console.log(data, "鸭子列表");
	}

	/**
	 * 获取自己鸭子
	 */
	public static getOwnDuck() {
		MyRequest._post("game/getOwnDuck", null, this, this.Req_getOwnDuck.bind(this), null);
	}

	private static Req_getOwnDuck(data) {
		console.log(data, "自己鸭子数据");
	}

}


enum propId {
	shuidi = 1,
	love,
	lanzi,
	youjifei,
	fuhefei,
	shuirongfei
}