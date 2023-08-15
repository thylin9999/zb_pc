<template>
<div class="hot-rooms" :class="{'is-not-home': !isHome, 'is-in-home': isHome }">
    <title-row
        icon="hot"
        title="热门直播"
        class="m-b-15 m-t-20"
    />
    <div class="w-100 loading-height"
         v-loading="isLoading"
         element-loading-background="transparent">
        <ul v-if="list.length" class="w-100 flex flex-wrap align-center">
            <li
                v-for="(item, index) in list"
                :key="item.id"
                class="m-r-10 m-b-20"
            >
                <live-broad-card
                    :index="index"
                    :info="item"
                    :show-top-img="!isHome"
                />
            </li>
        </ul>
        <no-data v-if="list && !list.length && !isLoading"/>
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import LiveBroadCard from '@/components/LiveBroadCard'
import { getHotRooms } from '@/api/competition/competition'
import NoData from '@/components/NoData'
export default {
    name: 'HotRecommend',
    props: {
        isHome: {
            type: Boolean,
            default: false
        },
        homeData: {
            type: Array,
            default: () => []
        }
    },
    components: {
        TitleRow,
        LiveBroadCard,
        NoData
    },
    data () {
        return {
            list: [],
            isLoading: false
        }
    },
    computed: {
        pageSize () {
            return this.isHome ? 5 : 20
        }
    },
    created () {
        if (!this.isHome) {
            this.fetchData()
        } else {
            this.list = this.homeData.slice(0, 5)
        }
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data } = await getHotRooms({ pageSize: this.pageSize })
                console.log(this.pageSize, '22222')
                // 首页展示4条，直播页面展示5条
                // this.list = this.isHome ? data.list.slice(0, 4) : data.list
                this.list = data ? data.list : []
                // this.list = data.list.concat(data.list)
            } catch (e) {
                console.log('出粗了')
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.is-in-home {
    li:nth-child(5n) {
        margin-right: 0!important;
    }
}
.is-not-home {
    width: 100%;
}
@media screen and (max-width: 1350px) {
    .is-not-home {
        padding: 0 10px!important;
    }
}
@media screen and (max-width: 1225px) {
    .is-not-home {
        padding: 0 !important;
    }
}
</style>
