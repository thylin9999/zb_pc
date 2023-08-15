<template>
    <div class="chat_box">
        <div class="content">
            <div class="announcement">
                <!-- 系统提示：任何群、广告均为诈骗，违规者封号处理!-->
                <marquee height="24" style="color: #d8ad66;" behavior=scroll>
                    <img :src="trumpet" width="14" height="14" alt="">
                    <!-- 这里可以填写走马灯内容 -->
                    {{ roomInfo.placard || '系统提示：任何群、广告均为诈骗，违规者封号处理!' }}
                </marquee>
            </div>
            <ul class="tab flex align-center text-333 font-14 justify-between">
                <li class="flex-1 text-center pointer" :class="{
                    'is-active': tab === 1
                }" @click="tab = 1">聊天</li>
                <li class="flex-1 text-center pointer" :class="{
                    'is-active': tab === 2
                }" @click="tab = 2">主播</li>
            </ul>
            <div v-if="tab === 1" class="flex-1 overflow-y-auto flex flex-column" >
                <!-- 主要的聊天室内容-->
                <div class="chat_con clear" ref="element" id="chatDiv">
                    <!--                <Picker calss="picker" v-if="showEmoji" :data="emojiIndex" set="twitter" @select="inputEmoji"/>-->
                    <ul class="chat_list">
                        <li v-for="(item,i) in chatList" :key="i" class="chat_item clear">
                            <!-- 系统提示 -->
                            <div v-if="item.type === '1120'" class="msg_item announce">
                                <div class="msg_box">
                                    <span class="msg_title notice">系统提示：</span>
                                    <span class="notice_msg">{{ item.msg }}</span>
                                </div>
                            </div>
                            <!-- 进入直播间 -->
                            <div v-if="item.type === '1010'" class="msg_item p_come">
                                <div class="msg_box">
                                    <el-popover
                                        ref="popover"
                                        :disabled="!isSuperManage"
                                        popper-class="taboo-box"
                                        placement="right"
                                        width="400"
                                        trigger="click">
                                        <div class="taboo">
                                            <div class="user flex align-center">
                                            <span class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                                                  :style="{
                                                    backgroundImage: `url(${item.avatar})`
                                                }"
                                            ></span>
                                                <div class="user-info m-l-10 flex flex-column">
                                                <span
                                                    class="text-center font-14 font-400 text-333 font-regular">{{ item.nickname
                                                    }}</span>
                                                    <span
                                                        class="level text-white text-center font-12 font-regular">{{ !item.member_id ? 'Lv0' : 'Lv1'}}</span>
                                                </div>
                                            </div>
                                            <div class="button m-t-15">
                                            <span
                                                @click="forbid(item)"
                                                class="d-inline-block font-14 font-400 font-regular text-center text-white">{{ muteMsg }}</span>
                                            </div>
                                            <i @click="closePopover" class="el-icon-close pointer p-absolute"></i>
                                        </div>
                                        <div class="d-inline-block" slot="reference" @click="openMuteDialog(item)">
                                            <span v-if="!item.member_id" class="tourist_level">Lv 0</span>
                                            <span v-else  class="member_level">Lv 1</span>
                                            <span  class="nickname msg_title">{{ item.nickname }}：</span>
                                        </div>
                                    </el-popover>
                                    <span class="p_come_msg">{{ item.msg }}</span>
                                </div>
                            </div>

                            <!-- 发言 -->
                            <div v-if="item.type === '1040'" class="msg_item">
                                <div class="msg_box">
                                    <el-popover
                                        ref="popover"
                                        :disabled="!isSuperManage"
                                        popper-class="taboo-box"
                                        placement="right"
                                        width="400"
                                        trigger="click">
                                        <div class="taboo">
                                            <div class="user flex align-center">
                                                <span class="icon d-inline-block"></span>
                                                <div class="user-info m-l-10 flex flex-column">
                                                <span
                                                    class="text-center font-14 font-400 text-333 font-regular">{{ item.nickname
                                                    }}</span>
                                                    <span
                                                        class="level text-white text-center font-12 font-regular">Lv1</span>
                                                </div>
                                            </div>
                                            <div class="button m-t-15" @click="forbid(item)">
                                            <span
                                                class="d-inline-block font-14 font-400 font-regular text-center text-white">{{ muteMsg }}</span>
                                            </div>
                                            <i @click="closePopover" class="el-icon-close pointer p-absolute"></i>
                                        </div>
                                        <div class="d-inline-block" slot="reference" @click="openMuteDialog(item)">
                                            <span  class="member_level">Lv 1</span>
                                            <span  class="nickname msg_title">{{ item.nickname }}：</span>
                                        </div>
                                    </el-popover>
                                    <span>{{ item.msg }}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="send_bot">
                  <Picker
                      style="height: 250px"
                      calss="picker"
                      v-if="showEmoji"
                      :data="emojiIndex"
                      emoji="smile"
                      set="twitter" @select="inputEmoji"/>
                    <div class="control">
                        <!--                    <el-tooltip placement="top">-->
                        <!--                        <div slot="content">锁屏</div>-->
                        <!--                        <img  :src="require('@/assets/images/live-room/icon-lock.png')" alt="">-->
                        <!--                    </el-tooltip>-->
                        <!--                    <el-tooltip placement="top">-->
                        <!--                        <div slot="content">清屏</div>-->
                        <!--                        <img :src="require('@/assets/images/live-room/icon-clear.png')" @click="iconClick(2)" alt="">-->
                        <!--                    </el-tooltip>-->
                        <!--                    <el-tooltip placement="top">-->
                        <!--                        <div slot="content">表情</div>-->
                        <!--                        <img :src="require('@/assets/images/live-room/icon-emjio.png')" @click="iconClick(4)" alt="">-->
                        <!--                    </el-tooltip>-->

                        <!--                    <img :src="require('@/assets/images/live-room/icon-close.png')" alt="">-->

                    </div>
                    <input
                        v-if="token"
                        ref="inputBox"
                        class="inp"
                        type="text"
                        placeholder="开始聊天"
                        v-model="inpTxt"
                        :maxlength="super_manage == 2 ? 100 : 30"
                        show-word-limit
                        @keydown.enter="sendMessage"
                    >
                    <div class="emjio_box">
                        <img class="emjio" :src="require('@/assets/images/live-room/icon-emjio.png')" @click="iconClick(4)" alt="">
                    </div>
                    <div class="send btn" v-throttle="[()=>sendMessage(),3000]">发送</div>
                    <div v-if="!token" class="no_login">
                        <span class="span_login" @click="openLoginDialogMixin">登录</span>
                        <span class="span_txt">发弹幕,参与主播互动</span>
                    </div>
                </div>
            </div>
            <div v-else class="flex-1 overflow-y-auto" >
                <LiveHostList :match-id="matchId" />
            </div>
        </div>
    </div>
