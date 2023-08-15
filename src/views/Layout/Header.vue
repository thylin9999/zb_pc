<template>
<div class="full-width"
     :class="{
    'is-light-header': isLightHeader,
     'host-page': isHost,
     'p-fixed': isLightHeader || isCompetition,
     'can-hover': opacityHeader,
     'is-live-room ': isLiveRoom || isCompetition,
     'text-logo': isCompetition,
     'live-room': isLiveRoom
    }"
     :style="isLightHeader ? homeHeader : headerStyle"
>
    <div class="p-relative header flex justify-between align-center" :class="{
        'wrap-1200': !isHost && !isLiveRoom
    }">
<!--        <span class="test p-fixed" @click="test">点我</span>-->
        <div class="left-section flex align-center">
            <div class="logo  flex align-center" :class="{
                'is-normal': isLiveRoom || isHost
            }">
                <div class=" bg-no-repeat  logo-bg"
                :class="{
                    'no-text': !isLightHeader,
                    'm-r-30': isLightHeader,
                }"
                  :style="{
                    backgroundImage: `url(${logoUrl})`
                  }"
                ></div>
            </div>
            <ul class="menus flex align-center"
                :class="{'light-header': isLightHeader && !showDark, 'show-dark': showDark, }">
                <template v-for="menu in menus">
                    <template v-if="!menu.hide">
                        <li
                            v-if="!menu.isScore"
                            class="pointer m-r-30 font-500 text-center hover-item"
                            :key="menu.id"
                            :class="{ 'is-active': currentId === menu.id}"
                            @click="changeTab(menu)"

                        >
                            <span class="font-18">{{ menu.text }}</span>
                        </li>
                        <li
                            v-else
                            class="pointer m-r-30 font-400 text-center score-item"
                            :key="menu.id"
                            :class="{ 'is-active': currentId === menu.id}"
                            @click="changeTab(menu)"
                        >
                            <el-popover
                                placement="bottom"
                                width="400"
                                popper-class="score-popper"
                                trigger="hover">
                                <div class="body flex align-center justify-around flex-wrap">
                                    <template v-for="scoreItem in scoreMenus">
                                        <el-button
                                            @click="goToScore(scoreItem)"
                                            class="score-button p-0 m-0 font-regular font-16"
                                            :disabled="scoreItem.disabled"
                                            :class="{
                                                'is-active': scoreActiveLeague === scoreItem.id
                                            }"
                                            :key="scoreItem.id"
                                        >{{ scoreItem.title }}</el-button>
                                    </template>
                                </div>
                                <el-button class="score-slot-button font-600"
                                 :class="{
                                      'is-active': isScorePage
                                 }"
                                 slot="reference">
                                    即时比分
                                    <i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                            </el-popover>
                        </li>
                    </template>
                </template>
            </ul>
            <span
               class="download-app m-r-20 bg-size-100 pointer flex align-center justify-center  font-500 font-18 font-medium"
               :class="{
                                'light': isLightHeader && !showDark
                            }"
                @click="goToDownload"
                >
             </span>

        </div>

        <user-infos class=" p-r-10" :is-light-header="isLightHeader" :show-dark="showDark"/>
        <span class="text-button visibility-hidden p-absolute" id="assistBtn">assistBtn</span>
    </div>
