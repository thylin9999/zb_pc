<template>
    <div v-if="animationLive" class="animationLive-box">
        <iframe class="animationLive" :src="videoInfo.anime_url" frameborder="0"></iframe>
    </div>
    <div id="mse" v-else :key="updateKey">
        <div class="video-pause-mask" v-if="afterExitVideo && ifFresh && playState === 'pause'">
          <img @click="changePlayState" class="mask-video-img" :src="maskVideoImg" alt="">
        </div>
        <vue-danmaku v-if="afterExitVideo" :style="{opacity: dankamuState ? 1 : 0}" class="dankumu" ref="dankumu" :danmus="danmus"
                     :randomChannel="true" use-slot :speeds="100">
          <!-- 弹幕插槽（vue 2.6.0 及以上版本可使用 v-slot:dm="{ index, danmu }"语法） -->
          <template slot="dm" slot-scope="{ index,danmu }">
            <!--label 1球童，11主播，12专家-->
            <div class="danmu" :style="danmuStyle[danmu.label]">{{ danmu.msg }}</div>
          </template>
          <!-- 容器插槽 -->
          <div></div>
        </vue-danmaku>
        <div class="play-control">
            <div class="left">
                <span class="iconfont default xe6cf" @click="changePlayState" v-if="playState === 'pause'">&#xe6cf;</span>
                <span class="iconfont default xe7fe" @click="changePlayState" v-else>&#xe7fe;</span>
                <span class="iconfont default xe60f" @click="controlOption('fresh')">&#xe60f;</span>
                <span class="iconfont default xea0b" @click="controlOption('volume')">{{ volume === 0 ? '&#xea0b;' : volume > 0.5 ? '&#xea10;' :'&#xea0f;' }}</span>
                <div class="volume-bar">
                  <vue-slider style="margin-top: 11px" :tooltip="tooltip" v-model="progress" :min="0" :max="100" :interval="1" :process-style="customProcessStyle"></vue-slider>
                </div>
            </div>
            <div class="right">
              <div class="default clarity" v-if="videoInfo.video_url === ''">
                <div class="default-clarity">{{ qualityType === 'Original' ? '超清' : qualityType === 'HD' ? '高清' : '一般' }}</div>
                <ul class="clarity-list">
                  <li @click="changeQuality('Original')">超清</li>
                  <li @click="changeQuality('HD')">高清</li>
                  <li @click="changeQuality('ordinary')">一般</li>
                </ul>
              </div>
                <div class="default dankamu">
                  <span class="iconfont default xe61c" style="color: #ddd" v-if="!dankamuState" @click="dankamuState = !dankamuState">&#xe65b;</span>
                  <span class="iconfont default xe61c" style="color: #d7b184" v-else @click="dankamuState = !dankamuState">&#xe65c;</span>
                </div>
                <div>
                  <span class="iconfont default xe73f" @click="controlOption('changeMiniplayer')">&#xe73f;</span>
                </div>
                 <div>
                   <span class="iconfont default xe8fa" @click="controlOption('getFullscreen')" v-if="!fullScreen">&#xe8fa;</span>
                   <span class="iconfont default xe8fb" @click="controlOption('exitFullscreen')" v-else>&#xe8fb;</span>
                 </div>
            </div>
        </div>
    </div>

</template>

