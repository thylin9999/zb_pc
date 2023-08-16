<template>
    <div class="wrap-1200 p-t-10">
        <div class="tabs w-100 flex align-center">
            <ul class="w-100 flex align-center justify-between">
                <li
                    class="font-16 pointer p-t-5 text-center p-b-5  text-white font-400 "
                    v-for="(tab, index) in  types"
                    :class="{
                        'is-active': index === currentTab
                    }"
                    :key="tab"
                    @click="changeType(index)"
                >{{  tab  }}</li>
            </ul>
        </div>
        <div class="w-100 swiper-box m-t-10"
          v-loading="swiperLoading"
        >
            <Swiper
                :list="swiperList"
                is-news
            />
        </div>
        <div class="box news-box bg-white m-t-10" v-loading="isLoading">
          <ul class="w-100"  v-infinite-scroll="load">
            <li
                v-for="item in newsList"
                :key="item.id"
                class="flex align-center news-row pointer"
                @click="goDetail(item)"
            >
              <div class="left">
                <img class="w-100 h-100" :src="item.cover" alt="">
              </div>
              <div class="right flex h-100 flex-column p-relative">
                  <custom-span class="title font-600" :content="item.title"/>
<!--                <span class="title font-600">{{  item.title }}</span>-->
                <div class="abstrat text-3-ellipsis font-18   m-t-15">{{ item.content | handleContent }}</div>
                <span class="time font-18 text-999 p-absolute">{{ item.create_time }}</span>
              </div>
            </li>
          </ul>
          <p class="loading" v-loading="isLoading" v-if="isLoading && !noMore"></p>
          <p class="p-t-15 p-b-10 text-center" v-if="noMore && newsList.length">没有更多了。。。</p>
          <NoData class="p-t-10" v-if="!newsList.length && !isLoading" />
        </div>

    </div>
</template>

<script>
import { getNewsTypes, getNews, getBanners } from '../../api/news'
import { statusCode } from '../../utils/statusCode'
import Swiper from '../../components/Swiper.vue'
import NoData from '@/components/NoData'
import { mapState } from 'vuex'
import { getZhCharactor } from '@/utils/utils'
import CustomSpan from '@/components/CustomSpan.vue'

export default {
    name: 'News',
    filters: {
        handleContent (value) {
            return getZhCharactor(value)
        }
    },
    components: {
        CustomSpan,
        Swiper,
        NoData
    },
    data () {
        return {
            loading: false,
            types: [],
            currentTab: 0,
            pagination: {
                currentPage: 1,
                pageSize: 20,
                total: 0
            },
            swiperList: [],
            newsList: [],
            isLoading: false,
            maxPage: 0,
            swiperLoading: false
        }
    },
    computed: {
        ...mapState('commonData', ['newsTypes']),
        apiParams () {
            const type = this.types.find((_, index) => index === this.currentTab)
            return {
                pageSize: this.pagination.pageSize,
                currentPage: this.pagination.currentPage,
                type: type === '全部' ? '' : type
            }
        },
        noMore () {
            return this.newsList.length >= this.pagination.total
        }
    },
    created () {
        this.init()
        this.fetchBanners()
    },
    watch: {
        currentTab: {
            handler () {
                this.pagination.total = 0
                this.pagination.currentPage = 1
                this.newsList = []
                this.fetchData()
            }
        }
    },
    methods: {
        load () {
            if (this.noMore) {
                return
            }
            this.pagination.currentPage += 1
            this.fetchData()
        },
        async fetchBanners () {
            this.swiperLoading = true
            try {
                const { code, data } = await getBanners()
                if (code === statusCode.success) {
                    this.swiperList = data
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.swiperLoading = false
            }
        },
        async init () {
            try {
                const { data, code } = await getNewsTypes()
                if (code === statusCode.success) {
                    this.types = data || []
                    this.fetchData()
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        changeType (type) {
            this.pagination.currentPage = 1
            this.currentTab = type
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { data, code } = await getNews(this.apiParams)
                if (code === statusCode.success) {
                    const list = data.list || []
                    this.newsList.push(...list)
                    this.pagination.total = data.total
                }
            } catch (e) {
                console.log('出错了', e)
            } finally {
                this.isLoading = false
            }
        },
        goDetail (item) {
            this.$router.push({
                name: 'NewsDetail',
                query: {
                    id: item.id
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.tabs {
    height:  80px;
    padding: 0 30px;
    background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
    border-radius: 10px;
    li {
        border-radius: 10px;
        line-height: 30px;
        width: 70px;
        &.is-active, &:hover {
            font-weight: 500;
            background: linear-gradient(90deg, #c765bf 0%, #E1A579 100%);
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.37);background-color: #fff;
        }
    }
}
.swiper-box{
    height: 375px;
}
.news-box{
    padding: 0 35px;
    min-height: 300px;
    border-radius: 10px;
}
.news-row{
    padding: 35px 0;
    border-bottom: 1px solid #EFCFB6;
    .left {
        width: 300px;
        height: 160px;
        border-radius: 10px;
        overflow: hidden;
    }
    .right {
        width: calc(100% - 335px);
        margin-left: 35px;
        height: 160px;
        color: #999;
        .title {
            line-height: 30px;
            font-size: 22px;
            color: #333;
        }
        .abstrat {
            line-height: 25px;
            max-height: 75px;
            overflow: hidden;
        }
        .time {
            left: 0;
            bottom: 0;
            line-height: 25px;
        }
    }
    &:hover {
      .right {
        color:#409eff;
        .title {
          color:#409eff;
        }
      }
    }
}
.loading{
  height: 200px;
}
</style>
