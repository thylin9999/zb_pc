<template>
<div class="card pointer transition-3 w-100 flex align-center justify-center  rect ">
    <div class="flex content-box bg-white h-100 border-raduis-10 align-center">
        <div class="left-time flex align-center">
            <span class="type d-inline-block bg-no-repeat m-r-10 bg-center bg-size-cover"
                  :style="{
                    backgroundImage: `url(${matchIcon})`
                  }"
            ></span>
            <div class="flex flex-column align-center justify-center">
                <CustomSpan
                    class="  font-medium font-16 text-333 font-600"
                    :content="formatTime(match.matchTime)"
                />
                <div class="font-14 font-400 text-999 m-t-5">
                    {{ match.leagueChsShort}}
                    <span v-if="match.roundCn">第{{ match.roundCn }}轮</span>
                </div>
            </div>
        </div>
        <div class="left-info p-l-15 flex align-center justify-between">
            <div class="battle-info w-100 flex justify-between align-center">
                <div class="home team flex align-center flex-end">
                    <div class="flex icon-and-name align-center justify-center">
                        <custom-span
                            class="font-medium m-r-5 text-right team-name   font-14 font-500"
                            :content="match.homeChs"
                        />
                        <div class="icon flex-shrank-0 bg-no-repeat bg-center m-l-15"
                             v-lazy-container="{ selector: 'img' }">
                            <img class="w-100 h-100" :data-src="homeLogo" :data-error="errorTeamLogo" alt="">
                        </div>
                    </div>
                </div>
                <div class="middle-info flex m-l-5 m-r-5 flex-column align-center">
                    <div class="status-time flex align-center jusfity-center m-b-5">
                        <DynamicDot v-if="isGoing" class="m-r-5"/>
                        <span class="font-12 font-400 ">{{matchStatusString}}</span>
                    </div>
                    <div class="flex align-center justify-center score">
                        <template v-if="isGoing || isEnd">
                            <span class=" score text-center d-inline-block">{{ match.homeScore }}</span>
                            <span class="p-l-10 p-r-10"> -</span>
                            <span class=" score text-center d-inline-block">{{ match.awayScore }}</span>
                        </template>
                        <template v-else>
                            <span class="font-20 font-500 text-999">VS</span>
                        </template>
                    </div>
                </div>
                <div class="away team flex align-center">
                    <div class="flex icon-and-name align-center justify-center">
<!--                        <div class="icon bg-no-repeat bg-center m-l-15 m-r-15"-->
<!--                             v-lazy:background-image="awayLogo"></div>-->
                        <div class="icon flex-shrank-0 bg-no-repeat bg-center  m-r-15"
                             v-lazy-container="{ selector: 'img' }">
                            <img class="w-100 h-100" :data-src="awayLogo" :data-error="errorTeamLogo" alt="">
                        </div>
                        <custom-span
                            class="font-medium team-name m-l-5 text-left font-14 font-500"
                            :content="match.awayChs"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="right-host p-r-20 flex align-center justify-center">

            <div class="button ">
                <!--有直播的-->
                <div class="hosts overflow-x-auto"
                     v-if="hasLivingBroad"
                >
                    <PopoverHost
                        :match="match"
                        show-button
                        is-dark
                    />
                </div>
                <!--没有直播的-->
                <template v-else>
                    <div
                        v-if="isFutureMatch"
                        class=" pointer match-status flex align-center justify-center w-100 h-100"
                        :class="{
                            'un-subscribe': isFutureMatch && !isSubscribe,
                            'is-end': isEnd || isSubscribe
                        }"
                        v-throttle="[()=>subscribeMatch(),3000]">
                        <span class="font-12 font-400 font-regular ">{{ buttonString }}</span>
                    </div>
                    <div v-if="isGoingMatch" class="going-span flex align-center justify-center"
                        @click="toVirtual"
                    >
                      <DynamicDot v-if="isGoing" class="m-r-5"/>
                      <span  class=" text-center d-inline-block">进行中</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import CustomSpan from '@/components/CustomSpan'
import PopoverHost from '@/components/PopoverHost'
import { addSubscribeMatch } from '@/api/competition/competition'
import { matchStatus, basketStatus, isGoingCompetition } from '@/utils/utils'
import { Message } from 'element-ui'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
import DynamicDot from '../../components/DynamicDot.vue'
import { setLocal } from '@/utils/cookie'

