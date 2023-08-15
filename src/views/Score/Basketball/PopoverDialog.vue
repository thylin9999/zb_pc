<template>
  <el-popover
      width="400"
      placement="right"
      popper-class="score-row-popper"
      trigger="click"
      @hide="show=false"
      @show="getLineup"
  >
    <div class="content font-14 overflow-y-auto">
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
            <div class="statics" v-if="hasStatics">
              <p class="text-center text-ccc font-14 p-t-10 p-b-5">技术统计</p>
              <template v-for="item in statics">
                <div v-if="!item.hide" class="row flex align-center justify-center" :key="item.key">
                  <div class="left  cards flex align-center flex-end">
                    <span class="team-value m-r-5 d-inline-block font-12 font-medium font-500">{{ item.homeV }}</span>
                    <el-progress
                     class="is-reverse"
                     color="#FF5B5D"
                     define-back-color="#001E32"
                     :percentage="item.homeVal"
                     :show-text="false"></el-progress>
                  </div>
                  <div class="middle text-center justify-center text-333 flex align-center">
                    <span class="font-12 event-name  font-regular font-400">{{ item.title }}</span>
                  </div>
                  <div class="right cards flex align-center">
                    <el-progress
                    color="#FF5B5D"
                    define-back-color="#001E32"
                    :percentage="item.awayVal"
                    :show-text="false"></el-progress>
                    <span class="team-value m-l-5 d-inline-block font-12 font-medium font-500">{{ item.awayV }}</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
        slot="reference"
        class="value font-16 all-score text-333 flex flex-column align-center justify-center"
    >
      <span>{{ info.homeScore }}</span>
      <span class="m-t-15">{{ info.awayScore }}</span>
    </div>
  </el-popover>
</template>

<script>
import { getMatchStatics } from '@/api/competition/competition'
import CustomSpan from '@/components/CustomSpan'
import { isGoingCompetition, isEnd } from '@/utils/utils'
import { mapState } from 'vuex'
import { Loading } from 'element-ui'
import { isEmpty } from '@/utils/lodashUtil'
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
            OriginalStatistics: {},
            realTimeInfo: {}
        }
    },
    computed: {
        ...mapState('commonData', ['basketballStatics']),
        canShow () {
            return isGoingCompetition(this.info.state, 'basketball') || isEnd(this.info.state)
        },
        hasStatics () {
            return !isEmpty(this.OriginalStatistics)
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
                    matchId: this.info.matchId,
                    type: 'basketball'
                })
                this.show = true
                if (data) {
                    this.realTimeInfo = data.matchInfo
                    this.OriginalStatistics = data.statistics || {}
                    this.handleStatics()
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                loadingInstance.close()
            }
        },
        handleStatics () {
            this.statics = this.basketballStatics.reduce((all, item) => {
                const { key, title } = item
                const homeV = this.OriginalStatistics[`home${key}`] * 1 || 0
                const awayV = this.OriginalStatistics[`away${key}`] * 1 || 0
                const total = homeV + awayV
                const temp = {
                    key,
                    title: title,
                    awayV,
                    homeV,
                    homeVal: homeV / total * 100,
                    awayVal: awayV / total * 100
                }
                all.push({
                    ...temp
                })
                return all
            }, [])
        }
    }
}
</script>

<style lang="scss" scoped>
.all-score{
  height: 70px;
  color: #F7464E;
}

.content {
  color: #ccc;
  background-color: rgba(45, 39, 89, 0.9);
  border-radius: 5px;
  max-height: 300px;
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
