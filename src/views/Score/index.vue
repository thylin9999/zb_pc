<template>
<div class="score-box wrap-1200 p-b-30"  :class="{
        'is-fixed': fixed,
        'is-time-tab': showTab
      }">
    <div class="fix-items " id="fixedItems">
      <div class="header w-100 p-t-20 flex justify-between align-center">
        <CompetitionStatus
            :competition-status.sync="competitionStatus"
            @updateDay="updateDay"
        />
        <div class="right-buttons flex align-center">
          <LeagueSelect
              :league-type="scoreActiveLeague"
              :leagues.sync="leagues"
              :day="day"
          />
          <VoiceChose
              :league-type="scoreActiveLeague"
          />
          <span  class="font-20 settings pointer m-l-10">
               <el-popover
                   width="400"
                   placement="bottom"
                   popper-class="league-popper"
                   :visible-arrow="false"
                   trigger="click">
                 <div class="settings-body">
                   <div class="header w-100 flex text-white justify-around align-center">
                      {{ titleString }}
                  </div>
                   <div class="body p-l-15 p-r-15 p-t-20 p-b-20">

                     <div class="flex justify-between align-center">
                       <span class="label d-inline-block font-14 font-regular text-999">语言选择</span>
                       <div class="flex-1">
                           <el-radio-group
                            size="mini"
                            v-model="languageType"
                            fill="#A05A77"
                            @change="changeLanguage">
                            <el-radio-button
                                class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                                label="zh"
                            >简体</el-radio-button>
                             <el-radio-button
                                 class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                                 label="tw"
                             >繁体</el-radio-button>
                            <el-radio-button
                                class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                                label="en">英文</el-radio-button>
                          </el-radio-group>
                       </div>
                     </div>
                     <div v-if="isFootball" class="flex justify-between align-center">
                       <span class="label d-inline-block font-14 font-regular text-999">比赛信息</span>
                       <div class="flex-1">
                         <el-checkbox-group
                             v-model="showCards"
                         >
                        <el-checkbox
                            class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                            label="red"
                        >红牌</el-checkbox>
                             <el-checkbox
                                 class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                                 label="yellow"
                             >黄牌</el-checkbox>
                       </el-checkbox-group>
                       </div>
                     </div>
                     <div v-if="isFootball" class="flex justify-between align-center">
                       <span class="label d-inline-block font-14 font-regular text-999">事件提示</span>
                       <div class="flex-1">
                         <el-checkbox-group
                             v-model="showTipTypes"
                             @change="changeTipType"
                         >
                          <el-checkbox
                              class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                              label="goal"
                          >进球</el-checkbox>
                              <el-checkbox
                                  class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                                  label="card"
                              >红黄牌</el-checkbox>
                        </el-checkbox-group>
                       </div>
                     </div>
                     <!--                     <div class="flex visibility-hidden justify-between align-center">-->
                     <!--                       <span class="label d-inline-block font-14 font-regular text-999">排序规则</span>-->
                     <!--                       <div class="flex-1">-->
                     <!--                           <el-radio-group size="mini" v-model="sort" >-->
                     <!--                            <el-radio-button-->
                     <!--                                class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"-->
                     <!--                                label="time"-->
                     <!--                            >按时间</el-radio-button>-->
                     <!--                             <el-radio-button-->
                     <!--                                 class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"-->
                     <!--                                 label="league"-->
                     <!--                             >按联赛</el-radio-button>-->
                     <!--                          </el-radio-group>-->
                     <!--                       </div>-->
                     <!--                     </div>-->
                   </div>
                 </div>
                   <span slot="reference">
                       <span class="flex align-center justify-center setting-box">
                           <IconPng  icon="icons/settings" :width="18" :height="18" />
                            <span class="font-16 m-l-5 text-ccc font-400">设置</span>
                       </span>
                   </span>
               </el-popover>

            </span>
        </div>
      </div>
      <div class="banner w-100 m-t-15 bg-size-cover bg-size-cover bg-no-repeat"
           :style="{
              backgroundImage: `url(${bgUrl})`
      }"
      >
      </div>
      <ScoreTimeLine
          v-if="showTab"
          :key="competitionStatus"
          :is-course="isCourse"
          :day.sync="day"
      />
      <div v-if="isFootball" class="table-header font-14 font-400">
        <div class="text-center header-row w-100 flex">
          <span class="leagueChsShort">赛事</span>
          <span class="time">时间</span>
          <span class="status">状态</span>
          <span class="home-team p-l-10 p-r-10 text-right">主队</span>
          <span class="score">比分</span>
          <span class="away-team p-l-10 p-r-10 text-left">客队</span>
          <span class="half">半场</span>
          <span class="corner">角球</span>
          <span class="liveHost">直播</span>
          <span class="operations">操作</span>
        </div>
      </div>
    </div>
    <div class="bg-white">
      <div class="score-table"
           :class="{
            'has-tab': showTab
          }"
      >
        <component
            :show-cards="showCards"
            :is="tableName"
            :show-tab="showTab"
            :leagues="leagues"
            :tab-type="competitionStatus"
            :day="day"
            :language="languageType"
            @calcOffset="calcOffset"
        ></component>
      </div>
      <div class="footer m-t-30 p-l-10 p-r-10">
        <IconWithTextGroup :types="scoreIcons"/>
      </div>
      <div v-if="competitionStatus === 1" class="side-bar-status">
        <ul class="list">
          <li
              v-for="item in positions"
              :key="item.id"
              class="pointer"
              :class="{
              'is-active': showId === item.key,
              'not-allowed': !item.exit
            }"
              @click="goToPart(item)"
          >
            <div class="d-inline-block item w-100 h-100 flex align-center justify-center" :href="`#${item.key}`">
              <hover-icon
                  :is-active="showId === item.key"
                  :icon="item.icon"
              />
            </div>
          </li>
        </ul>
        <div class="m-t-20  pointer top" v-show="showTop" @click="goTop">
            <hover-icon
                icon="common/icon-top"
            />
        </div>
      </div>
      <ul class="show-hide-bars">
        <li
            v-for="item in  showHideBars"
            :key="item.id"
            @click="choseBar(item)"
            :class="{
          'is-active': currentBar === item.type
        }"
            class="item pointer flex flex-column align-center justify-center">
          <i class="iconfont" :class="`${item.icon}`"></i>
          <span class="font-14">{{  item.title  }}</span>
        </li>
      </ul>
    </div>
