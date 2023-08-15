<template>
<div class="table h-100 overflow-y-auto">
    <el-checkbox-group v-model="selectedIds">
        <div class="min-h-300 font-14 h-100 overflow-y-auto" v-loading="loading || gettingLeagues">
            <template v-for="item in showCaches">
                <template v-if="showIds.includes(item.matchId)">
                    <BasketballRow
                        :key="item.key"
                        :info="item"
                        :type="item.type"
                        :language="language"
                        :is-collect="isCollect"
                        @refresh="fetchData"
                    >
                        <template #selection>
                            <el-checkbox :label="item.matchId" :key="item.matchId"></el-checkbox>
                        </template>
                    </BasketballRow>
                </template>
            </template>
            <template
                v-for="row in  titleRows"
            >
                <template v-if="showData[row.type] && showData[row.type].length ">
                <div v-if="showLabel" :key="row.type" :id="row.type" class="flex align-center m-t-15 m-b-15 justify-center" >
                    <icon-png class="m-r-5" :width="20" :height="20" :icon="row.icon"></icon-png>
                    <span class="font-16 font-regular font-400 text-999">{{ row.title }}</span>
                </div>
                <template v-for="item in showData[row.type]">
                    <BasketballRow
                        :key="item.id"
                        :info="item"
                        :type="row.type"
                        :language="language"
                        :is-collect="isCollect"
                        @refresh="fetchData"
                    >
                        <template #selection>
                            <el-checkbox :label="item.matchId" :key="item.matchId"></el-checkbox>
                        </template>
                    </BasketballRow>
                </template>
                </template>
            </template>
            <no-data v-if="!loading && !list.length && !gettingLeagues"/>
        </div>
    </el-checkbox-group>

</div>
</template>

<script>
import BasketballRow from '@/views/Score/Basketball/BasketballRow'
import IconPng from '@/components/IconPng'
import { getCollectList, getMatchList } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { isEnd, isGoingCompetition, basketStatus } from '@/utils/utils'
import { getItem } from '@/utils/cookie'
import { mapMutations, mapState } from 'vuex'
import NoData from '@/components/NoData'
export default {
    name: 'BasketballTable',
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
        }

    },
    components: {
        BasketballRow,
        IconPng,
        NoData
    },
    data () {
        return {
            isGoingIcon: require('../../../assets/images/score/going.gif'),

            loading: false,
            list: [],
            allData: {},
            rows: {
                'aa': {
                    id: 'aa',
                    type: 'isGoing',
                    icon: 'score/going',
                    title: '进行中的比赛',
                    holeRow: true
                },
                'bb': {
                    id: 'bb',
                    type: 'isFuture',
                    icon: 'score/future',
                    title: '未开始的比赛',
                    holeRow: true
                },
                'cc': {
                    id: 'cc',
                    type: 'isEnd',
                    icon: 'score/end',
                    title: '已完场的比赛',
                    holeRow: true
                },
                'dd': {
                    id: 'dd',
                    type: 'warning',
                    icon: 'score/warn',
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
            commonIds: [],
            selectedIds: []
        }
    },
    computed: {
        ...mapState('commonData', ['showHideType']),
        ...mapState('competition', ['gettingLeagues', 'thirdLeagueList']),
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
                leagueType: 2,
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
    methods: {
        ...mapMutations('competition', ['SET']),
        async fetchData () {
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
            const cacheIds = (getItem('basketballCaches') && JSON.parse(getItem('basketballCaches'))) || []
            const cacheRows = new Array(cacheIds.length).fill(0)
            this.cacheIds = cacheIds
            const commonIds = []
            const res = list.reduce((all, item, index) => {
                if (item.leagueType === 2) {
                    item.showPopover = isGoingCompetition(item.state, 'basketball') || isEnd(item.state)
                    if (cacheIds.includes(item.matchId)) {
                        const index = cacheIds.findIndex(x => x === item.matchId)
                        item.isTop = true
                        if (item.state === 0) {
                            item.stateString = '未开'
                            item.isFuture = true
                        } else if (item.state === -1) {
                            item.stateString = '完场'
                            item.type = 'isEnd'
                        } else if (isGoingCompetition(item.state, 'basketball')) {
                            item.stateString = '进行中'
                            item.type = 'isGoing'
                        } else {
                            item.stateString = basketStatus[item.state] || '异常'
                            item.type = 'warning'
                        }
                        cacheRows[index] = item
                    } else {
                        if (item.state * 1 === 0) {
                            item.stateString = '未开'
                            item.type = 'isFuture'
                            all.isFuture.push(item)
                        } else if (item.state * 1 === -1) {
                            item.stateString = '完场'
                            item.type = 'isEnd'
                            all.isEnd.push(item)
                        } else if (isGoingCompetition(item.state, 'basketball')) {
                            item.stateString = '进行中'
                            item.type = 'isGoing'
                            all.isGoing.push(item)
                        } else {
                            item.stateString = basketStatus[item.state] || '异常'
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
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .el-checkbox__label {
        display: none;
    }
}
</style>
