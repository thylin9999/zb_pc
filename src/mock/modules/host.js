import Mock, { Random } from 'mockjs'
import { statusCode } from '@/utils/statusCode'
import url from '../../api/Host/url'
const getSubscribeHost = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|5-20': [
            {
                id: '@id',
                'isSubscribe|1': true,
                avatar: '',
                'heat_num|1000-1000000': 2000,
                name: '@cname',
                description: '主播简介主播简介主播简介主播简介'
            }
        ]
    })
}

const getHostRank = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|6': [
            {
                anchor_name: '海牛会员5',
                follow: 0,
                id: 1,
                logo: null,
                member_id: 1000005,
                sign: null
                // id: '@id',
                // 'isSubscribe|1': true,
                // name: '@cname',
                // description: '主播简介主播简介主播简介主播简介'
            }
        ]
    })
}

const bookBroadcast = config => {
    return Mock.mock({
        code: statusCode.success,
        data: {
            msg: '',
            'list|20': [{
                id: '@id',
                'leagueType|1': [1, 2, 3, 4], // 联赛类型1足球 2篮球 3电竞 4其他
                matchTime: '@time'
            }]
        }
    })
}
// Mock.mock(url.getSubscribeHost, 'post', getSubscribeHost)
// Mock.mock(url.getHostRank, 'get', getHostRank)
// Mock.mock(url.bookBroadcast, 'post', bookBroadcast)
