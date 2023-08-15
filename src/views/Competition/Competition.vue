<template>
<div class="wrap-1200 flex competition-box p-t-10 hide-scrollbar">
    <div class="left-menus w-100 h-100 bg-white">
        <div class="types p-b-10 p-t-20 w-100">
            <div
                class="type pointer w-100 m-b-10 flex align-center"
                :class="{
                    'is-active': competitionTypeId === competitionType.id
                }"
                @click="changeCategory(competitionType)"
                v-for="competitionType in  competitionTypes" :key="competitionType.id">

                <span class="font-16 w-100 m-l-15 m-r-15 d-inline-block item text-center  font-500">{{ competitionType.label }}</span>
            </div>
        </div>
        <div class="tree-menus p-b-15">
            <TreeMenus
                :key="updateKey"
                :close-league-filter="closeLeagueFilter"
                :league-id.sync="leagueId"
                :league-type.sync="leagueType"
                is-competition
                no-hover
                @changeLeagueId="changeLeagueId"
            />
        </div>
        <div class="footer-btns p-l-15 text-center p-r-15 flex align-center justify-center flex-column w-100 font-14 font-400 text-white">
            <span class="d-inline-block pointer w-100 download-app" @click="goToDownload">下载APP</span>
            <span class="d-inline-block pointer m-t-10 w-100" @click="openLiveCast">我要开播</span>
        </div>
    </div>
    <div class="content h-100 flex flex-column flex m-l-10"
        :class="{
            'is-competition': !closeLeagueFilter
        }"
    >
        <TimerFilter
            v-if="!isMyBook"
            :total="pagination.total"
            :show-high-light="competitionTypeId !== 2"
            :time.sync="filterTime"
            @loadData="loadData(true)"
        />
        <div class="matches w-100  "
             :class="{
                   'm-t-15 p-t-20 ': !closeLeagueFilter
             }"
        >
            <div v-if="competitionTypeId !== 2 && isToday" class="title flex m-l-10  align-center flex justify-between align-center  p-r-20 p-l-10">
