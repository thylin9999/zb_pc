<template>
    <div class="live-room-wrapper-box wrap-1200 p-relative hide-scrollbar"
         :key="updateTimeKey">
        <div class="right-room">
          <div class="w-100 m-t-15 bg-white">
            <MatchHeader  :match-info="matchInfo"/>
          </div>
            <div class="content">
                <div class="virtual-room w-100 flex align-center m-t-15">
                  <div class="virtual-box m-r-15">
                    <iframe class="w-100 h-100" v-if="animationUrl" :src="animationUrl" frameborder="0"></iframe>
                  </div>
                  <div class="flex-1 chat-box bg-white">
                    <Chat :match-id="matchId" is-virtual/>
                  </div>
                </div>
                <div class="down-section-box wrap-1200">
                    <FootballMatchStatics
                        ref="footballRoom"
                        v-if="isFootball"
                        :match-id="matchId"
                        :match-info="matchInfo"
                        :all-data="competitionStoreData"
                    />
                    <BasketballDetail
                        ref="basketballRoom"
                        :match-id="matchId"
                        :match-info="matchInfo"
                        :all-data="competitionStoreData"
                        v-else/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import FootballMatchStatics from '@/views/VirtualLiveRoom/Components/FootballMatchStatics'
import BasketballDetail from '@/views/VirtualLiveRoom/BasketballDetail'
import MatchHeader from '@/views/VirtualLiveRoom/Components/MatchHeader'
// import Chat from './chat/index'
import Chat from '@/views/LiveRoom/chat/index'
import { mapMutations, mapState } from 'vuex'
import { getLocal, setLocal } from '@/utils/cookie'
import { getMatchBasketball, getMatchStatics } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import ScoreWs from '@/utils/scoreWs'

