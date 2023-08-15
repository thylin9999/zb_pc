<template>
    <div class="my-host m-t-15">
        <div class="w-100 ">
            <title-row icon="all-broad" title="未开播" class="m-b-30" />
            <OfflineHosts />
        </div>
        <div class="p-relative m-t-20">
            <title-row icon="all-broad" title="正在开播" class="m-b-30" />

        </div>
        <div class="w-100"
             v-loading="isLoading"
             element-loading-background="transparent">
            <div v-if="matches.length" class="">
                <ul class="flex flex-wrap hosts"  >
                    <li
                        v-for="item in matches"
                        :key="item.id"
                        class="m-b-25 card-item"
                    >
                        <live-broad-card
                            :info="item"
                        />
                    </li>
                </ul>
            </div>
            <no-data  v-if="!isLoading && !matches.length">
              <span class="font-14 text-999">暂无数据</span>
            </no-data>
        </div>
    </div>
</template>

<script>
import LiveBroadCard from '@/components/LiveBroadCard'
import TitleRow from '@/components/TitleRow'
import OfflineHosts from '@/views/Host/Components/OfflineHosts'
import NoData from '@/components/NoData'
import { getFlowedHosts } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
export default {
    name: 'MyFavorite',
    props: {
        leagueId: {
            type: [Number, String],
            default: null
        }
    },
    components: {
        OfflineHosts,
        LiveBroadCard,
        TitleRow,
        NoData
    },
    data () {
        return {
            matches: [],
            isLoading: false
        }
    },
    computed: {
        apiParams () {
            let type = null // 体育类型分类， 足球。篮球等
            let leagueId = null // 联赛分类， 中超，德甲西甲等
            if (this.leagueId) {
                if (typeof this.leagueId === 'string' && this.leagueId.includes('全部')) {
                    // 那么就是全部里面的
                    type = this.leagueId.split('-')[1]
                } else {
                    leagueId = this.leagueId
                }
            }
            return {
                type,
                leagueId,
                pageSize: 2000
            }
        }
    },
    watch: {
        leagueId: {
            handler () {
                this.fetchData()
            }
        },
        immediate: true,
        deep: true
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getFlowedHosts(2)
                if (code === statusCode.success) {
                    this.matches = data || []
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-item {
    margin-right: 10px;
}
</style>
