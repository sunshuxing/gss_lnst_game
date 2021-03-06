class Datamanager {
    private static Nowtreedata               //当前果树数据(不分土地只是当前果树数据)
    private static Ownguoyuandata            //自己果园数据(landid=1)
    private static Owncaiyuandata            //自己菜园数据(landid=2)
    private static treelanguagedata          //树语数据
    private static friendsdata               //总体好友数据
    private static Nowfrienddata             //当前好友数据
    private static Propdata                  //自己道具数据
    private static Answerrewarddata          //答题奖励数据
    private static nowDuckdata               //当前鸭子数据
    private static OwnDuckdata               //自己鸭子数据
    private static ducklanguagedata          //鸭语数据
    private static taskdata                  //任务数据
    private static finishedtaskdata          //已完成任务数据
    private static taskreceivedata          //


    /**
     * 保存当前鸭语数据
     */
    public static saveducklanguagedata(data) {
        this.ducklanguagedata = data;
    }

    /**
     * 获取当前鸭语数据
     */
    public static getducklanguagedata() {
        return this.ducklanguagedata;
    }

    /**
     * 保存自己鸭子数据
     */
    public static saveOwnDuckdata(data) {
        this.OwnDuckdata = data;
    }
    /**
     * 获取自己鸭子数据
     */
    public static getOwnDuckdata() {
        return this.OwnDuckdata;
    }

    /**
     * 保存当前鸭子数据
     */
    public static savenowDuckdata(data) {
        this.nowDuckdata = data;
    }

    /**
     * 获取当前鸭子数据
     */
    public static getnowDuckdata() {
        return this.nowDuckdata;
    }

    /**
     * 保存答题奖励数据
     */
    public static saveAnswerrewarddata(data) {
        this.Answerrewarddata = data;
    }

    /**
     * 获取答题奖励数据
     */
    public static getAnswerrewarddata() {
        return this.Answerrewarddata;
    }

    /**
     * 保存道具数据
     */
    public static savePropdata(data) {
        this.Propdata = data;
        this.getWarehousePropdata()
    }

    /**
     * 获取道具数据
     */

    public static getPropdata() {
        return this.Propdata;
    }

    /**
     * 获取仓库所需显示道具数据
     */
    public static getWarehousePropdata() {
        let propdata = []
        let warepropallnum = 0
        if (this.Propdata) {
            for (let i = 0; i < this.Propdata.length; i++) {
                if (this.Propdata[i].propType != 4 &&                   //点赞
                    this.Propdata[i].propId != 1 &&                     //水滴
                    this.Propdata[i].propId != 2) {                     //爱心值
                    propdata.push(this.Propdata[i])
                }
            }
        }
        for (let i = 0; i < propdata.length; i++) {
            let old = localStorage.getItem("prop" + (propdata[i].propId));
            if ((!old || propdata[i].num > old) && propdata[i].num != 0) {
                SceneManager.sceneManager.StageItems.huafei_red.visible = true;
                break;
            }
            else {
                SceneManager.sceneManager.StageItems.huafei_red.visible = false;
            }

        }
        return propdata
    }

    /**
     * 由道具id获取道具数据
     */
    public static getsinglePropdata(id) {
        if (this.Propdata) {
            for (let i = 0; i < this.Propdata.length; i++) {
                if (this.Propdata[i].propId == id) {
                    return this.Propdata[i];
                }
            }
        }
    }

    /**
     * 由道具id获取道具数量
     * id :道具id
     */
    public static getPropNumByid(id) {
        for (let i = 0; i < this.Propdata.length; i++) {
            if (this.Propdata[i].propId == id) {
                return this.Propdata[i].num;
            }
        }

    }

    /**
     * 保存当前果树数据
     */
    public static saveNowtreedata(data) {
        this.Nowtreedata = data;
    }

    /**
     * 获取当前果树数据
     */
    public static getNowtreedata() {
        console.log(this.Nowtreedata, "当前果树数据")
        return this.Nowtreedata;
    }


    /**
     * 保存自己果园数据
     */
    public static saveOwnguoyuandata(data) {
        this.Ownguoyuandata = data;
    }

    /**
     * 获取自己果园数据
     */
    public static getOwnguoyuandata() {
        return this.Ownguoyuandata;
    }

    /**
     * 保存自己菜园数据
     */
    public static saveOwncaiyuandata(data) {
        this.Owncaiyuandata = data;
    }

    /**
     * 获取自己菜园数据
     */
    public static getOwncaiyuandata() {
        return this.Owncaiyuandata;
    }

    /**
     * 保存树语数据
     */
    public static savetreelanguagedata(data) {
        this.treelanguagedata = data;
    }

    /**
     * 获取树语数据
     */
    public static gettreelanguagedata() {
        return this.treelanguagedata;
    }


    /**
     * 保存任务数据
     */
    public static savetaskdata(data) {
        this.taskdata = data
    }

    /**
     * 获取任务数据
     */
    public static gettaskdata() {
        return this.taskdata;
    }


    /**
     * 根据显示类型获取任务数据
     */
    public static gettaskdataBytype(type) {
        if (this.taskdata) {
            let newtask = [];
            for (let i = 0; i < this.taskdata.length; i++) {
                if (type == this.taskdata[i].showType || this.taskdata[i].showType == 2) {
                    newtask.push(this.taskdata[i])
                }
            }
            return newtask;
        }
    }

    /**
     * 获取特殊活动任务数据
     */

    public static getspeactdata() {
        if (this.taskdata) {
            let newdata = [];
            for (let i = 0; i < this.taskdata.length; i++) {
                if (this.taskdata[i].showType == 3) {
                    newdata.push(this.taskdata[i])
                }
            }
            return newdata;
        }
    }


    /**
     * 保存可领取任务数据
     */

    public static savetaskreceivedata(data) {
        this.taskreceivedata = data;
    }

    /**
     * 获取可领取任务数据
     */
    public static gettaskreceivedata() {
        return this.taskreceivedata;
    }
    /**
     * 获取阅读任务数据 
     */
    public static getlooktask() {
        if (this.taskdata) {
            for (let i = 0; i < this.taskdata.length; i++) {
                if (this.taskdata[i].code == "read_knowledge") {
                    return this.taskdata[i];
                }
            }
        }
    }


    /**
     * 保存总体好友数据
     */
    public static savefriendsdata(data) {
        this.friendsdata = data;
    }

    /**
     * 获取总体好友数据
     */
    public static getfriendsdata() {
        return this.friendsdata;
    }

    /**
     * 保存当前好友数据
     */
    public static savenowfrienddata(data) {
        console.log(data, "当前好友数据")
        this.Nowfrienddata = data;
    }

    /**
     * 获取当前好友数据
     */
    public static getnowfrienddata() {
        return this.Nowfrienddata;
    }

    /**
     * 通过用户id获取朋友数据
     */
    public static getfrienddataByuser(user) {
        if (this.friendsdata) {
            for (let i = 0; i < this.friendsdata.length; i++) {
                if (this.friendsdata[i].friendUser == user) {
                    return this.friendsdata[i];
                }
            }
        }
    }


    /**
     *  通过用户名称获取朋友果树id
     */
    public static getfriendtreeUseridByUser(User) {
        if (this.friendsdata) {
            for (let i = 0; i < this.friendsdata.length; i++) {
                if (this.friendsdata[i].friendUser == User) {
                    if (SceneManager.instance.landId == 1) {              //果园
                        for (let n = 0; n < this.friendsdata[i].trees.length; n++) {
                            if (this.friendsdata[i].trees[n]) {
                                if (this.friendsdata[i].trees[n].landId == 1) {
                                    return this.friendsdata[i].trees[n].id;
                                }
                            }
                            else {
                                return null
                            }
                        }
                    }
                    else if (SceneManager.instance.landId == 2) {         //菜园
                        for (let n = 0; n < this.friendsdata[i].trees.length; n++) {
                            if (this.friendsdata[i].trees[n]) {
                                if (this.friendsdata[i].trees[n].landId == 2) {
                                    return this.friendsdata[i].trees[n].id;
                                }
                            }
                            else {
                                return null
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 通过果树id获取朋友数据
     */
    public static getfriendByid(treedata) {
        let treeid = treedata.id
        if (this.friendsdata) {
            for (let i = 0; i < this.friendsdata.length; i++) {
                for (let n = 0; n < this.friendsdata[i].trees.length; n++) {
                    if (this.friendsdata[i].trees[n].id == treeid) {
                        return this.friendsdata[i];
                    }
                }
            }
        }
    }
}