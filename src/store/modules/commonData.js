import { getBoxList } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { transferTime } from '@/utils/utils'

const state = {
    isExpired: false,
    competitionTabs: [
        {
            id: 1,
            key: 'competition.all',
            name: '全部'
        },
        {
            id: 2,
            key: 'competition.football',
            name: '足球'
        },
        {
            id: 3,
            key: 'competition.basketball',
            name: '篮球'
        }
    ],
    descriptions: [
        {
            id: 1,
            text: '全球赛事',
            icon: 'global-competition'
        },
        {
            id: 2,
            text: '高清直播',
            icon: 'high-definition'
        },
        {
            id: 3,
            text: '海量数据',
            icon: 'mass-data'
        },
        {
            id: 4,
            text: '用户协议',
            icon: 'protocols',
            type: 'Description',
            com: 'Protocols'
        },
        {
            id: 5,
            text: '隐私政策',
            icon: 'privacy-policy',
            type: 'Description',
            com: 'Policy'
        },
        {
            id: 6,
            text: '免责声明',
            icon: 'disclaimer',
            type: 'Description',
            com: 'Disclaimer'
        }

    ],
    matchTypes: [
        {
            id: 1,
            title: '足球',
            icon: 'icons/football'
        },
        {
            id: 2,
            title: '篮球',
            icon: 'icons/basketball'
        },
        {
            id: 3,
            title: '热门赛事',
            icon: 'icons/hot-white'
        },
        {
            id: 4,
            title: '正在比赛',
            icon: 'icons/lock'
        }
    ],
    broadcastTypes: [
        {
            id: 5, // 未定
            title: '正在热播',
            key: 'living'
        },
        {
            id: 1,
            title: '足球热播',
            text: '足球',
            key: 'football'
        },
        {
            id: 2,
            title: '篮球热播',
            text: '篮球',
            key: 'basketball'
        },
        {
            id: 3,
            title: '电竞热播',
            text: '电竞',
            key: 'eSports'
        },
        {
            id: 4,
            title: '其他',
            text: '其他',
            key: 'other'
        }
    ],
    leagueTypes: {
        // 按球类分类
    },
    serviceSite: 'https://tb.53kf.com/code/client/b8ccba789e8f30713194b500e84013f22/1',
    urls: {
        ad_status: 1,
        android_link: 'http://www.wuhaicj.com/#/home',
        create_by: 'admin',
        create_time: '2022-09-19 04:43:23',
        id: 1,
        ios_link: 'http://www.wuhaicj.com/#/home',
        remark: '测试使用',
        status: 1,
        update_by: 'admin',
        update_time: '2022-09-20 04:12:19'
    },
    footballStaticsKinds: [ // 1：入球2：红牌3：黄牌7：点球8：乌龙9：两黄变红11：换人13：射失点球
        // 0.先开球
        // 1.第一个角球
        // 2.第一张黄牌
        // 3.射门次数
        // 4.射正次数
        // 5.犯规次数
        // 6.角球次数
        // 7.角球次数(加时)
        // 8.任意球次数
        // 9.越位次数
        // 10.乌龙球数
        // 11.黄牌数
        // 12.黄牌数(加时)
        // 13.红牌数
        // 14.控球率
        // 15.头球
        // 16.救球
        // 17.守门员出击
        // 18.丟球
        // 19.成功抢断
        // 20.阻截
        // 21.长传
        // 22.短传
        // 23.助攻
        // 24.成功传中
        // 25.第一个换人
        // 26.最后换人
        // 27.第一个越位
        // 28.最后越位
        // 29.换人数
        // 30.最后角球
        // 31.最后黄牌
        // 32.换人数(加时)
        // 33.越位次数(加时)
        // 34.射门不中
        // 35.中柱
        // 36.头球成功次数
        // 37.射门被挡
        // 38.铲球
        // 39.过人次数
        // 40.界外球
        // 41.传球次数
        // 42.传球成功率
        // 43.进攻次数
        // 44.危险进攻次数
        // 45.半场角球
        // 46.半场控球
        // 47.扑出点球
        {
            id: 1,
            name: '进球',
            icon: 'score'
        },
        {
            id: 2,
            name: '红牌',
            icon: 'red-card'
        },
        {
            id: 3,
            name: '黄牌',
            icon: 'yellow-card'
        },
        {
            id: 7,
            name: '点球',
            icon: 'penalty'
        },
        {
            id: 8,
            name: '乌龙球',
            icon: 'own-goal'
        },
        {
            id: 9,
            name: '两黄变红',
            icon: 'yellow2red'
        },
        {
            id: 11,
            name: '换人',
            icon: 'substitution'
        },
        {
            id: 13,
            name: '点球不进',
            icon: 'penalty-error'
        }
    ],
    scoreIcons: [
        {
            id: 1,
            name: '进球',
            icon: 'fill'
        },
        {
            id: 2,
            name: '点球',
            icon: 'pk'
        },
        {
            id: 3,
            name: '点球不进',
            icon: 'fail'
        },
        {
            id: 4,
            name: '乌龙球',
            icon: 'fill-by-self'
        },
        {
            id: 5,
            name: '换人',
            icon: 'change'
        },
        {
            id: 6,
            name: '角球',
            icon: 'corner'
        },
        {
            id: 7,
            name: '黄牌',
            icon: 'yellow'
        },
        {
            id: 8,
            name: '红牌',
            icon: 'red'
        },
        {
            id: 9,
            name: '两黄一红',
            icon: 'yellow2red'
        }, {
            id: 10,
            name: '受伤',
            icon: 'assist'
        }, {
            id: 11,
            name: '动画',
            icon: 'animation'
        }, {
            id: 12,
            name: '视频',
            icon: 'vr'
        }, {
            id: 13,
            name: '收藏',
            icon: 'collect'
        }, {
            id: 14,
            name: '置顶',
            icon: 'top'
        }

    ],
    stage1Res: {}, // 小组赛结果
    stage2Res: {}, // 1/8赛果
    stage3Res: {}, // 1/4赛果
    stage4Res: {}, // 1/2赛果
    stage5Res: {}, // 决赛
    basketballStatics: [
        {
            key: 'Totalmis',
            title: '失误'
        },
        {
            key: 'Score',
            title: '得分'
        },
        {
            key: 'Fast',
            title: '快攻得分'
        },
        {
            key: 'Inside',
            title: '内线得分'
        },
        {
            key: 'Exceed',
            title: '最多领先得分'
        }
    ],
    experiences: [
        {
            id: 1,
            title: '一个月'
        },
        {
            id: 2,
            title: '三个月'
        },
        {
            id: 3,
            title: '一年'
        },
        {
            id: 4,
            title: '两年'
        },
        {
            id: 5,
            title: '五年'
        },
        {
            id: 6,
            title: '五年以上'
        }
    ],
    requestFlag: {
        hotMatch: false,
        adv: false,
        detail: false
    },
    needRefresh: false,
    showTipType: ['goal', 'card'],
    showHideType: '',
    newsTypes: [],
    boxes: [], // 宝箱列表
    changeBoxStatus: false, // 是否要开启宝箱
    // timer: null // 宝箱计时器
    headerWidth: window.innerWidth
}
const actions = {
    async getBoxes ({ commit }, payload) {
        try {
            const { code, data } = await getBoxList()
            if (code === statusCode.success) {
                const boxes = data.reduce((all, item) => {
                    let time = Math.floor(item.time / 60)
                    time = time < 10 ? '0' + time : time
                    all.push({
                        ...item,
                        timeString: `${time}:00`,
                        isOpen: item.status === 3
                    })
                    return all
                }, [])
                commit('SET', {
                    boxes
                })
            }
            if (payload && payload.cb) {
                payload.cb()
            }
        } catch (e) {
            console.log('出错了')
        }
    }

}
const mutations = {
    SET (state, payload) {
        Object.entries(payload).forEach(item => {
            const key = item[0]
            const value = item[1]
            state[key] = value
        })
    },
    CHANGE_BOX_STATUS (state, { id }) {
        const item = state.boxes.find(x => x.id === id)
        item.status = 3
    },
    START_INTERVAL (state) {
        const item = state.boxes.find(x => x.status === 1)
        window.clearInterval(window.boxTimer)
        if (item) {
            window.boxTimer = window.setInterval(() => {
                if (item.time > 1) {
                    item.time--
                    item.timeString = transferTime(item.time)
                } else {
                    window.clearInterval(window.boxTimer)
                    window.boxTimer = null
                    // 开启宝箱
                    state.changeBoxStatus = true
                    // this.openBox1(item)
                }
            }, 1000)
        }
    },
    STOP_INTERVAL () {
        window.clearInterval(window.boxTimer)
        window.boxTimer = null
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