<script>
import { getPullUrl, encryptRoomId } from '@/utils/validator'
import { getSignurl, liveNoStream } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import FlvPlayer from 'xgplayer-flv'
import './../.xgplayer/skin/index'
import VueSlider from 'vue-slider-component'
import vueDanmaku from 'vue-danmaku'
export default {
    props: {
        isLive: {
            type: Boolean,
            default: () => true
        },
        videoInfo: {
            type: [Object, Array],
            default: () => {
            }
        },
        tooltip: {
            type: String,
            default: () => 'none'
        }
    },
    components: {
        VueSlider, vueDanmaku
    },
    data () {
        return {
            inp: '',
            updateKey: +new Date().getTime(),
            afterExitVideo: false,
            danmus: [], // 弹幕
            danmuStyle:
              {
                  '1': "color: '#61bbec'; background: ''; font-size: 18px;",
                  '11': "color: '#bc3737'; background: ''; font-size: 18px;",
                  '12': "color: '#a978d0'; background: ''; font-size: 18px;"
              },
            animationLive: false,
            progress: 0,
            dankamuState: true, // 弹幕状态
            fullScreen: false,
            playState: window.name === 'isReload' ? 'pause' : 'play', // 播放状态  pause 暂停状态
            firstCome: true, // 是否第一次进入
            ifFresh: window.name === 'isReload', // 播放状态  pause 暂停状态
            // isMute: false, // 是否静音
            volume: 0.5, // 音量
            volumeItem: 0, // 静音前音量
            muteButton: false,
            // liveCover: require('@/assets/images/common/video-cover.jpg'),
            logo: require('@/assets/images/common/logo.png'),
            maskVideoImg: require('@/assets/images/live-room/video-pause.png'),
            showQuality: false,
            // showRefresh: false,
            roomInfo: {},
            qualityType: 'HD', // 'Original'  'HD'  'ordinary'
            isMiniplayer: false, // 是否是小窗口播放
            // showQualityLogin: false, // 清晰度切换登录提示
            player: null, // 播放器
            isRefreshError: false, // 刷新时触发错误
            firstTime: true, // 是否第一次init
            timer: 30 // 第一次错误30秒后再去请求一次init
        }
    },
    computed: {
        ...mapState('user', ['token']),
        customProcessStyle () {
            const hue = this.progress * 1.2 // 自定义颜色的计算方式
            const color = `hsl(${hue}, 100%, 50%)` // 使用 HSL 色彩空间
            return {
                background: `linear-gradient(to right, ${color} 0%, ${color} ${this.progress}%, #ddd ${this.progress}%, red 100%)`
            }
        }
    },
    async mounted () {
        window.FlvPlayer = require('xgplayer')
        this.roomInfo = JSON.parse(JSON.stringify(this.videoInfo))
        if (this.videoInfo.live_status === 1) return
        try {
            setTimeout(() => {
                if (this.$route.query.room_id) {
                    this.getPlayUrl()
                }
            }, 1)
        } catch (e) {
            console.log('getPlayUrl播放逻辑有误')
        }
        window.addEventListener('beforeunload', this.handleRefresh)
    },
    methods: {
        async getPlayUrl () {
            if (this.roomInfo.video_url && this.roomInfo.video_url !== '') { // 转码后的视频
                await this.init()
            } else { // OBS直播推流
                const { code, msg, data } = await getSignurl({
                    suffix: 'flv',
                    profile: this.qualityType === 'Original' ? '1080p' : this.qualityType === 'HD' ? '720p' : '480p',
                    // profile: this.qualityType === 'Original' ? '720t' : this.qualityType === 'HD' ? '720p' : '480p',
                    room_id: this.$route.query.room_id
                })
                if (code === statusCode.success) {
                    this.roomInfo.md5_video = getPullUrl(data.info)
                    await this.init()
                } else { // 主播未开播 且无转码视频
                    Message(msg) //
                }
            }
        },
        async init () {
            const _this = this
            if (this.roomInfo) {
                let url = ''
                if (this.roomInfo.video_url && this.roomInfo.video_url !== '') {
                    url = this.roomInfo.video_url.includes('.m3u8') ? this.roomInfo.video_url.replace('.m3u8', '.flv') : this.roomInfo.video_url
                } else {
                    url = this.roomInfo.md5_video
                }
                _this.player = new FlvPlayer({
                    id: 'mse',
                    url,
                    definitionActive: 'click',
                    isLive: true,
                    autoplay: true,
                    playsinline: true,
                    height: '100%',
                    width: '100%',
                    volume: 0.5,
                    // volume: window.name === 'isReload' ? 0 : 0.5,
                    errorTips: '当前视频无法播放，请刷新重试'
                })
                if (window.name !== 'isReload') window.name = 'isReload'
                // 监听播放失败事件
                _this.player.on('error', (err) => { // 监听到播放失败则调用动画直播
                    console.log('error', err)
                    // _this.animationLive = true
                    _this.notSream(err)
                    _this.$nextTick(() => { // 解决 切换动画直播界面仍然提示加载视频loading问题 以及video有白边框问题
                        try {
                            document.getElementsByClassName('xgplayer-enter')[0].style.display = 'none'
                            document.getElementsByClassName('xgplayer-loading')[0].style.display = 'none'
                            // 找到界面中的video 标签
                            document.getElementsByTagName('video')[0].style.display = 'none'
                        } catch (error) {
                            console.log('样式错误')
                        }
                    })
                })
                _this.player.on('pause', () => {
                    console.log('暂停')
                    this.playState = 'pause'
                })
                _this.player.on('play', () => {
                    console.log('播放')
                    this.playState = 'play'
                })
                _this.player.on('requestFullscreen', () => {
                    console.log('全屏')
                    _this.fullScreen = true
                })
                _this.player.on('exitFullscreen', () => {
                    console.log('退出全屏')
                    _this.fullScreen = false
                })
                _this.afterExitVideo = true // 播放器实例创建之后加载弹幕
            }
        },
        changeQuality (type) {
            if (type === this.qualityType) return
            this.updateKey = +new Date().getTime()
            if (this.player) this.player.destroy()
            this.animationLive = true
            setTimeout(() => {
                this.animationLive = false
                this.qualityType = type || 'HD'
                this.showQuality = false // 高清... 切换 展示
                this.$forceUpdate()
                this.getPlayUrl()
            }, 1)
        },
        changePlayState () {
            if (this.playState === 'pause') {
                this.playState = 'play'
                this.player.play()
            } else {
                this.playState = 'pause'
                this.player.pause()
            }
        },
        controlOption (type) { // 控件按钮
            if (type === 'fresh') { // 刷新
                // if (this.player) this.player.reload()
                this.player.replay()
            }
            if (type === 'volume') { // 音量
                if (this.volume) {
                    this.volumeItem = this.volume
                    this.volume = 0
                    this.player.volume = 0
                } else {
                    if (this.firstCome) {
                        this.volume = 0.5
                        this.volumeItem = 0.5
                        this.firstCome = false
                    }
                    this.volume = this.volumeItem
                    this.player.volume = 0.5
                }
            }
            if (type === 'getFullscreen') { // 全屏
                this.fullScreen = true
                if (this.player) this.player.getFullscreen(this.player.root)
            }
            if (type === 'exitFullscreen') { // 退出全屏
                this.fullScreen = false
                if (this.player) this.player.exitFullscreen()
            }
            if (type === 'changeMiniplayer') { // 迷你播放器
                if (this.isMiniplayer) {
                    this.isMiniplayer = false
                    this.player.exitMiniplayer()
                } else {
                    this.isMiniplayer = true
                    this.player.getMiniplayer()
                }
            }
        },
        sendDankamu (val) {
            this.danmus.push(val)
        },
        sendMessage () {
            this.$emit('sendMessage', this.inp)
            this.inp = ''
        },
        handleRefresh () {
            this.isRefreshError = true
        },
        // 无流处理
        async notSream (err) {
            const _this = this
            if (!this.isRefreshError && err.code) { // 非刷新触发 && 有错误码
                console.log('正常触发')
                if (_this.videoInfo && !!_this.videoInfo.anime_url) { // 如果有动画地址，就去播放动画
                    _this.animationLive = true
                } else {
                    if (_this.firstTime) { // 如果是第一次init
                        _this.player && _this.player.destroy()
                        _this.firstTime = false
                        setTimeout(() => {
                            _this.init()
                        }, _this.timer * 1000)
                    } else {
                        const roomId = encryptRoomId(_this.videoInfo.room_id)
                        const data = await liveNoStream({ cipher_text: roomId })
                        console.log(data.msg)
                    }
                }
            } else { // 如果是刷新/取消刷新，是没有错误码的
                console.log('刷新触发')
            }
        }
    },
    watch: {
        fullScreen (val, oldVal) {
            console.log(val)
            if (val) {
                this.player.getFullscreen(this.player.root)
            } else {
                this.player.exitFullscreen()
            }
        },
        playState (val, oldVal) {
            console.log('playState')
            if (val === 'pause') {
            } else {
            }
        },
        progress (val, oldVal) {
            if (val === 0) {
                this.volume = 0
            } else {
                this.volume = val / 100
                this.player && (this.player.volume = val / 100)
            }
        },
        volume: { // 监听音量
            handler (val, oldVal) {
                if (val === 0) {
                    this.progress = 0
                } else {
                    this.progress = val * 100
                    this.player && (this.player.volume = val)
                }
            },
            deep: true,
            immediate: true
        }
    },
    beforeDestroy () {
        if (this.player) this.player.destroy()
        window.removeEventListener('beforeunload', this.handleRefresh)
    }
}
</script>
<style lang="scss">
.animationLive-box{
  position: relative;
  width: 100%;
  height: 100%;
  .animationLive{
    height: 100%;
    width: 70.3%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    //16 : 9
    //300 * 242     100 * 81
  }
}
.volume-bar {
  display: inline-block;
  width: 80px;
  margin-left: 4px;
  vertical-align: revert;
}

