<template>
  <div class="table h-100 overflow-y-auto">
<!--    <span @click="test">点我</span>-->
   <el-checkbox-group v-model="selectedIds">
        <div class="min-h-300 font-14 h-100 overflow-y-auto" v-loading="loading || gettingLeagues">
        <template v-for="(item, index) in showCaches">
            <template v-if="showIds.includes(item.matchId)">
                <FootballRow
                    :key="item.updateKey"
                    :row="item"
                    :show-strip="index % 2 === 0"
                    :type="item.type"
                    :language="language"
                    :is-collect="isCollect"
                    :show-cards="showCards"
                    @refresh="fetchData"
                >
                    <template #selection>
                        <el-checkbox :label="item.matchId" :key="item.matchId"></el-checkbox>
                    </template>
                </FootballRow>
            </template>
        </template>
        <template
            v-for="row in  titleRows"
        >
            <template v-if="showData[row.type] && showData[row.type].length">
              <div
                  v-if="showLabel"
                  :key="row.type + 'title'" :id="row.type"
                  class="flex section-title align-center m-t-15 m-b-15 justify-center"
                  :class="row.type"
              >
                  <template v-if="['isGoing', 'isFuture', 'isEnd'].includes(row.type)">
                      <template v-if="row.type === 'isGoing'">
                          <img :src="isGoingIcon" class="goingIcon">
                      </template>
                      <template v-if="row.type === 'isFuture'">
                          <img :src="isFutureIcon" class="futureIcon m-r-5">
                      </template>
                      <template v-if="row.type === 'isEnd'">
                          <img  :src="isEndIcon" class="endIcon m-r-5">
                      </template>
                  </template>
                  <i v-else class="iconfont font-20" :class="row.iconfont"></i>
                  <span class="font-16 font-regular font-400 ">{{ row.title }}</span>
              </div>
              <div :key="row.type" class="row-box">
                  <template v-for="(item, index) in showData[row.type]">
                      <FootballRow
                          :key="item.updateKey"
                          :show-strip="index % 2 === 0"
                          :row="item"
                          :type="row.type"
                          :language="language"
                          :is-collect="isCollect"
                          :show-cards="showCards"
                          @refresh="fetchData"
                      >
                      <template #selection>
                          <el-checkbox :label="item.matchId" :key="item.matchId"></el-checkbox>
                      </template>
                      </FootballRow>
                  </template>
              </div>
            </template>
        </template>
            <no-data  v-if="!loading && !list.length && !gettingLeagues"/>
        </div>
   </el-checkbox-group>

  </div>
</template>

