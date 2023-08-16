<template>
  <div class="chat_box">
<!--    <span class="test" @click="test">test</span>-->
    <div class="content p-relative"
      :class="{
        'is-virtual-room': isVirtual
      }"
    >
      <div class="announcement p-relative" v-if="!noMarqueen">
        <!-- 系统提示：任何群、广告均为诈骗，违规者封号处理!-->
<!--        <marquee height="24" style="color: #d8ad66;" behavior=scroll>-->
<!--          <img :src="trumpet" width="14" height="14" alt="">-->
<!--          &lt;!&ndash; 这里可以填写走马灯内容 &ndash;&gt;-->
<!--          {{ roomInfo.placard || '系统提示：任何群、广告均为诈骗，违规者封号处理!' }}-->
<!--        </marquee>-->
        <live-announce />
      </div>
      <ul v-if="isVirtual" class="tab flex align-center text-333 font-14 justify-between">
          <li class="flex-1 text-center pointer" :class="{
                  'is-active': tab === 1
              }" @click="tab = 1">聊天</li>
          <li class="flex-1 text-center pointer" :class="{
                  'is-active': tab === 2
              }" @click="tab = 2">主播</li>
      </ul>
      <div
          v-if="tab === 1 || !isVirtual"
          id="chatRef" class="flex-1 chat-ref flex flex-column p-relative"
          :class="{
              'h-100': !isVirtual
          }"
      >
          <!-- 主要的聊天室内容-->
          <div class="chat_con clear" ref="element" id="chatDiv">
              <ul class="reconnection" v-if="handControl && !isConnect" v-loading="loading">
                  <div class="txt" @click="reConnect"> 重新连接</div>
              </ul>
              <ul class="chat_list" v-else>
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
                                      class="taboo-popover d-inline-block"
                                      placement="top-start"
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
                                                      class="level text-white text-center font-12 font-regular">Lv1</span>
                                          </div>
                                      </div>
                                      <div class="button m-t-15">
                                            <span
                                                    @click="forbidSure(item)"
                                                    class="d-inline-block font-14 font-400 font-regular text-center text-white">{{ muteMsg
                                                }}</span>
                                      </div>
                                      <i @click="closePopover" class="el-icon-close pointer p-absolute"></i>
                                  </div>
                                  <div class="d-inline-block" slot="reference" @click="openMuteDialog(item)">
                                      <div class="flex align-center">
