const state = {
    animationUrl: '',
    realMatchInfo: {},
    competitionStoreData: {},
    competitionList: [], // 即时比分页面 比赛列表，为了统计 当天联赛，有多少场比赛
    gettingLeagues: false, // 即时比分界面，获取 热门联赛时，不发送 请求获取比赛列表
    basketBallPlayers: { // 篮球，动画直播，球员名单
        home: [],
        away: []
    },
    thirdLeagueList: [], // 三级赛事 id列表
    competitionStatics: { // 比赛数量总计
        football: 0,
        basketball: 0
    }

}

const actions = {

}
const mutations = {
    SET (state, payload) {
        Object.entries(payload).forEach(item => {
            const key = item[0]
            const value = item[1]
            state[key] = value
        })
    }
}
const getters = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