.vue-slider-rail{
  background-color: #fff;
}

#mse {
  position: relative;
  overflow: hidden;
  .video-pause-mask{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .mask-video-img{
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      position: absolute;
    }
  }

  .dankumu{  //弹幕
    pointer-events: none;
    width: 100%;
    height: 80%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .danmu{
        font-size: 18px;
    }
  }
  @keyframes controlAnimationHidden {
    0% {
      bottom: 0;
    }
    100% {
      bottom: -40px;
    }
  }

  .play-control {
    animation: controlAnimationHidden .8s ease-in-out forwards;
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: -40px;
    z-index: 555;
    display: flex;
    background-color: rgba(0, 0, 0, .6);

    .left {
      width: 50%;
      display: flex;
      justify-content: start;

      .default {
        margin-left: 16px;
        color: #fff;
        font-size: 20px;
        line-height: 40px;
        cursor: pointer;
      }
    }

    .right {
      width: 50%;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      position: relative;

      /*控件样式*/
      .default {
        margin-right: 16px;
        color: #fff;
        font-size: 20px;
        line-height: 40px;
        cursor: pointer;
      }

      .xea0b{  //音量
        font-size: 18px!important;
        margin-right: 3px!important;
      }

      .xe61c{  //全屏
        font-size: 30px!important;
        vertical-align: bottom;
      }

      .dankamu{  //弹幕
        margin-right: 0;
      }

      .full-screen-inp{
        position: absolute;
        left: -100px;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 30px;
        width: 380px;
        display: flex;
        .el-inp{
          width: 300px;
          font-size: 12px;
          height: 100%;
          .el-input__inner{
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            text-indent: 10px;
            width: 100%;
            height: 100%;
            color: #fff;
            background-color: #333333;
          }
        }
        .el-button{
          width: 60px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          font-size: 14px;
          background-color: #FBA187;
          color: #fff;
        }
      }

      .clarity{
        margin-right: 16px;
        position: relative;
        .default-clarity{  //清晰度
          font-size: 14px;
          text-align: center;
        }
        .clarity-list{
          font-size: 12px;
          position: absolute;
          bottom: 40px;
          left: -16px;
          width: 60px;
          //display: flex;
          text-align: center;
          flex-direction: column;
          background-color: #1b1f1e;
          display: none;
          li:hover{
            background-color: #323635;
          }
        }

        &:hover{
          .clarity-list{
            display: flex;
          }
        }
      }

      .clarity:hover{

      }
    }
  }
}

.xgplayer-miniplayer-active {
  position: fixed !important;
  right: 10px !important;
  bottom: 10px !important;
}

#mse:hover {
  @keyframes controlAnimationShow {
    0% {
      bottom: -40px;
    }
    100% {
      bottom: 0;
    }
  }

  .play-control {
    animation: controlAnimationShow .8s ease-in-out forwards;
  }
}

</style>
