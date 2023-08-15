<template>
    <div v-if="supportFlv && !playFailPopup" class="video-player"
         :class="{
            'quality-hide': !showPuse,
            'quality-show': showPuse
        }">
        <div id="video-player-tag"></div>
        <div id="dplayer" ref="dplayer" style="width: 100%;height: 100%">
            <div style="width: 100%;height: 100%">
                <!--                <img :src="liveCover" alt="" draggable="false" style="width: 100%;height: 100%">-->
            </div>
        </div>
        <img class="big-play-btn" :src="logo" v-if="showPuse" @click="bigPause"/>
        <div class="showRefresh btn" @mousemove="showRefresh = true" @mouseleave="showRefresh = false">
            <!--            <p @click="videoRefresh">刷新</p>-->
        </div>
        <div class="control" @mousemove="showQuality = true" @mouseleave="showQuality = false"
             v-if="roomInfo.live_status == 2 && roomInfo.video_url == ''">
            <span class="btn"> {{ qualityType == 'Original' ? '超清' : qualityType == 'HD' ? '高清' : '一般' }}  </span>
            <div class="control_box" v-show="showQuality">
                <ul class="quality_list">
                    <span class="btn pointer" @click="changeQuality('Original')">超清</span>
                    <span class="btn pointer" @click="changeQuality('HD')">高清</span>
                    <span class="btn pointer" @click="changeQuality('ordinary')">一般</span>
                </ul>
            </div>
        </div>
        <!--        <div class="cancelMute" @click="cancelMute" v-if="muteButton && roomInfo.live_status == 2">-->
        <!--            <img class="iconMute" :src="require('@/assets/images/home/icon-mute.png')" alt="">-->
        <!--            点击取消静音-->
        <!--        </div>-->

        <div v-if="showQualityLogin"
             class="w-100 quality-login-box p-absolute flex flex-column align-center justify-center">
            <i
                class="el-icon-circle-close close p-absolute pointer"
                @click="closeQualityLogin"
            ></i>
            <div class="upper text-center font-14 text-color">
                当前观看的是普通画质，登录继续畅享<span class="font-18 high-quality">高清画质</span>
            </div>
            <div class="login-btn text-center w-100 m-t-15">
          <span
              class="font-14 pointer text-color d-inline-block text-center"
              @click="loginRightNow"
          >立即登录</span>
            </div>
        </div>
<!--        <div v-if="playFailPopup" class="playFailPopup" @click="videoRefresh">-->
<!--            视频加载失败，请重新加载-->
<!--        </div>-->
    </div>
<!--    <div v-else class="supportFlv">-->
<!--        当前视频源不支持flash播放，请 <span @click="goAddDownload" class="pointer go-app"> 下载App </span>进行观看-->
<!--    </div>-->
    <div v-else class="animation-box">
        <iframe class="animation" v-if="videoInfo.anime_url" :src="videoInfo.anime_url" frameborder="0"></iframe>
    </div>

