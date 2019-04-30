class NewHelp {

	private static bgmask = new eui.Image;
	private static leaveMsgTemplateList: Array<LeaveMsgTemplate>;        //留言模板
	private static bgRect = new eui.Rect;
	public static map: { [key: string]: String } = {};		//创建一个map,用于存放用户头像连接，减少加载

	public static getWechatImg(users: Array<any>, success: Function) {
		//多个微信头像连接
		if (users && users.length > 0) {
			let length = users.length
			for (let i = 0; i < length; i++) {
				if (users[i] && !this.map[users[i]]) {
					users[i].splice(i, 1);
					i--;
					length--;
				}
			}
			if (users.length > 0) {								//其中有未保存的连接
				let params = {
					users: users.join(",")
				};
				MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImgwithplural.bind(this, users, success), null);
			}
			else {												//其中所有数据都已保存在map中
				success();
			}
		}
	}


	private static Req_WechatImgwithplural(users, success, data) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		for (let i = 0; i < users.length; i++) {
			if (users[i] && !this.map[users[i]]) {			//保存用户初次头像
				this.map[users[i]] = data[users[i]];
			}
		}
		success(data)
	}


	public static Req_WechatImgwithimage(data, users, image) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		let imgUrl = Config.picurl + data[users];
		if (users && !this.map[users]) {			//保存用户初次头像
			this.map[users] = data[users];
		}
		HttpRequest.imageloader(imgUrl, image, users);
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


	/**
	 * 添加点击不关闭二级场景遮罩
	 */
	public static addmaskwithoutcolse() {
		this.bgRect.width = SceneManager.sceneManager._stage.width;
		this.bgRect.height = SceneManager.sceneManager._stage.height;
		this.bgRect.fillAlpha = 0.3;
		SceneManager.sceneManager._stage.addChild(this.bgRect);

	}

	/**
	 * 移除点击不关闭二级场景遮罩
	 */
	public static removemaskwithoutcolse() {
		if (this.bgRect.parent) {
			this.bgRect.parent.removeChild(this.bgRect);
		}
	}


	//点击遮罩关闭场景
	public static closescene() {
		//关闭动态场景
		if (SceneManager.sceneManager.getDynamicScene().parent) {
			SceneManager.sceneManager.getDynamicScene().closeScene();
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
		if (SceneManager.sceneManager.warehouseScene && SceneManager.sceneManager.warehouseScene.parent) {
			SceneManager.sceneManager.warehouseScene.parent.removeChild(SceneManager.sceneManager.warehouseScene)
			this.removemask();
			Datamanager.getWarehousePropdata()
			return;
		}
		if (SceneManager.sceneManager.getNewfriendScene().parent) {
			SceneManager.sceneManager.getNewfriendScene().closeScene();
			return;
		}
		if (SceneManager.sceneManager.getSigninScene().parent) {
			SceneManager.sceneManager.getSigninScene().parent.removeChild(SceneManager.sceneManager.getSigninScene())
			this.removemask();
			return;
		}
		if (SceneManager.sceneManager.duckdetailScene && SceneManager.sceneManager.duckdetailScene.parent) {
			SceneManager.sceneManager.duckdetailScene.parent.removeChild(SceneManager.sceneManager.duckdetailScene)
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
		let barragbg = new eui.Group;		//弹幕容器
		let barragicongro = new eui.Group;	//弹幕头像容器
		let barragegroup = new eui.Group;	//弹幕内容容器
		let barragicon = new eui.Image;		//头像
		let barragiconbg = new eui.Rect;	//弹幕头像背景
		let bariconmask = new eui.Rect;		//弹幕头像遮罩
		let barragetext = new eui.Label;	//弹幕内容
		let barragetextbg = new eui.Rect;	//弹幕内容背景
		let data
		if (SceneManager.instance.landId == 1) {
			data = Datamanager.getOwnguoyuandata()			//果园数据
		} else if (SceneManager.instance.landId == 2) {
			data = Datamanager.getOwncaiyuandata()			//菜园数据
		}

		//添加弹幕内容
		barragetext.left = 54;
		barragetext.right = 16;
		barragetext.verticalCenter = 0;
		barragetext.size = 24;
		barragetext.text = this.getLeaveMsgByTemplateId(templateId)
		barragetext.textColor = 0xffffff;
		barragetext.fontFamily = "Microsoft YaHei";


		barragetextbg.left = 0
		barragetextbg.right = 0
		barragetextbg.bottom = 0
		barragetextbg.top = 0
		barragetextbg.x = 0;
		barragetextbg.y = 0
		barragetextbg.ellipseWidth = 50;
		barragetextbg.ellipseHeight = 50;
		barragetextbg.fillAlpha = 0.3;


		//添加单个弹幕容器
		barragegroup.height = 50
		barragegroup.verticalCenter = 0
		barragegroup.x = 38


		barragicongro.width = 76;
		barragicongro.height = 76;


		barragiconbg.width = 76;
		barragiconbg.height = 76;
		barragiconbg.horizontalCenter = 0;
		barragiconbg.verticalCenter = 0;
		barragiconbg.ellipseWidth = 76;
		barragiconbg.ellipseHeight = 76;
		barragiconbg.fillAlpha = 0.3;


		//添加弹幕头像
		barragicon.horizontalCenter = 0;
		barragicon.verticalCenter = 0;
		barragicon.width = 70;
		barragicon.height = 70;
		barragicon.texture = RES.getRes("noicon_png")
		if (data.userIcon) {
			let params = {
				users: data.user
			}
			MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, data.user, barragicon), null);
		}


		//添加弹幕头像遮罩
		bariconmask.horizontalCenter = 0;
		bariconmask.verticalCenter = 0;
		bariconmask.width = 70;
		bariconmask.height = 70;
		bariconmask.ellipseWidth = 70;
		bariconmask.ellipseHeight = 70;

		barragbg.x = 760;
		barragbg.y = 300 + Help.random_num(1, 3) * 60;


		barragbg.addChild(barragegroup)
		barragbg.addChild(barragicongro)
		barragicongro.addChild(barragiconbg)
		barragicongro.addChild(barragicon)
		barragicongro.addChild(bariconmask)
		barragegroup.addChild(barragetextbg)
		barragegroup.addChild(barragetext)
		barragicon.mask = bariconmask;
		BarGroup.addChild(barragbg);

		//弹幕飘动
		egret.Tween.get(barragbg)
			.to({ x: -(barragbg.width + 10) }, 8000).call(() => {
				if (barragegroup.parent) {
					BarGroup.removeChild(barragbg)
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
			let barragbg = new eui.Group;		//弹幕背景
			let barragicon = new eui.Image;		//头像
			let barragicongro = new eui.Group;	//弹幕头像
			let barragiconbg = new eui.Rect;	//弹幕头像背景
			let bariconmask = new eui.Rect;		//弹幕头像遮罩
			let barragegroup = new eui.Group;	//弹幕容器
			let barragetext = new eui.Label;	//弹幕内容
			let barragetextbg = new eui.Rect;	//弹幕内容背景

			//添加弹幕内容
			barragetext.left = 54;
			barragetext.right = 16;
			barragetext.verticalCenter = 0;
			barragetext.size = 24;
			barragetext.text = this.getLeaveMsgByTemplateId(dataList[i].templateId)
			barragetext.textColor = 0xffffff;
			barragetext.fontFamily = "Microsoft YaHei";

			barragetextbg.left = 0
			barragetextbg.right = 0
			barragetextbg.bottom = 0
			barragetextbg.top = 0
			barragetextbg.x = 0;
			barragetextbg.y = 0
			barragetextbg.ellipseWidth = 50;
			barragetextbg.ellipseHeight = 50;
			barragetextbg.fillAlpha = 0.3;

			//添加单个弹幕容器
			barragegroup.height = 50
			barragegroup.verticalCenter = 0
			barragegroup.x = 38

			barragicongro.width = 76;
			barragicongro.height = 76;

			barragiconbg.width = 76;
			barragiconbg.height = 76;
			barragiconbg.horizontalCenter = 0;
			barragiconbg.verticalCenter = 0;
			barragiconbg.ellipseWidth = 76;
			barragiconbg.ellipseHeight = 76;
			barragiconbg.fillAlpha = 0.3;

			//添加弹幕头像
			barragicon.horizontalCenter = 0;
			barragicon.verticalCenter = 0;
			barragicon.width = 70;
			barragicon.height = 70;
			barragicon.texture = RES.getRes("noicon_png")
			if (dataList[i].mainUserIcon) {
				let params = {
					users: dataList[i].mainUser
				}
				MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, dataList[i].mainUser, barragicon), null);
			}

			//添加弹幕头像遮罩
			bariconmask.horizontalCenter = 0;
			bariconmask.verticalCenter = 0;
			bariconmask.width = 70;
			bariconmask.height = 70;
			bariconmask.ellipseWidth = 70;
			bariconmask.ellipseHeight = 70;


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
						if (SceneManager.instance.landId == 1) {
							SceneManager.sceneManager.newmainScene.updateBytreedata(null);
						}
						else if (SceneManager.instance.landId == 2) {
							SceneManager.sceneManager.newmain2Scene.updateBytreedata(null)
						}
					}
				}
			}, this)


			barragbg.x = 760;
			barragbg.y = 300 + Help.random_num(1, 3) * 60;

			barragbg.addChild(barragegroup)
			barragbg.addChild(barragicongro)
			barragicongro.addChild(barragiconbg)
			barragicongro.addChild(barragicon)
			barragicongro.addChild(bariconmask)
			barragegroup.addChild(barragetextbg)
			barragegroup.addChild(barragetext)
			barragicon.mask = bariconmask;
			BarGroup.addChild(barragbg);


			//弹幕飘动
			if (barragbg) {
				egret.Tween.get(barragbg)
					.wait(i * 3000)
					.to({ x: -(barragbg.width + 10) }, 8000).call(() => {
						if (barragbg.parent) {
							BarGroup.removeChild(barragbg)
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
			let gro_prop
			if (SceneManager.sceneManager.landId == 1) {
				gro_prop = SceneManager.sceneManager.newmainScene.gro_prop;
			}
			else if (SceneManager.sceneManager.landId == 2) {
				gro_prop = SceneManager.sceneManager.newmain2Scene.gro_prop
			}
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
		let gro_prop
		if (SceneManager.sceneManager.landId == 1) {
			gro_prop = SceneManager.sceneManager.newmainScene.gro_prop;
		}
		else if (SceneManager.sceneManager.landId == 2) {
			gro_prop = SceneManager.sceneManager.newmain2Scene.gro_prop;
		}
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
		let gro_prop
		if (SceneManager.sceneManager.landId == 1) {
			gro_prop = SceneManager.sceneManager.newmainScene.gro_prop;
		}
		else if (SceneManager.sceneManager.landId == 2) {
			gro_prop = SceneManager.sceneManager.newmain2Scene.gro_prop;
		}
		let grass = new eui.Image;
		grass.width = 74 * 0.6;
		grass.height = 60 * 0.6;
		grass.texture = RES.getRes("home-grass");
		grass.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(grass, id, 1);
		}, this)
		if (!m) {
			m = Help.random_num(4, 6)
			if (m == 4) {
				gro_prop.addChild(grass);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 286 + Help.random_num(-2, 2) * 3;
					twn_y = 965 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 203 + Help.random_num(-2, 2) * 3;
					twn_y = 924 + Help.random_num(-2, 2) * 3;
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
					twn_x = 243 + Help.random_num(-2, 2) * 3;
					twn_y = 1006 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 262 + Help.random_num(-2, 2) * 3;
					twn_y = 968 + Help.random_num(-2, 2) * 3;
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
					twn_x = 293 + Help.random_num(-2, 2) * 3;
					twn_y = 1032 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 310 + Help.random_num(-2, 2) * 3;
					twn_y = 982 + Help.random_num(-2, 2) * 3;
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
		let gro_prop
		if (SceneManager.sceneManager.landId == 1) {
			gro_prop = SceneManager.sceneManager.newmainScene.gro_prop;
		}
		else if (SceneManager.sceneManager.landId == 2) {
			gro_prop = SceneManager.sceneManager.newmain2Scene.gro_prop;
		}
		let insect = new eui.Image;
		insect.width = 76 * 0.6;
		insect.height = 95.75 * 0.6;
		insect.texture = RES.getRes("home-insect");
		insect.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.removeTreeProp(insect, id, 2);
		}, this)
		if (!m) {
			m = Help.random_num(4, 6)
			if (m == 4) {
				gro_prop.addChild(insect);
				let twn_x;
				let twn_y;
				if (SceneManager.instance.landId == 1) {
					twn_x = 453 + Help.random_num(-2, 2) * 3;
					twn_y = 1000 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 428 + Help.random_num(-2, 2) * 3;
					twn_y = 957 + Help.random_num(-2, 2) * 3;
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
					twn_x = 413 + Help.random_num(-2, 2) * 3;
					twn_y = 1030 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 478 + Help.random_num(-2, 2) * 3;
					twn_y = 928 + Help.random_num(-2, 2) * 3;
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
					twn_x = 436 + Help.random_num(-2, 2) * 3;
					twn_y = 967 + Help.random_num(-2, 2) * 3;
				}
				else if (SceneManager.instance.landId == 2) {
					twn_x = 492 + Help.random_num(-2, 2) * 3;
					twn_y = 892 + Help.random_num(-2, 2) * 3;
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
	private static removeTreeProp(icon, id, type) {
		if (id < 0) {
			SceneManager.addNotice("不能清除自己放的哦！")
			icon.once(egret.TouchEvent.TOUCH_TAP, () => {
				this.removeTreeProp(icon, id, type);
			}, this)
			return
		}
		let params = {
			treePropId: id
		};
		MyRequest._post("game/removeTreeProp", params, this, this.Req_removeTreeProp.bind(this, icon, type), () => {
			icon.once(egret.TouchEvent.TOUCH_TAP, () => {
				this.removeTreeProp(icon, id, type);
			}, this)
		})
	}

	//除去果园成功后处理
	private static Req_removeTreeProp(icon, type, data): void {
		let gro_prop
		if (SceneManager.sceneManager.landId == 1) {
			gro_prop = SceneManager.sceneManager.newmainScene.gro_prop;
		}
		else if (SceneManager.sceneManager.landId == 2) {
			gro_prop = SceneManager.sceneManager.newmain2Scene.gro_prop;
		}
		var Data = data;
		gro_prop.removeChild(icon);
		if (Data.data && Number(Data.data.loveCount) > 0) {
			if (type == 1) {
				SceneManager.addNotice("清除成功,获得" + Data.data.loveCount + "个草")
			}
			else if (type == 2) {
				SceneManager.addNotice("清除成功,获得" + Data.data.loveCount + "个虫")
			}
			NewHelp.updateprop();

		} else {
			if (SceneManager.instance.landId == 1) {
				if (Datamanager.getNowtreedata().id == Datamanager.getOwnguoyuandata().id) {
					SceneManager.addNotice("清除成功")
				}
				else {
					SceneManager.addNotice("清除成功,每日已达上限！")
				}
			}
			else if (SceneManager.instance.landId == 2) {
				if (Datamanager.getNowtreedata().id == Datamanager.getOwncaiyuandata().id) {
					SceneManager.addNotice("清除成功")
				}
				else {
					SceneManager.addNotice("清除成功,每日已达上限！")
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
		// 显示自己道具数值
		SceneManager.sceneManager.StageItems.kettle_num.text = (Help.getPropById(Data.data, 1) ? Help.getPropById(Data.data, 1).num : 0) + "g";    //水滴数量
		SceneManager.sceneManager.StageItems.like_num.text = (Help.getPropById(Data.data, 11) ? Help.getPropById(Data.data, 11).num : 0);    		//点赞数量
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
			NewHelp.Invite();
			// SceneManager.addNotice("该好友还没有种树哦！")
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
			.to({ y: -230 }, 500)
			.to({ x: -120, y: -330, rotation: -54 }, 500).call(() => { this.waterTwn(data.data) }, this)
			.wait(1200)
			.to({ y: -230, rotation: 0 }, 500)
			.to({ y: 0, x: 0 }, 500)

	}




	/**
	 * 使用道具
	 * propId    道具种类id		1：水滴   2：爱心值    3：篮子    4：有机肥   5：复合肥    6水溶肥
	 * treedata  使用道具的果树数据
	 */
	public static useProp(propId, treedata) {
		let params
		if (treedata) {
			let canUseProp = treedata.canReceive == null ? "false" : treedata.canReceive;
			if (canUseProp == 'true') {
				console.log("果树已经可以兑换啦，不用再使用道具了。")
				SceneManager.sceneManager.StageItems.btn_kettle.touchEnabled = true;
				return;
			}
			if (treedata.needTake == "true") {
				SceneManager.addNotice("果树已经长好了,快去摘果吧！")
				SceneManager.sceneManager.StageItems.btn_kettle.touchEnabled = true;
				return
			}
			if (treedata.stageObj.isLast == "true" && treedata.growthValue == treedata.stageObj.energy && treedata.needTake == "false") {
				SceneManager.addNotice("果树已经长好啦，您可以邀请好友帮忙摘果哦！")
				SceneManager.sceneManager.StageItems.btn_kettle.touchEnabled = true;
				return
			}
			params = {
				propId: propId,
				treeUserId: treedata.id
			}
			if (this.canPost) {
				this.canPost = false;
				MyRequest._post("game/useProp", params, this, this.Req_useProp.bind(this, propId), this.postErr.bind(this, propId));
			}
		}
		else {
			if (propId == 8 || propId == 9 || propId == 10) {
				params = {
					propId: propId,
				}
				if (this.canPost) {
					this.canPost = false;
					MyRequest._post("game/useProp", params, this, this.Req_useProp.bind(this, propId), this.postErr.bind(this, propId));
				}
			}
			else {
				NewHelp.Invite()
				// SceneManager.addNotice("您还没有种树哦！")
			}
		}
	}

	//使用道具成功后处理
	private static Req_useProp(propId, data): void {
		NewHelp.closescene();
		this.canPost = true;
		SceneManager.sceneManager.newmainScene.progress.slideDuration = 6000;
		var Data = data;
		if (propId == 1) {										//使用水滴
			this.kettleTwn();					//使用水滴之后更新在动画中完成
		}
		else if (propId == 4 || propId == 5 || propId == 6) {	//使用化肥
			SceneManager.sceneManager.StageItems.touchEnabled = false;
			this.huafeiTwn(propId);
		}
		else if (propId == 9) {										//使用虫
			SceneManager.addNotice("使用成功！")
			NewHelp.updateprop()
			NewHelp.duckeatTwn("usedinsect_png")
		}
		else if (propId == 10) {									//使用草
			SceneManager.addNotice("使用成功！")
			NewHelp.updateprop()
			NewHelp.duckeatTwn("usedgrass_png")
		}
		else if (propId == 8) {										//使用鸭食
			SceneManager.addNotice("使用成功！")
			NewHelp.updateprop()
			NewHelp.duckeatTwn("duckfood_png")
		}
	}





	//化肥动画
	private static huafeiTwn(type) {
		let icon = new eui.Image();
		if (type == 4) {
			icon.texture = RES.getRes("szhuafei_png");
			icon.width = 86
			icon.height = 94;
			icon.x = 68;
			icon.y = 700;
		}
		else if (type == 5) {
			icon.texture = RES.getRes("jshuafei_png");
			icon.width = 86
			icon.height = 94;
			icon.x = 177.5;
			icon.y = 886;
		}
		else if (type == 6) {
			icon.texture = RES.getRes("zghuafei_png");
			icon.width = 86
			icon.height = 94;
			icon.x = 212;
			icon.y = 1006;
		}
		icon.anchorOffsetX = icon.width / 2;
		icon.anchorOffsetY = icon.height / 2;
		SceneManager.sceneManager._stage.addChild(icon)
		egret.Tween.get(icon)
			.to({ x: 540, y: 725 }, 1000)
			.wait(300)
			.to({ rotation: -60 }, 500).call(() => {
				this.huafeikeli(icon);
				if (type == 6) {
					SceneManager.addNotice("使用成功！收果时果子数会增加哦！")
				}
				if (type == 4) {
					SceneManager.addNotice("肥料生效,迅速生长" + Datamanager.getsinglePropdata(4).propObj.base + "g")
				}
			}, this)
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
			.call(() => {
				SceneManager.sceneManager._stage.removeChild(icon1);
				NewHelp.Specialeffects();
				SceneManager.sceneManager.StageItems.touchEnabled = true;
			}, this)
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
			.to({ y: -230 }, 500)
			.to({ x: -120, y: -330, rotation: -54 }, 500).call(this.waterTwn, this)
			.wait(1200)
			.to({ y: -230, rotation: 0 }, 500)
			.to({ y: 0, x: 0 }, 500).call(this.tettleEad, this);
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
			Help.helpwaterLove(data);												//爱心值动画
			SceneManager.sceneManager.newmainScene.progress.slideDuration = 6000;
			this.getTreeInfoByid(Datamanager.getNowtreedata().id)								//更新好友果园数据
			SceneManager.sceneManager.StageItems.img_water.visible = false;
			NewHelp.updateprop();
		}
		else {
			Help.waters();
			SceneManager.sceneManager.StageItems.img_water.visible = false;
		}
		if (Datamanager.getNowtreedata().fertilizerRecord) {
			SceneManager.addNotice("成长值增加20g")
		}
	}

	// 水壶冷却展现
	private static tettleEad() {
		SceneManager.sceneManager.StageItems.btn_kettle.touchEnabled = true;
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
		SceneManager.sceneManager.StageItems.btn_kettle.visible = false;
		this.showtime(this.a);
		SceneManager.sceneManager.StageItems.gro_lq.visible = true;
		this.kettlelq(this.a);
	}



	//水壶冷却
	private static kettlelq(time) {
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
			SceneManager.sceneManager.StageItems.time_lq.text = "00：0" + time;
		}
		if (time >= 10) {
			SceneManager.sceneManager.StageItems.time_lq.text = "00：" + time;
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
			SceneManager.sceneManager.StageItems.btn_kettle.visible = true;
			SceneManager.sceneManager.StageItems.gro_lq.visible = false;
			timer.reset();
		}
	}
	//冷却加速
	public static lqfast() {
		this.a = this.a - 1;
		this.showtime(this.a);
		let text = new eui.Label();
		text.text = "-1s";
		text.x = 625;
		text.y = 1160;
		text.textColor = 0xffffff;
		text.size = 40;
		SceneManager.sceneManager.StageItems.addChild(text);
		egret.Tween.get(text)
			.to({ y: 1120 }, 500).call(() => { SceneManager.sceneManager.StageItems.removeChild(text) }, this)
	}

	//水壶冷却完成
	private static kettleshow() {

	}


	//请求接口失败回调
	private static postErr(propId?) {
		SceneManager.sceneManager.StageItems.btn_kettle.touchEnabled = true;
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

	/**
	 * 随机显示树语
	 */

	public static treelanguageTimer = new egret.Timer(6000, 0);
	public static showtreelanguage() {
		this.treelanguageTimer.addEventListener(egret.TimerEvent.TIMER, () => {
			if (SceneManager.sceneManager.landId == 1) {
				SceneManager.sceneManager.newmainScene.treeTouch()
			}
			else if (SceneManager.sceneManager.landId == 2) {
				SceneManager.sceneManager.newmain2Scene.treeTouch()
			}
		}
			, this);
		this.treelanguageTimer.start();
	}


	//------------------------------------------------------------------------鸭语----------------------------------------------------------------------------//

	/**
	 * 获取鸭语数据
	 */
	public static getDuckLanguage(data) {
		if (!data) {
			Datamanager.savetreelanguagedata(null);
			return;
		}
		else {
			let params = {
				stage: data.stage
			};
			MyRequest._post("game/getDuckLanguage", params, this, this.Req_getDuckLanguage.bind(this), null)
		}
	}


	//鸭语数据
	private static Req_getDuckLanguage(data): void {
		//保存鸭语数据
		Datamanager.saveducklanguagedata(data.data);
	}

	/**
	 * 当前阶段鸭语显示
	 */
	public static nowduck_language() {
		if (Datamanager.getducklanguagedata().length > 0) {
			let n = Help.random_num(0, Datamanager.getducklanguagedata().length - 1)
			this.addducklanguage(Datamanager.getducklanguagedata()[n].msg);
		}
		else {
			this.ducktimer.reset();
			this.ducklanguageTimer.reset();
			SceneManager.sceneManager.newmain2Scene.duck_language_gro.removeChildren()
		}
	}

	public static ducktimer: egret.Timer = new egret.Timer(4500, 1);

	//显示鸭语
	public static addducklanguage(info: string) {
		if (SceneManager.sceneManager.newmain2Scene) {
			this.ducktimer.reset();
			let duckprompt = new DuckPrompt(info);
			let duck_language_gro = SceneManager.sceneManager.newmain2Scene.duck_language_gro
			duck_language_gro.removeChildren()
			duck_language_gro.visible = false;
			this.ducktimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
				duck_language_gro.removeChildren()
				duck_language_gro.visible = false;
			}, this);
			duck_language_gro.addChild(duckprompt);
			this.ducktimer.start();
			egret.Tween.get(duckprompt, { loop: true })
				.set({ scaleX: 0, scaleY: 0 }).call(() => { duck_language_gro.visible = true }, this)
				.to({ scaleX: 1, scaleY: 1 }, 1500)
				.wait(3000)
		}
	}

	/**
	 * 无鸭子时显示鸭语
	 */
	public static addnoduck_language(info: string) {
		this.ducktimer.reset();
		this.ducklanguageTimer.reset();
		let duckprompt = new DuckPrompt(info);
		let duck_language_gro = SceneManager.sceneManager.newmain2Scene.duck_language_gro
		duck_language_gro.removeChildren()
		duck_language_gro.visible = false;
		duck_language_gro.addChild(duckprompt);
		egret.Tween.get(duckprompt, { loop: true })
			.set({ scaleX: 0, scaleY: 0 }).call(() => { duck_language_gro.visible = true }, this)
			.to({ scaleX: 1, scaleY: 1 }, 1500)
			.wait(3000)

	}

	/**
	 * 随机显示鸭语
	 */
	public static ducklanguageTimer = new egret.Timer(7500, 0);
	public static showducklanguage() {
		this.ducklanguageTimer.addEventListener(egret.TimerEvent.TIMER, () => {
			this.nowduck_language();
		}
			, this);
		this.ducklanguageTimer.start();
	}

	public static stopducklanguage() {
		this.ducklanguageTimer.stop();
	}

	public static startducklanguage() {
		this.ducklanguageTimer.start();
	}

	//------------------------------------------------------------------------头像----------------------------------------------------------------------------//

	//获取微信头像
	public static Req_WechatImg(user, image: eui.Image, data) {
		if (!data) {
			return;
		}
		image.texture = RES.getRes("noicon_png");
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		let imgUrl = Config.picurl + data[user];
		var err = HttpRequest.imageloader(imgUrl, image, user);
		if (err && err == 1) {
			image.texture = RES.getRes("noicon_png")
		}
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
			progress.maximum = data.stageObj.energy;	//进度条最大值
			progress.value = data.growthValue;			//进度条当前值
			if (this.nowprogressvalue && this.nowprogressvalue > Number(data.growthValue)) {
				progress.value = 0;
				progress.slideDuration = 0;
				progress.value = 0.01;
				progress.value = data.growthValue;
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
			if (data.canReceive == "true" && SceneManager.sceneManager.StageItems.currentState == "friendtree") {
				progress_label.textFlow = <Array<egret.ITextElement>>[
					{ text: "已经可以兑换了,快去提醒好友吧" },
				]
			}

			if (data.needTake == "true") {
				if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: "采摘了才能进入下一阶段" },
					]
				}
				else if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: "已经可以采摘了,快去提醒好友吧" },
					]
				}
			}
			else if (data.stageObj.canHarvest == "true") {
				progress_label.textFlow = <Array<egret.ITextElement>>[
					{ text: data.stageObj.name },
					{ text: "还需要浇水" },
					{ text: ((Number(data.stageObj.energy) - Number(data.growthValue)) / Number(data.stageObj.energy) * 100).toFixed(2) + "%能" },
					{ text: "采摘" },
				]
			}
			else {
				if (data.nextStageName) {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: data.stageObj.name },
						{ text: "还需要浇水" },
						{ text: ((Number(data.stageObj.energy) - Number(data.growthValue)) / Number(data.stageObj.energy) * 100).toFixed(2) + "%到" },
						{ text: data.nextStageName },
					]
				}
				else {
					progress_label.textFlow = <Array<egret.ITextElement>>[
						{ text: data.stageObj.name },
						{ text: "还需要浇水" },
						{ text: ((Number(data.stageObj.energy) - Number(data.growthValue)) / Number(data.stageObj.energy) * 100).toFixed(2) + "%能" },
						{ text: "采摘" },
					]
				}
			}
			progress_label.visible = true;
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


	private static timer

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
					if (SceneManager.instance.landId == 1) {
						SceneManager.sceneManager.StageItems.gro_pick.y = 624;
					}
					else if (SceneManager.instance.landId == 2) {
						SceneManager.sceneManager.StageItems.gro_pick.y = 734;
					}
					SceneManager.sceneManager.StageItems.gro_pick.visible = true;
					SceneManager.sceneManager.StageItems.pick_label.text = "可摘果";
					SceneManager.sceneManager.StageItems.pick_time.visible = false;
					if (this.timer) {
						clearInterval(this.timer)
					}
					if (treedata.fruitTime) {
						SceneManager.sceneManager.StageItems.pick_hand.visible = false;
						SceneManager.sceneManager.StageItems.pick_label.visible = false;
						let time = new Date(treedata.fruitTime).getTime()
						time = time + Number(treedata.receiveDelay * 1000 * 60)
						this.timer = setInterval(() => {
							let text = SceneManager.instance.getTaskScene().dateDif(time, this.timer)
							text = text.slice(3);
							SceneManager.sceneManager.StageItems.tree_receive_info.text = text;
							if (text) {
								if (!SceneManager.sceneManager.StageItems.pick_time.visible) {
									SceneManager.sceneManager.StageItems.pick_time.visible = true;
									SceneManager.sceneManager.StageItems.pick_label.visible = true;
								}
								SceneManager.sceneManager.StageItems.pick_hand.visible = false;
							}
							else {
								if (SceneManager.sceneManager.StageItems.pick_time.visible) {
									SceneManager.sceneManager.StageItems.pick_time.visible = false;
								}
								SceneManager.sceneManager.StageItems.pick_hand.visible = true;
								SceneManager.sceneManager.StageItems.pick_label.visible = true;
								egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
									.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
									.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
									.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
									.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
							}
						}, 1000);
					}
					else {
						SceneManager.sceneManager.StageItems.pick_hand.visible = true;
						egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
							.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
							.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
							.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
							.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
					}
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
			if (SceneManager.instance.landId == 1) {
				SceneManager.sceneManager.StageItems.gro_pick.y = 624;
			}
			else if (SceneManager.instance.landId == 2) {
				SceneManager.sceneManager.StageItems.gro_pick.y = 734;
			}
			SceneManager.sceneManager.StageItems.pick_label.text = "帮摘果";
			egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
			this.isSteal = false;
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
		MyRequest._post("game/helpTakeGoods", params, this, this.Req_friendpick.bind(this, treeUserId), null);
	}

	//帮摘果之后请求
	private static Req_friendpick(treeUserId, data) {
		treeUserId = String(treeUserId);
		var nowday = new Date().toLocaleDateString();
		localStorage.setItem(treeUserId, nowday)
		Help.pickTwn(5);
		Help.pickTwnupdata(() => {
			Help.helppickTwn(data.data);
			this.getTreeInfoByid(Datamanager.getNowtreedata().id);
			SceneManager.sceneManager.StageItems.enabled = true;
			SceneManager.sceneManager.StageItems.pick_hand.once(egret.TouchEvent.TOUCH_TAP, SceneManager.sceneManager.StageItems.PickFruit, SceneManager.sceneManager.StageItems);
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
				SceneManager.sceneManager.StageItems.gro_steal.y = 781
			}
			else if (SceneManager.instance.landId == 2) {
				SceneManager.sceneManager.StageItems.gro_steal.y = 841
			}
			egret.Tween.get(SceneManager.sceneManager.StageItems.steal_btn, { loop: true })
				.to({ y: 1 }, 1000)
				.to({ y: -7 }, 1000)
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
		SceneManager.sceneManager.StageItems.steal_btn.touchEnabled = false;
	}

	//偷水请求之后的处理
	private static Req_stealWater(data): void {
		var Data = data.data;
		// SceneManager.addNotice("偷到" + Data.stealNum + "g水滴", 2000)
		Help.stealshow(Data.stealNum);
		this.checkSteal(Datamanager.getNowtreedata());
		SceneManager.sceneManager.StageItems.steal_btn.touchEnabled = true;
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
				SceneManager.sceneManager.getSigninScene().sign_red.visible = false;
			}
			else {
				SceneManager.sceneManager.StageItems.sign_gro.visible = true;
				SceneManager.sceneManager.getSigninScene().sign_red.visible = true;
			}
		}
		else {
			SceneManager.sceneManager.StageItems.sign_gro.visible = true;
			SceneManager.sceneManager.getSigninScene().sign_red.visible = true;
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
	public static dianzan(friendUser, listiem?) {
		if (friendUser == SceneManager.sceneManager.weixinUtil.login_user_id) {
			return;
		}
		let params = {
			friend: friendUser
		};
		MyRequest._post("game/checkPraise", params, this, this.Req_checkPraise.bind(this, friendUser, listiem), null)
	}

	private static Req_checkPraise(friendUser, listiem, data) {
		console.log("是否能给好友点赞", data);
		if (data.data == "true") {			//能给好友点赞
			this.praise(friendUser, listiem);
		}
		else if (data.data == "false") {		//不能给好友点赞
			SceneManager.addNotice("今日已给该好友点过赞了哦！");
		}
	}

	private static praise(friendUser, listiem?) {
		let params = {
			friend: friendUser
		};
		MyRequest._post("game/praise", params, this, this.Req_praise.bind(this, listiem), null)
	}

	private static Req_praise(listiem, data) {
		if (listiem) {
			SceneManager.sceneManager.getNewfriendScene().friendsdata.source[listiem].praises = SceneManager.sceneManager.getNewfriendScene().friendsdata.source[listiem].praises + 1
			SceneManager.sceneManager.getNewfriendScene().friendsdata.itemUpdated(SceneManager.sceneManager.getNewfriendScene().friendsdata.source[listiem])
		}
		NewHelp.getfriendlike(Datamanager.getNowtreedata())
		SceneManager.addNotice("点赞成功");
		NewHelp.getFriends();
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
		SceneManager.sceneManager.StageItems.friend_love_num.text = data.data							//好友点赞数
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

	/**
	 * 获取道具图片
	 */
	public static gettextrueBypropid(propid?, propType?) {
		if (propType == 51) {						//鸭子
			return "duck_png"
		}
		if (propid == propId.shuidi) {
			return "icon_water_png"
		}
		else if (propid == propId.lanzi) {
			return "lanzi"
		}
		else if (propid == propId.youjifei) {
			return "szhuafei_png"
		}
		else if (propid == propId.fuhefei) {
			return "jshuafei_png"
		}
		else if (propid == propId.shuirongfei) {
			return "zghuafei_png"
		}
		else if (propid == propId.jiandao) {
			return "close"
		}
		else if (propid == propId.duckfood) {
			return "duckfood_png"
		}
		else if (propid == propId.insect) {
			return "usedinsect_png"
		}
		else if (propid == propId.grass) {
			return "usedgrass_png"
		}
		else if (propid == propId.dianzan) {
			return "close"
		}
		else if (propid == propId.duckegg) {
			return "duckegg_png"
		}
		else {
			return "close"
		}
	}


	public static getnameBypropid(propid) {
		if (propid == propId.shuidi) {
			return "waterlabel_png"
		}
		else if (propid == propId.lanzi) {
			return "close"
		}
		else if (propid == propId.youjifei) {
			return "szlabel_png"
		}
		else if (propid == propId.fuhefei) {
			return "jslabel_png"
		}
		else if (propid == propId.shuirongfei) {
			return "zglabel_png"
		}
		else if (propid == propId.jiandao) {
			return "close"
		}
		else if (propid == propId.duckfood) {
			return "yashilabel_png"
		}
		else if (propid == propId.insect) {
			return "insectlabel_png"
		}
		else if (propid == propId.grass) {
			return "grasslabel_png"
		}
		else if (propid == propId.dianzan) {
			return "close"
		}
		else if (propid == propId.duckegg) {
			return "close"
		}
		else {
			return "close"
		}
	}



	public static intofriend(userid) {
		if (userid) {
			let params = {
				friendUser: userid
			};
			MyRequest._post("game/getFriendByUser", params, this, this.Req_intofriend.bind(this), null)
		}
	}


	public static Req_intofriend(data) {
		if (data.data) {
			let frienddata = data.data.list[0];
			Datamanager.savenowfrienddata(frienddata)
			if (frienddata.trees[0]) {
				NewHelp.getTreeInfoByid(frienddata.trees[0].id);
			}
			console.log(data, "单个好友数据")
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
			var max = Datamanager.getAnswerrewarddata()[0].num;
			var maxIndex = -1;
			for (let i = 0; i < Datamanager.getAnswerrewarddata().length; i++) {
				var nowNum = Datamanager.getAnswerrewarddata()[i].num;
				if (num >= nowNum && nowNum >= max) {
					maxIndex = i
				}
			}
			if (maxIndex >= 0) {
				return Datamanager.getAnswerrewarddata()[maxIndex].rewardInfo
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
				return "szhuafei_png"
			}
			else if (data.propId == 5) {		//复合肥
				return "jshuafei_png"
			}
			else if (data.propId == 6) {		//水溶肥
				return "zghuafei_png"
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
	 * 获取自己鸭子
	 */
	public static getOwnDuck() {
		SceneManager.sceneManager.newmain2Scene.duck_language_gro.removeChildren()
		this.ducklanguageTimer.reset();
		MyRequest._post("game/getOwnDuck", null, this, this.Req_getOwnDuck.bind(this), null);
		SceneManager.sceneManager.newmain2Scene.getduck_btn.visible = false;
	}

	private static Req_getOwnDuck(data) {
		console.log(data, "自己鸭子数据");
		if (data.data) {				//有鸭子数据
			Datamanager.saveOwnDuckdata(data.data)
			if (data.data.canReceive) {
				let peisonglabel = "免费获得" + "\n" + data.data.goodsName + "一箱!"
				SceneManager.sceneManager._stage.removeChildren();
				let image = new eui.Image();
				image.texture = RES.getRes("bgday_caiyuan_png");
				image.height = SceneManager.sceneManager._stage.height;
				let prompt = new PromptJump(peisonglabel, true);
				SceneManager.sceneManager._stage.addChild(image);
				SceneManager.sceneManager._stage.addChild(prompt);
				return
			}
			let duckdata = data.data;
			Datamanager.savenowDuckdata(data.data);
			if (SceneManager.sceneManager.newmain2Scene) {
				SceneManager.sceneManager.newmain2Scene.updateduck(duckdata);
			}
		}
		else {						//无鸭子数据获取鸭子列表
			this.getDuckList();
			Datamanager.savenowDuckdata(null);
			SceneManager.sceneManager.newmain2Scene.updateduck(null);
		}
	}

	/**
	 * 获取鸭子列表并领取
	 */
	public static getDuckList() {
		MyRequest._post("game/getDuckList", null, this, this.Req_getDuckList.bind(this), null);
	}

	private static Req_getDuckList(data) {
		console.log(data, "鸭子列表");
		let getduckimg = SceneManager.sceneManager.newmain2Scene.getduck_btn;
		getduckimg.visible = true;
		egret.Tween.get(getduckimg, { loop: true })
			.to({ y: getduckimg.y + 20 }, 500)
			.to({ y: getduckimg.y }, 500);
		if (!data.data[0].leftReceiveCount || data.data[0].leftReceiveCount > 0) {
			let duckId = data.data[0].id
			if (!this.once) {
				this.once = true;
				getduckimg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.receiveDuckFunc.bind(this, duckId), this);
			}
		}
		else {
			getduckimg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				SceneManager.addNotice("没有领取次数了");
				SceneManager.sceneManager.newmain2Scene.getduck_btn.touchEnabled = true;
			}, this)
		}
	}
	private static once: boolean;
	/**
	 * 领取鸭子处理事件
	 */
	public static receiveDuckFunc(duckId: String): void {
		this.receiveDuck(duckId);
		SceneManager.sceneManager.newmain2Scene.getduck_btn.touchEnabled = false;
	}

	/**
	 * 领取鸭子
	 * duckId:鸭子ID
	 */
	public static receiveDuck(duckId) {
		let params = {
			duckId: duckId
		}
		MyRequest._post("game/receiveDuck", params, this, this.Req_receiveDuck.bind(this), null);
	}

	private static Req_receiveDuck(data) {
		console.log(data, "领取成功");
		SceneManager.sceneManager.newmain2Scene.getduck_btn.touchEnabled = true;
		SceneManager.addNotice("领取成功")
		this.getOwnDuck();
		NewHelp.updateprop();
	}


	/**
	 * 获取别人鸭子
	 * treedata:果树信息
	 */
	public static getDuckByUserId() {
		let user = Datamanager.getnowfrienddata().friendUser;
		if (user) {
			SceneManager.sceneManager.newmain2Scene.duck_language_gro.removeChildren()
			this.ducklanguageTimer.reset();
			SceneManager.sceneManager.newmain2Scene.getduck_btn.visible = false;
			let params = {
				userId: user
			}
			MyRequest._post("game/getDuckByUserId", params, this, this.Req_getDuckByUserId.bind(this), null);
		}
	}

	private static Req_getDuckByUserId(data) {
		if (data) {
			Datamanager.savenowDuckdata(data.data);
			SceneManager.sceneManager.newmain2Scene.updateduck(data.data)
			console.log(data, "别人鸭子数据")
		}
	}

	/**
	 * 收取自己鸭蛋
	 */
	public static recevieDuckEgg() {
		MyRequest._post("game/recevieDuckEgg", null, this, this.Req_recevieDuckEgg.bind(this), null);
	}

	private static Req_recevieDuckEgg(data) {
		console.log(data, "收取鸭蛋数据")
		this.getOwnDuck();
		NewHelp.updateprop();
	}

	/**
	 * 偷别人鸭蛋
	 */
	public static stealDuckEgg() {
		let params = {
			duckUserId: Datamanager.getnowDuckdata().id
		}
		MyRequest._post("game/stealDuckEgg", params, this, this.Req_stealDuckEgg.bind(this), null);
	}

	private static Req_stealDuckEgg(data) {
		this.getDuckByUserId()
		this.updateprop();
		console.log(data, "偷别人鸭蛋数据")
	}


	/**
	 * 邀请好友
	 */
	public static Invite() {
		NewHelp.addmask();
		let invite = new Invitefriend();
		SceneManager.sceneManager._stage.addChild(invite);
	}


	/**
	 * 喂鸭子动画
	 */
	public static duckeatTwn(texture) {
		let icon = new eui.Image();
		icon.texture = RES.getRes(texture);
		icon.x = NewHelp.duck_moive.x - 120;
		icon.y = NewHelp.duck_moive.y - 120;
		icon.scaleX = 0.5;
		icon.scaleY = 0.5;
		SceneManager.sceneManager.newmain2Scene.addChild(icon);
		egret.Tween.get(icon)
			.to({ x: NewHelp.duck_moive.x + 100, y: NewHelp.duck_moive.y + 80, scaleY: 0.3, scaleX: 0.3 }, 1500)
			.call(() => {
				SceneManager.sceneManager.newmain2Scene.removeChild(icon);
				NewHelp.addduckmovie(DuckMoiveType.eat, Datamanager.getnowDuckdata().stageObj.stage, 10, () => { NewHelp.getOwnDuck() })
			}, this)
	}

	private static needDyn_red = true

	public static Dyn_loc_red(treeUserId) {
		if (this.needDyn_red) {
			console.log("动态红点")
			let params = {
				treeUserId: treeUserId,
				pageNo: 1,
				numPerPage: 1
			};
			MyRequest._post("game/searchDynamic", params, this, this.Req_Dyn_loc_red.bind(this), null)
		}
	}

	private static Req_Dyn_loc_red(data) {
		let dataID = data.data.list[0].id
		console.log("红点查询回调")
		let olddataID = localStorage.getItem("dyn_red")
		if (!dataID) {
			SceneManager.sceneManager.StageItems.dyn_red.visible = false;
		}
		else {
			if (olddataID) {
				if (olddataID == dataID) {
					SceneManager.sceneManager.StageItems.dyn_red.visible = false;
				}
				else {
					SceneManager.sceneManager.StageItems.dyn_red.visible = true;
				}
			}
			else if (!olddataID) {
				SceneManager.sceneManager.StageItems.dyn_red.visible = true;
			}
		}
		this.needDyn_red = false;
	}



	/**
	 * 帮助好友喂鸭子
	 * duckUserId 鸭子ID
	 * propUserId 用户道具id
	 */
	public static helpDuck(duckUserId, propUserId) {
		if (duckUserId) {
			let params = {
				duckUserId: duckUserId,
				propUserId: propUserId
			};
			MyRequest._post("game/helpDuck", params, this, this.Req_helpDuck.bind(this), null)
		}
	}


	private static Req_helpDuck(data) {
		console.log(data, "帮好友喂鸭数据");
	}

	/**
	 * 通过道具id获取用户道具id
	 * propId  道具id
	 */
	public static getpropUserIdbypropid(porpId) {
		var data = Datamanager.getPropdata();
		if (data) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].propId == porpId) {
					return data[i].id;
				}
			}
		}
	}


	/**
	 * 获取当前时间n天后
	 * AddDayCount  -1：昨天  1：明天
	 */
	public static getDateStr(AddDayCount) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;//获取当前月份的日期
		var d = dd.getDate();
		return y + '-' + (m < 10 ? '0' + m : m) + '-' + d;
	}




	/**
	 * 获取当前用户信息
	 */

	public static getNowUserInfo(userId) {
		this.getOwnavatar(userId);			//用户头像
	}

	/**
	 * 获取用户头像
	 * treedata   userId
	 */
	private static getOwnavatar(userId) {
		let params = {
			users: userId
		}
		MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, userId, SceneManager.sceneManager.StageItems.user_icon), null);
	}


	public static getselficon(userId) {
		let params = {
			users: userId
		}
		MyRequest._post("game/getWechatImg", params, this, this.Req_WechatImg.bind(this, userId, SceneManager.sceneManager.StageItems.own_icon), null);
	}



	//查询好友列表
	public static getFriends() {
		let params = {
			pageNo: 1,
			numPerPage: 10000
		};
		MyRequest._post("game/getFriends", params, this, this.Req_getFriends.bind(this), null);
	}


	public static Req_getFriends(data) {
		let friend_data = data.data.list
		let friend_user = [];
		for (let i = 0; i < friend_data.length; i++) {
			friend_user.push(friend_data[i].friendUser)
		}
		if (friend_user && friend_user.length > 0) {
			let params = {
				users: friend_user.join(",")
			};
			MyRequest._post("game/getWechatImg", params, this, this.Req_getWechatImg.bind(this, friend_data), null);
		}
	}


	private static Req_getWechatImg(friend_data, data) {
		if (!data) {
			return;
		}
		data = data.data;
		if (data && typeof data === "string") {
			data = JSON.parse(data)
		}
		Help.savefriendIcon(data);					//保存好友头像数据
		Datamanager.savefriendsdata(friend_data);	//保存总体好友数据
	}


	private static Rect = new eui.Rect;
	private static effectimg = new eui.Image;

	public static Specialeffects() {
		let newy = (SceneManager.sceneManager._stage.height - SceneManager.sceneManager.newmainScene.height)
		this.Rect.width = 329;
		this.Rect.height = 383;
		this.Rect.horizontalCenter = 0;
		this.Rect.bottom = 283;

		this.effectimg.texture = RES.getRes("effectsimg_png")
		this.effectimg.width = 329;
		this.effectimg.height = 383;
		this.effectimg.horizontalCenter = 0;
		this.effectimg.y = newy + 1051

		SceneManager.sceneManager._stage.addChild(this.Rect);
		this.effectimg.mask = this.Rect;
		SceneManager.sceneManager._stage.addChild(this.effectimg);

		egret.Tween.get(this.effectimg, { loop: true })
			.to({ y: newy + 400 }, 4000)
			.call(() => {
				if (this.Rect.parent) {
					this.Rect.parent.removeChild(this.Rect);
				}
				if (this.effectimg.parent) {
					this.effectimg.parent.removeChild(this.effectimg);
				}
			}, this)
	}


	public static removeEffect() {
		if (this.Rect.parent) {
			this.Rect.parent.removeChild(this.Rect);
		}
		if (this.effectimg.parent) {
			this.effectimg.parent.removeChild(this.effectimg);
		}
	}




	//--------------------------------------------------------------------任务/活动-------------------------------------------------------------------------//





	/**
	 * 去完成任务
	 */
	public static completetask(code, id?) {
		switch (code) {
			case 'browse_goods': {
				let propid = this.getpropIdbytaskcode(code)
				if (SceneManager.instance.isMiniprogram) {
					wx.miniProgram.navigateTo({
						url: "/pages/game/browseGoods?listType=1&isFinished=false&propId=" + propid
					})
				} else {
					sessionStorage.setItem("fromgame", "true");
					location.href = Config.webHome + "view/game-browse-goods.html?listType=1&isFinished=false&propId=" + propid
				}
			}
				break;
			case 'Invitation_friend': {
				SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
				this.tojump(true, "sharetexttree_png");

				if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
					let url = SceneManager.instance.weixinUtil.shareData.shareUrl
					let addFriend = MyRequest.geturlstr("addFriend", url)
					if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
						SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
						SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
					} else {
						SceneManager.instance.weixinUtil.shareData.titles = "【果说说农场】邀请你一起种水果，亲手种，免费送到家"
						SceneManager.instance.weixinUtil.shareData.describes = "种上一棵树，经营一座农场，开启舌尖上的旅行--果说说"
					}
					SceneManager.instance.weixinUtil._openShare();
				} else {
					let info
					if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
						info = "【果实熟了】快来、快来帮我摘水果。"
					} else {
						info = "【说说农场】一起种水果，亲手种，免费送到家。"
					}
					let data = {
						addFriend: true,
						title: info
					}
					SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
				}
			}
				break;
			case 'share_orchard': {
				SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
				this.tojump(true, "share_png")
			}
				break;
			case 'any_order': {
				let propid = this.getpropIdbytaskcode(code)
				if (SceneManager.instance.isMiniprogram) {
					//小程序端口taskCode要做参数发送
					wx.miniProgram.navigateTo({
						url: "/pages/game/browseGoods?listType=2&backGame=true&taskCode=" + id + "&propId=" + propid
					})
				} else {
					sessionStorage.setItem("fromgame", "true");
					sessionStorage.setItem("taskCode", id);
					location.href = Config.webHome + "view/game-browse-goods.html?listType=2&propId=" + propid
				}
			}
				break;
			case 'specifiy_order': {
				let propid = this.getpropIdbytaskcode(code)
				if (SceneManager.instance.isMiniprogram) {
					//小程序端口taskCode要做参数发送
					wx.miniProgram.navigateTo({
						url: "/pages/game/browseGoods?listType=0&backGame=true&taskCode=" + id + "&propId=" + propid
					})
				} else {
					sessionStorage.setItem("fromgame", "true");
					sessionStorage.setItem("taskCode", id);
					location.href = Config.webHome + "view/game-browse-goods.html?listType=0&propId=" + propid
				}
			}
				break;
			case 'read_knowledge': {
				let baikeScene = new BaikeScene();
				SceneManager.sceneManager._stage.addChild(baikeScene)
			}
				break
			case 'take_goods': {	//每日摘果
				NewHelp.closescene();
			}
				break
			case 'help_take': {		//帮摘果
				NewHelp.closescene();
			}
				break
			case 'get_tree_prop': {	//除虫除草
				NewHelp.closescene();
			}
				break
			case 'praise': {		//点赞好友
				NewHelp.closescene();
			}
				break
			case 'time_slot_login': {		//点赞好友
				SceneManager.addNotice("还没到时间，不要着急哦")
			}
				break
			case 'first_water': {		//点赞好友
				NewHelp.closescene();
			}
				break
			case 'add_friend': {		//添加好友
				SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVED_FROM_STAGE)   //使用manager获取场景并触发事件
				this.tojump(true, "sharetexttree_png");

				if (!SceneManager.instance.isMiniprogram) {//不是小程序的处理方式
					let url = SceneManager.instance.weixinUtil.shareData.shareUrl
					let addFriend = MyRequest.geturlstr("addFriend", url)
					if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
						SceneManager.instance.weixinUtil.shareData.titles = "【果实熟了】快来、快来帮我摘水果。"
						SceneManager.instance.weixinUtil.shareData.describes = "离免费收获一箱水果，只差最后一步啦！"
					} else {
						SceneManager.instance.weixinUtil.shareData.titles = "【果说说农场】邀请你一起种水果，亲手种，免费送到家"
						SceneManager.instance.weixinUtil.shareData.describes = "种上一棵树，经营一座农场，开启舌尖上的旅行--果说说"
					}
					SceneManager.instance.weixinUtil._openShare();
				} else {
					let info
					if (Help.getOwnData() && Number(Help.getOwnData().friendCanObtain) > 0) {
						info = "【果实熟了】快来、快来帮我摘水果。"
					} else {
						info = "【说说农场】一起种水果，亲手种，免费送到家。"
					}
					let data = {
						addFriend: true,
						title: info
					}
					SceneManager.instance.weixinUtil.toPostMessageShare(0, data)
				}
			}
				break
		}
	}

	private static getpropIdbytaskcode(taskCode) {
		let taskdata = Datamanager.gettaskdata();
		for (let i = 0; i < taskdata.length; i++) {
			if (taskCode == taskdata[i].code && taskdata[i].rewardRule) {
				if (taskdata[i].rewardRule.propId) {
					return taskdata[i].rewardRule.propId
				}
				else if (taskdata[i].rewardRule.propType) {
					return -1
				}
			}
		}
	}


	//跳转场景
	private static tojump(needCloseTask: boolean, image: string) {
		if (needCloseTask) {
			SceneManager.instance.getTaskScene().dispatchEventWith(MaskEvent.REMOVEMASK)
		}
		SceneManager.addJump(image);
	}

	//------------------------------------------------------------------------------偷果-------------------------------------------------------------//

	/**
	 * 检查是否可以偷果
	 * treedata 数据
	 */
	public static CheckStealGood() {
		if (Datamanager.getNowtreedata()) {							//有数据时检查
			let params = {
				isCheck: true,
				treeUserId: Datamanager.getNowtreedata().id
			}
			MyRequest._post("game/stealGoods", params, this, this.Req_CheckStealGood.bind(this), null);
		}
		else {
			SceneManager.sceneManager.StageItems.gro_pick.visible = false;
		}
	}

	public static isSteal						//是否是偷果

	private static Req_CheckStealGood(data) {
		if (data.data.flag == "true") {
			SceneManager.sceneManager.StageItems.gro_pick.visible = true;
			if (SceneManager.instance.landId == 1) {
				SceneManager.sceneManager.StageItems.gro_pick.y = 624;
			}
			else if (SceneManager.instance.landId == 2) {
				SceneManager.sceneManager.StageItems.gro_pick.y = 734;
			}
			SceneManager.sceneManager.StageItems.pick_label.text = "可偷果";
			egret.Tween.get(SceneManager.sceneManager.StageItems.pick_hand, { loop: true })
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y - 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y + 20 }, 500)
				.to({ y: SceneManager.sceneManager.StageItems.pick_hand.y }, 500)
			this.isSteal = true;
		}
		else {
			this.checkHelpTakeFruit(Datamanager.getNowtreedata())
		}
		console.log(data, "检查偷果数据");
	}


	public static StealGood() {
		if (Datamanager.getNowtreedata()) {
			let params = {
				isCheck: false,
				treeUserId: Datamanager.getNowtreedata().id
			}
			MyRequest._post("game/stealGoods", params, this, this.Req_StealGood.bind(this), null);
		}
	}

	private static Req_StealGood(data) {
		console.log(data, "偷果数据")
		SceneManager.addNotice("偷到" + data.data.getNum + "个果子")
		this.CheckStealGood();
	}

	//---------------------------------------------------------------鸭子动画------------------------------------------------------------------------//

	public static duck_Factory: egret.MovieClipDataFactory;		//鸭子动画工厂
	public static duck_moive: egret.MovieClip;					 	//鸭子动画


	public static getduckmovieFactory(type: DuckMoiveType) {
		let data: any;
		let txtr: egret.Texture;
		if (type == DuckMoiveType.sleep) {
			data = RES.getRes("ducksleep_json");
			txtr = RES.getRes("ducksleep_png");
		}
		else if (type == DuckMoiveType.hunger) {
			data = RES.getRes("duckhunger_json");
			txtr = RES.getRes("duckhunger_png");
		}
		else if (type == DuckMoiveType.eat) {
			data = RES.getRes("duckeat_json");
			txtr = RES.getRes("duckeat_png");
		}
		else if (type == DuckMoiveType.normal) {
			data = RES.getRes("ducknormal_json");
			txtr = RES.getRes("ducknormal_png");
		}
		else if (type == DuckMoiveType.layingegg) {
			data = RES.getRes("ducklayingegg_json");
			txtr = RES.getRes("ducklayingegg_png");
		}
		this.duck_Factory = new egret.MovieClipDataFactory(data, txtr);
	}

	/**
	 * 添加鸭子睡觉动画
	 * type 鸭子动画类型
	 * duckType 鸭子类型
	 * times 播放次数 	 <0 : 循环播放  
	 * completecallback 播放不循环时添加回调
	 */
	public static addduckmovie(type: DuckMoiveType, duckType: DuckType, times: number, completecallback?: Function) {
		this.removeAllDuckMovie();
		this.getduckmovieFactory(type);
		if (duckType == DuckType.small) {
			this.duck_moive = new egret.MovieClip(this.duck_Factory.generateMovieClipData("smallduck"));
			switch (type) {
				case DuckMoiveType.sleep: {									//睡觉
					this.duck_moive.x = -40;
					this.duck_moive.y = 700;
				}
					break;
				case DuckMoiveType.eat: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.hunger: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.normal: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.layingegg: {
					this.duck_moive.x = -10;
					this.duck_moive.y = 680;
				}
					break;
			}
		}
		else if (duckType == DuckType.mid) {
			this.duck_moive = new egret.MovieClip(this.duck_Factory.generateMovieClipData("midduck"));
			switch (type) {
				case DuckMoiveType.sleep: {
					this.duck_moive.x = 0;
					this.duck_moive.y = 680;
				}
					break;
				case DuckMoiveType.eat: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.hunger: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.normal: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.layingegg: {
					this.duck_moive.x = -10;
					this.duck_moive.y = 680;
				}
					break;
			}
		}
		else if (duckType == DuckType.big) {
			this.duck_moive = new egret.MovieClip(this.duck_Factory.generateMovieClipData("bigduck"));
			switch (type) {
				case DuckMoiveType.sleep: {
					this.duck_moive.x = -10;
					this.duck_moive.y = 680;
				}
					break;
				case DuckMoiveType.eat: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.hunger: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.normal: {
					this.duck_moive.x = 230;
					this.duck_moive.y = 430;
				}
					break;
				case DuckMoiveType.layingegg: {
					this.duck_moive.x = -10;
					this.duck_moive.y = 680;
				}
					break;
			}
		}
		SceneManager.sceneManager.newmain2Scene.addChild(this.duck_moive);
		this.duck_moive.play(times);
		if (times > 0 && completecallback) {
			this.duck_moive.once(egret.Event.COMPLETE, function () {
				egret.log("COMPLETE");
				completecallback();
			}, this);
		}
		let duckdata = Datamanager.getnowDuckdata();
		this.duck_moive.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
			SceneManager.toduckdetailScene(duckdata)
		}, this)
		this.duck_moive.touchEnabled = true;
	}


	/**
	 * 移除所有鸭子状态动画
	 */
	public static removeAllDuckMovie() {
		if (this.duck_moive && this.duck_moive.parent) {
			this.duck_moive.parent.removeChild(this.duck_moive);
		}
	}


	public static changeduckXY(x: number, y: number) {
		this.duck_moive.x = x;
		this.duck_moive.y = y;
	}


	/**
	 * 检查鸭子当前状态
	 * duckdata: 鸭子数据
	 */
	public static checkDuckNowStatus(duckdata) {
		if (duckdata) {										//是否有鸭子数据
			if (!duckdata.needTake) {							//鸭子无蛋
				if (!duckdata.hungerTime) {						//鸭子状态 饥饿				
					NewHelp.addduckmovie(DuckMoiveType.hunger, duckdata.stageObj.stage, -1)
					NewHelp.startducklanguage();
				}
				else {
					let nowtime = new Date().getTime();
					let hungerTime = new Date(duckdata.hungerTime).getTime();
					if (nowtime > hungerTime) {					//鸭子状态 饥饿
						NewHelp.addduckmovie(DuckMoiveType.hunger, duckdata.stageObj.stage, -1)
						NewHelp.startducklanguage();
					}
					else {										//鸭子状态 非饥饿
						let now = new Date();
						let hour = now.getHours();
						if (hour > 19 || hour < 7) {										//睡觉状态
							NewHelp.addduckmovie(DuckMoiveType.sleep, duckdata.stageObj.stage, -1)
							NewHelp.stopducklanguage();
						} else if (hour < 20 || hour > 5) {									//正常状态
							NewHelp.addduckmovie(DuckMoiveType.normal, duckdata.stageObj.stage, -1)
							NewHelp.startducklanguage();
						}
					}
				}
			}
			else {											//鸭子有蛋
				let now = new Date();
				let hour = now.getHours();
				if (hour > 19 || hour < 7) {										//睡觉状态
					NewHelp.addduckmovie(DuckMoiveType.sleep, duckdata.stageObj.stage, -1)
					NewHelp.stopducklanguage();
					if (duckdata.needTake) {
						NewHelp.changeduckXY(40, 630);
					}
				} else if (hour < 20 || hour > 5) {									//正常状态
					NewHelp.startducklanguage();
					NewHelp.addduckmovie(DuckMoiveType.normal, duckdata.stageObj.stage, -1)
				}
			}
		}
	}


	public static toduckdetail(duckdata) {
		if (SceneManager.sceneManager.StageItems.currentState == "havetree") {
			SceneManager.toduckdetailScene(duckdata);
		}
	}


	//-----------------------------------------------------------------------------礼包----------------------------------------------------------------------------//

	private static nowDate  					//当前时间

	public static getnowDate() {
		MyRequest._post("fruit/getNowDateTime", null, this, this.Req_getNowDateTime.bind(this), null)		//获取服务器当前时间
	}


	public static Req_getNowDateTime(data) {
		this.nowDate = data.data;
		MyRequest._post("game/getSysReward", null, this, this.Req_getSysReward.bind(this), null)		//获取当前是否有礼包抽奖规则		
	}

	//点击礼包事件
	private static presenttouch() {
		if (SceneManager.sceneManager.StageItems.currentState == "friendtree") {
			return;
		}
		if (Datamanager.getNowtreedata()) {
			let params = {
				treeUserId: Datamanager.getNowtreedata().id
			}
			MyRequest._post("game/receiveSysReward", params, this, this.Req_receiveSysReward.bind(this), (() => {
				this.image.once(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this)
			}))
			console.log("点击礼包")
		}
	}


	private static startpresentTwn() {
		if (!localStorage.getItem("present") || localStorage.getItem("present") == "true") {
			this.addluckybag();
			this.luckybagTween1();
		}
	}

	private static stoppresentTwn() {
		if (!localStorage.getItem("present") || localStorage.getItem("present") == "true") {
			this.removeluckybag();
		}
	}

	/**
	 * 获取礼包规则回调
	 */
	private static Req_getSysReward(data) {
		console.log("礼包抽奖规则:", data);
		let starttime			//活动开始时间
		let endtime				//活动结束时间
		let that = this
		for (let i = 0; i < data.data.length; i++) {
			if (data.data[i].isOpened == "true") {
				that.stoppresentTwn();
			}
			else {
				starttime = data.data[i].startTime.replace(new RegExp(/-/gm), "/")
				starttime = Date.parse(starttime)
				endtime = data.data[i].endTime.replace(new RegExp(/-/gm), "/")
				endtime = Date.parse(endtime)
				if (starttime > this.nowDate) {
					console.log("活动时间之前")
					setTimeout(function () {
						console.log("礼包点击动画和事件开始");
						localStorage.setItem("present", "true");
						that.startpresentTwn();
					}, Number(starttime) - Number(this.nowDate));
				}
				if (endtime > this.nowDate) {
					console.log("活动时间之间")
					setTimeout(function () {
						console.log("礼包点击动画和事件结束")
						that.stoppresentTwn();
						localStorage.setItem("present", "false");
					}, Number(endtime) - Number(this.nowDate));
				}
				if (starttime < this.nowDate && endtime > this.nowDate) {
					this.startpresentTwn();
					localStorage.setItem("present", "true");
					console.log("在活动时间内")
				}
				if (endtime < this.nowDate) {
					console.log("在活动时间之后")
				}
			}
		}
	}


	private static Req_receiveSysReward(data) {
		console.log("领取礼包数据:", data);
		this.image.once(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this);
		let info: string;				//文字
		let imgname: string;		    //图片名称
		let orderId: any;				//礼包id
		let info2: string;				//文字2
		if (data.data) {
			let rewaredata = data.data[0];
			if (rewaredata.status == "0") {
				if (rewaredata.giftType == "0") {
					console.log("领取礼包")
					orderId = rewaredata.orderId;
					info = "恭喜您获得礼包！"
					info2 = rewaredata.fruitInfo + "一件";
				}
				else {
					info = "恭喜您获得礼包！"
					info2 = "恭喜您获得" + rewaredata.reward.propName + "x" + rewaredata.reward.propNum;
				}
			}
			else if (rewaredata.status == "1") {
				info = "很遗憾,您没中奖哦~";
				imgname = "presentimgsor_png"
			}
			else if (rewaredata.status == "2") {
				info = "您已经领过了哦~";
				imgname = "presentimgobtained_png"
				this.stoppresentTwn();
				localStorage.setItem("present", "false")
			}
			else if (rewaredata.status == "-1") {
				info = "已抢光~";
				imgname = "presentimgnomore_png"
				this.stoppresentTwn();
				localStorage.setItem("present", "false")
			}
			else if (rewaredata.status == "-2") {
				info = "领礼包次数已达上限~";
				imgname = "presentimgfull_png"
				this.stoppresentTwn();
				localStorage.setItem("present", "false")
			}
			MyRequest._post("fruit/getNowDateTime", null, this, this.Req_getNowDateTime.bind(this), null)		//获取服务器当前时间
		}
		let share = new Sharepresent(info, imgname, orderId, info2);
		SceneManager.sceneManager._stage.addChild(share);
	}



	private static image = new eui.Image();

	public static addluckybag() {
		this.image.texture = RES.getRes("luckybag_png")
		SceneManager.sceneManager.StageItems.addChild(this.image);
		this.image.anchorOffsetX = (this.image.width) / 2;
		this.image.anchorOffsetY = this.image.height;
	}

	public static removeluckybag() {
		if (this.image && this.image.parent) {
			this.image.parent.removeChild(this.image);
		}
	}

	public static luckybagTween1() {
		if (this.image && this.image.parent) {
			let y = this.image.height + ((1254 - this.image.height) / 2) - 100;
			let x = -(this.image.height / 2);
			this.image.y = y;
			this.image.x = x;
			egret.Tween.get(this.image)
				.set({ y: y, x: x })
				.to({ y: y + 100, x: x + 200 }, 600)
				.to({ y: y, x: x + 400 }, 600)
				.to({ y: y + 100, x: x + 600 }, 600)
				.to({ y: y + 50, x: x + 700 }, 300).call(this.luckybagTween2, this)
		}
	}


	public static luckybagTween2() {
		if (this.image && this.image.parent) {
			this.image.once(egret.TouchEvent.TOUCH_TAP, this.presenttouch, this)
			egret.Tween.get(this.image, { loop: true })
				.to({ scaleY: 0.9 }, 500)
				.to({ scaleY: 1 }, 500)
		}
	}

}


//鸭子动画类型
enum DuckMoiveType {
	sleep = 1,
	eat,
	hunger,
	normal,
	layingegg,
}

//鸭子类型
enum DuckType {
	small = 1,
	mid,
	big,
}


enum propId {
	shuidi = 1,
	love,
	lanzi,
	youjifei,
	fuhefei,
	shuirongfei,
	jiandao,
	duckfood,
	insect,
	grass,
	dianzan,
	duckegg,
}