</div>
</template>

<script>
import CompetitionStatus from '@/views/Score/components/CompetitionStatus'
import LeagueSelect from '@/views/Score/components/LeagueSelect'
import VoiceChose from '@/views/Score/components/VoiceChose'
import FootballTable from '@/views/Score/Footerball/index'
import BasketballTable from '@/views/Score/Basketball'
import ScoreTimeLine from '@/views/Score/components/ScoreTimeLine'
import IconWithTextGroup from '@/components/IconWithTextGroup'
import HoverIcon from '../../components/HoverIcon.vue'
import dayjs from 'dayjs'
import { getEvents } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'
import { mapMutations, mapState } from 'vuex'
import IconPng from '@/components/IconPng.vue'
import ScoreWs from '@/utils/scoreWs'

export default {
    name: 'index',
    components: {
        IconPng,
        IconWithTextGroup,
        CompetitionStatus,
        LeagueSelect,
        VoiceChose,
        FootballTable,
        BasketballTable,
        ScoreTimeLine,
        HoverIcon
    },
    data () {
        return {
            bgUrl: '',
            sort: 'time',
            languageType: 'zh',
            showCards: ['red', 'yellow'],
            scoreActiveLeague: 1, // 默认是足球
            tableComps: {
                1: 'FootballTable',
                2: 'BasketballTable'
            },
            competitionStatus: 1, // 即时
            leagues: [],
            day: dayjs().format('YYYY-MM-DD'),
            maxTop: 0,
            fixed: false,
            positions: [
                {
                    id: 1,
                    key: 'isGoing',
                    icon: 'score/icons/going',
                    title: '进行中',
                    exit: true
                },
                {
                    id: 2,
                    key: 'isFuture',
                    icon: 'score/icons/future',
                    title: '未开',
                    exit: true
                },
                {
                    id: 3,
                    key: 'isEnd',
                    icon: 'score/icons/end',
                    title: '完场',
                    exit: true
                },
                {
                    id: 4,
                    key: 'warning',
                    icon: 'score/icons/warn',
                    title: '异常',
                    exit: true
                }
            ],
            showId: null,
            navOffsets: [],
            hasThirdLeague: false,
            showTipTypes: ['goal', 'card'],
            showHideBars: [
                {
                    id: 1,
                    title: '保留',
                    icon: 'icon-danxuan_xuanzhong',
                    type: 'store'
                },
                {
                    id: 2,
                    title: '隐藏',
                    icon: 'icon-yincang',
                    type: 'hide'
                },
                {
                    id: 3,
                    title: '显示',
                    icon: 'icon-xianshikejian',
                    type: 'show'
                }
            ],
            currentBar: '',
            showTop: false
        }
    },
    computed: {
        ...mapState('commonData', ['scoreIcons']),
        ...mapState('voice', ['playStatus']),
        titleString () {
            return this.isFootball ? '足球比分设置' : '篮球比分设置'
        },
        tableName () {
            return this.tableComps[this.scoreActiveLeague]
        },
        showTab () {
            return [2, 3].includes(this.competitionStatus)
        },
        isCourse () {
            return this.competitionStatus === 2
        },
        isFootball () {
            // eslint-disable-next-line eqeqeq
            return this.scoreActiveLeague == 1
        }
    },
    watch: {
        '$route': {
            handler () {
                this.choseBar({ type: '' })
                const { scoreLeague } = this.$route.query
                this.scoreActiveLeague = scoreLeague || 1
                this.navOffsets = []
                this.showId = null
            },
            immediate: true,
            deep: true
        }
    },
    created () {
        this.getImage()
        // 比分页面才初始化ws
        this.initWs()
    },
    mounted () {
        this.initScroll()
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        calcOffset () {
            // 找出高亮的状态
            setTimeout(() => {
                this.handleNavStatus()
                // this.handleFixedItems()
            }, 2000)
        },
        handleNavStatus () {
            this.positions.forEach(item => {
                const id = item.key
                const el = document.getElementById(id)
                if (el) {
                    item.exit = true
                    // offsetTop值一值在变化
                    this.navOffsets.push({ id, value: el.offsetTop })
                } else {
                    item.exit = false
                }
            })
            let i = 0
            while (i < this.positions.length) {
                const item = this.positions[i]
                if (item.exit) {
                    this.showId = item.key
                    return
                }
                i++
            }
        },
        updateDay () {
            this.day = dayjs().format('YYYY-MM-DD')
            this.choseBar({ type: '' })
        },
        changeLanguage () {
            console.log(this.languageType, 'languageType')
        },
        async getImage () { // 热门赛程下方的banner图
            try {
                const { data, code } = await getEvents(5)
                if (code === statusCode.success) {
                    this.bgUrl = data.length && data[0].pic_url
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        initScroll () {
            // 获取offset
            const fixedItems = document.getElementById('fixedItems')
            this.maxTop = fixedItems.offsetTop
            window.addEventListener('scroll', this.handleFixedItems)
        },
        handleFixedItems () {
            const scrollTop = document.documentElement.scrollTop
            this.fixed = scrollTop > this.maxTop
            this.showTop = document.documentElement.scrollTop > 60
        },
        goToPart (item) {
            if (!item.exit) {
                return
            }
            this.showId = item.key
            const el = document.getElementById(`${this.showId}`)
            const offsetTop = el.offsetTop
            document.documentElement.scrollTo({
                top: offsetTop - 220,
                behavior: 'smooth'
            })
        },
        changeTipType () {
            this.SET({ showTipType: this.showTipTypes })
        },
        choseBar (bar) {
            this.currentBar = this.currentBar === bar.type ? '' : bar.type
            this.SET({ showHideType: this.currentBar })
        },
        initWs () {
            ScoreWs.initScoreWs()
        },
        goTop () {
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    },
    beforeDestroy () {
        ScoreWs.closeWs()
        window.removeEventListener('scroll', this.handleFixedItems)
    }
}
</script>

<style lang="scss" scoped>
.score-box{
  .score-table {
  }
  &.is-fixed {
    padding-top: 200px;
    .fix-items {
      background-color: #F3F5F9;
      z-index: 999;
      width: 1200px;
      position: fixed;
      margin: 0 auto;
      top: 0;
    }
  }
  &.is-fixed.is-time-tab {
    padding-top: 260px;
  }
  .table-header {
    background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
    font-size: 16px;
    color: #fff;
    line-height: 40px;
    padding-left: 35px;
    span {
      display: inline-block;
    }
    .header-row {
      .leagueChsShort {
        padding-left: 20px;
        width: 170px;
      }
      .time, .score {
        width: 100px;
      }
      .status{
        width: 110px;
      }
      .home-team  {
        width: 180px;
      }
      .away-team {
        width: 160px;
      }
      .half {
        width: 75px;
      }
      .corner{
        width: 80px;
      }
      .liveHost {
        width: 160px;
      }
      .operations {
        width: 50px;
      }
    }
  }
}
.banner {
    height: 100px;
    background: #003F67;
    border-radius: 10px 10px 0px 0px;
}
.right-buttons {
  width: 244px;
  height: 32px;
  background: #FFFFFF;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
  border-radius: 3px;
  position: relative;
  &:before, &:after {
    position: absolute;
    content: '';
    height: 22px;
    width: 1px;
    top: 5px;
    background-color: #CCCCCC;
  }
  &:before {
    left: 71px;
  }
  &:after {
    right: 79px;
  }
  .setting-box {
    width: 78px;
  }
  .settings svg {
      fill: #ccc;
  }
  .button {
    height: 26px;
    line-height: 26px;
  }
}
.settings-body {
  width: 360px;
  .header {
    height: 38px;
    background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
  }
  .body {
    .label {
      width: 100px;
    }
  }
}
.show-hide-bars{
  position: fixed;
  top: 250px;
  left: 50%;
  margin-left: -665px;
  z-index: 998;
  overflow: hidden;
  box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.3);
  border-radius: 10px;
  li {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #e9e9e9;
    font-size: 16px;
    .item {
      text-decoration: none;
      text-align: center;
      line-height: 60px;
    }
    .iconfont {
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: #dbdbdb;
    }
    &:hover, &.is-active {
      background-color: #FEF2E4;
      color: #A05A77;
      .iconfont {
        color: #A05A77;
      }
    }
  }
}
.side-bar-status {
  position: fixed;
  top: 250px;
  left: 50%;
  margin-left: 610px;
  z-index: 998;

  .list {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.3);
  }
  li {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #e9e9e9;
    .item {
      text-decoration: none;
      text-align: center;
      line-height: 60px;
    }
    .text {
      font-size: 12px;
      display: none;
      color: #dbdbdb;
    }
    .iconfont {
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: #dbdbdb;
    }
    &:hover, &.is-active {
      background-color: #FEF2E4;
      .iconfont {
        display: none;
      }
      .text {
        display: inline-block;
        color: #837d7d;
      }
    }
  }
  .top {
    width: 50px;
    height: 50px;
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.3);
    border-radius: 10px;
    &:hover {
      background-color: #FEF2E4;
    }
  }
}
</style>
