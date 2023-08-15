<template>
<div
    class="loading-height competition-box"
    v-loading="isLoading"
    element-loading-background="transparent"
>
    <template v-if="list.length">
        <div
            v-for="(item, index) in list"
            :key="item.matchId"
            class="row w-100 p-l-15 p-r-15 flex align-center"
            :class="{
                'is-stripped': index % 2 === 0
            }"
        >
            <div class="left flex justify-between align-center">
                <div class="time flex font-16 font-400 justify-center align-center">
                    <span class="text-center">{{ item.matchTime | getDate }}</span>
                    <span class=" text-center">{{ item.matchTime | getTime }}</span>
                </div>
                <span class="font-14 league text-6f font-400">{{ item.leagueChsShort }}</span>
                <span class="font-14 league text-6f font-400">{{ item.roundCn || '--'}}</span>
            </div>
            <div class="middle flex align-center p-l-25 font-14 text-333">
                <div class="team1 flex align-center">
                    <span class="team-name text-center">
                        <CustomSpan :content="item.homeChs"/>
                    </span>
                    <span
                        class="icon m-l-15 m-r-20 bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"
                        :style="{
                        backgroundImage: `url(${item.homeLogo})`
                    }"
                    ></span>
                    <span class="score font-22">{{ item.homeScore || 0 }}</span>
                </div>
                <span class="m-l-10 m-r-10 font-22">-</span>
                <div class="team1 flex flex-reverse align-center">
                    <span class="score font-22">{{ item.awayScore || 0 }}</span>
                    <span
                        class="icon m-l-15 m-r-20 bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"
                        :style="{
                        backgroundImage: `url(${item.awayLogo})`
                    }"
                    ></span>
                    <span class="team-name text-center">
                        <CustomSpan :content="item.awayChs"/>
                    </span>

                </div>
            </div>
            <div class="right text-center">
                <span
                    class="d-inline-block pointer font-14 text-center subscribe"
                    :class="{
                        'is-subscribed': item.isAppointment === 1
                    }"
                    @click="cancelSubscribe(item)"
                >{{ item | getSubscribeInfo }}</span>
            </div>
        </div>
    </template>
    <el-empty
        v-if="list && !list.length && !isLoading"
        :image-size="108"
        description="暂无数据" />
</div>
</template>

<script>
import { getAnchorMatches } from '@/api/Host/Host'
import { addSubscribeMatch } from '@/api/competition/competition'
import CustomSpan from '@/components/CustomSpan'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
export default {
    name: 'HostCompetition',
    filters: {
        getTime (value) {
            return dayjs(value).format('HH:mm')
        },
        getDate (value) {
            return dayjs(value).format('YYYY-MM-DD')
        },
        getSubscribeInfo (match) {
            return match.isAppointment === 1 ? '已订阅' : '订阅'
        }
    },
    components: {
        CustomSpan
    },
    data () {
        return {
            roomId: null,
            list: [],
            isLoading: false
        }
    },
    created () {
        this.roomId = this.$route.query.room_id
        this.fetchData()
    },
    computed: {
        ...mapState('user', ['token'])
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getAnchorMatches({
                    roomId: this.roomId
                })
                if (code === statusCode.success) {
                    if (data.list) {
                        this.list = data.list.reduce((all, item) => {
                            all.push({
                                ...item,
                                isAppointment: this.token ? item.appointment : 2
                            })
                            return all
                        }, [])
                    }
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了。。。')
            } finally {
                this.isLoading = false
            }
        },
        async cancelSubscribe (item) {
            if (!this.token) {
                this.openLoginDialogMixin()
                return
            }
            try {
                const { code, msg } = await addSubscribeMatch(item.matchId, item.leagueType)
                if (code === statusCode.success) {
                    Message.success(msg)
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.fetchData()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.competition-box {
    padding: 40px 0;
}
.row {
    height: 60px;
    line-height: 60px;
    &.is-stripped {
        background-color: #DEE4FF;
    }
    .left {
        .league {
            width: 120px;
        }
    }
    .middle {
        width: 50%;
    }
    .right {
        width: 25%;
        .subscribe {
            width: 80px;
            line-height: 30px;
            background-image: linear-gradient(0deg, #3B5FFF, #A2B3FF);
            border-radius: 3px;
            color: #fff;
            &.is-subscribed {
                background-image: none;
                background-color: transparent;
                border: 1px solid #939393;
                font-weight: 300;
                color: #939393;
            }
        }
    }
    .team1 {
        .icon {
            width: 30px;
            height: 30px;
            background-color: #C9CFED;
        }
        .team-name {
            width: 100px;
            display: inline-block;
        }
    }
}
.time {
    color: #2e2e2e;
    span {
        display: inline-block;
        width: 200px;
    }
}
</style>
