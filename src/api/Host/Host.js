import request from '../request'
import url from './url'

// export function getHosts () {
//     return request({
//         method: 'get',
//         url: url.getHosts
//     })
// }

// 主播列表
export function getHostList (status = 2) { // 默认获取正在直播的主播 1. 未开播 2. 开播
    return request({
        method: 'post',
        url: url.getHostList,
        data: {
            live_status: status
        }
    })
}
// 获取订阅的直播列表
export function getSubscribeHost ({ type = null }) {
    return request({
        method: 'post',
        url: url.getSubscribeHost,
        data: {
            type // 区分开播和未开播的
        }
    })
}

export function startLive ({
    placard, matchId, liveType, title, liveCover, category, videoUrl
}) {
    return request({
        method: 'post',
        url: url.startLive,
        data: {
            // leagueType: category, // 赛事类型
            live_cover: liveCover,
            room_title: title,
            type: category, // 分类
            match_id: matchId,
            placard,
            video_url: videoUrl
        }
    })
}

export function closeLive () {
    return request({
        method: 'post',
        url: url.closeLive
    })
}

export function getOBSAddress () {
    return request({
        method: 'post',
        url: url.getOBSAddress
    })
}

export function getHostRank () {
    return request({
        method: 'post',
        url: url.getHostRank
    })
}
// 关注的主播列表
export function getFlowedHosts (status) {
    return request({
        method: 'post',
        url: url.getFlowedHosts,
        data: {
            live_status: status
        }
    })
}

// 订阅主播
export function getSubscribeHosts () {
    return request({
        method: 'post',
        url: url.getSubscribeHosts
    })
}
// 关注、取消 主播
export function followHost (anchorId) {
    return request({
        method: 'post',
        url: url.followHost,
        data: {
            anchor_id: anchorId
        }
    })
}

export function getHotHostRoom () {
    return request({
        method: 'post',
        url: url.getHotHostRoom
    })
}

export function getOfflineHost () {
    return request({
        method: 'post',
        url: url.getOfflineHost
    })
}
export function bookBroadcast () {
    return request({
        method: 'post',
        url: url.bookBroadcast
    })
}

export function bookMatches ({ matchId, cover, title, leagueType = 1 }) {
    return request({
        method: 'post',
        url: url.bookMatches,
        data: {
            matchId,
            leagueType, // 足球，篮球电竞等
            title,
            live_cover: cover
        }
    })
}

export function getBookedMatches (matchId, pageSize) {
    return request({
        method: 'post',
        url: url.getBookedMatches,
        data: {
            match_id: matchId,
            pageSize
        }
    })
}

export function bookOpenBroadcast (id) {
    return request({
        method: 'post',
        url: url.bookOpenBroadcast,
        data: {
            id
        }
    })
}

export function getMyBroadcastHistory ({ pageNumber = 1, pageSize = 20, status = 1 }) {
    return request({
        method: 'post',
        url: url.broadcastHistory,
        data: {
            pageNum: pageNumber,
            pageSize: 2000,
            status // 进行中， 2. 已结束
        }
    })
}

export function cancelSubscribe (matchId, leagueType) {
    return request({
        method: 'post',
        url: url.cancelSubscribe,
        data: {
            matchId,
            leagueType
        }
    })
}
// 主播赛程
export function getAnchorMatches ({ pageNumber = 1, pageSize = 2000, roomId }) {
    return request({
        method: 'post',
        url: url.getAnchorMatches,
        data: {
            pageNum: pageNumber,
            pageSize: pageSize,
            room_id: roomId
        }
    })
}

export function muteLiveRoom ({ type = '2', memberId, roomId }) {
    return request({
        method: 'post',
        url: url.muteLiveRoom,
        data: {
            member_id: memberId,
            room_id: roomId,
            type
        }
    })
}

export function checkMute (memberId) {
    return request({
        method: 'post',
        url: url.checkMute,
        data: {
            member_id: memberId
        }
    })
}

export function searchAnchor (search) {
    return request({
        method: 'get',
        url: url.searchAnchor,
        params: {
            search
        }
    })
}

export function searchBroadcast ({ search, pageSize = 20, pageNum = 1 }) {
    return request({
        method: 'post',
        url: url.searchBroadcast,
        data: {
            pageNum: pageNum,
            pageSize,
            search // 进行中， 2. 已结束
        }
    })
}
// 贡献排行榜
export function getGiftRanking (anchorId, type = 1) {
    return request({
        method: 'get',
        url: url.getGiftRanking,
        params: {
            anchor_id: anchorId,
            type
        }
    })
}

// 礼物列表
export function getGiftList () {
    return request({
        method: 'get',
        url: url.getGiftList
    })
}
// 赠送礼物
export function giveGift ({ giftId, anchorId, roomId }) {
    return request({
        method: 'post',
        url: url.giveGift,
        data: {
            gift_id: giftId,
            anchor_id: anchorId,
            room_id: roomId
        }
    })
}
// 宝箱列表
export function getBoxList () {
    return request({
        method: 'get',
        url: url.getBoxList
    })
}
// 开启宝箱
export function openBox (id) {
    return request({
        method: 'post',
        url: url.openBox,
        data: {
            id
        }
    })
}
// 领取宝箱
export function drawBox (id) {
    return request({
        method: 'post',
        url: url.drawBox,
        data: {
            id
        }
    })
}
