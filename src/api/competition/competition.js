import request from '../request'
import url from './url'
export function getCompetitions (type = 1) {
    return request({
        method: 'post',
        url: url.getCompetitions,
        data: {
            type
        }
    })
}

export function getOnlineBroadcast ({ pageNumber = 1, pageSize = 20, type = null, leagueId }) {
    return request({
        method: 'post',
        url: url.getOnlineBroadcast,
        data: {
            pageNum: pageNumber,
            pageSize,
            type,
            leagueId
        }
    })
}

export function getHotBroadcast ({ pageNumber = 1, pageSize = 5 }) {
    return request({
        method: 'post',
        url: url.getOnlineBroadcast,
        data: {
            pageNum: pageNumber,
            pageSize
        }
    })
}

// 热门直播
export function getHotRooms ({ anchorId, pageNumber = 1, pageSize = 2000, type = 0 }) {
    return request({
        method: 'post',
        url: url.getHotRooms,
        data: {
            pageNum: pageNumber,
            pageSize,
            type,
            anchor_id: anchorId
        }
    })
}

// 首页顶部推荐
export function liveRoom (data) {
    return request({
        method: 'post',
        url: url.liveRoom,
        data
    })
}

export function getBookedMatches ({ pageNumber = 1, pageSize = 20 }) {
    return request({
        method: 'post',
        url: url.getBookedMatches,
        data: {
            pageNum: pageNumber,
            pageSize
        }
    })
}

export function getVideoCompetitions () {
    return request({
        method: 'get',
        url: url.getVideoCompetitions
    })
}

// 赛程
export function getMatchList ({
    pageNumber = 1,
    pageSize = 20,
    leagueId = null,
    playing = null,
    leagueType = null,
    hierarchy = '',
    day
}) {
    return request({
        method: 'post',
        url: url.getMatchList,
        timeout: 1000 * 60, // 1分钟
        data: {
            'pageNum': pageNumber,
            pageSize,
            day,
            leagueId,
            playing,
            leagueType,
            hierarchy
        }
    })
}
export function getSchemaMatches ({
    pageNumber = 1,
    pageSize = 20,
    leagueId = null,
    playing = null,
    leagueType = null,
    day
}) {
    return request({
        method: 'post',
        url: url.getSchemaMatches,
        timeout: 1000 * 60, // 1分钟
        data: {
            'pageNum': pageNumber,
            pageSize,
            day,
            leagueId,
            playing,
            leagueType
        }
    })
}

// 全部赛程
export function getAllCompetition ({
    playing = null,
    day
}) {
    return request({
        method: 'post',
        url: url.getAllCompetition,
        timeout: 1000 * 60, // 1分钟
        data: {
            day,
            playing
        }
    })
}

// 热门赛程
// export function getHostMatches (data) {
//     return request({
//         method: 'post',
//         url: url.getHostMatches,
//         data: {
//             day: data ? data.day : null
//         }
//     })
// }
export function getHostMatches (data) {
    // const params = data.playing ? {
    //     day: data ? data.day : null,
    //     playing: data.playing
    // } : {
    //     day: data ? data.day : null,
    //     pageSize: 2000
    // }
    return request({
        method: 'post',
        url: url.getHostMatches,
        requestTimeoutType: 'hotMatch',
        data: {
            day: data ? data.day : null,
            playing: data && data.playing ? data.playing : 3000
        }
    })
}
// 卡片预约赛事
export function addSubscribeMatch (matchId, leagueType) {
    return request({
        method: 'post',
        url: url.addSubscribeMatch,
        data: {
            match_id: matchId,
            leagueType
        }
    })
}

// 我的预约赛程
export function getBookedCompetition ({ pageNumber, pageSize, status }) {
    return request({
        method: 'post',
        url: url.getBookedCompetition,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            match_status: status // 我的预约：2000 我的历史预约：3000
        }
    })
}
// 清空已完场
export function clearFinished () {
    return request({
        method: 'post',
        url: url.clearFinished
    })
}

// 时间查询 赛程
export function getMatchScheduleByDay ({ date, leagueId = 1 }) {
    return request({
        method: 'post',
        url: url.getMatchScheduleByDay,
        data: {
            day: date,
            leagueId: 1 // 足球
        }
    })
}

// 赛程
export function getMatchSchedule (data) {
    return request({
        method: 'post',
        url: url.getMatchSchedule,
        data
    })
}

export function getMatchesByDay ({ day, leagueId, leagueType, schedule = null }) {
    return request({
        method: 'post',
        url: url.getMatchesByDay,
        data: {
            day,
            leagueId,
            leagueType,
            schedule
        }
    })
}
// 联赛列表
export function getLeagues (type, day, playing, hierarchy) {
    return request({
        method: 'post',
        url: url.getLeagues,
        data: { // 联赛类型 1足球 2篮球 3电竞 4其他
            league_type: type,
            day,
            playing,
            hierarchy
        }
    })
}

