/**
 * 果树对象
 */

declare class TreeData {
    id: string;
    name: any;                       //果树名称
    icon: any;                       //用户列表上显示的果树图标
    basketNum: any;                  //兑换所需篮子数量
    basketCapacity: any;             //篮子容量
    exchangeSpec: any;               //可兑换的规格id
    priceMin: any;                   //兑换的最低价
    priceMax: any;                   //兑换的最高价
    specName: any;                   //兑换的规格名称
    specIcon: any;                   //兑换规格图标
    fruitName: any;                  //规格对应水果名称
    fruitIcon: any;                  //规格对应水果图标
    stageList: any;                  //阶段对象列表
}
/**
 * 用户果树对象
 */

declare class TreeUserData {
    id: string;
    treeName: any;                   //果树名称
    treeId: any;                     //果树id
    createDate: any;                 //创建时间
    user: any;                       //领取用户id
    growthValue: any;                //当前阶段成长值
    stage: any;                //当前阶段值
    stageObj: TreeStage;                   //阶段对象
    isReceive: any;              //是否兑换
    receiveTime: any;                //兑换时间
    receiveOrderId: any;             //兑换关联订单id
    useFertilizer: any;          //阶段是否使用过合适的化肥（结果期使用）
    needTake: any;               //是否需要摘果（结果期使用）
    canReceive: any;             //是否可以兑换
    obtailFruitNum: any;             //获取总数量
    friendCanObtain: any;            //朋友可收获数量
    userName: any;                   //用户名称
}

/**
 * 阶段对象
 */

declare class TreeStage {
    id: string;
    treeId: any;                     //树id
    stage: any;                      //阶段id
    name: any;                       //阶段名称
    energy: any;                     //下个阶段所需成长值/收果所需
    canHarvest: boolean;             //是否是成果期
    fitFeritilizer: any;             //合适的肥料
    fitFeritilizerName: any;         //合适肥料的名称
    normalGet: any;                  //正常得果数
    fitGet: any;                     //施肥得果数
    isLast: any;                     //是否是最后阶段
    stageImage:string                //阶段图片
    harvestImage:string              //阶段结果图片
}

/**
 * 用户道具对象
 */
declare class PropUser {
    id: any;
    user: any;                       //获得道具的用户id
    propId: any;                     //道具id
    propType: any;                   //道具类型（0水滴1道具2爱心值3化肥）
    propName: any;                   //道具名称(有多种化肥，其他都是一个名字)
    num: any;                        //持有数量（爱心值需要100个才能使用，水滴浇水需要10个）有可能为0也是没有该道具
}

/**
 * 消息动态对象
 */

declare class Dynamic {
    id: any;
    mainUser: any;                   //动作用户
    mainUserName: any;               //动作用户名
    mainUserIcon: any;               //动作用户头像
    effectUser: any;                 //被动用户
    effectUserName: any;             //被动用户名
    effectUserIcon: any;             //被动用户头像
    type: any;                       //类型（0成长动态1领取果树2拜访3偷水4浇水5留言6签到7系统赠送10放草11放虫20除草21除虫100兑换水果）
    propType: any;                   //道具类型（-1无0水滴1道具2爱心值3化肥）当为1篮子时value为获得果子数量
    value: any;                      //获得的数量，如果是负数则是损失的数量
    userTreeId: any;                 //用户果树id
    treeName: any;                   //果树名称（当type为0显示成长动态时有）
    treeStage: any;                  //果树阶段（当type为0显示成长动态时有）
    createDate: any;                 //创建时间
    showDate:boolean                 //是否显示时间
}

/**
 * 签到对象
 */
declare class Signin {
    id: any;
    user: any;
    continueDay: any;                //持续签到天数（超过7天第8天算持续1天，循环）如果lastSignDay比昨天还早则表示签到中断，此时持续签到0天
    lastSignDay: any;                //最后签到日期
}

/**
 * 朋友对象
 */

declare class Friend {
    id: any;
    mainUser: any;                   //自己的id
    friendUser: any;                 //朋友id
    friendUserName: any;             //朋友昵称
    friendUserIcon: any;             //朋友头像
    friendTreeIcon: any;             //朋友种树的图标
    createDate: any;                 //创建时间
}


/**
 * 任务对象
 */
declare class Task {
    id: any;
    name: any;                       //任务名称
    icon: any;                       //任务图标
    info: any;                       //描述信息
    code: any;                       //任务代码【Invitation_friend(邀请朋友),share_orchard(分享果园),share_goods(分享商品),browse_goods(浏览商品),any_order（任意下单），specifiy_order(指定下单)】
    deleteFlag: boolean;             //是否禁用
    limitTime: any;                  //限制次数
    rewardRuleId: any;               //奖励规则对象id
    rewardRule: RewardRule;          //奖励规则对象
    finishCount: number;             //计算出来的当日完成次数
    needReceive: boolean;            //是否可以领取
    finishedId: string;               //当可以领取时，领取的任务code
    btnStatus:number;                //按钮状态（0未完成1未领取2已经完成达到限制次数）
}

/**
 * 任务完成对象
 */

declare class TaskFinished {
    id: string;
    user: string;                       //用户id
    createDate: any;                 //任务完成时间
    beenReceive: string;            //是否被领取
    taskCode: any;                     //任务id
}

/**
 * 奖励规则对象
 */

declare class RewardRule {
    id: any;
    name: any;                       //规则名称
    isRange: boolean;                //是否有范围（true则max、min有效）
    max: any;                        //范围最大值
    min: any;                        //范围最小值
    num: any;                        //不使用范围的数量
    useType: boolean;                //使用道具类型（true则使用道具类型并且随机获取如3_随机一种化肥）
    propId: any;                     //道具id
    propType: any;                   //道具类型id
}


/**
 * 果园道具对象
 */

declare class TreeProp {
    id: any;
    treeUserId: any;                 //用户果树id
    pushUser: any;                   //放置用户id（防止自己除去）
    pushUserName: any;               //放置用户名
    propType: any;                   //道具类型（0虫1草）
    createDate: any;                 //放置时间
}

/**
 * 系统消息对象   用于首页顶部轮播重要消息
 */

declare class SystemInfo {
    id: any;
    title: any;
    detail: any;
    icon: any;
    createDate: any;
}

/**
 * 树语对象   果树说话/指引文字对象
 */

declare class TreeLanguage {
    id: any;
    msg: any;                        //消息
    isStage: boolean;                //是否需要指定阶段显示
    stage: any;                      //阶段值
}

/**
 * 留言模板对象
 */

declare class LeaveMsgTemplate {
    id: any;
    msg: any;                       //留言
    icon: any;                       //图标
}

/**
 * 用户留言对象
 */

declare class LeaveMsgUser {
    id: any;
    mainUser: any;                   //留言用户id
    mainUserName: any;               //留言用户昵称
    mainUserIcon: any;               //留言用户头像
    treeUserId: any;                 //用户果树id
    templateId: any;                 //模板id
    createDate: any;                 //留言时间
}