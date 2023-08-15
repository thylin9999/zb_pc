<template>
    <div class="page wrap-1200 flex p-t-15 p-b-20">
        <div  class="detail-box bg-white p-10">
            <div class="title p-relative p-t-20 p-b-20 p-l-25">
                <div class="text-333 font-600 news-title">{{ detail.title }}</div>
                <span class="back font-14 p-absolute text-999 pointer font-400" @click="back">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回</span>
                </span>
                <div class="font-14 text-999 font-400 flex align-center ">
                    <div class="">
                        发布时间：<span>{{  detail.create_time  }}</span>
                    </div>
                    <div class="m-l-30">
                        发布人：<span>{{  detail.author  }}</span>
                    </div>
                </div>
            </div>
            <div
                v-loading="isLoading"
                class="content break-all font-16 text-333 font-400 p-t-25 p-b-30 p-l-25" v-html="detail.content">
            </div>
        </div>
        <div class="recommend-box overflow-hidden m-l-10">
            <div class="header font-16 font-500">相关资讯</div>
            <div class="box" v-loading="loadingOthers">
              <ul class="w-100 p-b-10" >
                <li
                    class="w-100 pointer p-l-10 p-t-10 p-r-10"
                    v-for="news in otherNews"
                    :key="news.id"
                >
                  <news-row class="flex align-center" :info="news" />
                </li>
              </ul>
              <no-data v-if="!loadingOthers && !otherNews.length" />
            </div>
        </div>
    </div>
</template>

<script>
import NewsRow from './NewsRow.vue'
import { getNewsDetail, getOtherNews } from '@/api/news'
import { statusCode } from '@/utils/statusCode'
import NoData from '@/components/NoData'
export default {
    name: 'NewsDetail',
    components: {
        NewsRow,
        NoData
    },
    data () {
        return {
            id: null,
            detail: {},
            otherNews: [],
            isLoading: false,
            loadingOthers: false
        }
    },
    watch: {
        '$route': {
            handler () {
                const query = this.$route.query
                this.id = query.id
                if (this.id) {
                    this.fetchData()
                    this.fetchOtherNews()
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async fetchOtherNews () {
            this.loadingOthers = true
            try {
                const { code, data } = await getOtherNews(this.id)
                if (code === statusCode.success) {
                    this.otherNews = data
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.loadingOthers = false
            }
        },
        async  fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getNewsDetail(this.id)
                if (code === statusCode.success) {
                    this.detail = { ...data }
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.isLoading = false
            }
        },
        back () {
            // this.$router.push({
            //     name: 'News'
            // })
            this.$router.go(-1)
        }
    }
}

</script>

<style lang="scss" scoped>
.detail-box {
    width: 840px;
    .title {
        line-height: 30px;
        font-size: 22px;
        border-bottom: 1px solid #EFCFB6;
        .back {
            right: 0;
            top: 20px;
        }
      .news-title {
        width: calc(100% - 50px);
      }
    }
    .content {
      //line-height: 22px;
      min-height: 300px;
    }
}
.recommend-box{
    width: 350px;
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.2);
    .header {
        color: #E2A67A;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
    }
    .box {
      min-height: 200px;
    }
}
</style>
