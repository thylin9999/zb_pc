<template>
<div class="basket-ball  m-t-15 wrap-1200 ">
    <div v-if="info" :key="updateTimeKey" class="abstract p-t-15 p-l-30 p-r-30 p-b-15 flex justify-between">
        <div class="team flex flex-column">
            <div class="flex w-100 align-center">
              <div class="team-logo bg-no-repeat bg-center bg-size-cover"
                   :style="{
                    backgroundImage: `url(${homeLogo})`
                }"
                  >
                  </div>
                <CustomSpan class="m-l-15 font-20 font-regular text-333 flex-1" :content="matchInfo.homeChs"/>
            </div>
            <div class="flex m-t-15 w-100 align-center">
              <div class="team-logo bg-no-repeat bg-center bg-size-cover"
                   :style="{
                    backgroundImage: `url(${awayLogo})`
                }"
                  >
                  </div>
                <CustomSpan class="m-l-15 font-20 font-regular text-333 flex-1" :content="matchInfo.awayChs"/>
            </div>
        </div>
        <div class="score-items flex flex-column justify-center">
            <div class="flex row font-16 font-regular text-999 text-center">
                <span class="first item">1st</span>
                <span class="second item">2nd</span>
                <span class="third item">3rd</span>
                <span class="forth item">4th</span>
                <template v-iof="info.overtimeCount">
                  <span class="item" v-for="i in info.overtimeCount" :key="`ot${i}`">
                    OT{{ i }}
                  </span>
                </template>
            </div>
            <div class="flex row font-20 m-t-5 font-regular text-333 text-center">
                <span class="first item">{{ info.home1 }}</span>
                <span class="second item">{{ info.home2 }}</span>
                <span class="third item">{{ info.home3 }}</span>
                <span class="forth item">{{ info.home4 }}</span>
                <template v-iof="info.overtimeCount">
                    <span class="item" v-for="i in info.overtimeCount" :key="`home-score${i}`">
                      {{ info[`homeOT${i}`]}}
                    </span>
                </template>
            </div>
            <div class="flex row font-20 m-t-5 font-regular text-333 text-center">
                <span class="first item">{{ info.away1 }}</span>
                <span class="second item">{{ info.away2 }}</span>
                <span class="third item">{{ info.away3 }}</span>
                <span class="forth item">{{ info.away4 }}</span>
                <template v-iof="info.overtimeCount">
                      <span class="item" v-for="i in info.overtimeCount" :key="`away-score${i}`">
                        {{ info[`awayOT${i}`]}}
                      </span>
                </template>
            </div>
        </div>
        <div class="flex flex-column justify-center score font-medium text-333">
            <span>{{ info.homeScore }}</span>
            <span>{{ info.awayScore }}</span>
        </div>
    </div>
    <div class="tabs m-t-15 bg-white">
        <div class="buttons flex p-t-15 p-b-20 align-center justify-center">
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
        <div class="content  m-t-20 m-b-30">
            <template>
                <Statics
                    v-if="activeTab === 3"
                    :match-id="matchId"
                    :players="players"
                    :home-logo="homeLogo"
                    :away-logo="awayLogo"
                />
                <TextLive
                    v-if="activeTab === 1"
                    :match-info="matchInfo"
                    :match-id="matchId"
                    :events="events"
                    :statics="statics"
                />
                <BasketballLineup
                    :home-logo="homeLogo"
                    :away-logo="awayLogo"
                    :match-id="matchId"
                    v-if="activeTab === 4"
                />
            </template>
        </div>
    </div>