<!--                                        <span v-if="!item.member_id" class="tourist_level">Lv 0</span>-->
                                        <!--                                      <span v-else class="member_level">Lv 1</span>-->
                                          <span
                                              class="member_level"
                                              :class="`label${item.label}`"
                                          >

                                        </span>
                                        <span class="nickname msg_title m-l-10">{{ item.nickname }}：</span>
                                      </div>
                                  </div>
                              </el-popover>
                              <span class="p_come_msg">{{ item.msg }}</span>
                          </div>
                      </div>

                      <!-- 发言 -->
                      <div v-if="item.type === '1040'" class="msg_item">
                          <div class="msg_box" :class="{msg_box_link:[1,2].includes(item.jump_type)}">
                              <el-popover
                                      ref="popover"
                                      :disabled="!isSuperManage"
                                      class="taboo-popover d-inline-block"
                                      popper-class="taboo-box"
                                      placement="top-start"
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
                                      <div class="button m-t-15" @click="forbidSure(item)">
                                            <span
                                                    class="d-inline-block font-14 font-400 font-regular text-center text-white">{{ muteMsg
                                                }}</span>
                                      </div>
                                      <i @click="closePopover" class="el-icon-close pointer p-absolute"></i>
                                  </div>
                                  <div class="d-inline-block name-box" slot="reference" @click="openMuteDialog(item)">
                                      <div class="flex align-center">
                                        <span class="member_level"
                                              :class="[
                                            `label${item.label}`
                                        ]"
                                        ></span>
                                        <span class="nickname m-l-10 msg_title">{{ item.nickname }}：</span>
                                      </div>
                                  </div>
                              </el-popover>
                              <!--jump_type 1外跳 2内跳   此判断只针对移动 pc皆打开新界面 -->
                              <span v-if="[1,2].includes(item.jump_type)" @click="linkUrl(item)" class="msg_link"> {{ item.msg
                                  }} </span>
                              <span class="msg-content" v-else>{{ item.msg }}</span>
                          </div>
                      </div>
                      <!--  礼物-->
                    <div v-if="item.type === '1121'" class="msg_item">
                      <div class="msg_box gift-msg">
                        <el-popover
                            ref="popover"
                            :disabled="!isSuperManage"
                            class="taboo-popover d-inline-block"
                            popper-class="taboo-box"
                            placement="top-start"
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
                            <div class="button m-t-15" @click="forbidSure(item)">
                                            <span
                                                class="d-inline-block font-14 font-400 font-regular text-center text-white">{{ muteMsg
                                              }}</span>
                            </div>
                            <i @click="closePopover" class="el-icon-close pointer p-absolute"></i>
                          </div>
                          <div class="d-inline-block name-box" slot="reference" @click="openMuteDialog(item)">
                            <div class="flex align-center">
                              <span class="member_level"
                                    :class="[
                                  `label${item.label}`
                              ]"
                              ></span>
                              <span class="nickname m-l-10 msg_title">{{ item.nickname }}</span>
                            </div>
                          </div>
                        </el-popover>
                        <span class="msg-content flex-1 d-inline-block">
                            <span class="p-l-5 p-r-5">送出</span>
                            <span>{{ item.gift_name }}</span>
                            <img class="gift-img" :src="item.gift_img" alt="">
                        </span>
                      </div>
                    </div>
                  </li>
              </ul>

          </div>
          <div v-if="showLabel"
               class="tips text-center p-absolute flex align-center justify-center"
               @click="goToBottom"
          >
              <i class="el-icon-arrow-down text-white"></i>
              <span class="font-12 m-l-5 text-white">有更多新的消息</span>
          </div>
          <!--快捷发言区-->
          <div class="quickList bg-white" v-if="quickList.length">
              <i class="el-icon-caret-left" @click="quickListMove('l')"></i>
              <i class="el-icon-caret-right" @click="quickListMove('r')"></i>
              <ul id="quickList">
                  <li v-for="(item,i) in quickList" :key="i" @click="send('1040',item)">
                      <span>{{ item.content }}</span>
                  </li>
              </ul>
          </div>
          <div class="divider"></div>
          <div class="send_bot ">

              <div class="operat-btn w-100 p-relative ">
                <Picker
                    v-clickoutside="handleClickOutside"
                    style="height: 250px"
                    class="picker p-absolute"
                    v-if="showEmoji"
                    :data="emojiIndex"
                    emoji="smile"
                    set="twitter" @select="inputEmoji"/>
                <div class="w-100 h-100 flex align-center justify-between p-t-5 p-b-5 p-l-10">
                  <div class="flex align-center">
                    <el-tooltip placement="top">
                      <div slot="content">表情</div>
                      <HoverIcon :width="20" :height="20" icon="live-room/icon-emjio"
                               @click.native="iconClick(4)"
                      />
                    </el-tooltip>
                    <el-tooltip placement="top">
                      <div slot="content">清理</div>
                      <HoverIcon class="m-l-15" :width="20" :height="20" icon="live-room/icon-clear"
                               @click.native="clearMsg"
                      />
                    </el-tooltip>
                  </div>
                  <div :class="{
                      'visibility-hidden': isVirtual
                  }">
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        >
                      <div class="popover-content">
                        <el-checkbox label="屏蔽礼物消息" v-model="hideGiftMsg"></el-checkbox>
                        <el-checkbox class="m-t-15" label="屏蔽礼物特效" v-model="hideAnimation"></el-checkbox>
                      </div>
                      <HoverIcon slot="reference" class="" :width="20" :height="20" icon="live-room/clear-gift"
                      />
                    </el-popover>
                  </div>
                </div>

              </div>
              <div class="input-row w-100 flex align-center">
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
                <div v-else class="no_login">
                  <span class="span_login" @click="openLoginDialogMixin">登录</span>
                  <span class="span_txt">发弹幕,参与主播互动</span>
                </div>
                <el-button
                    small
                    class="send btn"
                    :disabled="chatTime >0"
                    v-throttle="[()=>sendMessage(),3000]"> {{ chatTime >0 ? chatTime + 's' :'发送' }}
                </el-button>
              </div>
          </div>
          <div class="gift-box w-100 p-absolute">
            <gift-box />
            <vip-gift />
          </div>
      </div>
      <div v-else class="flex-1 overflow-y-auto" >
          <LiveHostList :match-id="matchId" />
      </div>
    </div>
    <div class="linkPopup" v-show="linkPopupShow">
      <i class="el-icon-close" @click="linkPopupEvent('close')"></i>
      <p class="title">互动弹幕</p>
      <div class="link-txt">
        <div class="t-1">全天赛事精彩不断 看赛事直播上看球</div>
        <div class="t-link">{{ currentLinkInfo.jump_url }}</div>
      </div>
      <div class="link-btn" @click="linkPopupEvent('link')">访问链接</div>
    </div>
  </div>
