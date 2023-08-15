<template>
  <div class="content font-14">
    <div class="info">
      <div class="flex justify-between align-center row header-row">
        <div class="left text-center">
          <CustomSpan content="皇家马德里" />
        </div>
        <span class="middle font-16 text-white text-center">1-1</span>
        <div class="right text-center">
          <CustomSpan content="马德里竞技" />
        </div>
      </div>
      <div class="row text-center bottom-border">
        <span>比赛结束</span>
      </div>
      <div class="exchange-and-shot">
        <div class="row flex justify-between align-center bottom-border">
          <div class="left text-right">皇家马德里</div>
          <div class="middle text-center">87'</div>
          <div class="right text-left visibility-hidden">马德里竞技</div>
        </div>
        <div class="row flex justify-between align-center bottom-border">
          <div class="left text-right visibility-hidden">皇家马德里</div>
          <div class="middle text-center">87'</div>
          <div class="right text-left">马德里竞技</div>
        </div>
        <div class="row flex justify-between align-center bottom-border">
          <div class="left text-right">皇家马德里</div>
          <div class="middle text-center">87'</div>
          <div class="right text-left visibility-hidden">马德里竞技</div>
        </div>
      </div>
    </div>
    <div class="statics">
      <template v-for="item in statics">
        <div v-if="!item.hide" class="row flex align-center justify-center" :key="item.event">
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
  </div>
</template>

<script>
// import { getMatchStatics } from '@/api/competition/competition'
import CustomSpan from '@/components/CustomSpan'
export default {
    name: 'BasketballScorePopover',
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
            statics: [],
            source: {
                '3': {
                    away_team: '7',
                    event: '射门次数',
                    home_team: '9'
                },
                '4': {
                    away_team: '3',
                    event: '射正次数',
                    home_team: '3'
                }
            }
        }
    },
    created () {
        // this.init()
        this.handleStatics()
    },
    methods: {
        async init () {
            try {
                // const res = await getMatchStatics(this.info.match_id)
            } catch (e) {
                console.log('出错了')
            }
        },
        handleStatics () {
            this.statics = Object.keys(this.source).reduce((all, key) => {
                const item = this.source[key]
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
    }
}
</script>

<style lang="scss" scoped>
.content {
  color: #ccc;
  background-color: rgba(0,63,103, 0.8);
  border-radius: 5px;
}
.row {
  line-height: 44px;
  height: 44px;
  &.header-row{
    height: 40px;
    line-height: 40px;
    background-color: #003F67;
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
}
::v-deep {
  .el-progress {
    width: 120px;
  }
}
</style>
