<template>
    <div class="home show-scrollbar">
        <div class="box" :style="{
          backgroundImage: `url(${bgUrl})`
      }">
            <div class="video-box">
                <div class="video">
                    <div class="video_view">
                        <keep-alive v-if="isRouterAlive">
                            <VideoHome :videoInfo="videoInfo" v-on:initRoomInfo="initRoomInfo" :roomInfoHome="roomInfoHome"></VideoHome>
                        </keep-alive>
                    </div>
                    <div class="videoList">
                        <div class="item" :class="{select:current == i}" v-for="(item,i) in list" :key="i">
                            <img v-if="current == i" class="icon_arr_r" :src="require('@/assets/images/home/icon-arr-r.png')" alt="">
                            <img @click="selectLive(item,i)" class="item_img" :src="item.live_cover || require('@/assets/images/common/host-avatar.png')" alt="">
                        </div>
                        <div class="item item_blank" v-for="tem in (6-list.length)" :key="1000-tem"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray2">
            <div class="wrap-1200 p-t-25">
                <match-list-row show-buttons class="m-t-n-10 w-100" />
            </div>
            <!-- 热门直播 -->
            <hot-recommend
                class="wrap-1200"
                is-home
                :home-data="list"
                :key="list.length"
            />
            <home-news />
            <!--          主播列表-->
            <lazy-component>
                <HomeHostSection class="m-t-15" />
            </lazy-component>
            <!--          <host-rank />-->
            <lazy-component>
                <host-list class="wrap-1200" is-home/>
            </lazy-component>
            <!-- 赛事推荐 -->
            <div class="wrap-1200">
                <lazy-component>
                    <MatchRecomment />
                </lazy-component>
            </div>
            <div class="wrap-1200">
                <lazy-component>
                    <events />
                </lazy-component>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import VideoHome from '@/components/VideoHome'
import HotRecommend from '../components/HotRecommend'
import HostList from '@/views/Host/HostList'
import MatchListRow from '@/views/Competition/MatchListRow'
import Events from '@/views/components/Events'
import HomeHostSection from '@/views/Host/HomeHostSection'
import MatchRecomment from '@/views/Competition/MatchRecomment'
import HomeNews from './News/HomeNews.vue'
import { getHotRooms } from '@/api/competition/competition'
import { getEvents } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
export default {
    name: 'Home',
    components: {
        HomeNews,
        VideoHome,
        HotRecommend,
        HomeHostSection,
        HostList,
        MatchListRow,
        Events,
        MatchRecomment
    },
    data () {
        return {
            isRouterAlive: true,
            current: 0,
            videoInfo: {},
            list: [],
            competitions: [],
            showDialog: false,
            banners: [], // 热门赛程下方banner
            hostBanners: [],
            // bgUrl: null,
            roomInfoHome: null
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    computed: {
        ...mapState('user', ['token']),
        // hotBanner () {
        //     return this.banners.length && this.banners[0].pic_url
        // },
        hotHostBanner () {
            return this.hostBanners.length && this.hostBanners[0].pic_url
        },
        bgUrl() {
            return require('../assets/images/common/home-bg.jpg')
        }

    },
    created () {
        this.fetchData()
        // this.getImage(1) // 热门赛事 banner
        // this.getImage(4, {
        //     requestTimeoutType: 'adv'
        // }) // 首页背景图
    },
    mounted () {
        // if (!this.token) {
        //     this.$nextTick(() => {
        // this.setLoginPopup(true)
        //     })
        // }
    },
    methods: {
        reload () {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },
        initRoomInfo (val) {
            this.roomInfoHome = val
        },
        async getImage (type, config) { // 热门赛程下方的banner图
            const { data, code } = await getEvents(type, config)
            if (code === statusCode.success) {
                if (type === 1) {
                    this.banners = data || []
                } else if (type === 4) {
                    // 背景图
                    this.bgUrl = data.length && data[0].pic_url
                } else {
                    this.hostBanners = data || []
                }
            }
        },
        openLoginDialog () {
            this.showDialog = true
        },
        selectLive (item, i) {
            this.current = i
            this.videoInfo = item
        },
        async fetchData () {
            try {
                const { data } = await getHotRooms({})
                if (data) {
                    this.videoInfo = data.list[0]
                    // 首页展示4条，直播页面展示5条
                    this.list = data.list.slice(0, 6)
                    this.selectLive(this.videoInfo, 0)
                }
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
@import '@/theme/default-vars.scss';

.box{
    margin-top: -70px;
    padding-top: 70px;
    width: 100%;
    height: 670px;
    background: url('../assets/images/home/bg.png') no-repeat;
    background-size: 100% 100%;
}
.video-box{
    width: 1200px;
    margin: auto;
    height: 574px;
    padding-top: 5px;

    .video {
        height: 574px;
        z-index: 2;
        display: flex;
        border-radius: 5px;
        background-color: rgba(11,9,9,.66);
      overflow: hidden;
        .video_view{
          width: 1024px;
          height: 574px;
        }
        .videoList{
            width: 174px;
            height: 574px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: space-around;
          .item{
            border-radius: 5px;
            width: 160px;
            height: 86px;
            border: none;
            position: relative;
            .item_img{
              width: 100%;
              height: 100%;
            }
            .icon_arr_r{
              width: 8px;
              height: 14px;
              position: absolute;
              left: -8px;
              top: 0;
              bottom: 0;
              margin: auto;
              z-index: 2;
            }
          }
          .select{
            border: 2px solid #d2ac84;
          }
          .item:hover{
            border: 2px solid #d2ac84;
          }
          .item_blank:hover{
            border: none;
          }
        }
    }
}
.banner {
    height: 100px;
    border-radius: 5px;
}
::v-deep {
    .title-row-icon {
        width: 35px;
        height: 35px;
    }
}
</style>