export default {
    name: 'WrapperBox',
    components: {
        FootballMatchStatics,
        BasketballDetail,
        MatchHeader,
        Chat
    },
    data () {
        return {
            // comName: 'HostCompetition',
            matchId: null, // 当前直播间的比赛id
            matchInfo: {},
            competitionStoreData: null,
            leagueType: null,
            matchTypes: [
                {
                    id: 5,
                    title: '全部',
                    key: 'all',
                    isHover: false,
                    icon: 'live-room/all'
                },
                {
                    id: 1,
                    title: '足球',
                    isHover: false,
                    key: 'football',
                    icon: 'live-room/football'
                },
                {
                    id: 2,
                    title: '篮球',
                    isHover: false,
                    key: 'basketball',
                    icon: 'live-room/basketball'
                },
                {
                    id: 3,
                    title: '电竞',
                    isHover: false,
                    key: 'eSport',
                    icon: 'live-room/esport'
                },
                {
                    id: 4,
                    title: '其他',
                    isHover: false,
                    key: 'other',
                    icon: 'live-room/other'
                }
            ],
            tabId: 1,
            tabs: [
                {
                    id: 1,
                    title: '主播赛程',
                    com: 'HostCompetition'
                },
                {
                    id: 2,
                    title: '推荐直播',
                    com: 'AboutSelfCompetition'
                },
                {
                    id: 3,
                    title: '赛况',
                    com: 'MatchStatics'
                },
                {
                    id: 4,
                    title: '阵容',
                    com: 'Lineup'
                }
            ],
            boxHeight: 100,
            footerMaxY: 0, //  footer的最大滚动值
            updateTimeKey: +new Date().getTime(),
            loopIns: null
        }
    },
    computed: {
        ...mapState('user', ['token']),
        ...mapState('competition', ['animationUrl', 'realMatchInfo']),
        comName () {
            return this.tabs.find(x => x.id === this.tabId).com
        },
        style () {
            return {
                maxHeight: `calc(100vh - ${this.boxHeight}px)`
            }
        },
        isFootball () {
            return this.leagueType === 1
        }
    },
    beforeRouteEnter (to, from, next) {
        const query = to.query
        const metaQuery = to.meta.query
        const paramsError = Object.keys(metaQuery).some(key => {
            return metaQuery[key] === 'required' && !query[key]
        })
        if (paramsError) {
            next('/')
        } else {
            next()
        }
    },
    created () {
        // 从列表保存的
        const info = JSON.parse(getLocal('matchInfo'))
        const { matchId, leagueType } = this.$route.query
        this.matchId = matchId
        this.leagueType = leagueType && leagueType * 1
        this.matchInfo = info
        this.init()
    },
    mounted () {
        this.initWs()
        // 相对于 html的偏移
        this.footerMaxY = (document.getElementById('footer') && document.getElementById('footer').offsetTop) || 0
        window.addEventListener('scroll', this.initScroll)
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        // test () {
        // // 模拟修改数据
        //     const params = {
        //         data: [{
        //             match_id: 2213434,
        //             home_score: 5,
        //             away_score: 10,
        //             who: 'away',
        //             state: 3,
        //             away_name: '22222',
        //             home_name: '111111111',
        //             time: '93',
        //             away_corner: 3,
        //             away_half_score: 2,
        //             away_yellow: 1,
        //             away_red: 0,
        //             home_corner: 1,
        //             home_half_score: 0,
        //             home_red: 0,
        //             home_yellow: 3,
        //             now_time: '90'
        //         }],
        //         type: 'score'
        //     }
        //     this.updateScore(params)
        // },
        updateScore ({ type, data }) { // score 更新列表
            data.forEach(match => {
                const id = match.match_id
                if (id === this.matchId * 1) {
                    // 更新matchInfo
                    const newInfo = {
                        awayCorner: match.away_corner,
                        awayHalfScore: match.away_half_score,
                        awayRed: match.away_red,
                        awayYellow: match.away_yellow,
                        awayScore: match.away_score,
                        homeCorner: match.home_corner,
                        homeHalfScore: match.home_half_score,
                        homeRed: match.home_red,
                        homeYellow: match.home_yellow,
                        homeScore: match.home_score,
                        timing: match.now_time,
                        nowTime: match.now_time
                    }
                    this.matchInfo = { ...this.matchInfo, ...newInfo, leagueType: this.leagueType }
                    this.SET({ realMatchInfo: this.matchInfo })
                    setLocal('matchInfo', JSON.stringify({ ...this.matchInfo }))

                    this.competitionStoreData = Object.assign({}, this.competitionStoreData, { matchInfo: this.matchInfo })
                    if (this.isFootball) {
                        this.$refs.footballRoom.refreshPage()
                    } else {
                        this.$refs.basketballRoom.refreshPage()
                    }
                //
                }
            })
        },
        async  init () {
            try {
                const request = this.leagueType === 1 ? getMatchStatics : getMatchBasketball
                const params = this.leagueType === 1
                    ? { matchId: this.matchId }
                    : this.matchId
                const { data, code } = await request(params)
                if (code === statusCode.success && data) {
                    this.matchInfo = { ...this.matchInfo, ...data.matchInfo, leagueType: this.leagueType }
                    this.SET({
                        animationUrl: data.animeUrl,
                        realMatchInfo: this.matchInfo
                    })
                    setLocal('matchInfo', JSON.stringify({ ...this.matchInfo }))
                    this.competitionStoreData = { ...data }
                    this.updateTimeKey = +new Date().getTime()
                }
            } catch (e) {
                console.log(e, '错了')
            }
        },
        showTab (tab) {
            return this.isFootball || (!this.isFootball && ![3, 4].includes(tab.id))
        },
        initScroll () {
            const { y } = document.getElementById('footer').getBoundingClientRect()
            this.boxHeight = 100 + this.footerMaxY - y
        },
        changeTab (tab) {
            this.tabId = tab.id
        },
        changeMatchInfo (matchInfo) {
            this.matchInfo = matchInfo
        },
        goToPage (menu) {
            // let routeData
            // let routeData = this.$router.resolve({
            //     name: 'personDetail',
            //     query: {
            //         id: row.id,
            //     },
            // })
            // window.open(routeData.href, '_blank')

            if (menu.key === 'favorite') {
                // 我的关注
                if (!this.token) {
                    this.openLoginDialogMixin()
                    return
                }
                this.$router.push({
                    name: 'LiveBroad',
                    params: {
                        categoryId: 2
                    }
                })
            } else if (menu.key === 'booked') {
                // 我的预约
                if (!this.token) {
                    this.openLoginDialogMixin()
                    return
                }
                this.$router.push({
                    name: 'Competition',
                    params: {
                        competitionTypeId: 2
                    }
                })
            } else {
                this.$router.push({
                    name: 'LiveBroad',
                    params: {
                        categoryId: menu.key === 'all' ? 1 : 3,
                        leagueType: menu.key === 'all' ? null : menu.id
                    }
                })
            }
        },
        addListener () {
            // 根据通知来 更新数据
            ScoreWs.listener.on('score', this.updateScore)
        },
        initWs () {
            ScoreWs.initScoreWs(this.addListener)
        }
    },
    beforeDestroy () {
        this.loopIns && this.loopIns.stop()
        ScoreWs.listener.off('score', this.updateScore)
        ScoreWs.closeWs()
    }
}
</script>

<style lang="scss" scoped>
.virtual-box{
  width: 805px;
  height: 620px;
  background: #D8D8D8;
  border-radius: 10px;
}
.chat-box {
  width: 380px;
  height: 620px;
}

    .left-bar {
        width: 90px;
        position: fixed;
        left: 0;
        top: 78px;
        bottom: 0;
        z-index: 1;
        max-height: calc(100vh - 200px);
        background-color: #003F67;
        overflow-y: auto;
        .menus {
            height: 180px;
            .item.is-hover {
                color: #3DB1FB;
            }
        }
        .item {
            color: #fff;
        }
        .types {
            height: 450px;
            .item.is-hover {
                color: #3DB1FB;
            }
        }
    }
    .right-room {
        overflow-y: auto;
        //height: calc(100vh - 78px);
    }
    .down-section-box {
        width: 100%;
        margin: auto;
        background-color: #f3f5f9;
    }

    .down-section {
        width: 100%;

        .tabs {
            .tab-item {
                width: 50%;
                font-size: 18px;
                color: #818181;
                line-height: 55px;
                border-bottom: 1px solid #DEE4FF;
            }

            .row {
                border-right: 1px solid #DEE4FF;

            }

            .tab-item:last-child .row {
                border: none;
            }

            .inner-title {
                width: 215px;
            }

            .tab-item.is-active .inner-title {
                color: #5170FF;

                &::before {
                    content: '';
                    width: 100%;
                    height: 2px;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    background: linear-gradient(0deg, #3B5FFF, #A2B3FF);
                    z-index: 2;
                }

            }
        }
    }

    ::v-deep {
      .chat-box {
        .chat_con {
          background-color: #fff!important;
        }
      }
    }
</style>
