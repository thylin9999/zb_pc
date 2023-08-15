<template>
    <div class="w-100 h-100">
        <div class="types">
          <span>类别：</span>
          <el-radio-group text-color="#FBA187"  v-model="leagueType" @change="changeType">
            <el-radio-button :label="1">足球</el-radio-button>
            <el-radio-button :label="2">篮球</el-radio-button>
          </el-radio-group>
        </div>
        <div class="table p-t-15" :key="updateKey">
          <div class="header row font-14 text-333 font-500 text-center">
            <div class="competition-title battle-title table-right-border">赛事</div>
            <div class="time competition-title table-right-border">比赛时间</div>
            <div class="battle-info battle-item table-right-border">主队VS客队</div>
            <div class="item1 battle-item table-right-border">
              <span class="d-inline-block w-100 table-bottom-border">{{ isFootball ? '胜负平' : '胜负'}}</span>
              <div class="ul flex align-center ">
                <div class="item table-right-border">主胜</div>
                <div v-if="isFootball" class="item table-right-border">平局</div>
                <div class="item ">客胜</div>
              </div>
            </div>
            <div class="item2 battle-item table-right-border">
                <span class="d-inline-block w-100 table-bottom-border">{{ isFootball ? '让球' : '让分'}}</span>
                <div class="ul flex align-center">
                  <div class="item table-right-border">主胜</div>
<!--                  <div class="item table-right-border">让1</div>-->
                  <div class="item">客胜</div>
                </div>
            </div>
            <div class="item3 battle-item ">
              <span class="d-inline-block w-100 table-bottom-border">{{ isFootball ? '大小球' : '大小分'}}</span>
              <div class="ul flex align-center">
                <div class="item table-right-border">大</div>
<!--                <div class="item table-right-border">1/1.5</div>-->
                <div class="item ">小</div>
              </div>
            </div>
          </div>
          <template
              v-for="date in dates"
          >
            <OddsRow
                :date="date"
                :key="date.id"
                :type="leagueType"
                :select-id.sync="selectId"
                @choseRate="choseRate"
            />
          </template>
        </div>
        <div class="footer p-t-30 text-right p-b-30">
          <el-button type="info" @click="reset">重置</el-button>
          <el-button class="confirm" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script>
import OddsRow from '@/views/ExpertCenter/Components/OddsRow'
import dayjs from 'dayjs'
import { weekDay } from '@/utils/utils'
import isEmpty from 'lodash.isempty'
import { Message } from 'element-ui'

const isoweek = require('dayjs/plugin/isoWeek')
export default {
    name: 'Solution1',
    props: {
        initLeague: {
            type: [Number, String],
            default: ''
        },
        initInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        OddsRow
    },
    data () {
        return {
            leagueType: 1,
            // '2023-04-30@2222535@1@1' ['2023-04-30', '2222535', '1', '1'] , 日期，比赛id, 胜平负 1， 让分2，大小3 ，[1,2,3] 分别对应选中了玩法的哪一个
            selectId: '',
            list: [
                {
                    id: 1,
                    title: '英超',
                    time: '02-19 12:30',
                    battle: '诺维奇vs雷丁',
                    isSelect: false,
                    rate: 1.86
                },
                {
                    id: 2,
                    title: '英超',
                    time: '02-19 12:30',
                    battle: '诺维奇vs雷丁',
                    isSelect: false,
                    rate: 1.86
                }
            ],
            selectInfo: null,
            updateKey: +new Date().getTime()
        }
    },
    created () {
        dayjs.extend(isoweek)
        this.generateDates()
    },
    computed: {
        isFootball () {
            return this.leagueType === 1
        }
    },
    methods: {
        changeType () {
            this.selectId = ''
            this.$emit('update:initLeague', this.leagueType)
        },
        generateDates () {
            if (!isEmpty(this.initInfo)) {
                this.selectId = this.initInfo.id
                this.selectInfo = this.initInfo
            }
            this.leagueType = this.initLeague || 1
            const today = dayjs().format('YYYY-MM-DD')
            const tomorrow = dayjs(today).add(1, 'day').format('YYYY-MM-DD')
            const thirdDay = dayjs(tomorrow).add(1, 'day').format('YYYY-MM-DD')
            this.dates = [
                {
                    id: today,
                    week: weekDay[dayjs(today).isoWeekday()]
                },
                {
                    id: tomorrow,
                    week: weekDay[dayjs(tomorrow).isoWeekday()]
                },
                {
                    id: thirdDay,
                    week: weekDay[dayjs(thirdDay).isoWeekday()]
                }
            ]
        },
        choseRate ({ id, match }) {
            this.selectInfo = {
                id,
                match
            }
        },
        confirm () {
            if (!this.selectId) {
                Message.info('请选择方案！')
                return
            }
            this.$emit('setSelectInfo', this.selectInfo)
            this.$emit('update:isFirst', false)
        },
        reset () {
            this.list.forEach(item => {
                item.isSelect = false
            })
            this.updateKey = +new Date().getTime()
            this.leagueType = 1
            this.selectId = ''
        }
    }
}

</script>

<style lang="scss" scoped>
.row {
  display: flex;
  line-height: 30px;

  border-radius: 10px;
  overflow: hidden;
  background-color: #FFFCFA;
  .competition-title {
    width: 110px;
  }
  .battle-item{
    flex: 1;
    .item {
      flex: 1;
    }
  }
}
.list {
  .row-content {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    line-height: 40px;
    border: 1px solid #D8D8D8;
    &:last-child {
      border-bottom: none;
    }
    .row {
      border-radius: 0;
      line-height: 40px;
    }
  }
  .battle-item {
    .item {
      cursor: pointer;
      &:hover, &.is-active {
        background-color: #FBA187;
        color: #fff;
      }
    }
  }
}
.header {
  .battle-title, .battle-info, .time{
    line-height: 60px;
  }
  &.row {
    border: 1px solid #D8D8D8;
  }
}

.footer {
  right: 25px;
  bottom: 25px;
  .el-button {
    width: 100px;
  }
  .confirm {
      background-color: #A05A77;
      color: #fff;
      &:hover {
          opacity: 0.9;
      }
  }
}
::v-deep {
  .el-radio-button__inner {
      border: 1px solid #D8D8D8;
      background-color: transparent!important;
      padding: 5px 20px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    border: 1px solid #FBA187;
    box-shadow: none;
  }

}
</style>
