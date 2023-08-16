<template>
    <div class="host-section wrap-1200 ">
<!--      <div class="host-banner w-100 bg-no-repeat bg-center bg-size-cover"-->
<!--           :style="{-->
<!--                    backgroundImage: `url(${hotHostBanner})`-->
<!--                }"-->
<!--      ></div>-->
      <div class="w-100 content-box m-t-15 flex justify-between ">
        <div class="left-host h-100">
          <div class="hosts bg-white">
            <div class="header w-100 flex justify-center align-center p-relative">
              <div class="hot-host m-t-20 text-center font-14 text-white bg-no-repeat bg-center bg-size-cover">
                  <span class="label">热门主播</span>
              </div>
              <div class="apply-host m-t-25  p-r-15 pointer p-absolute flex align-center"
                   :class="{
                        'visibility-hidden': !(!isLoginMode || !isHostAnchor)
                      }"
              >
<!--                <span class="icon bg-no-repeat bg-center bg-size-cover icon-15 d-inline-block"></span>-->
                <span class="font-12 "

                      @click="queryHost">申请开播</span>
              </div>
            </div>
            <div class="host-list w-100 m-t-30 p-relative">
                <span class="operate-button text-center pointer left p-absolute"
                  :class="{
                      'not-allowed': !leftMove
                    }"
                >
                    <i class="el-icon-arrow-left"></i>
                </span>
                <span class="operate-button text-center pointer right p-absolute"
                  :class="{
                      'not-allowed': !leftMove
                    }"
                >
                    <i class="el-icon-arrow-right"></i>
                </span>
              <div class="list-box overflow-x-auto " ref="listBox">
                <div ref="listRef" class="list-parent flex align-center justify-center" :style="listParentStyle">
                  <template
                      v-for="host in hosts"
                  >
                    <div
                        class="item p-b-10 text-center"
                        :key="host.id"
                        @click="goToLiveRoom(host)"
                    >
                      <div style="border-radius: 50%;overflow: hidden"
                          class="avatar d-inline-block p-relative bg-center bg-no-repeat bg-size-cover"
                          v-lazy-container="{ selector: 'img' }"
                      >
                          <img class="w-100 h-100" :data-src="host.logo" :data-error="errorUserLogo" alt="">
                        <span class="live-icon d-inline-block bg-center bg-no-repeat bg-size-cover p-absolute"></span>
                      </div>
                      <p class="font-14 font-600 text-333 m-t-5">{{ host.anchor_name || '其他' }}</p>
                      <p v-show="false" class="font-12 text-5a m-t-5">{{ host.leagueChsShort || '--' }}</p>
                      <custom-span v-show="false" class="font-12 w-100 text-5a m-t-5" :content="`${host.homeChs || '其他'} VS ${host.awayChs || '其他'}`"></custom-span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-news bg-white h-100 overflow-hidden p-b-20">
          <div class="header p-l-20 p-t-15 p-b-15 p-r-20 flex align-center justify-between">
            <div class="flex align-center justify-between labels">
                <span
                    v-for="label in labels"
                    :key="label.id"
                    class="pointer"
                    :class="{
                        'is-active text-333 font-16 font-600': label.id === currentLabel,
                        'font-14  font-400': label.id !== currentLabel,
                    }"
                    @click="changeLabel(label)"
                >
                    {{ label.title  }}
                </span>
            </div>
<!--            <more-button  @click.native="goToNotice"/>-->
          </div>
<!--          <div  class="list-box m-t-20 flex flex-column overflow-y-auto"-->
<!--            v-loading="isLoading"-->
<!--          >-->
<!--            <template v-if="ads.length">-->
<!--              <template-->
<!--                  v-for="ad in ads"-->
<!--              >-->
<!--                <div class="news-row w-100 flex align-center m-b-5 p-r-10 p-l-20" :key="ad.id" @click="clickAd(ad)">-->
<!--                  <CustomSpan class="pointer font-14 d-inline-block w-100 " :content="ad.title" />-->
<!--                </div>-->
<!--              </template>-->
<!--            </template>-->
<!--            <no-data v-else />-->
<!--          </div>-->
        </div>
      </div>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getHostList } from '@/api/Host/Host'
