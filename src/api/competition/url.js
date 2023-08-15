const url = {
    getCompetitions: '/api/get-competition',
    getOnlineBroadcast: '/api/live/roomLists',
    // 热门直播
    getHotRooms: '/api/live/hotRoom',
    liveRoom: '/api/live/live', // 直播间

    getBookedMatches: '/api/get-matches',
    getMatchList: '/api/scheduleMatch/lists', // 赛程
    getHostMatches: '/api/scheduleMatch/hotMatch',
    getVideoCompetitions: '/api/get-video-competitions',
    addSubscribeMatch: '/api/attention/add', // 预约赛事
    getBookedCompetition: '/api/attention/lists', // 我的预约赛事
    clearFinished: '/api/attention/cancelFinish', // 清空已完场的预约赛事
    getMatchScheduleByDay: '/api/scheduleMatch/getScheduleByDay',
    getMatchSchedule: '/api/scheduleMatch/getSchedule', // 联赛赛程
    getHotMatches: '/api/scheduleMatch/hotMatch', // 热门赛程
    // 直播和预约使用
    getMatchesByDay: '/api/scheduleMatch/getScheduleByDay', // 赛程按日期
    // 赛程使用
    getSchemaMatches: '/api/scheduleMatch/matchLists', // 赛程

    // 全部赛程
    getAllCompetition: '/api/scheduleMatch/all',

    getLeagues: '/api/leagues/hotLists', // 获取热门联赛
    getBasketballLeagues: '/api/leaguesBasketball/hotLists', // 获取篮球热门联赛
    getLeaguesByType: '/api/leagues/lists', // 获取联赛
    getTeamStanding: '/api/team/standing', // 五大联赛排名  联赛id 意甲:34;英超:36;德甲:8;法甲:11;西甲:31;
    getTeamStandingZC: '/api/team/standingZc', // 中超排名
    getBasketballStanding: '/api/teamBasketball/standing', // 篮球积分

    //  本场比赛
    getMatchLive: '/api/live/matchLive',

    // 篮球
    getBasketballCompetition: '/api/scheduleBasketball/lists',
    // 阵容
    getLineup: '/api/lineup',
    // 赛况
    getMatchStatics: '/api/statistics/match',
    getMatchBasketball: '/api/match/basketball',
    getTextLive: '/api/match/textLive',
    // 获取拉流配置
    signurl: '/api/live/signurl',
    getCollectList: '/api/collect/list',
    addCollect: '/api/collect/add',
    cancelCollect: '/api/collect/cancel',
    speechList: '/api/speech/list', // 快捷发言

    // 专家发布
    // getCompetitionWithOdds: '/api/odds/list',
    getCompetitionWithOdds: '/api/odds/scl',
    // 指数联赛
    getOddsLeagues: '/api/odds/leagues',

    // 搜索联赛
    getCompetitionBySearch: '/api/scheduleMatch/search',

    // 没有视频推流下播
    liveNoStream: '/api/live/closeNoStream'
}
export default url