</template>
<script src="flv.min.js"></script>
<script src="hls.min.js"></script>
<script src="DPlayer.min.js"></script>
<script>
    import {getPullUrl} from '@/utils/validator'
    import Hls from 'hls.js'
    import {getSignurl} from "@/api/competition/competition";
    import {statusCode} from "@/utils/statusCode";
    import {getToken} from "@/utils/cookie";
    import {Message} from "element-ui";
    import {mapState} from 'vuex'

    export default {
        props: {
            isLive: {
                type: Boolean,
                default: () => true
            },
            videoInfo: {
                type: [Object, Array],
                default: () => {
                },
            },
            refresh: {  //当前界面是刷新操作会暂停 备用
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                playFailPopup: false, //播放失败弹窗
                canPlayFlag: false,  //是否能播放
                canPlayFlagTime: 8,  //播放地址倒计时  6秒后未能播放视其为失败
                pullFiledTime: 3,
                qualityTime: 10,
                firstPlay: true,  //第一次播放判断
                supportFlv: true,
                firstLoad: false,
                volume: 0,
                muteButton: false,
                liveCover: require('@/assets/images/common/video-cover.jpg'),
                logo: require('@/assets/images/common/logo.png'),
                refreshItem: true,
                showQuality: false,
                showRefresh: false,
                roomInfo: {},
                timeOut: false,
                dp: null,
                qualityType: 'Original', // 'Original'  'HD'  'ordinary'
                showPuse: false,
                timer: null,
                showQualityLogin: false, // 清晰度切换登录提示
                // timeDec: 1140, //直播时长到了指定时间需要刷新一次清除缓存 暂定19分钟  19*60=1140
            }
        },
        computed: {
            ...mapState('user', ['token'])
        },
        async mounted() {
            this.roomInfo = JSON.parse(JSON.stringify(this.videoInfo))
            if (this.videoInfo.live_status == 1) return
            if (window.name == '') {
                window.name = 'isReload'
                this.volume = 0.5
            } else if (window.name == 'isReload') {
                this.volume = 0
                this.muteButton = true
            }
            try {
                setTimeout(() => {
                    this.showPuse = true
                    this.showPuse = false
                    this.getPlayUrl()
                }, 1000)
            } catch (e) {
            }
        },
        methods: {
            // refreshByTimeDec() {  //直播时长到了指定时间需要刷新一次清除缓存 暂定19分钟  19*60=1140
            //     this.timer = setInterval(() => {
            //         this.timeDec--
            //         if (this.timeDec <= 0) {
            //             if (this.dp) this.dp.destroy()
            //             this.timeDec = 1140
            //             this.videoRefresh()
            //         }
            //     }, 1000)
            // },
            async getPlayUrl() {
                if (this.roomInfo.video_url && this.roomInfo.video_url !== '') { //开播选择播放视频源
                    await this.init()
                } else { //直播选择推流
                    let {code, msg, data} = await getSignurl({
                        suffix: 'flv',
                        profile: this.qualityType === 'Original' ? '1080p' : this.qualityType === 'HD' ? '720p' : '480p',
                        room_id: this.$route.query.room_id
                    })
                    if (code === statusCode.success) {
                        this.roomInfo.md5_video = getPullUrl(data.info)
                        await this.init()
                        // this.refreshByTimeDec()  //刷新会导致没哟声音 暂时不自动刷新
                    } else {  //主播未开播 且 未添加源地址
                        Message(msg)
                    }
                }
            },
            sendDankamu(msgJson) {
            },
            goAddDownload() {
                // this.$router.push({path: '/app-download'})
            },
            cancelMute(type) {
                if (type === 1) {
                    this.muteButton = false
                    return
                }
                if (this.dp) {
                    this.dp.volume(0.5)
                    this.muteButton = false
                }
            },
            handlePlay() {
                this.$refs.dplayer.play()
                this.isPlay = false
            },
            handlePause() {
                alert('pause')
                this.$refs.dplayer.pause()
                this.showPuse = true
            },
            bigPause() {
                this.showPuse = false
                this.timeOut = true
                if (this.dp) {
                    this.dp.toggle()
                }
            },
            changeQuality(type) {
                this.qualityType = type || 'HD'
                this.showQuality = false  //高清... 切换 展示
                this.getPlayUrl()
            },
            videoRefresh() {
                this.showPuse = false
                this.timeOut = true
                if (this.dp) {
                    this.dp.toggle()
                }
            },
            async init() {
                let that = this
                if (this.roomInfo) {
                    let url = ''
                    if (this.roomInfo.video_url && this.roomInfo.video_url !== '') {
                        if (this.roomInfo.video_url.indexOf('rtmp') > -1) {
                            this.supportFlv = false
                            return
                        }
                        url = this.roomInfo.video_url.includes('.m3u8') ? this.roomInfo.video_url.replace('.m3u8', '.flv') : this.roomInfo.video_url
                        let timer = setTimeout(() => {  //开始播放倒计时
                            clearTimeout(timer)
                            if (!this.canPlayFlag) {
                                if (this.dp) this.dp.destroy()
                                this.playFailPopup = true
                            }
                        }, this.canPlayFlagTime * 1000)
                    } else {
                        let timer = setTimeout(() => {  //开始播放倒计时
                            clearTimeout(timer)
                            if (!this.canPlayFlag) {
                                // 视频区中间提示 加载失败弹窗
                                this.playFailPopup = true
                            }
                        }, this.canPlayFlagTime * 1000)
                        url = this.roomInfo.md5_video
                    }
                    window.flvjs = (await import(/* webpackChunkName: "flv" */ 'flv.js')).default
                    const DPlayer = (await import(/* webpackChunkName: "dplayer" */ 'dplayer')).default
                    this.dp = new DPlayer({
                        container: document.getElementById('dplayer'),
                        autoplay: true,
                        live: this.isLive,
                        volume: 0.5,
                        danmaku: false,
                        hotkey: true,
                        lang: 'zh-cn',
                        video: {
                            url,
                            type: 'auto', // auto
                            customType: {
                                customHls: function (video) { // player
                                    that.newHls?.destroy()
                                    that.newHls = new Hls()
                                    that.newHls.on(Hls.Events.ERROR, function (eventName, data) {
                                        const {type, details} = data
                                        if (type === 'networkError') { // 网络错误
                                            switch (details) {
                                                case  'manifestLoadTimeOut': // 超时
                                                    console.log('超时重置...')
                                                    that.changeQuality(that.qualityType)
                                                    break
                                                default:
                                                    console.log(data)
                                            }
                                        }
                                    })
                                    that.newHls.loadSource(video.src)
                                    that.newHls.attachMedia(video)
                                }
                            }
                        },
                    })
                    this.dp.volume(this.volume) // 设置初始声音
                    this.dp.on('volumechange', (info) => {  //取消静音
                        if (this.dp.volume() > 0) {
                            this.cancelMute(1)
                        }
                    })
                    this.dp.on('canplay', () => {//判断播放是否成功
                        that.canPlayFlag = true
                        that.playFailPopup = false
                        //倒计时18s播放时间
                        //因为暂时无法 判断播放是否失败  error回调事件监听失效  所以只能通过canplay事件来判断
                    })
                    //
                    setTimeout(() => {
                        this.dp.play()
                        if (!getToken() && that.firstPlay) {  //未登录情况下 切第一次进入  3分钟需要唤醒一次弹窗提示用户登录 且画质切换为480
                            let timer = setTimeout(() => {
                                that.firstPlay = false
                                that.changeQuality('ordinary')
                                // 这里触发。。。
                                this.showQualityLogin = true
                                clearInterval(timer)
                            }, 3 * 60 * 1000)
                        }
                    }, 500)
                    if (this.dp) {
                        let item = document.getElementsByClassName('dplayer-controller')[0]
                        let link = document.createElement('div')
                        // link.innerHTML = '刷新'
                        link.className = 'showRefresh-roomVideo'
                        item.appendChild(link)
                        link.addEventListener('click', function () {
                            that.videoRefresh()
                        })
                    }
                }
            },
            playVideo() {
                this.refreshItem = false
                this.dp && this.dp.play()
            },
            loginRightNow() {
                // this.setLoginPopup(true)
                this.openLoginDialogMixin()
            },
            closeQualityLogin() {
                this.showQualityLogin = false
                if (!this.token) {
                    let timer = setTimeout(() => {
                        timer = null
                        clearTimeout(timer)
                        this.changeQuality('ordinary')
                        this.showQualityLogin = true
                    }, 3 * 60 * 1000)
                }
            }
        },
        inject: ['reload'],
        watch: {
            dp: {
                handler: function (newValue, old) {
                    if (newValue.paused) {
                        // console.log('暂停')
                        this.refreshItem = true
                        this.showPuse = true
                    } else {
                        // console.log('播放')
                        this.refreshItem = false
                        this.showPuse = false
                    }
                },
                deep: true
            },
            showPuse(newValue, oldValue) {
                this.firstLoad = false
                if (newValue) {
                    this.timeOut = false
                } else {
                    if (this.firstLoad) {
                        this.firstLoad = false
                    } else {
                        // this.videoRefresh()
                        this.firstLoad = true
                        this.reload()
                    }
                    this.timeOut = true
                    let that = this
                    clearTimeout(this.threeSecond)
                    this.threeSecond = setTimeout(function () {
                        that.timeOut = false
                    }, 2000)
                }
            },
            supportFlv: {
                handler() {
                    if (!this.supportFlv) {
                        this.setDownloadPopup(true)
                    }
                },
            },
            token: {
                handler() {
                    if (this.token) {
                        this.showQualityLogin = false
                        this.setLoginPopup(false)
                    }
                }
            },
        },
        beforeDestroy() {
            clearInterval(this.timer)
            if (this.dp) {
                this.dp.destroy()
            }
        },
    }
