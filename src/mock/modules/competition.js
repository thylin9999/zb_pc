import Mock from 'mockjs'
import { statusCode } from '@/utils/statusCode'
import url from '../../api/competition/url'
const getCompetitions = config => {
    return Mock.mock({
        code: statusCode.success,
        page: {
            total: 150,
            current: 1
        },
        'data|5-20': [{
            id: '@id',
            nick: '@cname',
            'room_title': '柬埔寨对阿根廷',
            heat_num: '10000',
            'live_cover|1': [
                '',
                'https://cdn.podapi.com/image/live/20220511/810101297e7bf7d0418f718121cf2e2b?imageView2/2/w/600/h/600',
                'https://cdn.podapi.com/image/live/20220511/74fe6e768e027c7e8152fdc9156fb6d8?imageView2/2/w/600/h/600',
                'https://cdn.sportnanoapi.com/football/team/0ca927f81a711c8df6961aa864fb1898.jfif',
                'https://cdn.sportnanoapi.com/football/team/9e033dde06190d44817b6e37a4bc0b2b.png'
            ]
        }]
    })
}

const getOnlineBroadcast = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|0-10': [
            {
                id: '@id',
                team1: {
                    name: '@cname',
                    id: '@id'
                },
                team2: {
                    name: '@cname',
                    id: '@id'
                },
                'img|1': [
                    'https://cdn.podapi.com/image/live/20220511/810101297e7bf7d0418f718121cf2e2b?imageView2/2/w/600/h/600',
                    'https://cdn.podapi.com/image/live/20220511/74fe6e768e027c7e8152fdc9156fb6d8?imageView2/2/w/600/h/600',
                    'https://cdn.sportnanoapi.com/football/team/0ca927f81a711c8df6961aa864fb1898.jfif',
                    'https://cdn.sportnanoapi.com/football/team/9e033dde06190d44817b6e37a4bc0b2b.png'
                ],
                user: {
                    name: '@cname',
                    viewers: {
                        'count|0-2000000': 2000
                    }
                }
            }
        ]
    })
}

const getBookedMatches = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|5': [
            {
                id: '@id',
                name: '@cname',
                'status|1': [0, 1], // 0 未开始，1 进行中
                time: '@time',
                team1: {
                    icon: '',
                    loop: '中甲第3轮',
                    'score|0-10': 2
                },
                team2: {
                    icon: '',
                    loop: '中甲第3轮',
                    'score|0-10': 2
                }
            }
        ]
    })
}

const getVideoCompetitions = config => {
    return Mock.mock({
        code: statusCode.success,
        'data|4': [
            {
                id: '@id',
                'cover|1': [
                    'https://cdn.podapi.com/image/avatar/20201129/94c9db716f8fec692e28d177d0d8d960?imageView2/2/w/200/h/200',
                    'https://cdn.podapi.com/image/avatar/20211110/78afecb665cf8ee2756b0e4995d17d13?imageView2/2/w/200/h/200',
                    'https://cdn.podapi.com/image/avatar/20210416/45448f2f01b687d92181cf9f82e4cd0f?imageView2/2/w/200/h/200'
                ],
                time: '@time',
                title: '日职联:川崎前锋 vs 札幌冈萨多'
            }
        ]
    })
}

const getMatchList = config => {
    return Mock.mock({
        'code': statusCode.success,
        'msg': '',
        data: {
            'list|10': [
                {
                    'anchor_list|0-5': [ // 主播信息
                        {
                            'room_id': '',
                            'img': ''
                        }
                    ],
                    'appointment': '',
                    'id': '@id',
                    'matchId': '',
                    'color': '',
                    'kind': '',
                    'leagueId': '',
                    'leagueEn': '',
                    'leagueEnShort': '',
                    'leagueChsShort': '@title',
                    'leagueChtShort': '',
                    'subLeagueId': '',
                    'subLeagueEn': '',
                    'subLeagueChs': '',
                    'subLeagueCht': '',
                    'matchTime': '2020-06-15 12:15:00',
                    'startTime': '',
                    'homeEn': '',
                    'homeChs': '@cname',
                    'homeCht': '',
                    'awayEn': '',
                    'awayChs': '@cname',
                    'awayCht': '',
                    'homeId': '',
                    'awayId': '',
                    'state|1': [0, 1, 2, 3, 4, 5, -1, -10, -11, -12, -13, -14], // 比赛状态 0：未开1：上半场2：中场3：下半场4：加时5：点球-1：完场-10：取消-11：待定-12：腰斩-13：中断-14：推迟
                    'homeScore|0-10': 1,
                    'awayScore|0-10': 2,
                    'homeHalfScore': '',
                    'awayHalfScore': '',
                    'homeRed': '',
                    'awayRed': '',
                    'homeYellow': '',
                    'awayYellow': '',
                    'homeCorner': '',
                    'awayCorner': '',
                    'homeRankEn': '',
                    'homeRankCn': '',
                    'awayRankEn': '',
                    'awayRankCn': '',
                    'isNeutral': '',
                    'hasLineup': '',
                    'season': '',
                    'groupId': '',
                    'roundEn': '',
                    'roundCn': '',
                    'grouping': '',
                    'locationEn': '',
                    'locationCn': '',
                    'weatherEn': '',
                    'weatherCn': '',
                    'temp': '',
                    'explainEn': '',
                    'explainCn': '',
                    'extraExplain': '',
                    'isHidden': '',
                    'updateTime': '',
                    'matchStartTime': '',
                    'sort': '0',
                    'isPosition': '1',
                    'technicCount': '',
                    'leagueType': '1',
                    'remark': '',
                    'adminUser': '',
                    'create_time': '',
                    'update_time': '',
                    'follow': '0',
                    'reserveNum': '0',
                    'matchLevel': '0',
                    'focalPoint': '1'
                }
            ]
        }
    })
}

// Mock.mock(/\/api\/get-competition/, 'post', getCompetitions)

// Mock.mock(url.getOnlineBroadcast, 'get', getOnlineBroadcast)
// Mock.mock(url.getBookedMatches, 'post', getBookedMatches)

// Mock.mock(url.getVideoCompetitions, 'get', getVideoCompetitions)
// Mock.mock(url.getMatchList, 'post', getMatchList)