// 直播中联赛列表
export function getLeaguesLiving (type) {
    return request({
        method: 'post',
        url: '/api/leagues/hotListsLive',
        data: { // 联赛类型 1足球 2篮球 3电竞 4其他
            league_type: type
        }
    })
}
// 篮球热门联赛
export function getBasketballLeagues (type) {
    return request({
        method: 'post',
        url: url.getBasketballLeagues,
        data: { // 联赛类型 1足球 2篮球 3电竞 4其他
            league_type: type
        }
    })
}

export function getLeaguesByType (type) {
    return request({
        method: 'post',
        url: url.getLeaguesByType,
        data: {
            league_type: type
        }
    })
}

export function getTeamStanding (id) {
    return request({
        method: 'post',
        url: url.getTeamStanding,
        data: {
            league_id: id
        }
    })
}
export function getBasketballStanding (id) {
    return request({
        method: 'post',
        url: url.getBasketballStanding,
        data: {
            leagueId: id
        }
    })
}
export function getTeamStandingZC (id) {
    return request({
        method: 'post',
        url: url.getTeamStandingZC,
        data: {
            subId: id // 分组 ，A组 2186 B组 2760 C组；2787 第二阶段。。。
        }
    })
}

// 获取本场比赛相关
export function getMatchLive ({ pageNumber = 1, pageSize = 2000, matchId }) {
    return request({
        method: 'post',
        url: url.getMatchLive,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            match_id: matchId
        }
    })
}

// 篮球赛程

export function getBasketballCompetition ({
    pageNumber = 1,
    pageSize = 20,
    leagueId = null,
    playing = null,
    leagueType = null,
    hierarchy = '',
    day
}) {
    return request({
        method: 'post',
        url: url.getBasketballCompetition,
        timeout: 1000 * 60, // 1分钟
        data: {
            'pageNum': pageNumber,
            pageSize,
            day,
            leagueId,
            playing,
            leagueType,
            hierarchy
        }
    })
}

export function getLineup (matchId, leagueType = 1) {
    const type = leagueType === 1 ? 'football' : 'basketball'
    return request({
        method: 'post',
        url: url.getLineup + '/' + type,
        data: {
            match_id: matchId * 1,
            leagueType
        },
        timeout: 1000 * 60 * 60
    })
}
export function getMatchStatics ({ matchId, roomId, type = 'football' }) {
    return request({
        method: 'post',
        url: `/api/match/${type}`,
        data: {
            match_id: matchId,
            room_id: roomId
        },
        timeout: 1000 * 60 * 60
    })
}
export function getMatchBasketball (matchId) {
    return request({
        method: 'post',
        url: url.getMatchBasketball,
        data: {
            match_id: matchId
        },
        timeout: 1000 * 60 * 60
    })
}

export function getTextLive (matchId, type = 1, quarter, currentPage = 1, pageSize = 3000) {
    return request({
        method: 'post',
        url: url.getTextLive,
        data: {
            match_id: matchId * 1,
            type: type + '',
            quarter,
            page: currentPage,
            page_size: pageSize

        },
        timeout: 1000 * 60
    })
}
export function getSignurl (params) {
    return request({
        method: 'get',
        url: url.signurl,
        params
    })
}

export function getCollectList () {
    return request({
        method: 'post',
        url: url.getCollectList,
        timeout: 60 * 1000
    })
}
export function addCollect ({ matchId, type = 1 }) {
    return request({
        method: 'post',
        url: url.addCollect,
        data: {
            match_id: matchId,
            type// 1 足球 ，2篮球
        }
    })
}
export function cancelCollect (matchId) {
    return request({
        method: 'post',
        url: url.cancelCollect,
        data: {
            match_id: matchId
        }
    })
}
export function speechList (params) {
    return request({
        method: 'get',
        url: url.speechList,
        params
    })
}

// 赛事 指数列表
export function getCompetitionWithOdds ({ date, type, leagueId, pageSize, pageNum }) {
    return request({
        method: 'get',
        url: url.getCompetitionWithOdds,
        params: {
            pageNum,
            pageSize,
            league_id: leagueId,
            type,
            date
        }
    })
}

// 直说联赛
export function getOddsLeagues (type, day, playing, hierarchy) {
    return request({
        method: 'get',
        url: url.getOddsLeagues,
        params: {
            league_type: type,
            day,
            playing,
            hierarchy
        }
    })
}

export function getCompetitionBySearch ({ type, search }) {
    return request({
        method: 'get',
        url: url.getCompetitionBySearch,
        params: {
            type,
            search
        }
    })
}

// 无视频流
export function liveNoStream (data) {
    return request({
        method: 'post',
        url: url.liveNoStream,
        data
    })
}