</script>
<style lang="scss">

    .animation-box{
      width: 100%;
      height: 100%;
      position: relative;
      .animation{
        position: absolute;
        height: 100%;
        width: 70.3%;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
    .showRefresh-roomVideo {
        color: #fff;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        width: 58px;
        height: 38px;
        position: absolute;
        right: 100px;
        bottom: 0px;
        cursor: pointer;
        background-image: url('../assets/images/icons/refresh.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 23px 20px;
        transition: .3s;

        &:hover {
            background-image: url('../assets/images/icons/refresh_h.png');
        }
    }
</style>
<style lang="scss">
    .supportFlv {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        color: #ccc;
        line-height: 488px;
        text-align: center;

        .go-app {
            color: #5170ff;
            font-size: 16px;
        }
    }

    .dplayer-danloading {
        display: none !important;
    }

    .dplayer-bezel-icon {
        display: none !important;
    }

    .imgBnner {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    .big-play-btn {
        position: absolute;
        width: 200px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .video-player {
        height: 100%;
        position: relative;
        overflow: hidden;

        .play_img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            z-index: 100;
        }

        .dplayer-full-cover {
            width: 40px;
            height: 40px;
            //background: blue;
            position: absolute;
            top: 0;

            &:hover {
                cursor: pointer;
            }
        }

        .control {
            display: none;
            color: #fff;
            text-align: center;
            line-height: 38px;
            font-size: 14px;
            width: 58px;
            height: 38px;
            position: absolute;
            //right: 65px;
            left: 175px;
            bottom: 0px;
            z-index: 0;

            .control_box {
                width: 78px;
                height: 97px;
                position: absolute;
                bottom: 18px;
                left: -10px;

                .quality_list {
                    width: 78px;
                    height: 85px;
                    overflow: hidden;
                    display: block;
                    background-color: rgba(193, 99, 91, .3);
                    font-size: 13px;

                    & > span {
                        float: left;
                        display: block;
                        width: 100%;
                        height: 25px;
                        line-height: 25px;
                    }

                    & > span:hover {
                        background-color: #1890ff;
                    }
                }
            }
        }

        .cancelMute {
            cursor: pointer;
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            margin: auto;
            width: 152px;
            height: 52px;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 52px;
            //background-color: #c1635b;
            background-image: url("../assets/images/live-room/mute.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;

            .iconMute {
                width: 18px;
                height: 18px;
                vertical-align: text-bottom;
            }
        }

        .playFailPopup {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            color: #fff;
            text-align: center;
            line-height: 48px;
            font-size: 16px;
            z-index: 100;
            width: 372px;
            height: 48px;
            border-radius: 5px;
            border: 1px solid #FA3C3C;
            background-color: #694044;
            cursor: pointer;
        }
    }

    .quality-hide:hover {
        .control {
            display: inline-block;
        }
    }

    .quality-show {
        .control {
            display: inline-block;
        }
    }

    //    提示登录弹
    .quality-login-box {
        height: 140px;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);

        .close {
            right: 20px;
            top: 5px;
            color: #fff;
        }

        .upper {
            .high-quality {
                color: #3DB1FB;
            }
        }

        .login-btn {
            span {
                width: 146px;
                height: 39px;
                line-height: 39px;
                background: linear-gradient(135deg, #3DB1F8 0%, #0B6AA9 100%);
                border-radius: 20px;
            }
        }
    }
</style>
