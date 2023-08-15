<template>
    <div class="live-room">
        <div class="box" v-if="roomInfo && anchorInfo">
            <div class="left">
                <div class="top">
<!--                    <img class="img_title" :src="anchorInfo.logo" alt="">-->
                    <div class="img_title bg-no-repeat bg-center bg-size-cover"
                        :style="{
                            backgroundImage: `url(${anchorInfo.logo})`
                        }"
                    >
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
                    </div>
                    <div class="home_away" v-if="roomInfo.match_info">
                        <el-tooltip class="item" effect="dark" :content="roomInfo.match_info.homeChs" placement="top-start">
                            <div class="homeChs">{{ roomInfo.match_info.homeChs }}</div>
                        </el-tooltip>
                        <img class="homeLogo" :src="homeLogo" alt="">
                        <img class="vs" :src="require('@/assets/images/live-room/vs.png')" alt="">
                        <img class="awayLogo" :src="awayLogo" alt="">
                        <el-tooltip class="item" effect="dark" :content="roomInfo.match_info.awayChs" placement="top-start">
                            <div class="awayChs">{{ roomInfo.match_info.awayChs }}</div>
                        </el-tooltip>
                    </div>
                    <div class="watch_phone" @mousemove="showModule = true" @mouseleave="showModule = false">
                        <img :src="require('@/assets/images/live-room/share-icon.png')"
                             style="width: 14px;vertical-align: bottom" alt="">
                        <span style="font-size: 12px;padding: 0 5px;">分享</span>
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
                        <img :src="require('@/assets/images/live-room/complain-icon.png')"
                             style="width: 14px;vertical-align: bottom" alt="">
                        <span style="font-size: 12px;padding: 0 5px;">举报/投诉</span>
                    </div>
                    <div class="hot">
                        <img style="width: 14px;vertical-align: baseline" class="icon"
                             :src="require('@/assets/images/live-room/hot-icon.png')" alt="">
                        {{ anchorInfo.follow }}
                    </div>
                    <div class="book_box">
                        <!--                        {{ anchorInfo.follow }}人 |-->
                        <span class="book_btn" v-throttle="[()=>followHost(),3000]">
                           {{ anchorInfo.is_follow ? '已关注' : '关注' }}
                        </span>
                    </div>
                </div>
                <keep-alive v-if="isRouterAlive">
                    <div class="video_box">
                        <VideoRoom v-if="roomInfo.live_status == 2 || 1" :videoInfo="roomInfo" ref="videoRoom"></VideoRoom>
                        <CloseRecommend v-else class="closeRecommend"></CloseRecommend>
                        <div class="leaveStatus" v-if="roomInfo.live_status == 1 ">主播已离开</div>
                    </div>
                </keep-alive>
            </div>
            <div class="right">
                <Chat :roomInfo="roomInfo" v-on:send="sendDankamu"></Chat>
            </div>
        </div>
    </div>
</template>

<script>
import QR from '@/views/Layout/QR'
import Chat from './chat/index'
import VideoRoom from '@/components/VideoRoom'
import { statusCode } from '@/utils/statusCode'
import { liveRoom } from '@/api/competition/competition'
import { Message } from 'element-ui'
import { followHost } from '@/api/Host/Host'
import { mapState } from 'vuex'
import CloseRecommend from './closeRecom'
import { Copy } from '@/utils/validator'
import CustomSpan from '@/components/CustomSpan'