<!--                <span  class="date font-16  font-500 font-medium">{{ filterTime | dateFilter }}</span>-->
                <div class="date font-500 font-medium">
                    <span>{{ filterTime | dateFilter }}</span>
                    <span class="m-l-5">(今天)</span>
                </div>
                <el-checkbox class="font-16" v-if="isToday" v-model="showEnd" @change="loadData">查看已结束</el-checkbox>
            </div>
            <div v-if="closeLeagueFilter" class="flex justify-between align-center ">
                <div class="tabs text-center flex align-center justify-between">
                    <span class="pointer" :class="{ 'is-active': bookType === 1}" @click="changeBookType(1)">足球</span>
                    <span class="pointer" :class="{ 'is-active': bookType === 2}" @click="changeBookType(2)">篮球</span>
                </div>
                <div class="clear-btn p-relative pointer" @click="clearCompetition">
                    <span class="font-14 font-400">清除已完场</span>
                </div>
            </div>
            <div class="match-list w-100 m-t-10 overflow-y-auto p-relative"
                 id="matchList"
                 ref="scrollParent"
            >
                <template
                    v-if="!emptyList && !isLoading"
                >
                    <template   v-if="competitionTypeId === 2">
                        <ul class="m-t-10" >
                            <li
                                :id="`match-${item.matchId}`"
                                v-for="item in bookShowList"
                                :key="item.matchId"
                                class="m-b-5 "
                            >
                                <match-card-rect
                                    class="border-radius-10"
                                    :show-full-date="closeLeagueFilter"
                                    :match="item"
                                    @refresh="loadData"
                                    @updateAppointment="updateAppointment"
                                />
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <div
                            v-for="(arr, date) in  showData"
                            :key="date"
                        >
                            <div>
                                <ul class="">
                                    <li
                                        :id="`match-${item.matchId}`"
                                        v-for="item in arr"
                                        :key="`${item.matchId}-${item.appointment}`"
                                        class="m-b-5"
                                    >
                                        <match-card-rect
                                            :show-full-date="closeLeagueFilter"
                                            :match="item"
                                            @refresh="loadData"
                                            @updateAppointment="updateAppointment"
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>

                </template>

                <content-loader v-if="isLoading"/>
                <no-data v-if="!isLoading && emptyList && showResult" />
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TreeMenus from '@/components/TreeMenus'
import TimerFilter from '@/views/Competition/TimerFilter'
import MatchCardRect from '@/views/Competition/Components/MatchCardRect'
import { getMatchList, clearFinished, getBookedCompetition, getAllCompetition } from '@/api/competition/competition'
import dayjs from 'dayjs'
import { Message } from 'element-ui'
import { mapState, mapMutations } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import { isEmpty } from '@/utils/lodashUtil'
import { isEnd, isGoingCompetition } from '@/utils/utils'
import ContentLoader from '@/components/skeleton/ContentLoader.vue'
import NoData from '@/components/NoData.vue'
export default {
    name: 'Competition',
    filters: {
        dateFilter (value) {
            let str = ''
            if (value) {
                str = dayjs(value).format('MM-DD')
            }
            return str
        }
    },
    components: {
        TreeMenus,
        TimerFilter,
        MatchCardRect,
        ContentLoader,
        NoData
    },
    data () {
        return {
            targetMatch: null, // 目标比赛，即进入页面后滚动到这场比赛
            leagueId: null, // 联赛id，
            leagueType: null, // 比赛类型， 足球、篮球
            showEnd: false,
            filterTime: dayjs().format('YYYY-MM-DD'),
            pagination: {
                total: 0,
                pageSize: 2000,
                currentPage: 1
            },
            list: [],
            isLoading: false,
            competitionTypeId: 1, // 全部/预约切换
            competitionTypes: [
                {
                    id: 1,
                    label: '全部赛程',
                    icon: 'icon-status/competition'
                },
                {
                    id: 2,
                    label: '我的预约',
                    icon: 'icon-status/book'
                }
            ],
            showResult: false, // 是否展示 暂无数据
            showData: {},
            showList: [], // 我的预约列表
            updateKey: +new Date().getTime(),
            bookType: 1 // 我的预约里面的type
        }
    },
    computed: {
        ...mapState('commonData', ['competitionTabs', 'matchTypes']),
        ...mapState('user', ['token']),
        closeLeagueFilter () { // 我的预约
            return this.competitionTypeId === 2
        },
        isToday () {
            return dayjs(this.filterTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
        },
        apiParams () {
            let leagueId = null // 联赛分类， 中超，德甲西甲等
            if (this.leagueId) {
                if (typeof this.leagueId === 'string' && this.leagueId.includes('全部')) {
                    // 那么就是全部里面的
                } else if (typeof this.leagueId === 'string' && this.leagueId.includes('other')) {
                    leagueId = 100000
                } else {
                    leagueId = this.leagueId
                }
            }
            const playing = this.isToday
                ? (this.showEnd ? 3000 : null)
                : (dayjs(this.filterTime).isBefore(dayjs(), 'day') ? 3000 : 1000)
            return {
                pageNumber: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                leagueId, // 联赛id，
                playing,
                hierarchy: leagueId * 1 === 100000 ? '3' : '',
                leagueType: this.leagueType, // 赛事分类，足球，篮球等
                day: this.filterTime,
                status: this.competitionTypeId === 1 ? null : 2000
            }
        },
        isJustAllCompetition () { // 全部赛程
            return !this.isMyBook && !this.leagueType && !this.leagueId
        },
        emptyList () {
            return this.competitionTypeId === 2 ? !this.bookShowList.length : isEmpty(this.showData)
        },
        isMyBook () {
            return this.competitionTypeId === 2
        },
        isFootball () {
            return this.leagueType === 1
        },
        bookShowList () {
            return this.showList.filter(item => {
                return item.leagueType === this.bookType
            })
        }
    },
    watch: {
        token: {
            handler () {
                this.fetchData()
            }
        },
        targetMatch: {
            handler () {
                if (this.targetMatch && this.isToday && !this.isMyBook) {
                    this.$nextTick(() => {
                        this.initScroll()
                    })
                }
            },
            immediate: true,
            deep: true
        }
    },
    created () {
        const { competitionTypeId } = this.$route.params
        this.competitionTypeId = competitionTypeId || 1
        if (this.competitionTypeId === 2) {
            // 我的关注
            this.leagueType = null
            this.leagueId = null
        }
        this.updateLeagueTypes(this.filterTime)
        this.fetchData()
    },
    mounted () {
        window.addEventListener('scroll', this.hidePopover)
        window.addEventListener('mousewheel', this.hidePopover)
        this.$nextTick(() => {
            const matchList = document.getElementById('matchList')
            if (matchList) {
                matchList.addEventListener('scroll', this.hidePopover)
            }
        })
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        changeBookType (type) {
            this.bookType = type
        },
        hidePopover () {
            const assistBtn = document.getElementById('assistBtn')
            assistBtn.click()
        },
        initScroll () {
            const targetDom = document.querySelector(`#match-${this.targetMatch.matchId}`)
            if (targetDom) {
                this.$nextTick(() => {
                    this.$refs.scrollParent.scrollTo({
                        top: targetDom.offsetTop,
                        behavior: 'smooth'
                    })
                })
            }
        },
        updateAppointment ({ id, value, date }) {
            const item = this.showData[date].find(x => x.matchId === id)
            item.appointment = value
        },
        loadMore () {
            if (this.list.length >= this.pagination.total) {
                return
            }
            this.pagination.currentPage += 1
            this.fetchData()
        },
        loadData (updateTime = false) {
            // 清空 列表，加载
            this.list = []
            this.isLoading = true
            this.pagination.total = 0
            this.pagination.pageSize = 2000
            this.pagination.currentPage = 1
            if (updateTime) {
                this.leagueId = null
                // 更新联赛。。。
                this.updateLeagueTypes(this.filterTime)
            }
            this.fetchData()
        },
        changeLeagueId () {
            this.competitionTypeId = 3 // 统一代表第三类，非 全部和我的
            this.leagueId = this.leagueId ? this.leagueId : `全部-${this.leagueType}`
            this.loadData()
        },
        changeCategory (type) {
            if (type.id === this.competitionTypeId) return
            if (type.id === 2 && !this.token) {
                this.openLoginDialogMixin()
            } else {
                this.competitionTypeId = type.id
                // 切换到赛程时，足球展开，
                this.leagueType = null
                this.leagueId = null
                this.loadData()
            }
        },
        fetchData: debounce(async function () {
            this.showData = {}
            try {
                this.isLoading = true
                const request = this.competitionTypeId === 2
                    ? getBookedCompetition
                    : (this.isJustAllCompetition ? getAllCompetition : getMatchList)
                const { data, code } = await request(this.apiParams)
                const statics = {
                    football: 0,
                    basketball: 0
                }
                if (code === statusCode.success) {
                    const list = (data && data.list) || []
                    const tempList = list.reduce((all, item) => {
                        if (item.leagueType === 2) {
                            // 篮球
                            all.push({
                                ...item
                            })
                            statics.basketball++
                        } else {
                            all.push({
                                ...item
                            })
                            statics.football++
                        }
                        return all
                    }, [])
                    if (this.isJustAllCompetition) {
                        this.SET({
                            competitionStatics: { ...statics }
                        })
                    }
                    this.handleData(tempList)
                    this.pagination.currentPage = this.isJustAllCompetition ? 1 : data && data.current_page
                    this.pagination.total = this.isJustAllCompetition ? data.count : data && data.total
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
                this.showResult = true
                this.updateKey = +new Date().getTime()
            }
        }, 300),
        clearCompetition: throttle(async function () {
            try {
                const { code, msg } = await clearFinished()
                if (code === statusCode.success) {
                    Message.success(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.fetchData()
            }
        }, 3000),
        handleData (data) {
            if (this.competitionTypeId === 2) {
                const list = data.reduce((all, item) => {
                    if (item.state * 1 === 0) {
                        // 未开
                        all.others.push(item)
                    } else {
                        all.end.push(item)
                    }
                    return all
                }, {
                    end: [],
                    others: []
                })
                this.showList = [].concat(list.others, list.end)
            } else {
                const dates = []

                const targetStates = {
                    isGoing: [],
                    isEnd: [],
                    isFuture: []
                }
                // 查找最近时间的比赛
                const tempMap = data.reduce((all, item, index) => {
                    // 处理三种中途的比赛
                    const key = item.leagueType === 1 ? 'football' : 'basketball'
                    if (isGoingCompetition(item.state, key)) {
                        targetStates.isGoing.push(item)
                    } else if (isEnd(item.state)) {
                        targetStates.isEnd.push(item)
                    } else { // 这里只要是未开的比赛，都在这里，包含 取消，延迟，未来赛程等
                        targetStates.isFuture.push(item)
                    }
                    const date = dayjs(item.matchTime).format('YYYY-MM-DD')
                    if (!all[date]) {
                        all[date] = []
                        dates.push(date)
                    }
                    all[date].push(item)
                    return all
                }, {})
                // 处理滚动数据的问题
                this.handleScrollData(targetStates)
                const dateArr = dates.sort((a, b) => {
                    return dayjs(a) - dayjs(b)
                })
                // 时间排序
                this.showData = dateArr.reduce((all, date) => {
                    all[date] = tempMap[date].sort((a, b) => {
                        return dayjs(a.matchTime) - dayjs(b.matchTime)
                    })
                    return all
                }, {})
            }
        },
        handleScrollData (data) {
            const targetData = data.isGoing.length
                ? data.isGoing
                : (
                    data.isFuture.length
                        ? data.isFuture
                        : data.isEnd
                )
            const tempList = targetData.sort((a, b) => {
                return dayjs(a.matchTime) - dayjs(b.matchTime)
            })
            // 在这里处理下？
            this.targetMatch = { ...tempList[0] }
        },
        goToDownload () {
            this.$router.push({
                name: 'DownloadApp'
            })
        },
        openLiveCast () {
            if (!this.token) {
                this.openLoginDialogMixin()
                return
            }
            if (!this.isHostAnchor) {
                Message.info('您目前还不是主播，请先申请主播，再开播！')
                this.queryHost()
                return
            }
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 6
                }
            })
        }
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.hidePopover)
        window.removeEventListener('mousewheel', this.hidePopover)
        const matchList = document.getElementById('matchList')
        matchList && matchList.removeEventListener('scroll', this.hidePopover)
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.competition-box {
    height: calc(100vh - 60px);
}
.left-menus {
    width: 210px;
    border-radius: 10px;
    .types {
        border-top: 1px solid #F1F2F5;
        border-bottom: 1px solid #F1F2F5;
    }
    .type {
        .item {
            line-height: 35px;
            background-color: #F3F3F3;
            color: #999;
            border-radius: 5px;
        }
        &.is-active, &:hover {
            span{
                color: #fff;
                background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
            }
        }
    }
    .tree-menus {
        height: calc(100% - 250px);
        overflow-y: auto;
    }
    .footer-btns {
        line-height: 34px;
        border-top: 1px solid #F3F3F3;
        height: 125px;
        span {
            border-radius: 5px;
            background: linear-gradient(90deg, #22307C 0%, #121325 100%);
        }
        .download-app {
            background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
        }
    }
}
.content {
    width: calc(100% - 220px);
    &.is-competition {
        .matches {
            height: calc(100% - 125px);
            .match-list {
                height: calc(100% - 25px);
            }
        }
    }
    .matches {
        height: 100%;
        .title {
            border-left: 5px solid #A05A77;
            line-height: 20px;
            height: 20px;
            font-size: 16px;
            color: #333333;
            &.border-none {
                border-color: transparent;
            }
        }
        .clear-btn {
            width: 122px;
            height: 32px;
            line-height: 30px;
            padding-left: 40px;
            background: #FFFFFF;
            box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
            border-radius: 3px;
            color: #ccc;
            &:before {
                position: absolute;
                content: '';
                left: 15px;
                top: 6px;
                width: 20px;
                height: 20px;
                background-image: url('../../assets/images/icons/icon-qk.png');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
            &:hover {
                &:before {
                    background-image: url('../../assets/images/icons/icon-qk_h.png');
                }
                color: #E6B48E;
            }
        }
        .match-list{
            height: calc(100% - 42px);
            li {
              //overflow: hidden;
            }
        }
    }
}
.tabs {
    width: 131px;
    height: 30px;
    background: #FFFFFF;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
    border-radius: 3px;
    line-height: 30px;
    padding: 0 3px;
    position: relative;
    &:after {
        position: absolute;
        content: '';
        left: 65px;
        width: 1px;
        height: 22px;
        background: #CCCCCC;
    }
    span {
        width: 58px;
        height: 26px;
        line-height: 26px;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #ccc;
        &.is-active, &:hover {
            background: #A05A77;
            color: #fff;
            font-weight: 500;
        }
    }
}
</style>