</div>
</template>
<script>
import UserInfos from '@/views/User/UserInfos'
import { mapState } from 'vuex'
// import { invalidateToken } from '@/api/user'
export default {
    name: 'Header',
    components: {
        UserInfos
    },
    inject: ['reload'],
    data () {
        return {
            menus: [
                {
                    id: 1,
                    text: '首页',
                    name: 'Home',
                    sub: 'Home'
                },
                {
                    id: 9,
                    text: '即时比分',
                    isScore: true,
                    name: 'Score',
                    sub: 'Score'
                },
                {
                    id: 5,
                    text: '直播',
                    name: 'LiveBroad',
                    sub: 'LiveBroad'
                },
                {
                    id: 10,
                    text: '资讯',
                    name: 'News',
                    sub: 'News'
                },
                {
                    id: 11,
                    text: '有料',
                    name: 'Guide',
                    sub: 'Guide'
                },
                {
                    id: 2,
                    text: '赛事',
                    name: 'Competition',
                    sub: 'Competition'
                },
                {
                    id: 6,
                    text: '直播间',
                    name: 'live-room',
                    sub: 'LiveRoom',
                    hide: true
                }
            ],
            scoreActiveLeague: 1,
            scoreMenus: [
                {
                    id: 1,
                    title: '足球'
                },
                {
                    id: 2,
                    title: '篮球'
                },
                {
                    id: 3,
                    title: '电竞',
                    disabled: true
                },
                {
                    id: 4,
                    title: '其他',
                    disabled: true
                }
            ],
            currentId: 1,
            opacity: 0,
            opacityHeader: true, // 是否可以hover效果，下拉之后，没有这个效果
            showDark: false // 首页悬浮时，需要修改样式
        }
    },
    computed: {
        ...mapState('commonData', ['isExpired', 'headerWidth']),
        isPersonalCenter () {
            return this.currentId === 7
        },
        isLightHeader () { // 首页
            return this.currentId === 1
        },
        isHost () {
            return this.currentId === 5
        },
        isLiveRoom () {
            return this.currentId === 6
        },
        isCompetition () {
            return this.currentId === 2
        },
        logoUrl () {
            return !(this.isLiveRoom || this.isHost)
                ? require('../../assets/images/common/logo-dark-text.png')
                : require('../../assets/images/common/logo-dark.png')
        },
        homeHeader () {
            return {
                backgroundColor: `rgba(255,255,255,${this.opacity})`
            }
        },
        headerStyle () {
            let res = {}
            if (this.isHost) {
                const width = this.headerWidth > 1200 ? this.headerWidth : 1200
                res = {
                    'width': width + 'px'
                }
            }
            return res
        },
        isScorePage () {
            return this.currentId === 9
        }

    },
    watch: {
        '$route': {
            handler () {
                this.currentId = this.$route.meta.subId
                this.handleScoreMenu()
                this.$nextTick(() => {
                    if (this.isLightHeader) { // 只有首页才需要处理
                        this.opacity = 0
                        this.initScroll()
                    }
                })
            },
            immediate: true,
            deep: true
        },
        isExpired: {
            handler () {
                if (this.isExpired) {
                    // 其他页面原地刷新， 个人中心页面，需要跳转首页
                    if (this.isPersonalCenter) {
                        this.$router.push('/')
                    } else {
                        this.reload()
                    }
                }
            }
        }
    },
    mounted () {
        // if (this.isLightHeader) { // 只有首页才需要处理
        //     this.initScroll()
        // }
        this.$nextTick(() => {
            if (this.isLightHeader) { // 只有首页才需要处理
                this.initScroll()
            }
        })
    },
    methods: {
        enterWorldCup () {
            this.$router.push({
                name: 'WorldCup'
            })
        },
        initScroll () {
            // window.removeEventListener('scroll', this.handleHomeScroll)
            // 处理滚动的问题
            window.addEventListener('scroll', this.handleHomeScroll)
        },
        handleHomeScroll () {
            const scrollTop = document.documentElement.scrollTop
            this.opacity = scrollTop / 70
            this.opacityHeader = scrollTop <= 70
            this.showDark = scrollTop > 0
        },
        changeTab (tab) {
            this.currentId = tab.id
            this.$router.push({
                name: tab.name
            })
        },
        goToDownload () {
            this.$router.push({
                name: 'DownloadApp'
            })
        },
        handleScoreMenu () {
            const { scoreLeague } = this.$route.query
            // 默认选中足球
            this.scoreActiveLeague = (scoreLeague || 1) * 1
        },
        goToScore ({ id, title }) {
            this.$router.push({
                name: 'Score',
                query: {
                    scoreLeague: id
                }
            })
        }
        // async test () {
        //     const { code, data } = await invalidateToken(true)
        //     console.log(code, data, 'asdf')
        // }
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handleHomeScroll)
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
//.test {
//    left: 100px;
//    top: 100px;
//    z-index: 10000;
//    color: #fff;
//}
.full-width {
    width: 100%;
    min-width: 1200px;
}

.is-light-header.p-fixed {
    left: 0;
    top: 0;
    z-index: 1999;
  &.can-hover:hover {
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
    background-color: hsla(0,0%,100%,.08) !important;
  }
}
.header {
    height: 60px;
    margin: auto;
    .logo {
        &.is-normal {
            width: 210px;
          .logo-bg {
            width: 155px!important;
          }
        }
        height: 60px;
        line-height: 60px;
        img{
            width: 155px;
            height: 40px;
        }
        .logo-bg {
          width: 95px;
          height: 40px;
          background-size: auto 100%;
          background-position: left center;
          &.no-text {
              width: 95px;
              height: 40px;
              margin: 0 auto;
          }
        }
    }
    .menus {
        li {
            width: 60px;
            height: 30px;
            line-height: 30px;
            color: #333;
            &.score-item {
                width: 105px;
            }
            &:not(.score-item).is-active, &.hover-item:hover {
                border-radius: 10px;
                color: $text-white;
                background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            }
            .score-slot-button {
              color: #333;
            }
        }
        &.light-header {
            li {
                color: $text-white;
              .score-slot-button {
                color: #fff;
              }
            }
        }
    }
    .world-cup-icon{
        margin-left: 30px;
        width: 196px;
        height: 48px;
    }
}
.download-app{
    width: 72px;
    height: 25px;
    color: #3DB1FB;
    background-image: url('../../assets/images/download/download-now.gif');

    &.light {
        color:#E7CC9D;
    }
}

.live-room {
    padding-right: 35px;
}

.is-live-room {
    position: fixed;
    left: 0;
    z-index: 1999;
    top: 0;
    background-color: #fff;
}

.score-slot-button {
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  border-radius: 5px;
  border: none;
  padding: 5px;
  background: transparent;
  &:hover {
    color: #fff!important;
    background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
  }
}

#assistBtn {
  z-index: -1;
}
::v-deep {
    .el-button.is-active {
        color: #fff!important;
        background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
    }
    .el-button.score-button {
        &:hover, &.is-active {
            color: #fff!important;
            background: #A05A77;
        }
    }
}
</style>