export default {
    name: 'liveRoom',
    components: {
        QR,
        Chat,
        VideoRoom,
        CloseRecommend,
        CustomSpan
    },
    data () {
        return {
            isRouterAlive: true,
            // eslint-disable-next-line no-undef
            shareUrl: window.location.href,
            showModule: false,
            matchInfo: null,
            roomInfo: null,
            anchorInfo: null,
            defaultB: require('@/assets/images/home/card/basketball.png'),
            defaultF: require('@/assets/images/common/team-flag.png')
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    computed: {
        ...mapState('user', ['token']),
        homeLogo () {
            return this.roomInfo.match_info.homeLogo ? this.roomInfo.match_info.homeLogo : this.emptyLogo
        },
        awayLogo () {
            return this.roomInfo.match_info.awayLogo ? this.roomInfo.match_info.awayLogo : this.emptyLogo
        },
        emptyLogo () {
            return [this.defaultF, this.defaultB][this.roomInfo.type - 1]
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
    methods: {
        reload () {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },
        sendDankamu (val) {
            this.$refs.videoRoom.$emit('sendDankamu', val)
        },
        async getInfo (dataJson) {
            const {
                data,
                code,
                msg
            } = await liveRoom(dataJson)
            if (code === statusCode.success) {
                this.roomInfo = data.room_info
                this.matchInfo = data.room_info && data.room_info.match_info
                this.anchorInfo = data.anchor_info
                // 外面有需要用到 match_id
                this.$emit('update:matchId', this.roomInfo.match_id)
                this.$emit('changeMatchInfo', this.matchInfo)
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
                    // this.anchorInfo.is_follow = this.anchorInfo.is_follow ? 1 : 0
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
        }
    }
}
</script>

<style scoped lang="scss">
    .live-room {
        width: 100%;
        padding-left: 100px;
        padding-right: 100px;
        padding-top: 8px;
        min-width: 1325px;
        max-width: 1650px;
        margin: auto;
    }

    .box {
        height: 40.78vw;
        justify-content: center;
        min-height: 536px;
        max-height: 704px;
        margin: auto;
        display: flex;

        .left {
            display: flex;
            flex-direction: column;
            min-width: 800px;
            max-width: 1100px;
            flex: 1;
            height: 100%;

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
                    max-width: 120px;
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
                        color: #9f9f9f;
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

                        .no {
                            color: #8D8D8D;
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

                .home_away {
                    height: 100%;
                    position: relative;
                    z-index: 0;

                    & > div {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }

                    & > img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }

                    & > .vs {
                        width: 30px;
                        left: 0;
                        right: 0;
                    }

                    .homeLogo {
                        right: 52.5%;
                        width: 40px;
                        height: 40px;
                    }

                    .homeScore {
                        right: 58%;
                        line-height: 86px;
                        font-size: 22px;
                    }

                    .homeChs {
                        text-align: right;
                        font-size: 18px;
                        right: 58%;
                        line-height: 86px;
                        width: 10%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .awayLogo {
                        left: 52.5%;
                        width: 40px;
                        height: 40px;
                    }

                    .awayScore {
                        left: 58%;
                        line-height: 86px;
                        font-size: 22px;
                    }

                    .awayChs {
                        font-size: 18px;
                        left: 58%;
                        line-height: 86px;
                        width: 10%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                }

                .watch_phone {
                    cursor: pointer;
                    border-radius: 5px;
                    padding: 8px 0;
                    font-size: 12px;
                    position: absolute;
                    bottom: 4px;
                    right: 105px;
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
                    right: 0px;
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
                    top: 5px;
                    right: 20px;
                    padding: 6px 18px;
                    border-radius: 20px;
                    color: #fff;
                    background: linear-gradient(to top, #3B5FFF, #A2B3FF);

                    .book_btn {
                        cursor: pointer;
                    }
                }
            }

            .video_box {
                width: 100%;
                flex: 1;
                flex-direction: column;
                position: relative;
                background-color: #000;

                .closeRecommend {
                    position: absolute;
                    width: 80%;
                    bottom: 10%;
                    left: 10%;
                }

                .leaveStatus {
                    letter-spacing: 2px;
                    cursor: pointer;
                    position: absolute;
                    top: 30%;
                    left: 0;
                    right: 0;
                    margin: auto;
                    width: 222px;
                    height: 41px;
                    border-radius: 5px;
                    color: #666;
                    font-size: 13px;
                    text-align: center;
                    line-height: 34px;
                    background: url("../../assets/images/live-room/close.png") no-repeat;
                    background-size: 100% 100%;

                    .iconMute {
                        width: 18px;
                        height: 18px;
                        vertical-align: text-bottom;
                    }
                }
            }

        }

        .right {
            //background: #fff;
            //margin-left: 10px;
            //border-radius: 4px;
            //border: 0.5px solid rgba(182, 188, 203, .4);
            //max-width: 335px;
            //min-width: 316px;
            //height: 100%;
            background: #fff;
            margin-left: 10px;
            border-radius: 4px;
            border: 0.5px solid rgba(182, 188, 203, .4);
            width: 336px;

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
        }
    }

    @media screen and (max-width: 1360px) {
        .box {
            height: 554px;
        }
    }

    .tj {
        padding-top: 50px;
    }
</style>
