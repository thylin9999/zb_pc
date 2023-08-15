<template>
<div class="hot-live" :class="{'is-not-home-box': !isHome}">
    <div class="p-relative">
        <title-row icon="live-broad" title="全部直播" class="m-b-5">
            <more-button v-if="isHome" @click.native="goToLiveBroadCast"/>
        </title-row>
        <match-types
            class="match-types p-absolute"
            :options="types"
            :active-id.sync="hostId"
        />
    </div>
    <div class="w-100 loading-height"
         v-loading="isLoading"
         element-loading-background="transparent">
        <div v-if="list.length" class="">
            <ul class="flex flex-wrap hosts " :class="{'is-home': isHome, 'is-not-home': !isHome }" >
                <li
                    v-for="item in list"
                    :key="item.id"
                    class="m-t-10"
                    :class="{'m-b-15': isHome, 'm-r-20': !isHome}"
                >
                    <live-broad-card
                        :info="item"
                    />
                </li>
            </ul>
        </div>
      <no-data  v-if="!list.length && !isLoading" />
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import MoreButton from '@/components/MoreButton'
import LiveBroadCard from '@/components/LiveBroadCard'
import MatchTypes from '@/views/components/MatchTypes'
import { getOnlineBroadcast } from '@/api/competition/competition'
import NoData from '@/components/NoData'
export default {
    name: 'HostList',
    props: {
        isHome: {
            type: Boolean,
            default: false
        }
    },
    components: {
        TitleRow,
        MoreButton,
        LiveBroadCard,
        MatchTypes,
        NoData
    },
    data () {
        return {
            list: [],
            hostId: 5,
            isLoading: false,
            pagination: {
                pageNumber: 1,
                pageSize: 10,
                total: 0
            },
            types: [
                {
                    id: 5, // 未定
                    title: '正在热播',
                    key: 'living'
                },
                {
                    id: 1,
                    title: '足球热播',
                    key: 'football'
                },
                {
                    id: 2,
                    title: '篮球热播',
                    key: 'basketball'
                },
                {
                    id: 3,
                    title: '电竞热播',
                    key: 'eSports'
                },
                {
                    id: 4,
                    title: '其他',
                    key: 'other'
                }
            ]
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        apiParams () {
            return {
                pageNumber: this.pagination.pageNumber,
                pageSize: this.pagination.pageSize,
                type: this.hostId * 1 === 5 ? null : this.hostId // 赛事类型
            }
        }
    },
    watch: {
        hostId () {
            this.pagination.pageNumber = 1
            this.fetchData()
        }
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                // 获取所有的直播
                const { data } = await getOnlineBroadcast(this.apiParams)
                if (data) {
                    this.pagination.total = data.total
                    this.pagination.pageNumber = data.current_page
                    this.list = data ? data.list : []
                } else {
                    this.pagination.total = 0
                    this.pagination.pageNumber = 1
                    this.list = []
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        goToLiveBroadCast () {
            this.$router.push({
                name: 'LiveBroad'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.hot-live {
    margin-top: 15px;
}
.hosts{
    &.is-home {
        li {
            margin-right: 10px;
        }
        li:nth-child(5n) {
            margin-right: 0;
        }
    }
    &.is-not-home {
        li {
            margin-right: 20px;
        }
    }
}
.match-types {
    left: 150px;
    top: 5px;
}
@media screen and (max-width: 1350px) {
    .is-not-home-box {
        padding: 0 10px!important;
    }
}
@media screen and (max-width: 1225px) {
    .is-not-home-box {
        padding: 0 !important;
    }
}
</style>
