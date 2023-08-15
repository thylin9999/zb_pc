const url = {
    // getHosts: '/api/get-hosts',
    startLive: '/api/live/startLive',
    getHostIsOnline: '/api/live/live', // 主播是否开播的信息
    // 下播
    closeLive: '/api/live/close',
    getHostList: '/api/anchor/all', // 主播列表
    getOBSAddress: '/api/live/getOBS',
    getHostRank: '/api/anchor/ranking',
    getSubscribeHost: '/api/get-subscribe-host',
    // 正式接口
    // 关注的主播列表
    getFlowedHosts: '/api/follow/lists',
    // 新的关注主播列表
    getSubscribeHosts: '/api/follow/myLists',

    followHost: '/api/follow/add',
    // 主播角度 的推荐直播
    getHotHostRoom: '/api/anchor/hot',
    // 预约直播
    bookBroadcast: '/api/preordain/lists',
    bookMatches: '/api/preordain/add', // 预约比赛

    // 预约列表，一键开播
    bookOpenBroadcast: '/api/live/startPreordain',
    broadcastHistory: '/api/live/liveHistory',

    getBookedMatches: '/api/preordain/lists', // 未开始的直播
    // 取消预约
    cancelSubscribe: '/api/preordain/cancel',
    getOfflineHost: '/api/anchor/lists', // 未开播的主播

    // 主播赛程
    getAnchorMatches: '/api/anchor/AnchorMatch',

    // 直播间禁言
    muteLiveRoom: '/api/live/mute',
    checkMute: '/api/muteRoom/check',

    // 主播搜索
    searchAnchor: '/api/anchor/search',
    // 直播搜索
    searchBroadcast: '/api/live/search',

    // 直播间
    getGiftRanking: '/api/gift/ranking',
    // 礼物列表
    getGiftList: '/api/gift/lists',
    giveGift: '/api/gift/giveGift',

    // 宝箱
    getBoxList: '/api/box/list',
    openBox: '/api/box/openBox',
    drawBox: '/api/box/drawBox'
}
export default url