</template>
<script>
import { Message } from 'element-ui'
import LiveHostList from '@/components/LiveHostList'
import { mapState } from 'vuex'
import { muteLiveRoom, checkMute } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import data from 'emoji-mart-vue-fast/data/twitter.json'
import { getToken, removeSessionStorageItem, removeToken } from '@/utils/cookie'
const include = ['smileys']
const emojiIndex = new EmojiIndex(data, { include })
const emojiDel = ['face_holding_back_tears', 'melting_face', 'saluting_face', 'face_with_open_eyes_and_hand_over_mouth',
    'face_with_peeking_eye', 'face_with_diagonal_mouth', 'dotted_line_face']
if (emojiIndex._categories[0].emojis) {
    emojiIndex._categories[0].emojis.forEach((item, index) => {
        if (emojiDel.includes(item.id)) {
            emojiIndex._categories[0].emojis.splice(index, 1)
        }
    })
}
emojiIndex._categories[0].emojis = emojiIndex._categories[0].emojis.slice(0, 27)
export default {
    // eslint-disable-next-line no-undef
    components: { Picker, LiveHostList },
    props: {
        visitSend: {
            type: Boolean,
            default: false
        },
        roomInfo: {
            type: Object,
            default: function () {
                return {}
            }
        },
        matchId: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            tab: 1,
            isMute: false, // 是否禁言了
            emojiOptions: {
                showPreview: false,
                showSkinTones: false,
                showSearch: false,
                showRecents: false,
                showEmoticons: false,
                showCategories: false,
                title: ''
            },
            showEmoji: false,
            emojiIndex: emojiIndex,
            emojisOutput: '',
            connectTime: null,
            countdown: 5, // 倒计时 5秒重连
            timer: null,
            isLeave: false,
            isConnect: false,
            inpTxt: '',
            announcement: '',
            webSocket: null,
            value: '600',
            trumpet: require('@/assets/images/common/trumpet.png'),
            chatList: []
        }
    },
    watch: {
        isConnect (newVal) {
            if (!newVal && !this.isLeave) { // 非主动断线
                this.reConnect()
            }
            if (newVal) { // 连接成功 清楚重连定时器
                clearInterval(this.connectTime)
            }
        }
    },
    computed: {
        ...mapState('user', ['nickname', 'memberId', 'token', 'super_manage', 'signature']),
        isSuperManage () {
            return this.super_manage === 2
        },
        muteMsg () {
            return this.isMute ? '已禁言' : '禁言'
        }
    },
    created () {
        this.connectWebSocket()
    },
    methods: {
        hidePopover () {
            const assistBtn = document.getElementById('assistBtn')
            assistBtn.click()
        },
        async openMuteDialog (user) {
            if (!this.token) {
                return
            }
            try {
                const { code, data } = await checkMute(user.member_id)
                if (code === statusCode.success) {
                    this.isMute = data.status === 1
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        inputEmoji (emoji) {
            this.showEmoji = !this.showEmoji
            this.inpTxt = this.inpTxt + emoji.native
        },
        iconClick (type) {
            if (type === 2) { // 清屏
                this.chatList = []
            }
            if (type === 4) { // 表情
                if (!getToken()) {
                    this.openLoginDialogMixin()
                    return
                }
                this.$emit('close')
                this.showEmoji = !this.showEmoji
            }
        },
        sendMessage () {
            if (!this.inpTxt.trim().length) return
            if (!this.token) {
                Message('请先登录')
            } else {
                this.send('1040')
            }
        },
        send (num) {
            if (num === '1040') { // 发言
                const sendCon = {
                    device: 'PC',
                    type: num,
                    room_id: this.matchId * 1,
                    member_id: this.memberId,
                    nickname: this.nickname,
                    msg: this.inpTxt,
                    signature: this.signature
                }
                this.webSocket.send(JSON.stringify(sendCon))
                this.inpTxt = ''
            }
        },
        connectWebSocket () {
            const that = this
            // eslint-disable-next-line no-undef
            this.webSocket = new WebSocket(_requestWS)
            this.webSocket.onopen = function (e) {
                if (e.type === 'open') {
                    const sendCon = {
                        device: 'PC',
                        type: '1010',
                        // room_id: that.$route.query.room_id,
                        room_id: that.matchId * 1,
                        nickname: that.nickname,
                        member_id: that.memberId,
                        signature: that.signature
                    }
                    that.isConnect = true
                    that.webSocket.send(JSON.stringify(sendCon))
                }
            }
            this.webSocket.onmessage = function (evt) {
                if (!evt.data.includes('type')) return
                const obj = JSON.parse(evt.data)
                let item = {}
                if (obj) {
                    switch (obj.type) {
                    case '1000': // 心跳检测
                        break
                    case '1010': // 用户进入直播间
                        item = {
                            type: '1010',
                            msg: '进入直播间',
                            member_id: obj.member_id ? obj.member_id : null, // 会员
                            nickname: obj.nickname,
                            avatar: obj.avatar
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.$refs.element.scrollTop = 10000000
                        })
                        break
                    case '1040': // 普通发言
                        item = {
                            type: obj.type,
                            nickname: obj.nickname,
                            msg: obj.content.msg,
                            member_id: obj.member_id,
                            avatar: obj.avatar
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.$refs.element.scrollTop = 10000000
                        })
                        that.$emit('send', {
                            'id': 'hbzb',
                            'author': 'DIYgod',
                            'time': 0,
                            'text': item.msg,
                            'color': 16777215,
                            'type': 0
                        })
                        break
                    case '1090': // 1090主播关闭直播
                        item = {
                            type: '1090',
                            msg: '系统提示：主播已下播'
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.$refs.element.scrollTop = 10000000
                        })
                        break
                    case '1120': // 系统提示
                        item = {
                            type: '1120',
                            msg: obj.content.msg
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.$refs.element.scrollTop = 10000000
                        })
                        break
                    case '1210': // 系统提示
                        removeSessionStorageItem('userInfo')
                        removeToken()
                        Message.error(obj.content, 'warning', 3000)
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                        break
                    case '1072': // 系统提示
                        Message('您已被禁言,请联系在线客服。')
                        break
                    case '2010': // 信息發送頻繁
                        item = {
                            type: '2010',
                            msg: obj.content
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.$refs.element.scrollTop = 10000000
                        })
                        break
                    default: // 1110主播回来
                        break
                    }
                }
            }
            // 关闭链接
            this.webSocket.onclose = function () {
                console.log('webScoket  已经断开')
                if (!this.isLeave) that.isConnect = false
            }
        },
        closeWs () {
            this.webSocket.close()
        },
        reConnect () { // 断线重连
            this.connectTime = setInterval(() => {
                this.connectWebSocket()
                console.log('断线重连')
            }, 5000)
        },
        closePopover () {
            // this.$refs.popover.doClose()
            this.$refs.popover.forEach(el => {
                el.doClose()
            })
        },
        async forbid (item) { // 禁言
            try {
                const {
                    msg,
                    data,
                    code
                } = await muteLiveRoom({
                    memberId: item.member_id,
                    roomId: this.roomInfo.room_id
                })
                console.log(msg, data)
                if (code === statusCode.success) {
                    Message('禁言成功')
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.closePopover()
            }
        }
    },
    beforeDestroy () {
        clearInterval(this.connectTime)
        this.isLeave = true // 主动离开 不需重连
        this.closeWs()
    }
}
</script>

<style scoped lang="scss">
    @import "./index.scss";
    .tab {
        line-height: 35px;
        height: 35px;
        border-bottom: 1px solid #A4DCFF;
        li {
            &.is-active {
                color: #3DB1FB;
            }
        }
    }
    .taboo {
        .el-icon-close {
            font-size: 12px;
            right: 10px;
            top: 10px;
        }

        .user {
            .icon {
                width: 35px;
                height: 35px;
                background-color: #eee;
            }

            .level {
                width: 40px;
                background: #79CBFF;
                border-radius: 3px;
                line-height: 16px;
                height: 16px;
            }
        }

        .button {
            cursor: pointer;

            span {
                width: 137px;
                height: 23px;
                background: #79CBFF;
                border-radius: 3px;
            }
        }
    }

    .msg_box {
        .level {
            width: 40px;
            background-color: #D5D5D5;
            border-radius: 3px;
            line-height: 16px;
            height: 16px;

            &.is-vip {
                background-color: #79CBFF;
            }
        }
    }
</style>