<script>
import FootballRow from '@/views/Score/Footerball/FootballRow'
import { getCollectList, getMatchList } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { isEnd, isGoingCompetition, matchStatus } from '@/utils/utils'
import { getItem } from '@/utils/cookie'
import { mapMutations, mapState } from 'vuex'
import ScoreWs from '@/utils/scoreWs'
import { notification } from '@/utils/msgDialog'
import NoData from '@/components/NoData.vue'
export default {
    name: 'FootballTable',
    props: {
        showTab: {
            type: Boolean,
            default: true
        },
        tabType: {
            type: [Number, String],
            default: 1
        },
        day: {
            type: String,
            default: null
        },
        leagues: {
            type: Array,
            default: () => []
        },
        language: {
            type: String,
            default: 'zh'
        },
        showCards: {
            type: Array,
            default: () => []
        }

    },
    components: {
        NoData,
        FootballRow
    },
    data () {
        return {
            loading: false,
            list: [],
            allData: {},
            isGoingIcon: require('../../../assets/images/score/going.gif'),
            isFutureIcon: require('../../../assets/images/score/future.gif'),
            isEndIcon: require('../../../assets/images/score/end.gif'),
            rows: {
                'aa': {
                    id: 'aa',
                    type: 'isGoing',
                    icon: 'score/going',
                    iconfont: 'icon-list',
                    title: '进行中的比赛',
                    holeRow: true
                },
                'bb': {
                    id: 'bb',
                    type: 'isFuture',
                    iconfont: 'icon-suoxiao',
                    icon: 'score/future',
                    title: '未开始的比赛',
                    holeRow: true
                },
                'cc': {
                    id: 'cc',
                    type: 'isEnd',
                    icon: 'score/end',
                    iconfont: 'icon-icon_daojishi',
                    title: '已完场的比赛',
                    holeRow: true
                },
                'dd': {
                    id: 'dd',
                    type: 'warning',
                    icon: 'score/warn',
                    iconfont: 'icon-warning',
                    title: '异常的比赛',
                    holeRow: true
                }
            },
            tabOptions: {
                '1': 'aa-bb-cc-dd',
                '2': 'bb-dd',
                '3': 'cc',
                '4': 'aa-bb-cc-dd'
            },
            showCaches: [],
            cacheIds: [], // 置顶的赛事 id 集合
            commonIds: [],
            selectedIds: []
        }
    },
    computed: {
        ...mapState('commonData', ['showTipType', 'showHideType']),
        ...mapState('competition', ['gettingLeagues', 'thirdLeagueList']),
        ...mapState('voice', ['voice']),
        titleRows () {
            let list = []
            const options = this.tabOptions[this.tabType].split('-')
            options.forEach(key => {
                list = [].concat(list, [this.rows[key]])
            })
            return list
        },
        apiParams () {
            const hasThird = this.leagues.some(leagueId => this.thirdLeagueList.includes(leagueId))
            return {
                hierarchy: hasThird ? '1,2,3' : '',
                pageSize: 2000,
                leagueId: this.leagues && this.leagues.join(','),
                playing: [1, 4].includes(this.tabType) ? null : (this.tabType === 2 ? 1000 : 3000),
                leagueType: 1,
                day: this.day
            }
        },
        fetchParams () {
            return {
                leagues: this.leagues,
                day: this.day,
                tabType: this.tabType
            }
        },
        isCollect () {
            return this.tabType === 4
        },
        showIds () {
            // 这里根据showHideType 来修改 显示的结果
            const ids = [].concat(this.cacheIds, this.commonIds)
            if (this.showHideType === 'store') {
                return ids.filter(id => this.selectedIds.includes(id))
            } else if (this.showHideType === 'hide') {
                return ids.filter(id => !this.selectedIds.includes(id))
            } else {
                // 显示
                return ids
            }
        },
        showData () {
            // 需要展示的id 列表
            return Object.keys(this.allData).reduce((all, key) => {
                const list = this.allData[key]
                const showList = list.filter(x => {
                    return this.showIds.includes(x.matchId)
                })
                all[key] = [...showList]
                return all
            }, {})
        },
        showLabel () {
            return this.tabType * 1 === 1
        }
    },
    watch: {
        fetchParams: {
            handler () {
                if (!this.gettingLeagues) {
                    this.fetchData()
                }
            },
            deep: true
        }
    },
    mounted () {
        this.initWs()
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        async fetchData () {
            this.selectedIds = []
            try {
                this.loading = true
                const request = this.isCollect ? getCollectList : getMatchList
                const { data, code } = await request(this.apiParams)
                if (code === statusCode.success) {
                    this.list = this.isCollect ? (data || []) : (data && data.list) || []
                    this.handleData(this.list)
                    this.$emit('calcOffset')
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.loading = false
            }
        },
        handleData (list) {
            // 0：未开1：上半场2：中场3：下半场4：加时5：点球-1：完场-10：取消-11：待定-12：腰斩-13：中断-14：推迟
            const cacheIds = (getItem('footballCaches') && JSON.parse(getItem('footballCaches'))) || []
            const cacheRows = new Array(cacheIds.length).fill(0)
            this.cacheIds = cacheIds
            const commonIds = []
            const res = list.reduce((all, item, index) => {
                if (item.leagueType === 1) {
                    item.showPopover = isGoingCompetition(item.state) || isEnd(item.state)
                    item.isSelect = false
                    if (cacheIds.includes(item.matchId)) {
                        const index = cacheIds.findIndex(x => x === item.matchId)
                        item.isTop = true
                        if (item.state === 0) {
                            item.stateString = '未开'
                            item.isFuture = true
                        } else if (item.state === -1) {
                            item.stateString = '完场'
                            item.type = 'isEnd'
                        } else if (isGoingCompetition(item.state)) {
                            item.isNumber = item.timing && !isNaN(item.timing * 1)
                            item.stateString = item.timing
                            item.type = 'isGoing'
                        } else {
                            item.stateString = matchStatus[item.state] || '异常'
                            item.type = 'warning'
                        }
                        item.updateKey = `${item.matchId}`
                        cacheRows[index] = item
                    } else {
                        item.updateKey = `${item.matchId}`
                        if (item.state * 1 === 0) {
                            item.stateString = '未开'
                            item.type = 'isFuture'
                            all.isFuture.push(item)
                        } else if (item.state * 1 === -1) {
                            item.stateString = '完场'
                            item.type = 'isEnd'
                            all.isEnd.push(item)
                        } else if (isGoingCompetition(item.state)) {
                            item.isNumber = item.timing && !isNaN(item.timing * 1)
                            item.stateString = item.timing
                            item.type = 'isGoing'
                            all.isGoing.push(item)
                        } else {
                            item.stateString = matchStatus[item.state] || '异常'
                            item.type = 'warning'
                            all.warning.push(item)
                        }
                        commonIds.push(item.matchId)
                    }
                }
                return all
            }, {
                isGoing: [],
                isFuture: [],
                isEnd: [],
                warning: []
            })
            this.commonIds = commonIds
            this.allData = res
            this.showCaches = cacheRows
                .filter(x => x !== 0)
        },
        initWs () {
            ScoreWs.addListener(() => ScoreWs.listener.on('info', this.giveNotifycation))
            ScoreWs.addListener(() => ScoreWs.listener.on('score', this.updateScore))
            ScoreWs.addListener(() => ScoreWs.listener.on('now', this.updateMatchTime))
        },
        test () {
            // 模拟修改数据
            // this.giveNotifycation({
            //     type: 'goal',
            //     data: {
            //         // match_id: 1221,
            //         // red: 0,
            //         // state: 3,
            //         // team_name: 'asdfasdf',
            //         // time: '90',
            //         // who: 'away',
            //         // yellow: 6
            //         match_id: 2356068,
            //         home_score: 0,
            //         away_score: 2,
            //         who: 'home',
            //         state: 3,
            //         away_name: '22222',
            //         home_name: '111111111',
            //         time: '93'
            //     }
            //     // data: [{
            //     // match_id: 2356068,
            //     // home_score: 0,
            //     // away_score: 2,
            //     // who: 'away',
            //     // state: 3,
            //     // away_name: '22222',
            //     // home_name: '111111111',
            //     // time: '93'
            //     // away_corner: 3,
            //     // away_half_score: 2,
            //     // away_yellow: 1,
            //     // away_red: 0,
            //     // away_score: 2,
            //     // home_corner: 1,
            //     // home_half_score: 0,
            //     // home_red: 0,
            //     // home_score: 0,
            //     // home_yellow: 3,
            //     // now_time: '80',
            //     // state: 3
            //     // }]
            // })
            // this.updateScore({
            //     type: 'score',
            //     data: [{
            //         away_corner: 4,
            //         away_half_score: 0,
            //         away_red: 0,
            //         away_score: 1,
            //         away_yellow: 0,
            //         explain: '',
            //         extra_explain: '',
            //         has_lineup: '',
            //         home_corner: 1,
            //         home_half_score: 0,
            //         home_red: 0,
            //         home_score: 5,
            //         home_yellow: 0,
            //         injury_time: '',
            //         match_id: 2347924,
            //         match_time: '2023-06-01 17:00:00',
            //         now_time: '89',
            //         start_time: '2023-06-01 18:10:40',
            //         state: 3
            //     }]
            // })
            this.updateMatchTime({
                type: 'now',
                data: [
                    {
                        match_id: 2347924,
                        now_time: '23'
                    }
                ]
            })
        },
        giveNotifycation ({ type, data }) {
            const flag = ['yellow', 'red'].includes(type) ? 'card' : type
            if (!this.showTipType.includes(flag)) {
                return
            }
            const params = data
            notification.success({
                type,
                data: params
            })
            // 不光要有音效，还需要更新数据
            const audio = new Audio(`/voices/${this.voice}.mp3`)
            audio.play()
            this.updateRow(data, type)
        },
        updateRow (data, type) { // 进球 红黄牌 更新列表
            if (this.cacheIds.includes(data.match_id)) {
                // 更新caches
                const rowIndex = this.showCaches.findIndex(item => item.matchId === data.match_id)
                if (rowIndex > -1) {
                    const item = this.showCaches[rowIndex]
                    const updateKey = `${item.matchId}` + new Date().getTime()
                    const newItem = {
                        ...item,
                        timing: data.time,
                        state: data.state,
                        updateKey
                    }
                    if (type === 'goal') {
                        // item
                        newItem.homeScore = data.home_score
                        newItem.awayScore = data.away_score
                    } else {
                        // 红黄牌
                        newItem[`${data.who}Red`] = data.red
                        newItem[`${data.who}Yellow`] = data.yellow
                    }

                    if (newItem.state * 1 === 0) {
                        newItem.stateString = '未开'
                    } else if (data.state * 1 === -1) {
                        newItem.stateString = '完场'
                    } else if (isGoingCompetition(newItem.state)) {
                        newItem.isNumber = newItem.timing && !isNaN(newItem.timing * 1)
                        newItem.stateString = newItem.timing
                    } else {
                        newItem.stateString = matchStatus[data.state] || '异常'
                    }
                    this.showCaches.splice(rowIndex, 1, newItem)
                }
            }
            if (this.commonIds.includes(data.match_id)) {
                Object.entries(this.allData).forEach(rows => {
                    const list = rows[1]
                    const rowIndex = list.findIndex(item => item.matchId === data.match_id)
                    if (rowIndex > -1) {
                        const item = list[rowIndex]
                        const updateKey = `${item.matchId}` + new Date().getTime()
                        const newTime = data.time || data.now_time
                        const newItem = {
                            ...item,
                            timing: newTime || item.timing,
                            state: data.state,
                            updateKey
                        }
                        if (type === 'goal') {
                        // item
                            newItem.homeScore = data.home_score
                            newItem.awayScore = data.away_score
                        } else {
                        // 红黄牌
                            newItem[`${data.who}Red`] = data.red
                            newItem[`${data.who}Yellow`] = data.yellow
                        }

                        if (newItem.state * 1 === 0) {
                            newItem.stateString = '未开'
                        } else if (data.state * 1 === -1) {
                            newItem.stateString = '完场'
                        } else if (isGoingCompetition(newItem.state)) {
                            newItem.isNumber = newItem.timing && !isNaN(newItem.timing * 1)
                            newItem.stateString = newItem.timing
                        } else {
                            newItem.stateString = matchStatus[data.state] || '异常'
                        }
                        list.splice(rowIndex, 1, newItem)
                    }
                })
            }
        },
        updateMatchTime ({ type, data }) {
            data.forEach(item => {
                const id = item.match_id
                if (this.cacheIds.includes(id)) {
                    this.traverseCaches(item, type)
                }
                if (this.commonIds.includes(id)) {
                    this.traverseAllData(item, type)
                }
            })
        },
        updateScore ({ type, data }) { // score 更新列表
            data.forEach(item => {
                const id = item.match_id
                if (this.cacheIds.includes(id)) {
                    this.traverseCaches(item, type)
                }
                if (this.commonIds.includes(id)) {
                    this.traverseAllData(item, type)
                }
            })
        },
        traverseAllData (match, type) {
            Object.entries(this.allData).forEach(rows => {
                const list = rows[1]
                const rowIndex = list.findIndex(item => item.matchId === match.match_id)

                if (rowIndex > -1) {
                    let newItem = {}
                    const item = list[rowIndex]
                    const updateKey = `${item.matchId}` + new Date().getTime()
                    if (type === 'now') {
                        newItem = {
                            ...item,
                            timing: match.now_time || item.now_time
                        }
                    } else {
                        const newTime = match.time || match.now_time
                        newItem = {
                            ...item,
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
                            timing: newTime || item.timing,
                            updateKey
                        }
                    }

                    if (newItem.state * 1 === 0) {
                        newItem.stateString = '未开'
                    } else if (newItem.state * 1 === -1) {
                        newItem.stateString = '完场'
                    } else if (isGoingCompetition(newItem.state)) {
                        newItem.isNumber = newItem.timing && !isNaN(newItem.timing * 1)
                        newItem.stateString = newItem.timing
                    } else {
                        newItem.stateString = matchStatus[newItem.state] || '异常'
                    }
                    list.splice(rowIndex, 1, newItem)
                }
            })
        },
        traverseCaches (match, type) {
            const rowIndex = this.showCaches.findIndex(item => item.matchId === match.match_id)
            if (rowIndex > -1) {
                const item = this.showCaches[rowIndex]
                const updateKey = `${item.matchId}` + new Date().getTime()
                let newItem = {}
                if (type === 'now') {
                    newItem = {
                        ...item,
                        timing: match.now_time || item.now_time
                    }
                } else if (type === 'score') {
                    const newTime = match.time || match.now_time
                    newItem = {
                        ...item,
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
                        timing: newTime || item.now_time,
                        updateKey
                    }
                }
                if (newItem.state * 1 === 0) {
                    newItem.stateString = '未开'
                } else if (newItem.state * 1 === -1) {
                    newItem.stateString = '完场'
                } else if (isGoingCompetition(newItem.state)) {
                    newItem.isNumber = newItem.timing && !isNaN(newItem.timing * 1)
                    newItem.stateString = newItem.timing
                } else {
                    newItem.stateString = matchStatus[newItem.state] || '异常'
                }
                this.showCaches.splice(rowIndex, 1, newItem)
            }
        }
    },
    beforeDestroy () {
        ScoreWs.listener.off('info', this.giveNotifycation)
        ScoreWs.listener.off('score', this.updateScore)
    }
}
</script>
<style lang="scss" scoped>
.section-title {
    padding-left: 60px;
  .iconfont {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
  span{
    display: inline-block;
    padding-top: 1px;
    line-height: 20px;
    height: 20px;
  }
  &.isGoing {
    color: #43B365;
    margin-top: 0!important;
    .goingIcon {
      width: 50px;
      height: 50px;
    }

    span {
      line-height: 50px;
    }
  }
  &.isFuture {
    color: #79CBFF;
    .futureIcon {
      width: 30px;
      height: 30px;
    }
  }
  &.isEnd {
    color: #999999;
    .endIcon {
      margin-top: -5px;
      width: 35px;
      height: 35px;
    }
  }
  &.warning {
    color: #DCCF34;
  }

}

.row-box{
    width: calc(100% - 4px);
    margin: 0 auto;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.3);
}

::v-deep {
    .el-checkbox__label {
        display: none;
    }
}
</style>