import { getAd, getEvents } from '@/api/Common'
import NoData from '@/components/NoData'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import CustomSpan from '@/components/CustomSpan'
import MoreButton from '@/components/MoreButton'
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'HomeHostSection',
    components: { CustomSpan, MoreButton, NoData },
    data () {
        return {
            isLoading: false,
            leftMove: false,
            rightMove: false,
            ads: [],
            hosts: [],
            hostBanners: [],
            labels: [
                {
                    id: 1,
                    title: '公告'
                },
                {
                    id: 2,
                    title: '活动'
                },
                {
                    id: 3,
                    title: '帮助',
                    isLocal: true
                },
                {
                    id: 4,
                    title: '用户协议',
                    isLocal: true
                }
            ],
            currentLabel: 1,
            helps: [
                {
                    id: 7,
                    label: '直播工具',
                    title: '直播工具',
                    buttonId: 4
                },
                {
                    id: 5,
                    label: '直播教程',
                    title: '直播教程',
                    buttonId: 3
                },
                {
                    id: 6,
                    label: '直播规范',
                    title: '直播规范',
                    buttonId: 2
                }
            ],
            protocols: [
                {
                    id: 2,
                    title: '用户协议'
                },
                {
                    id: 8,
                    title: '直播协议',
                    buttonId: 1
                }
                // {
                //     id: 9,
                //     title: '注销协议'
                // }
            ]
        }
    },
    created () {
        this.getImage(2) // 热门主播 banner
        this.fetchData()
        this.getAd()
    },
    computed: {
        ...mapState('user', ['token']),
        ...mapGetters('user', ['isHostAnchor', 'isLoginMode']),
        listParentStyle () {
            return {
                width: this.hosts.length * 140 + 'px'
            }
        },
        hotHostBanner () {
            return this.hostBanners.length && this.hostBanners[0].pic_url
        }
    },
    mounted () {
        this.$nextTick(() => {
            const els = document.querySelectorAll('.marquee-ref')
            const elsArr = Array.from(els)
            elsArr.forEach(el => {
                el.stop()
            })
        })
    },
    methods: {
        async getImage (type) { // 热门赛程下方的banner图
            try {
                const { data, code } = await getEvents(type)
                if (code === statusCode.success) {
                    if (type === 1) {
                        this.banners = data || []
                    } else {
                        this.hostBanners = data || []
                    }
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        initScroll () {
            this.$nextTick(() => {
                const wrapperInfo = this.$refs.listBox.getBoundingClientRect()
                const wrapperWidth = wrapperInfo.width
                const innerUlInfo = this.$refs.listRef.getBoundingClientRect()
                const innerUlWidth = innerUlInfo.width
                this.rightMove = this.$refs.listBox.scrollLeft + wrapperWidth + 10 < innerUlWidth
                this.leftMove = this.$refs.listBox.scrollLeft > 10
            })
        },
        prev () {
            if (this.leftMove) {
                const left = this.$refs.listBox.scrollLeft
                this.$refs.listBox.scrollTo({
                    left: left - 130,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        next () {
            if (this.rightMove) {
                const left = this.$refs.listBox.scrollLeft
                this.$refs.listBox.scrollTo({
                    left: left + 130,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        async getAd () {
            try {
                this.ads = []
                const { data, code } = await getAd({ pageSize: 8 })
                if (code === statusCode.success) {
                    this.ads = (data && data.list) || []
                }
            } catch (e) {
                console.log('出粗了')
            } finally {
                this.isLoading = false
            }
        },
        async fetchData () {
            try {
                const { data, code, msg } = await getHostList(2)
                if (code === statusCode.success) {
                    this.hosts = data || []
                    this.initScroll()
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        goToLiveRoom (host) {
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: host.member_id }
            })
            window.open(href, '_blank')
        },
        clickAd (ad) {
            if (ad.jump_type === 1 || ad.type === 2) {
                // 内部跳转
                this.$router.push({
                    path: ad.links
                })
            } else if (ad.jump_type === 2 || ad.type === 3) { // 外跳
                window.open(ad.links, '_blank')
            }
            if ([3, 4].includes(this.currentLabel)) {
                const params = {
                    tabId: ad.buttonId ? 2 : 3
                }
                if (ad.buttonId) {
                    params.buttonId = ad.buttonId
                }
                this.$router.push({
                    name: 'HelpCenter',
                    params
                })
            }
        },
        goToNotice () {
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId: 1
                }
            })
        },
        changeLabel (label) {
            this.currentLabel = label.id
            // 请求数据
            this.fetchContents()
        },
        fetchContents () {
            this.isLoading = true
            if (this.currentLabel === 1) {
                this.getAd()
            } else if (this.currentLabel === 2) {
                // 活动
                this.getEvents()
            } else {
                // 其他
                this.ads = this.currentLabel === 3 ? this.helps : this.protocols
                this.isLoading = false
            }
        },
        async getEvents () {
            try {
                const { data, code } = await getEvents(3)
                if (code === statusCode.success) {
                    this.ads = data || []
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

.host-banner {
  height: 100px;
  border-radius: 10px;
}
.content-box {
  height: 240px;
}
.left-host {
    width: 800px;
    .hosts {
        height: 240px;
        border-radius: 10px;
    }
    .hot-host {
      line-height: 36px;
      width: 165px;
      height: 36px;
      font-weight: 600;
      background: linear-gradient(90deg, #7C2246 0%, #251222 100%);
      box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.29);
      border-radius: 10px;
      border-image: linear-gradient(180deg, rgba(114, 114, 128, 1), rgba(23, 21, 42, 1)) 1 1;
      .label {
        background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .apply-host {
        width: 99px;
        height: 30px;
        background: #FEF2E4;
        border-radius: 18px;
        right: 15px;
        line-height: 30px;
        padding-left: 35px;
        color: #E6B48E;
      &:before {
        position: absolute;
        content: '';
        left: 15px;
        top: 8px;
        width: 14px;
        height: 14px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('../../assets/images/host/apply-host_h.png');
      }
      &:hover {
        background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
        color: #fff;
        &:before {
          background-image: url('../../assets/images/host/apply-host.png');
        }
      }

    }

    .host-list {
        overflow: hidden;
        height: 145px;
        .list-box {
            width: 670px;
            margin: 0 auto;
            height: calc(100% + 20px)
        }
        .item {
            width: 130px;
            margin: 0 5px;
            .avatar {
                width: 64px;
                height: 64px;
                border-radius: 3px;
                img {
                  border-radius: 3px;
                }
            }
            .live-icon {
                width: 20px;
                height: 20px;
                bottom: -2px;
                right: -3px;
                background-image: url('../../assets/images/host/live-icon.gif');
            }
        }

      .operate-button{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          line-height: 36px;
          font-size: 20px;
          font-weight: 600;
          border: 2px solid #6C73AF;
          &.left {
            left: 20px;
            top: 15px;
          }
        &.right {
          right: 20px;
          top: 15px;
        }
      }
    }
}
.right-news {
    border-radius: 10px;
    width: 390px;
    .header {
        border-bottom:1px solid #DEE4FF;
        .labels {
            width: 60%;
            color: #999;
        }
    }
    .list-box {
        height: calc(100% - 65px);
        .news-row {
            line-height: 20px;
            height: 20px;
            &:before {
                display: inline-block;
                border-radius: 50%;
                content: '';
                width: 5px;
                height: 5px;
                margin-right: 10px;
                background-color: #D8D8D8;
            }
            color: #646464;
          &:hover {
            color: #409eff;
            &:before {
              background-color: #409eff;
            }
          }
        }
    }

}
</style>
