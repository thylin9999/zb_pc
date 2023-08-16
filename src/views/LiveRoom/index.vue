<template>
  <div class="live-room">
    <div class="box" v-if="roomInfo && anchorInfo">
      <div class="left">
        <div class="match-title" v-if="roomInfo.match_info">
          <div class="home_away" v-if="roomInfo.match_info">
            <el-tooltip class="item" effect="dark" :content="roomInfo.match_info.homeChs" placement="top-start">
              <div class="homeChs">{{ roomInfo.match_info.homeChs }}</div>
            </el-tooltip>
            <div class="homeScore">{{ roomInfo.match_info.homeScore }}</div>
            <img class="homeLogo" :src="homeLogo" alt="">
            <img class="vs" :src="require('@/assets/images/live-room/vs.png')" alt="">
            <img class="awayLogo" :src="awayLogo" alt="">
            <div class="awayScore">{{ roomInfo.match_info.awayScore }}</div>
            <el-tooltip class="item" effect="dark" :content="roomInfo.match_info.awayChs" placement="top-start">
              <div class="awayChs">{{ roomInfo.match_info.awayChs }}</div>
            </el-tooltip>
          </div>
          <div class="title-right" v-if="isFootball || isBasketBall" @click="toLineup">
            赛事实况
          </div>
        </div>
        <div class="top" >
          <div class="img_title overflow-hidden bg-no-repeat bg-center bg-size-cover"

               v-lazy-container="{ selector: 'img' }"
          >
              <img class="w-100 h-100" :data-src="anchorInfo.logo" :data-error="errorUserLogo" alt="">
          </div>
          <div class="room_title" v-if="roomInfo">
            <custom-span
              class="name  font-16 font-600 text-333"
              :content="roomInfo.room_title"
            />
          </div>
          <div class="sign_list">
            <div class="anchor">
              {{ anchorInfo.anchor_name }}
            </div>
            <div class="room_no">房间ID：<span class="no">{{ anchorInfo.member_id }}</span></div>
            <div class="room_hot">
              <span class="iconfont hot-icon">&#xe61a;</span>
              <span class="num">{{ roomInfo.heat_num }}</span>
            </div>
          </div>
          <div class="watch_phone" @mousemove="showModule = true" @mouseleave="showModule = false">
            <span class="iconfont" style="color: #999">&#xe615;</span>
            <span style="font-size: 12px;padding: 0 5px;color: #999999">分享</span>
            <div v-if="showModule"
                 class="showModule scale clear">
              <div class="txt_call">精彩解说，尽在看球直播！</div>
              <div class="txt_share_box">
                <span>分享到：</span>
                <div class="img_share_box">
                  <img :src="require('@/assets/images/room/qq.png')" class="btn" alt=""
                       @click="shareClick('qq')">
                  <img :src="require('@/assets/images/room/qq_zoom.png')" class="btn" alt=""
                       @click="shareClick('qqZone')">
                </div>
              </div>
              <div class="box_copy">
                <input disabled type="text" class="inp_url" v-model="shareUrl">
                <span class="btn copy" @click="copy">复制链接</span>
              </div>
              <div class="qr_share">
                <QR :widthT="95"></QR>
                <p class="txt">扫码分享</p>
              </div>
            </div>
          </div>
          <div class="complain">
            <!--            <img :src="require('@/assets/images/live-room/complain-icon.png')"-->
            <!--                 style="width: 14px;vertical-align: bottom" alt="">-->
            <span class="iconfont" style="color: #999">&#xe61d;</span>
            <span style="font-size: 12px;padding: 0 5px;color: #999999">举报/投诉</span>
          </div>
          <div class="book_box book_btn" v-throttle="[()=>followHost(),3000]">
            <span class="iconfont hot-focus">&#xe616;</span>{{ anchorInfo.is_follow ? '已关注' : '关注' }}
            <span class="up">|</span>
            <span>  {{ anchorInfo.follow }}</span>
          </div>
        </div>
        <keep-alive v-if="isRouterAlive">
          <div class="video_box">
            <div v-if="roomInfo.live_status == 2" class="video-room">
              <VideoRoom @sendMessage="sendMessage" :videoInfo="roomInfo" ref="videoRoom"></VideoRoom>
            </div>
            <CloseRecommend v-else class="closeRecommend"></CloseRecommend>
            <div class="leaveStatus" v-if="roomInfo.live_status == 1 ">主播已下播</div>
            <gift-login-tips v-if="showGiftLogin" />
          </div>
        </keep-alive>
        <!-- <div class="gifts w-100">
            <gifts
                :anchor-info="giftAnchorInfo"
            />
        </div> -->
        <downsection
          id="liveroom-downsection"
          :anchor-id="anchorInfo && anchorInfo.member_id"
          :match-id="matchId"
          :match-info="matchInfo"
        />
      </div>
      <div class="right flex flex-column">
          <div class="gift-ranking">
              <div class="bg-white p-l-15 p-t-10 p-b-10 p-r-10">
                  <live-announce />
              </div>
              <!-- <div class="m-t-10 bg-white">
                  <gift-ranking
                      :anchor-id="anchorInfo && anchorInfo.member_id"
                  />
              </div> -->
          </div>
          <div class="chat-section flex-1"
          >
              <Chat
                  ref="chat"
                  :no-marqueen="true"
                  :roomInfo="roomInfo"
                  v-on:send="sendDankamu"
                  @changeStatus='changeStatus'></Chat>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import QR from '@/views/Layout/QR'