</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
import { getMatchBasketball } from '@/api/competition/competition'
import BasketballLineup from '@/views/VirtualLiveRoom/Components/BasketballLineup'
import TextLive from '@/views/VirtualLiveRoom/Components/BasketballTextLive'
import Statics from '@/views/VirtualLiveRoom/Components/BasketballStatics'
import { statusCode } from '@/utils/statusCode'
import { mapMutations } from 'vuex'
export default {
    name: 'BasketballDetail',
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
    components: {
        CustomSpan,
        BasketballLineup,
        TextLive,
        Statics
    },
    data () {
        return {
            updateTimeKey: +new Date().getTime(),
            roomId: null,
            statics: [],
            activeTab: 4,
            buttons: [
                {
                    id: 1,
                    title: '文字直播',
                    key: 'text-living'
                },
                {
                    id: 3,
                    title: '球员统计',
                    key: 'statistics'
                },
                {
                    id: 4,
                    title: '阵容',
                    key: 'lineup'
                }
            ],
            events: [],
            defaultB: require('@/assets/images/home/card/basketball.png'),
            defaultF: require('@/assets/images/common/team-flag.png'),
            players: [],
            info: null
        }
    },
    computed: {
        homeLogo () {
            return this.matchInfo.homeLogo ? this.matchInfo.homeLogo : this.emptyLogo
        },
        awayLogo () {
            return this.matchInfo.awayLogo ? this.matchInfo.awayLogo : this.emptyLogo
        },
        emptyLogo () {
            return [this.defaultF, this.defaultB][this.matchInfo.leagueType - 1]
        }
    },
    watch: {
        matchInfo: {
            handler () {
                this.info = this.matchInfo
                this.updateTimeKey = +new Date().getTime()
            },
            immediate: true,
            deep: true
        }
    },
    created () {
        if (this.allData) {
            this.handleData()
        }
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        changeButton (button) {
            this.activeTab = button.id
        },
        refreshPage () {

        },
        async init () {
            try {
                const { data, code } = await getMatchBasketball(this.matchId)
                if (code === statusCode.success && data) {
                    this.info = { ...data.matchInfo }
                    this.SET({ animationUrl: data.animeUrl })
                    this.handleStatics(data)
                }
            } catch (e) {
                console.log(e, '错了')
            }
        },
        handleData () {
            const data = this.allData
            this.SET({ animationUrl: data.animeUrl })
            this.handleStatics(data)
        },
        handleStatics (data) {
            const teams = ['home', 'away']
            let homeData, awayData
            teams.forEach(key => {
                const params = {
                    name: data.matchInfo[`${key}Chs`],
                    score: data[`${key}Score`],
                    logo: this[`${key}Logo`],
                    players: data[`${key}PlayerList`]
                }
                if (key === 'home') {
                    homeData = { ...params }
                } else {
                    awayData = { ...params }
                }
            })
            this.players = [homeData, awayData]
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 300px;
}
.abstract{
    border-radius: 10px 10px 0 0;
    background-color: #fff;
    .score-items{
        .row {
            line-height: 22px;
        }
        .item {
            width: 50px;
        }
    }
    .score {
        font-size: 35px;
    }
}

.team {
    width: 700px;
}
.team-logo{
  width: 40px;
  height: 40px;
  background-color: #D8D8D8;
  border-radius: 50%;
}

.statics{
    border-radius: 0px 0px 10px 10px;
    height: 130px;
    background-color: #003F67;
    .row {
        .left, .right {
            width: calc(50% - 65px);
        }
        .middle {
            font-size: 22px;
            line-height: 33px;
            .team-value{
                width: 40px;
            }
            .event-name{
                width: 110px;
            }
        }
    }
    .static-span {
        width: 113px;
        height: 34px;
        line-height: 34px;
        background: #6CCEFF;
        border-radius: 17px;
    }

    .left-stop {
        left: 35px;
        top: 24px;
    }
    .right-stop{
        right: 40px;
        top: 24px;
    }
    .left-rule{
        left: 35px;
        bottom: 24px;
    }
    .right-rule{
        right: 40px;
        bottom: 24px;
    }
}

.tabs {
  border-radius: 5px;
  .buttons {
    border-bottom: 1px solid #A4DCFF;
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
}
</style>
