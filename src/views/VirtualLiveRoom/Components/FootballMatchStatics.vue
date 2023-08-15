<template>
<div class="bg-white info-box m-t-10">
    <div class="buttons wrap-1200 flex p-t-15 p-b-20 align-center justify-center">
        <template v-for="button in buttons">
            <span
                :Key="button.id"
                class="pointer button m-r-5 m-l-5 font-18 text-center font-500 font-medium"
                :class="{
                    'is-active': button.id === activeTab
                }"
                @click="changeButton(button)">{{ button.title }}</span>
        </template>
    </div>
    <div class="content m-t-20 m-b-30" :class="{
      'is-lineup': activeTab === 4
    }">
        <template v-if="matchInfo">
            <template  v-if="activeTab === 3">
              <Statics
                  v-if="hasStatics"
                  :match-info="matchInfo"
                  :match-id="matchId"
                  :statics="statics"
              />
              <no-data
                  v-else />
            </template>
            <template v-if="activeTab === 2">
              <CompetitionEvents
                  v-if="events.length"
                  :match-info="matchInfo"
                  :match-id="matchId"
                  :events="events"
                  :statics="statics"
              />
              <no-data
                  v-else />
            </template>
            <TextLive
                v-if="activeTab === 1"
                :match-info="matchInfo"
                :match-id="matchId"
            />
            <Lineup
                v-if="activeTab === 4"
                :match-info="matchInfo"
                :match-id="matchId"
                :events="events"
                :statics="statics"
            />
        </template>
    </div>
    <div class="footer">
        <ul class="types flex flex-wrap justify-center">
            <template v-for="kind in footballStaticsKinds">
                <li class="type flex align-center" :key="`icon-${kind.id}`">
                    <span
                        class="icon d-inline-block bg-center bg-no-repeat bg-size-100"
                        v-lazy:background-image="require(`../../../assets/images/live-room/statics/${kind.icon}.png`)"
                    ></span>
                    <span class="font-12 m-l-5 font-regular font-400">{{ kind.name }}</span>
                </li>
            </template>

        </ul>
    </div>
</div>
</template>