</template>
<script>
import { Message, MessageBox } from 'element-ui'
import { mapState } from 'vuex'
import { muteLiveRoom, checkMute } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// import data from 'emoji-mart-vue-fast/data/all.json'
import data from 'emoji-mart-vue-fast/data/twitter.json'
import LiveAnnounce from '@/components/LiveAnnounce'
import { getToken, removeSessionStorageItem, removeToken } from '@/utils/cookie'
import { speechList } from '@/api/competition/competition'
import LiveHostList from '@/components/LiveHostList.vue'
import { useTip } from '@/utils/msgDialog'
import GiftBox from '@/views/LiveRoom/Components/GiftTip/GiftBox.vue'
import VipGift from '@/views/LiveRoom/Components/GiftTip/VipGift'
import { getUid } from '@/utils/utils'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import HoverIcon from '@/components/HoverIcon'
const include = ['smileys']
const emojiIndex = new EmojiIndex(data, { include })
const emojiDel = ['face_holding_back_tears', 'melting_face', 'saluting_face', 'face_with_open_eyes_and_hand_over_mouth',
    'face_with_peeking_eye', 'face_with_diagonal_mouth', 'dotted_line_face', 'smiling_face_with_tear']
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
    components: { LiveHostList, Picker, LiveAnnounce, GiftBox, HoverIcon, VipGift },
    directives: { Clickoutside },
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
        isVirtual: {
            type: Boolean,
            default: false
        },
        matchId: {
            type: [String, Number],
            default: ''
        },
        noMarqueen: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tab: 1,
            currentLinkInfo: {}, // 当前链接信息
            linkPopupShow: false, // 超链接弹窗
            quickList: [], // 快捷发言列表
            chatTime: 0,
            chatTimer: null,
            isMute: false, // 是否禁言了
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
            chatList: [],
            showLabel: false,
            isOnBottom: true, // 默认是在最下方
            breakTime: 0,
            handControl: false,
            loading: false, // 重连加载中
            hideAnimation: false,
            hideGiftMsg: false
        }
    },
    watch: {
        isConnect (newVal) { // 监听是否连接 逻辑调整 三次自动重连后改为用户手动一次
            if (!newVal && !this.isLeave && this.breakTime < 3) { // 非主动断线  且重连次数不达到三次
                this.chatAddInfo('1120', '聊天室连接失败')
                this.reConnect()
            } else { // 手动重连
                this.handControl = true // 手动重连出现
            }
            if (newVal) { // 连接成功 清楚重连定时器
                clearInterval(this.connectTime)
            }
        }
    },
    computed: {
        ...mapState('user', ['nickname', 'member_id', 'memberId', 'token', 'super_manage', 'signature', 'giftList']),
        isSuperManage () {
            return this.super_manage === 2
        },
        muteMsg () {
            return this.isMute ? '已禁言' : '禁言'
        }

    },
    created () {
        this.connectWebSocket()
        this.init()
    },
    mounted () {
        this.$refs.element.addEventListener('scroll', () => this.scrollChatList(true))
    },
    methods: {
        init () {
        /* 进入直播间 优先给聊天室提示 */
            this.chatAddInfo('1120', '聊天室连接中...')
            this.getSpeechList() // 获取快捷发言列表
        },
        chatAddInfo (type, msg, content) { // 聊天室添加信息
            if (!content) {
                const item = { type, msg }
                this.$nextTick(() => {
                    this.chatList.push(item)
                })
            }
        },
        linkUrl (item) {
            this.currentLinkInfo = item
            this.linkPopupShow = true
        },
        linkPopupEvent (type) {
            if (type === 'link') {
                window.open(this.currentLinkInfo.jump_url)
            }
            this.linkPopupShow = false
        },
        async getSpeechList () { // 获取快捷发言内容
            if (!this.token) return
            const sendJson = {
                pageNum: 1,
                pageSize: 100
            }
            sendJson.type = this.super_manage === 2 ? 2 : 1
            const { code, data } = await speechList(sendJson)
            if (code === statusCode.success) {
                this.quickList = JSON.parse(JSON.stringify(data.list))
            }
        },
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
        quickListMove (direction) { // 快捷发言列表滚动
            const quickList = document.getElementById('quickList')
            const quickListWidth = quickList.offsetWidth
            const quickListScrollLeft = quickList.scrollLeft
            if (direction === 'l') {
                quickList.scrollLeft = quickListScrollLeft - quickListWidth
            } else {
                quickList.scrollLeft = quickListScrollLeft + quickListWidth
            }
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
        clearMsg () {
            this.chatList = []
        },
        handleClickOutside () {
            this.showEmoji = false
        },
        sendMessage (val) {
            // if (val) this.inpTxt = val
            if (!this.inpTxt.trim().length) return
            if (!this.token) {
                Message('请先登录')
            } else {
                this.send('1040')
            }
        },
        send (num, item) {
            if (this.chatTime > 0) { // 有倒计时 皆不可发言
                return
            } else {
                this.chatTime = 3
                const timer = setInterval(() => {
                    if (this.chatTime > 0) {
                        this.chatTime--
                    } else {
                        clearInterval(timer)
                    }
                }, 1000)
            }
            if (num === '1040') { // 发言
                const sendCon = {
                    device: 'PC',
                    type: num,
                    room_id: this.isVirtual ? this.matchId * 1 : this.$route.query.room_id,
                    // room_id: this.$route.query.room_id,
                    member_id: this.memberId,
                    nickname: this.nickname,
                    msg: this.inpTxt,
                    signature: this.signature
                }
                if (item) { // 快捷发言
                    sendCon.msg = item.content
                    sendCon.jump_type = item.jump_type
                    sendCon.jump_url = item.jump_url
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
                        // room_id: that.$route.query.room_id,
                        room_id: that.isVirtual ? that.matchId * 1 : that.$route.query.room_id,
                        nickname: that.nickname,
                        member_id: that.memberId,
                        signature: that.signature
                    }
                    console.log('---websocke已连接成功---')
                    that.chatAddInfo('1120', '聊天室已连接成功')
                    that.isConnect = true
                    that.loading = false // 连接成功 不用加载框
                    that.webSocket.send(JSON.stringify(sendCon))
                }
            }
            this.webSocket.onmessage = function (evt) {
                if (!evt.data.includes('type')) return
                const obj = JSON.parse(evt.data)
                // 在这里判断，是否需要展示标签
                that.checkIsOnBottom()
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
                            avatar: obj.avatar,
                            label: obj.label ? obj.label : 0
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                            // that.$refs.element.scrollTop = 10000000
                        })
                        break
                    case '1040': // 普通发言
                        item = {
                            type: obj.type,
                            nickname: obj.nickname,
                            msg: obj.content.msg,
                            member_id: obj.member_id,
                            avatar: obj.avatar,
                            jump_type: obj.content.jump_type,
                            jump_url: obj.content.jump_url,
                            label: obj.content.label || obj.content.userInfo.label
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                        })
                        that.$emit('send', item)
                        break
                    case '1090': // 1090主播关闭直播
                        item = {
                            type: '1090',
                            msg: '系统提示：主播已下播'
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                        })
                        break
                    case '1120': // 系统提示
                        item = {
                            type: '1120',
                            msg: obj.content.msg
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
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
                    case '1071': // 管理员对用户禁言 - 当做系统提示
                        item = {
                            type: '1120',
                            msg: obj.nickname + '被管理员禁言'
                        }
                        that.chatList.push(item)
                        that.$nextTick(() => {
                            that.wsMsgScroll(obj)
                        })
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
                            that.wsMsgScroll(obj)
                        })
                        break
                    case '1310': // 主播下拨后 视频区逻辑-展示下播文案 推荐热门直播三个
                        that.$emit('changeStatus', 1)
                        break
                    case '1121':
                        that.handleGiftMsg(obj)
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
            this.loading = true
            this.connectTime = setInterval(() => {
                this.connectWebSocket()
                console.log('断线重连')
                this.breakTime += 1
            }, 5000)
        },
        closePopover () {
        // this.$refs.popover.doClose()
            this.$refs.popover.forEach(el => {
                el.doClose()
            })
        },
        forbidSure (item) {
            MessageBox(`确认将用户[${item.nickname}]禁言？`, '禁言提示', {
                confirmButtonText: '确定'
            }).then(() => {
                this.forbid(item)
            })
        },
        async forbid (item) { // 禁言
            try {
                const { code } = await muteLiveRoom({
                    memberId: item.member_id,
                    roomId: this.roomInfo.room_id
                })
                if (code === statusCode.success) {
                    Message('禁言成功')
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.closePopover()
            }
        },
        wsMsgScroll (obj) {
        // 新消息来时，需要判断，是否在最下方，如果是，那么就滚动，否则不滚动
            if (obj.member_id === this.memberId) {
                // 需要滚动到最底下
                this.goToBottom()
            } else {
                if (this.isOnBottom) {
                    this.goToBottom()
                } else {
                    this.scrollChatList()
                }
            }
        },
        checkIsOnBottom () {
            this.isOnBottom = this.$refs.element.scrollHeight - 10 < this.$refs.element.scrollTop + this.$refs.element.offsetHeight
        },
        scrollChatList (notShowAgain = false) { // 获取消息后，判断是否需要展示 最新消息
            if (this.$refs.element.scrollHeight - 10 > this.$refs.element.scrollTop + this.$refs.element.offsetHeight) {
                if (!notShowAgain) { // 手动滑动时，不展示 更多消息
                    this.showLabel = true
                }
            } else {
                this.showLabel = false
            }
        },
        goToBottom () {
            this.$refs.element.scrollTop = this.$refs.element.scrollHeight
            this.showLabel = false
        },
        test () {
            const msg = {
                animation: 'http://img.wuhaicj.com/gift/2023060217165287911.svga',
                avatar: 'http://img.wuhaicj.com/avatar/2023030222011632325.jpeg',
                gift_id: 39,
                gift_name: 'test2',
                img: 'http://img.wuhaicj.com/cover/2023060217163225374.png',
                label: '11',
                member_id: '1000007',
                msg: 'alvin111送出板砖',
                nickname: 'alvin111',
                room_id: '2000639',
                type: '1121'
            }
            this.handleGiftMsg(msg)
            // setTimeout(() => {
            //     this.handleGiftMsg({
            //         animation: 'http://img.wuhaicj.com/gift/2023052016284560625.svga',
            //         avatar: 'http://img.wuhaicj.com/avatar/2023030222011632325.jpeg',
            //         gift_id: 11,
            //         gift_name: '金杯',
            //         img: 'http://img.wuhaicj.com/cover/2023051914189564899.png',
            //         label: '11',
            //         member_id: '1000007',
            //         msg: 'alvin111送出金杯',
            //         nickname: 'alvin111',
            //         room_id: '2000639',
            //         type: '1121'
            //     })
            // }, 1000)
        },
        handleGiftMsg (msg) { // 防止消息过快导致的问题
            // 执行
            if (!this.hideGiftMsg) { // 消息可以先出现，动画得排队一个个出现
                const item = {
                    type: msg.type,
                    nickname: msg.nickname,
                    gift_name: msg.gift_name,
                    gift_img: msg.img,
                    msg: msg.msg,
                    member_id: msg.member_id,
                    avatar: msg.avatar,
                    label: msg.label || 0
                }
                this.chatList.push(item)
                this.$nextTick(() => {
                    this.wsMsgScroll(msg)
                })
                this.$emit('send', {
                    'id': 'hbzb',
                    'author': 'DIYgod',
                    'time': 0,
                    'text': item.msg,
                    'color': 16777215,
                    'type': 0
                })
            }
            if (!this.hideAnimation) {
                const gift = this.giftList.find(x => x.id === msg.gift_id * 1)
                const id = getUid()
                if (gift) {
                    if (gift.type === 2) { // 普通礼物
                        useTip.addItem({
                            ...msg,
                            msgId: id,
                            giftUrl: gift.animation || msg.animation,
                            giftType: gift.type || 2,
                            gift
                        })
                        useTip.start()
                    } else {
                        // 豪华礼物，聊天室无法聊天
                        useTip.addVipItem({
                            ...msg,
                            msgId: id,
                            giftUrl: gift.animation || msg.animation,
                            giftType: gift.type || 2,
                            gift
                        })
                        useTip.startVip()
                    }
                }
            }
        }
    },
    beforeDestroy () {
        clearInterval(this.connectTime)
        this.isLeave = true // 主动离开 不需重连
        this.closeWs()
        this.$refs.element.removeEventListener('scroll', () => this.scrollChatList(true))
    }
}
</script>

<style scoped lang="scss">
  @import "./index.scss";
  .test {
    position: fixed;
    right: 200px;
    top: 100px;
  }
  .tab {
    line-height: 35px;
    height: 35px;
    border-bottom: 1px solid #F3F3F3;
    li {
      &.is-active {
        color: #409eff;
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
        background: #409eff;
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
        background: #A05A77;
        border-radius: 3px;
      }
    }
  }

  .msg_box {
    .msg_title {
      color: #4164FF;
    }
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

  .send_bot {

    .emoji-mart emoji-mart-static {
      height: 200px;
    }
  }

  .tips {
    width: 138px;
    height: 25px;
    line-height: 25px;
    background: #A05A77;
    border-radius: 13px;
    opacity: 0.8;
    left: 50%;
    transform: translateX(-50%);
    bottom: 80px;
  }

</style>
