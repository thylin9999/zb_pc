<template>
    <div class="wrap-1200 flex align-center">
        <div class="left-news m-r-10 ">
            <div class="p-relative">
                <title-row icon="news" title="体育资讯" class="m-b-5">
                    <div class="font-12 pointer font-400 p-relative more-btn" @click="goToNewsList">
                      <span>更多</span>
                      <i class="font-14 font-600 el-icon-arrow-right"></i>
                    </div>
                </title-row>
                <match-types
                    class="match-types flex-1 p-absolute"
                    :options="types"
                    :active-id.sync="activeId"
                />
            </div>
            <div
                v-if="currentType"
                v-loading="isLoading"
                class="content border-radius-10 m-t-10 overflow-hidden p-10 bg-white flex align-center"
                 >
                <template v-if="newsList.length">
                  <div class="first-news flex-shrank-0 p-relative overflow-hidden">
                    <img class="w-100 h-100" :src="firstNews.cover" alt="">
                    <CustomSpan class="title p-l-15 w-100 p-absolute text-white font-18" :content="firstNews.title"></CustomSpan>
                  </div>
                  <ul class="news-rows m-l-10 flex-1 h-100 flex flex-column ">
                    <li
                        v-for="news in newsList"
                        :key="news.id"
                        class="news-item pointer m-b-5"
                    >
                      <news-row class="flex align-center" :info="news" />
                    </li>
                  </ul>
                </template>
                <no-data  v-if="!isLoading && !newsList.length" />
            </div>
        </div>
        <div class="right-experts">
            <expert-list />
        </div>
    </div>
</template>

<script>
import { getNewsTypes, getNews } from '../../api/news/index'
import TitleRow from '@/components/TitleRow'
import MatchTypes from '@/views/components/MatchTypes'
import CustomSpan from '../../components/CustomSpan'
import ExpertList from '../components/ExpertList.vue'
import NewsRow from './NewsRow.vue'
import { statusCode } from '@/utils/statusCode'
import { mapMutations } from 'vuex'
import NoData from '@/components/NoData.vue'
export default {
    name: 'HomeNews',
    components: {
        TitleRow,
        MatchTypes,
        CustomSpan,
        ExpertList,
        NewsRow,
        NoData
    },
    data () {
        return {
            types: [
                {
                    id: 0,
                    title: '全部'
                },
                {
                    id: 1,
                    title: '欧冠'
                },
                {
                    id: 2,
                    title: '英超'
                },
                {
                    id: 3,
                    title: '意甲'
                },
                {
                    id: 4,
                    title: '法甲'
                },
                {
                    id: 5,
                    title: '德甲'
                },
                {
                    id: 6,
                    title: '西甲'
                }
            ],
            activeId: 0,
            newsList: [],
            isLoading: false
        }
    },
    computed: {
        apiParams () {
            const type = this.types.find(x => x.id === this.activeId)
            return {
                pageSize: 6,
                currentPage: 1,
                type: type.title
            }
        },
        currentType () {
            return this.types.find(x => x.id === this.activeId)
        },
        firstNews () {
            return this.newsList[0]
        }
    },
    watch: {
        activeId () {
            this.fetchData()
        }
    },
    created () {
        // this.initTypes()
        this.activeId = this.types[0].id
        this.fetchData()
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        async initTypes () {
            try {
                const { data, code } = await getNewsTypes()
                if (code === statusCode.success) {
                    this.types = data.reduce((all, item, index) => {
                        all.push({
                            title: item,
                            id: index
                        })
                        return all
                    }, [])
                    // this.SET({ newsTypes: this.types })
                    this.activeId = this.types[0].id
                    this.fetchData()
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getNews(this.apiParams)
                if (code === statusCode.success) {
                    const list = (data && data.list) || []
                    this.newsList = list.slice(0, 5)
                }
            } catch (e) {
                console.log('出错le', e)
            } finally {
                this.isLoading = false
            }
        },
        goToNewsList () {
            this.$router.push({
                name: 'News'
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.left-news{
    width: 880px;
    height: 416px;
    .content {
        height: 370px;
    }
  .more-btn {
    z-index: 5;
    line-height: 26px;
    margin-top: 5px;
    color: #409eff;
  }
}
.right-experts {
    width: 310px;
}
.match-types {
    width: calc(100% - 150px);
    left: 150px;
    top: 5px;
}

.first-news {
    width: 420px;
    height: 350px;
    background: #D8D8D8;
    border-radius: 10px;
    .title {
        left: 0;
        bottom: 17px;
    }
}
.news-rows{
  width: 430px;
}
.news-item {
  &:last-child {
    margin-bottom: 0!important;
  }
}
</style>
