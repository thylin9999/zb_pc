<template>
<div class="my-host p-relative h-100 hide-scrollbar" ref="myHostRef">
    <div class="flex align-center p-t-15 m-b-20">
        <span class="font-20 d-inline-block font-600 text-333">{{ title }}</span>
        <MatchTypes
            class="match-types  m-l-10"
            :options="currentTypes"
            :active-id="leagueId"
            @changeActiveId="changeActiveId"
        />
    </div>
    <div class="w-100 overflow-y-auto loading-height host-list-wrap "
         v-loading="isLoading"
         element-loading-background="transparent">
        <div v-if="matches.length" class="">
            <ul class="flex flex-wrap hosts"  >
                <li
                    v-for="item in matches"
                    :key="item.id"
                    class="m-b-15 card-item"
                >
                    <live-broad-card
                        :info="item"
                    />
                </li>
            </ul>
        </div>
        <no-data  v-if="matches && !matches.length && !isLoading">
          <span class="font-14 text-999">暂无数据</span>
        </no-data>
    </div>
    <div class="text-center footer w-100 p-absolute p-t-10">
      <el-pagination
          background
          :current-page.sync="pagination.pageNumber"
          :page-size.sync="pagination.pageSize"
          layout="prev, pager, next"
          :total="pagination.total">
      </el-pagination>
    </div>
</div>
</template>

<script>
// import MatchListRow from '@/views/Competition/MatchListRow'
import LiveBroadCard from '@/components/LiveBroadCard'
import NoData from '@/components/NoData'
import MatchTypes from '@/views/components/MatchTypes'
import { getOnlineBroadcast } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { matchTypes } from '@/utils/utils'
import { Message } from 'element-ui'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'MyLiveHost',
    props: {
        leagueId: {
            type: [Number, String],
            default: null
        },
        leagueType: {
            type: Number,
            default: null
        },
        categoryId: { // 区分 全部直播，足球，篮球 电竞等
            type: Number,
            default: null
        }
    },
    components: {
        LiveBroadCard,
        MatchTypes,
        NoData
    },
    data () {
        return {
            matches: [],
            isLoading: false,
            allTypes: [
                {
                    id: 1,
                    title: '足球',
                    key: 'football'
                },
                {
                    id: 2,
                    title: '篮球',
                    key: 'basketball'
                },
                {
                    id: 3,
                    title: '电竞',
                    key: 'eSports'
                },
                {
                    id: 4,
                    title: '其他',
                    key: 'other'
                }
            ],
            pagination: {
                pageNumber: 1,
                pageSize: 300,
                total: 0
            },
            rowNum: 1
        }
    },
    computed: {
        ...mapState('commonData', ['leagueTypes']),
        currentTypes () { // 当前分类下的热门 联赛
            if (this.categoryId === 1) {
                return []
            } else {
                const types = this.leagueTypes[this.leagueType] || []
                return types.reduce((all, item) => {
                    all.push({
                        ...item,
                        id: item.leagueId,
                        title: item.nameChsShort
                    })
                    return all
                }, [])
            }
        },
        apiParams () {
            // let type = null // 体育类型分类， 足球。篮球等
            let leagueId = null // 联赛分类， 中超，德甲西甲等
            if (this.leagueId) {
                if (typeof this.leagueId === 'string' && this.leagueId.includes('全部')) {
                    // 那么就是全部里面的
                } else {
                    leagueId = this.leagueId
                }
            }
            return {
                type: this.leagueType,
                leagueId,
                pageNumber: this.pagination.pageNumber,
                pageSize: this.pagination.pageSize
            }
        },
        fetchDataParams () {
            return {
                leagueId: this.leagueId,
                leagueType: this.leagueType,
                pageNumber: this.pagination.pageNumber
            }
        },
        title () {
            return this.categoryId === 1 ? '全部直播' : matchTypes[this.leagueType]
        }
    },
    watch: {
        fetchDataParams: {
            handler () {
                this.fetchData()
            }
        },
        immediate: true,
        deep: true
    },
    mounted () {
        this.calcPageSize()
    },
    methods: {
        ...mapMutations('commonData', 'SET'),
        calcPageSize () {
            const { width } = this.$refs.myHostRef.getBoundingClientRect()
            // 242  每个卡片的宽度
            this.rowNum = Math.floor(width / 242)
            // 计算宽度
            const headerWidth = 225 + this.rowNum * 242 - 10
            // console.log(headerWidth)
            this.SET({ headerWidth })
            this.pagination.pageSize = this.rowNum * 3
            this.fetchData()
        },
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getOnlineBroadcast(this.apiParams)
                if (code === statusCode.success) {
                    this.matches = data ? data.list : []
                    if (data) {
                        this.pagination.total = data.total
                    }
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        changeActiveId (id) {
            // 切换状态了
            if (this.categoryId === 1) {
                // 全部里面切换的，需要通知外层
                this.$emit('update:leagueType', id)
                this.$emit('update:leagueId', `全部-${id}`)
                this.$emit('changeCategoryIdByRows')
            } else {
                // 切换联赛
                this.$emit('update:leagueId', id)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-item {
    margin-right: 10px;
}
.host-list-wrap {
  height: 558px;
}
.footer {
  //margin-top: 35px;
    bottom: 20px;
}
</style>