import Chat from './chat/index'
import VideoRoom from '@/components/VideoRoom1'
import GiftRanking from '@/views/LiveRoom/Components/GiftRanking.vue'
import { statusCode } from '@/utils/statusCode'
import { liveRoom } from '@/api/competition/competition'
import { Message } from 'element-ui'
import { followHost } from '@/api/Host/Host'
import { mapState } from 'vuex'
import CloseRecommend from './closeRecom'
import { Copy } from '@/utils/validator'
import CustomSpan from '@/components/CustomSpan'
import Downsection from '@/views/LiveRoom/Components/Downsection'
import LiveAnnounce from '@/components/LiveAnnounce.vue'
import Gifts from '@/views/LiveRoom/Components/Gifts.vue'
import GiftLoginTips from '@/components/GiftLoginTips.vue'
export default {
    name: 'liveRoom',
    components: {
        QR,
        Chat,
        VideoRoom,
        CloseRecommend,
        CustomSpan,
        Downsection,
        GiftRanking,
        LiveAnnounce,
        Gifts,
        GiftLoginTips
    },
    data () {
        return {
            isRouterAlive: true,
            // eslint-disable-next-line no-undef
            shareUrl: window.location.href,
            showModule: false,
            matchInfo: {},
            matchId: null,
            roomInfo: {},
            anchorInfo: null,
            defaultB: require('@/assets/images/home/card/basketball.png'),
            defaultF: require('@/assets/images/common/team-flag.png'),
            updateKey: +new Date().getTime(),
            chatKey: 'chat' + new Date().getTime()

        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    computed: {
        ...mapState('user', ['token', 'signature', 'memberId']),
        ...mapState('modal', ['showGiftLogin']),
        isFootball () {
            return this.matchInfo && this.matchInfo.leagueType === 1
        },
        isBasketBall () {
            return this.matchInfo && this.matchInfo.leagueType === 2
        },
        homeLogo () {
            return this.roomInfo.match_info.homeLogo ? this.roomInfo.match_info.homeLogo : this.emptyLogo
        },
        awayLogo () {
            return this.roomInfo.match_info.awayLogo ? this.roomInfo.match_info.awayLogo : this.emptyLogo
        },
        emptyLogo () {
            return [this.defaultF, this.defaultB][this.roomInfo.type - 1]
        },
        giftAnchorInfo () {
            return {
                anchorId: this.anchorInfo.member_id,
                roomId: this.roomInfo.room_id || this.anchorInfo.member_id
            }
        }
    },
    created () {
        this.getInfo({ room_id: this.$route.query.room_id })
    },
    mounted () {
        this.$router.afterEach((to, from, next) => {
            window.scrollTo(0, 0)
        })
    },
    watch: {
        // token: {
        //     handler () {
        //         this.updateKey = +new Date().getTime()
        //         this.getInfo({ room_id: this.$route.query.room_id })
        //     },
        //     immediate: true
        // }
    },
    methods: {
        refreshChat () {
            // 跟新chat
            this.chatKey = 'chat' + new Date().getTime()
        },
        reload () {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },
        sendDankamu (val) {
            this.$refs.videoRoom.sendDankamu(val)
        },
        sendMessage (val) {
            console.log(2)
            this.$refs.chat.sendMessage(val)
        },
        changeStatus (val) {
            this.roomInfo.live_status = val
        },
        async getInfo (dataJson) {
            const {
                data,
                code,
                msg
            } = await liveRoom(dataJson)
            if (code === statusCode.success) {
                this.roomInfo = data.room_info
                // this.roomInfo.live_status = data.room_info.status
                // 如果存在动画直播 则加到房间信息里面去
                if (data.anime_url) this.roomInfo.anime_url = data.anime_url
                this.matchInfo = data.room_info && data.room_info.match_info
                this.anchorInfo = data.anchor_info
                this.matchId = this.roomInfo.match_id
                // 外面有需要用到 match_id
                this.$emit('update:matchId', this.roomInfo.match_id)
                // this.$emit('changeMatchInfo', this.matchInfo)
            } else if (code * 1 === statusCode.noRoom) {
                this.$router.push({
                    path: '/'
                })
                Message.error(msg)
            }
        },
        async followHost () {
            if (!this.token) {
                Message.error('请先登录')
                this.openLoginDialog()
                return
            }
            try {
                const {
                    code,
                    msg
                } = await followHost(this.anchorInfo.member_id)
                if (code === 200) {
                    if (this.anchorInfo.is_follow === 1) {
                        this.anchorInfo.is_follow = 0
                        this.anchorInfo.follow -= 1
                    } else {
                        this.anchorInfo.is_follow = 1
                        this.anchorInfo.follow += 1
                    }
                }
                Message.success(msg)
            } catch (e) {
                console.log('出错了')
            }
        },
        shareClick (type) {
            const title = '看球直播'
            const summary = '看球直播将为您呈现全球经典赛事解说'
            const image = require('@/assets/logo.png')
            const url = window.location.href// 获取当前网页地址
            let sharesinastring = null // 跳转的url地址;
            if (type === 'qq') { // 扫码  移动端
                let _shareUrl = 'https://connect.qq.com/widget/shareqq/index.html?'
                // eslint-disable-next-line no-undef
                _shareUrl += 'url=' + encodeURIComponent(_requestApiUrl || url)
                _shareUrl += '&title=' + encodeURIComponent(title || '自定义')
                window.open(_shareUrl, '_blank')// qq
            }
            if (type === 'qqZone') {
                sharesinastring = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}&pics=${image}&summary=${summary}`
                window.open(sharesinastring, '_blank')// qq空间
            }
        },
        copy () { // 复制内容
            Copy(this.shareUrl)
        },
        toLineup () {
            const dom = document.body.querySelector('#liveroom-downsection')
            dom && dom.scrollIntoView({ behavior: 'smooth' })
        }
    }
}
</script>

<style scoped lang="scss">
  .live-room {
    width: 100%;
    min-width: 1400px;
    // padding-left: 100px;
    padding-top: 8px;
    margin: auto;
  }

  .box {
    display: flex;

    .left {
      height: calc(100vh - 83px);
      flex: 1;
      overflow-y: auto;

      .match-title {
        width: 100%;
        height: 65px;
        margin-bottom: 5px;
        border-radius: 10px;
        position: relative;
        background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
        display: flex;
        justify-content: center;

        .home_away {
          width: 100%;
          height: 100%;
          z-index: 0;
          display: flex;
          justify-content: center;

          & > .vs {
            width: 34px;
            height: 29px;
            margin: 18px 10px;
          }

          .homeLogo {
            right: 53%;
            width: 41px;
            height: 41px;
            border-radius: 50%;
            margin: 12px 6px;
          }

          .homeScore {
            line-height: 65px;
            font-size: 24px;
            margin: 0 30px 0 15px;
            color: #fff;
          }

          .homeChs {
            text-align: right;
            font-size: 18px;
            line-height: 65px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
          }

          .awayLogo {
            width: 41px;
            height: 41px;
            border-radius: 50%;
            margin: 12px 6px;
          }

          .awayScore {
            line-height: 65px;
            font-size: 24px;
            margin: 0 15px 0 30px;
            color: #fff;
          }

          .awayChs {
            font-size: 18px;
            line-height: 65px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
          }

        }

        .match-title-item {
          height: 100%;
        }

        .title-right {
          top: 0;
          bottom: 0;
          right: 24px;
          margin: auto;
          position: absolute;
          width: 70px;
          height: 27px;
          background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.37);
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          color: #fff;
          text-align: center;
          line-height: 27px;
        }

        .title-right:active {
          background: linear-gradient(90deg, #E1A579 0%, #FFF5E8 100%);
        }
      }

      .top {
        width: 100%;
        height: 66px;
        background-color: #fff;
        position: relative;

        .img_title {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 8px;
          left: 16px;
          border-radius: 50%;
        }

        .room_title {
          height: 20px;
          font-size: 18px;
          position: absolute;
          top: 14px;
          left: 80px;
          color: #333;
          max-width: calc(100% - 320px);
          z-index: 1;
        }

        .sign_list {
          position: absolute;
          overflow: hidden;
          bottom: 8px;
          left: 60px;
          font-size: 12px;
          color: #9f9f9f;

          .anchor {
            height: 20px;
            padding-left: 20px;
            font-size: 12px;
            color: #999;
            overflow: hidden;
            float: left;
          }

          .hot {
            padding-left: 10px;
            float: left;
            height: 20px;
            font-size: 14px;
          }

          .icon {
            width: 14px;
            height: 14px;
            vertical-align: center;
            line-height: 20px;
          }

          .room_no {
            height: 20px;
            float: left;
            line-height: 14px;
            padding-left: 15px;
            color: #999999;
          }

          .room_hot {
            height: 20px;
            float: left;
            line-height: 14px;
            padding-left: 15px;

            .hot-icon {
              font-size: 14px;
              color: #FF6A6A;
            }

            .num {
              display: inline-block;
              padding: 0 4px;
              color: #333;
            }
          }

          .sigh_item {
            float: left;
            padding: 4px 8px;
            background: rgba(51, 85, 255, .1);
            color: #37f;
            border-radius: 2px;
            font-size: 12px;
            margin-left: 10px;
            line-height: 11px;
          }
        }

        .watch_phone {
          cursor: pointer;
          border-radius: 5px;
          padding: 8px 0;
          font-size: 12px;
          position: absolute;
          bottom: 4px;
          right: 250px;
          color: #8D8D8D;

          .showModule {
            position: absolute;
            top: 32px;
            left: -180px;
            width: 360px;
            height: 180px;
            padding: 15px 16px 20px;
            border-radius: 4px;
            box-shadow: 0 8px 10px 0 rgba(40, 38, 45, 0.2);
            background-color: #fff;
            z-index: 9999;

            .txt_call {
              float: left;
              width: 100%;
              height: 20px;
              font-size: 12px;
              color: #28262d;
              text-align: center;
              line-height: 25px;
            }

            .txt_share_box {
              width: 60%;
              height: 90px;
              position: absolute;
              top: 50px;
              font-size: 12px;

              .img_share_box {
                display: flex;
                justify-content: space-evenly;
              }
            }

            .box_copy {
              float: left;
              position: absolute;
              bottom: 25px;
              left: 20px;

              .inp_url {
                height: 31px;
                border: solid 1px #ccc;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border-right: none;
                background-color: #fff;
                box-sizing: border-box;
                text-indent: 20px;
              }

              .copy {
                color: #fff;
                display: inline-block;
                padding: 9px 13px 8px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                border-left: 0;
                background-color: #689fee;
              }
            }

            .qr_share {
              width: 100px;
              height: 100px;
              position: absolute;
              bottom: 36px;
              right: 16px;

              .txt {
                width: 100%;
                color: #000000;
                text-align: center;
              }
            }
          }
        }

        .complain {
          cursor: pointer;
          border-radius: 5px;
          padding: 8px 16px;
          font-size: 12px;
          position: absolute;
          bottom: 4px;
          right: 150px;
          color: #8D8D8D;
        }

        .hot {
          font-size: 14px;
          position: absolute;
          top: 3px;
          right: 106px;
          padding: 8px 16px;
          border-radius: 20px;
          color: #8B8B8B;
        }

        .book_box {
          font-size: 12px;
          position: absolute;
          bottom: 5px;
          right: 20px;
          padding: 4px 10px;
          border-radius: 20px;
          color: #fff;
          background: #409eff;
          cursor: pointer;

          .hot-focus {
            font-size: 14px;
            margin: 2px;
          }

          .up {
            padding: 0 6px;
          }
        }
      }

      .video_box {
        width: 100%;
        height: 0;
        padding-top: 56.25%;
        flex: 1;
        flex-direction: column;
        position: relative;
        background-color: #000;

        .closeRecommend {
          position: absolute;
          width: 100%;
          top: 45%;
          left: 0;
          right: 0;
          margin: auto;
        }

        .leaveStatus {
          width: 216px;
          height: 66px;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 66px;
          border-radius: 5px;
          border: 1px solid rgba(60, 174, 250, .1);
          background-color: rgba(52, 38, 50, .8);
          position: absolute;
          left: 0;
          right: 0;
          top: 30%;
          margin: auto;

          .iconMute {
            width: 18px;
            height: 18px;
            vertical-align: text-bottom;
          }
        }

        .video-room {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }

    }

    .right {
      background: #fff;
      margin: 0 20px 0 10px;
      border-radius: 4px;
      border: 0.5px solid rgba(182, 188, 203, .4);
      width: 360px;
      height: calc(100vh - 83px);
      box-sizing: border-box;

      .announces {
        height: 40px;
        width: 100%;
        padding: 10px 20px;
        border-bottom: 1px solid #dddaaa;
      }

      .txt_top {
        height: 85px;
        padding: 10px 20px;
        color: #9f9f9f;
        font-size: 14px;
      }

      .chat {
        width: 100%;
        height: 416px;
      }

      .send_model {
        width: 100%;
        height: 50px;
        padding: 10px 5px;
        display: flex;

        .send_inp {
          font-size: 14px;
          flex: 1;
          background-color: #eee;
          color: #000;
          text-indent: 10px;
          border: none;
          outline: none;
        }

        .send_btn {
          width: 57px;
          font-size: 14px;
          border-style: none;
          color: #fff;
          background-color: #999;
          cursor: pointer;
        }
      }

      .gift-ranking {
        background-color: #F9F9F9;
      }
      .chat-section {
        height: calc(100% - 256px);
      }
    }
  }

  .tj {
    padding-top: 50px;
  }
</style>
