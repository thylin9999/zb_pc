<template>
<div class="">
    <div class="buttons flex p-t-15 align-center justify-center">
        <template v-for="button in buttons">
            <span
                :Key="button.id"
                class="pointer button m-r-5 m-l-5 font-14 text-center font-500 font-medium"
                :class="{
                    'is-active': button.id === activeTab
                }"
                @click="changeButton(button)">{{ button.title }}</span>
        </template>
    </div>
    <div class="content m-t-20 m-b-30">
        <template v-if="matchInfo">
            <Statics
                v-if="activeTab === 3"
                :match-info="matchInfo"
                :match-id="matchId"
                :statics="statics"
            />
            <CompetitionEvents
                v-if="activeTab === 2"
                :match-info="matchInfo"
                :match-id="matchId"
                :events="events"
                :statics="statics"
            />
            <TextLive
                v-if="activeTab === 1"
                :match-info="matchInfo"
                :match-id="matchId"
                :events="events"
                :statics="statics"
            />
        </template>
    </div>
    <div class="footer">
        <ul class="types flex flex-wrap">
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
import Statics from '@/views/LiveRoom/Components/FootballStatics/Statics'
import CompetitionEvents from '@/views/LiveRoom/Components/FootballStatics/CompetitionEvents'
import TextLive from '@/views/LiveRoom/Components/FootballStatics/TextLive'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'FootballMatchStatics',
    components: {
        Statics,
        CompetitionEvents,
        TextLive
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            roomId: null,
            activeTab: 3,
            matchInfo: null,
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
                }
            ]
        }
    },
    created () {
        this.roomId = this.$route.query.room_id
        this.init()
    },
    computed: {
        ...mapState('commonData', ['footballStaticsKinds'])
    },
    methods: {
        changeButton (button) {
            this.activeTab = button.id
        },
        async init () {
            try {
                const { data, code } = await getMatchStatics({
                    matchId: this.matchId,
                    roomId: this.roomId
                })
                if (code === statusCode.success) {
                    this.matchInfo = { ...data.match_info, homeRed: 0, homeYellow: 0, awayRed: 0, awayYellow: 0 }
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
                    this.handleEvents(data.event)
                }
            } catch (e) {
                console.log(e, '错了')
            }
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
.buttons {
    .button {
        width: 116px;
        height: 33px;
        background: #FEF2E4;
        border-radius: 3px;
        color: #B7B7B7;
        line-height: 33px;
        &.is-active {
            background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
            color: #fff;
        }
    }
}
.types {
    color: #999;
    width: 520px;
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