<script>
import { getMatchStatics } from '@/api/competition/competition'
import Statics from '@/views/VirtualLiveRoom/Components/FootballStatics/Statics'
import CompetitionEvents from '@/views/VirtualLiveRoom/Components/FootballStatics/CompetitionEvents'
import TextLive from '@/views/VirtualLiveRoom/Components/FootballStatics/TextLive'
import Lineup from '@/views/VirtualLiveRoom/Components/Lineup'
import { mapState, mapMutations } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import NoData from '@/components/NoData'
import isEmpty from 'lodash.isempty'
export default {
    name: 'FootballMatchStatics',
    components: {
        Statics,
        CompetitionEvents,
        TextLive,
        Lineup,
        NoData
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        },
        allData: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            activeTab: 3,
            statics: {},
            events: [],
            buttons: [
                {
                    id: 1,
                    title: '文字直播',
                    key: 'text-living'
                },
                {
                    id: 2,
                    title: '重要事件',
                    key: 'event'
                },
                {
                    id: 3,
                    title: '技术统计',
                    key: 'statistics'
                },
                {
                    id: 4,
                    title: '阵容',
                    key: 'lineup'
                }
            ]
        }
    },
    created () {
        if (this.allData) {
            this.handleData()
        }
    },
    computed: {
        ...mapState('commonData', ['footballStaticsKinds']),
        hasStatics () {
            return !isEmpty(this.statics)
        }
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        changeButton (button) {
            this.activeTab = button.id
        },
        refreshPage () {
            console.log('refreshPage')
        },
        handleData () {
            const data = this.allData
            if (data.statistics) {
                this.statics = Object.keys(data.statistics).reduce((all, key) => {
                    const item = data.statistics[key]

                    if (key * 1 === 46 || key * 1 === 14 || key * 1 === 42) {
                        // 自身就有百分数的 直接复制
                        item.homeVal = parseInt(item.home_team)
                        item.awayVal = parseInt(item.away_team)
                    } else {
                        const homeTeam = item.home_team * 1
                        const awayTeam = item.away_team * 1
                        if (isNaN(homeTeam) || isNaN(awayTeam)) {
                            item.hide = true
                        } else {
                            const total = item.home_team * 1 + item.away_team * 1
                            item.homeVal = Math.floor(item.home_team / total * 100)
                            item.awayVal = 100 - item.homeVal
                        }
                    }
                    all[key] = { ...item }
                    return all
                }, {})
            }
            this.SET({ animationUrl: data.animeUrl, realMatchInfo: this.matchInfo })
            if (data.event) {
                this.handleEvents(data.event)
            }
        },
        async init () {
            try {
                const { data, code } = await getMatchStatics({
                    matchId: this.matchId,
                    roomId: this.roomId
                })
                if (code === statusCode.success) {
                    this.matchInfo = { ...data.matchInfo, homeRed: 0, homeYellow: 0, awayRed: 0, awayYellow: 0 }
                    if (data.statistics) {
                        this.statics = Object.keys(data.statistics).reduce((all, key) => {
                            const item = data.statistics[key]

                            if (key * 1 === 46 || key * 1 === 14 || key * 1 === 42) {
                                // 自身就有百分数的 直接复制
                                item.homeVal = parseInt(item.home_team)
                                item.awayVal = parseInt(item.away_team)
                            } else {
                                const homeTeam = item.home_team * 1
                                const awayTeam = item.away_team * 1
                                if (isNaN(homeTeam) || isNaN(awayTeam)) {
                                    item.hide = true
                                } else {
                                    const total = item.home_team * 1 + item.away_team * 1
                                    item.homeVal = Math.floor(item.home_team / total * 100)
                                    item.awayVal = 100 - item.homeVal
                                }
                            }
                            all[key] = { ...item }
                            return all
                        }, {})
                    }
                    this.SET({ animationUrl: data.animeUrl, realMatchInfo: this.matchInfo })
                    this.handleEvents(data.event)
                }
            } catch (e) {
                console.log(e, '错了')
            }
            return Promise.resolve()
        },
        handleEvents (event) {
            let homeRed = 0
            let homeYellow = 0
            let awayRed = 0
            let awayYellow = 0
            this.events = event.reduce((all, item) => {
                const icon = this.footballStaticsKinds.find(x => x.id === item.kind)
                all.push({
                    ...item,
                    icon: icon && icon.icon,
                    kind: icon
                })
                if (item.kind * 1 === 2) {
                    // 红牌
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeRed++
                    } else {
                        awayRed++
                    }
                } else if (item.kind * 1 === 3) {
                    // 黄牌
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeYellow++
                    } else {
                        awayYellow++
                    }
                    // eslint-disable-next-line eqeqeq
                } else if (item.kind == 9) { // 两黄变红
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeYellow++
                        homeRed++
                    } else {
                        awayYellow++
                        awayRed++
                    }
                }
                return all
            }, [])
            this.matchInfo.homeRed = homeRed
            this.matchInfo.homeYellow = homeYellow
            this.matchInfo.awayRed = awayRed
            this.matchInfo.awayYellow = awayYellow
        }
    }
}
</script>

<style lang="scss" scoped>
.info-box {
  border-radius: 5px;
}
.content {
  height: 500px;
  &.is-lineup {
    height: 900px;
  }
}
.buttons {
    border-bottom: 1px solid #FBA187;
    .button {
        width: 116px;
        height: 33px;
        color: #333;
        line-height: 33px;
        position: relative;
        &.is-active {
            color: #FBA187;
          &:after {
            position: absolute;
            width: 0;
            height: 0;
            left: calc(50% - 3px);
            top: calc(100% + 6px);
            content: "";
            border-right: 6px solid transparent;
            border-top: 6px solid transparent;
            border-left: 6px solid transparent;
            border-bottom: 6px solid #FBA187;
          }
        }
    }
}
.types {
    color: #999;
    width: 1200px;
    margin: 0 auto;
    .type {
        width: 130px;
        margin-bottom: 15px;
    }
    .icon {
        width: 15px;
        height: 15px;
    }
}
</style>
