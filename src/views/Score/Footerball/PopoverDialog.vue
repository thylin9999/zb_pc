<template>
  <el-popover
      width="400"
      placement="right"
      popper-class="score-row-popper"
      trigger="hover"
      @hide="show=false"
      @show="getLineup"
  >
    <div class="content font-12 ">
      <div class="info">
        <div class="flex justify-between align-center row header-row">
          <div class="left text-center">
            <CustomSpan :content="realTimeInfo.homeChs" />
          </div>
          <span class="middle font-16 text-white text-center">{{ realTimeInfo.homeScore }} - {{ realTimeInfo.awayScore }}</span>
          <div class="right text-center">
            <CustomSpan :content="realTimeInfo.awayChs" />
          </div>
        </div>
        <div  class="loading-box">
          <template >
            <div class="row text-center bottom-border">
              <span>比赛结束</span>
            </div>
            <div class="exchange-and-shot overflow-y-auto show-scrollbar">
              <template
                  v-for="event in events"
              >
                <div :key="event.id" class="row flex justify-between align-center bottom-border">
                  <div
                      :class="{
                        'visibility-hidden': !event.isHome
                      }"
                      class="left text-right flex align-center flex-end">
                    <CustomSpan class="name flex-1" :content="event.nameChs"/>
                    <span
                        v-if="event.icon"
                        class="icon d-inline-block m-l-5 m-r-5 bg-center bg-no-repeat bg-size-100"
                        v-lazy:background-image="require(`../../../assets/images/live-room/statics/${event.icon}.png`)"
                    ></span>
                  </div>
                  <div class="middle text-center">{{ event.time }}'</div>
                  <div
                      :class="{
                        'visibility-hidden': event.isHome
                      }"
                      class="right text-left flex align-center"
                  >
                <span
                    v-if="event.icon"
                    class="icon d-inline-block m-l-5 m-r-5 bg-center bg-no-repeat bg-size-100"
                    v-lazy:background-image="require(`../../../assets/images/live-room/statics/${event.icon}.png`)"
                ></span>
                    <CustomSpan class="name flex-1" :content="event.nameChs"/>
                  </div>
                </div>
              </template>
            </div>
            <div class="row text-center bottom-border">
              <span>比赛开始</span>
            </div>
            <div class="statics ">
              <template v-for="(item) in statics">
                <div v-if="!item.hide && showIds.includes(item.key)" class="row flex align-center justify-center" :key="item.event">
                  <div class="left  cards flex align-center flex-end">
                    <span class="team-value m-r-5 d-inline-block font-12 font-medium font-500">{{ item.home_team }}</span>
                    <el-progress class="is-reverse" color="#FF5B5D" :percentage="item.homeVal" :show-text="false"></el-progress>
                  </div>
                  <div class="middle text-center justify-center text-333 flex align-center">
                    <span class="font-12 event-name  font-regular font-400">{{ item.event }}</span>
                  </div>
                  <div class="right cards flex align-center">
                    <el-progress :percentage="item.awayVal" :show-text="false"></el-progress>
                    <span class="team-value m-l-5 d-inline-block font-12 font-medium font-500">{{ item.away_team }}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div slot="reference" class="score-column flex align-center justify-center font-14"
         :class="{
            'red': info.status !== 2
         }"
    >
      <span class="score-num text-right">{{ info.homeScore }}</span>
      <span class="line m-l-5 m-r-5">-</span>
      <span class="score-num text-left">{{ info.awayScore }}</span>
    </div>
  </el-popover>
</template>

<script>
import { getMatchStatics } from '@/api/competition/competition'
import CustomSpan from '@/components/CustomSpan'

import { isGoingCompetition, isEnd } from '@/utils/utils'
import { mapState } from 'vuex'
import { Loading } from 'element-ui'
export default {
    name: 'PopoverDialog',
    components: {
        CustomSpan
    },
    props: {
        info: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            show: false,
            statics: [],
            events: [],
            OriginalStatistics: [],
            showIds: [43, 44, 14, 4, 3, 6, 11, 5],
            realTimeInfo: {}
        }
    },
    computed: {
        ...mapState('commonData', ['footballStaticsKinds']),
        canShow () {
            return isGoingCompetition(this.info.state) || isEnd(this.info.state)
        }
    },
    methods: {
        async getLineup () {
            this.realTimeInfo = this.info
            if (!this.canShow) {
                return
            }
            const loadingInstance = Loading.service({
                target: '.content',
                background: 'rgba(0,0,0,0.5)'
            })
            try {
                const { data } = await getMatchStatics({
                    matchId: this.info.matchId
                })
                this.show = true
                if (data) {
                    this.realTimeInfo = data.matchInfo
                    this.OriginalStatistics = data.statistics || []
                    this.handleStatics()
                    this.handleEvents(data.event || [])
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                loadingInstance.close()
            }
        },
        handleStatics () {
            this.statics = Object.keys(this.OriginalStatistics).reduce((all, key) => {
                const item = this.OriginalStatistics[key]
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
                all[key] = { ...item, key: key * 1 }
                return all
            }, {})
        },
        handleEvents (event) {
            this.events = event.reduce((all, item) => {
                const icon = this.footballStaticsKinds.find(x => x.id === item.kind)
                all.push({
                    ...item,
                    icon: icon && icon.icon,
                    kind: icon
                })
                return all
            }, [])
        }
    }
}
</script>

<style lang="scss" scoped>
.score-column{
  font-size: 18px;
  font-weight: 800;
  .score-num {
    display: inline-block;
    width: calc(50% - 10px);
  }
  &.red {
    color: #F7464E;
  }
}

.content {
  color: #ccc;
  background-color: rgba(45, 39, 89, 0.9);
  border-radius: 5px;
  min-height: 50px;
  overflow: hidden;
}
.exchange-and-shot {
  max-height: 150px;
}
.row {
  line-height: 44px;
  height: 44px;
  &.header-row{
    height: 40px;
    line-height: 40px;
    background-color: #161047;
  }
  &.bottom-border{
    border-bottom: 1px solid #A4DCFF;
  }
  .left, .right {
    width: calc(50% - 40px);
    .team-value{
      line-height: 17px;
    }
  }
  .middle {
    width: 80px;
    .event-name{
      color: #ccc;
    }
  }
  .icon {
    width: 15px;
    height: 15px;
  }
}
::v-deep {
  .el-progress {
    width: 120px;
  }
}
</style>