export default {
    name: 'MatchCardRect',
    filters: {
        filterTime (value) {
            return dayjs(value).format('HH:mm')
        }
    },
    props: {
        match: {
            type: Object,
            default: () => ({})
        },
        isFinish: {
            type: Boolean,
            default: false
        },
        showFullDate: { // 我的预约展示完整日期
            type: Boolean,
            default: false
        }
    },
    components: {
        CustomSpan,
        PopoverHost,
        DynamicDot
    },
    data () {
        return {
            emptyTeamLogo: require('@/assets/images/common/team-flag.png')
        }
    },
    computed: {
        ...mapState('user', ['token']),
        competitionStatus () {
            return this.isFootball ? matchStatus : basketStatus
        },
        buttonString () {
            return this.isFutureMatch ? (this.isSubscribe ? '已预约' : '预约') : this.competitionStatus[this.match.state]
        },
        hasLivingBroad () {
            return this.match.anchor_list && this.match.anchor_list.length > 0
        },
        isGoing () {
            return isGoingCompetition(this.match.state, this.isFootball ? 'football' : 'basketball')
        },
        isGoingMatch () { // 未开，并且 state > 0
            return !this.isFutureMatch && this.match.state > 0
        },
        matchStatusString () {
            // 进行中赛事的比赛状态
            return this.competitionStatus[this.match.state]
        },
        isEnd () {
            return this.match.state * 1 === -1
        },
        isFutureMatch () { // 未来的赛事
            return this.match.state * 1 === 0
        },
        isSubscribe () {
            return this.match.appointment * 1 === 1
        },
        awayLogo () {
            return this.match.awayLogo
        },
        homeLogo () {
            return this.match.homeLogo
        },
        isFootball () {
            return this.match.leagueType === 1
        },
        matchIcon () {
            return this.match.leagueType === 1 ? require('../../../assets/images/home/card/football.png') : require('../../../assets/images/home/card/basketball.png')
        }
    },
    methods: {
        formatTime (time) {
            const style = this.showFullDate ? 'MM-DD HH:mm' : 'HH:mm'
            // const style = 'HH:mm'
            return dayjs(time).format(style)
        },
        async subscribeMatch () {
            if (!this.isFutureMatch) {
                return
            }
            if (!this.token) {
                this.openLoginDialogMixin()
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(this.match.matchId, this.match.leagueType)
                if (code === statusCode.success) {
                    Message({
                        type: 'success',
                        message: msg,
                        duration: 500
                    })
                    if (this.showFullDate) {
                        this.$emit('refresh')
                    } else {
                        this.$emit('updateAppointment',
                            {
                                id: this.match.matchId,
                                date: dayjs(this.match.matchTime).format('YYYY-MM-DD'),
                                value: this.match.appointment === 1 ? 2 : 1
                            })
                    }
                } else {
                    if (code === statusCode.isExpired) {
                        this.openLoginDialogMixin()
                    }
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出凑了')
            }
        },
        goToLiveRoom (host) {
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: host.room_id }
            })
            window.open(href, '_blank')
        },
        toVirtual () {
            setLocal('matchInfo', JSON.stringify({ ...this.match }))
            this.$nextTick(() => {
                const { href } = this.$router.resolve({
                    name: 'VirtualLive',
                    query: {
                        matchId: this.match.matchId,
                        leagueType: this.match.leagueType
                    }
                })
                window.open(href, '_blank')
            })
        }

    }
}
</script>

<style lang="scss" scoped>
.card {
    height: 80px;
    .content-box{
        padding: 0 25px;
        // padding: 20px 0;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
    }
    &:hover {
        box-shadow: 0 4px 24px 0 #ebedfa;
        position: relative;
        z-index: 4;
    }
}
.left-time {
    width: 15%;
    .type {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        background-image: url("../../../assets/images/common/footer.png");
    }
}
.left-info {
    width: 70%;
    .time-and-title {
        width: 100px;
    }
    .match-time {
        color: #272727;
    }
    .match-title {
        font-weight: 400;
        color: #272727;
    }
    .battle-info {
        .team {
            width: calc(50% - 100px);
            .score {
                width: 40px;
                font-size: 25px;
                color: #272727;
            }
            .icon-and-name{
                width: calc(100% - 50px);
            }
        }
        .icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-size: contain;
        }
        .team-name {
            width: calc(100% - 35px);
        }
    }
}
.middle-info{
    width: 130px;
    color: #666a80;
    .score {
        font-size: 24px;
        font-weight: 500;
        color: #F7464E;
        line-height: 33px;
    }
}
.right-host {
    width: 15%;
    line-height: 40px;
    .button {
        width: 65px;
    }
    .league-name {
        width: calc(100% - 65px);
    }
    .hosts{
        margin: 0 auto;
        .host-item{
            .icon {
                width: 30px;
                height: 40px;
                border-radius: 50%;
                background-size: cover;
            }
            span {
                color: #737373;
            }
        }
        .live-broadcast{
            width: 65px;
            line-height: 40px;
            background-color: #FB7674;
            border-radius: 3px;
            color: #fff;
            background-image: url('../../../assets/images/common/live.gif');
            background-size: 12px 16px;
            background-position: 7px center;
            background-repeat: no-repeat;
        }
    }
    .un-subscribe {
        background: linear-gradient(90deg, #22307C 0%, #121325 100%);
        color: #fff;
    }

    .is-subscribe, .un-subscribe {
        border-radius: 26px;
    }
    .match-status {
        background: linear-gradient(90deg, #22307C 0%, #121325 100%);
        border-radius: 5px;
        color: #fff;
        line-height: 30px;
        height: 30px;
    }
    .going-span {
      // 进行中
      width: 65px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #F85058;
      border-radius: 5px;
      color: #F7464E;
      font-size: 12px;
    }
    .is-end {
        border: 1px solid transparent;
        background: #F3F3F3;
        font-weight: 300;
        color: #999999;
    }
    .is-going-button {
        .live-broadcast {
            border-radius: 5px;
        }
    }
}
</style>
