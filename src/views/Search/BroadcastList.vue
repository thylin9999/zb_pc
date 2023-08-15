<template>
    <div class="page">
        <div class="flex align-center justify-between">
            <div>
                <span class="font-25 text-333">相关直播</span>
                <span class="m-l-15">共找到{{  pagination.total }}个结果</span>
            </div>
            <div class="more pointer font-14 text-333 font-400 flex align-center"
                :class="{
                    'visibility-hidden': !isAll || (!isLoading && !list.length)
                }"
                @click="changeToHost"
            >
                <span>查看更多</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="list"
             v-loading="isLoading"
             element-loading-background="transparent">
            <ul class="w-100 h-100 flex align-center flex-wrap">
                <li
                    v-for="(item, index) in  list"
                    :key="item.id"
                    class="flex m-t-10 align-center  item"
                >
                    <live-broad-card
                        :index="index"
                        :info="item"
                        :show-top-img="false"
                    />
                </li>
            </ul>
            <no-data v-if="!isLoading && !list.length">
                <span calss="font-14 text-333 font-400 m-t-20">暂无相关内容</span>
            </no-data>
        </div>
        <div class="text-center p-b-20 p-t-10">
        <pagination
            :current-page.sync="pagination.currentPage"
            :page-size.sync="pagination.pageSize"
            :total="pagination.total"
            @loadData="fetchData"
        >
        </pagination>
        </div>
    </div>
</template>

<script>
import { searchBroadcast } from '../../api/Host/Host'
import LiveBroadCard from '@/components/LiveBroadCard'
import NoData from '../../components/NoData.vue'
import { statusCode } from '../../utils/statusCode'
import Pagination from '../../components/Pagination.vue'
export default {
    name: 'BroadcastList',
    components: {
        NoData,
        LiveBroadCard,
        Pagination
    },
    props: {
        search: {
            type: String,
            default: ''
        },
        isAll: { // 是否位列表页
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            total: 0,
            list: [
            ],
            isLoading: false,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    computed: {
        apiParams () {
            return {
                search: this.search,
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize
            }
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            this.isLoading = true
            try {
                const { data, code } = await searchBroadcast(this.apiParams)
                if (code === statusCode.success) {
                    const res = data || {}
                    if (data) {
                        this.pagination.currentPage = res.current_page
                        this.pagination.pageSize = res.per_page
                        this.pagination.total = res.total
                    }
                    const list = res.list || []
                    if (!this.isAll) {
                        this.list = list
                    } else {
                        this.list = list.slice(0, 10)
                        if (!list.length) {
                            this.$emit('update:hasLive', false)
                        } else {
                            this.$emit('update:hasLive', true)
                        }
                    }
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        changeToHost () {
            this.$emit('changeTab', 3)
        }
    }
}

</script>

<style lang="scss" scoped>
.page{
    min-height: 480px;
}
.list {
  min-height: 350px;
}
.item {
    width: 230px;
    margin-right: 12px;
    &:nth-child(5n) {
        margin-right: 0;
    }
}
</style>
