<template>
    <div v-if="matches.length" class="matches w-100 text-white flex align-center justify-between  font-regular">
        <div class="left-list w-100 p-relative">
            <template v-if="showButtons">
                <span  @click="prev"
                         :class="{
                        'is-unactive opacity-7 not-allowed': !leftMove
                    }"
                    class="prev  p-absolute flex align-center justify-center">
                  <i class="el-icon-caret-left "></i>
                </span>
                <span  @click="next"
                      :class="{
                        'is-unactive opacity-7 not-allowed': !rightMove
                    }"
                      class="next  p-absolute flex align-center justify-center">
                  <i class="el-icon-caret-right"></i>
                </span>

            </template>
            <div class="clear-scrollbar">
                <div ref="ulBox"
                     class="ul-box overflow-x-auto"
                     :class="{'has-show-button': showButtons}"
                >
                    <ul
                        ref="matchUl"
                        class="list p-b-10 overflow-x-auto  flex  flex-no-wrap"
                        :style="ulStyle"
                    >
                        <li
                            class=" match-item  "
                            v-for="match in matches"
                            :key="match.id"
                        >
                            <hot-match-card
                                :match="match"
                                @refresh="fetchData"/>

                        </li>
                        <li class="show-more pointer font-12 h-100" @click="goToMore">
                            <span class="calender d-inline-block bg-no-repeat bg-center bg-size-cover"></span>
                            <span class="more-span">更多赛程</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getHostMatches, addSubscribeMatch } from '@/api/competition/competition'
import dayjs from 'dayjs'
import HotMatchCard from '@/views/Competition/Components/HotMatchCard'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import { matchStatus, basketStatus } from '@/utils/utils'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'MatchList',
    filters: {
        filterTime (value) {
            const date = dayjs(value).isAfter(dayjs(), 'day') ? '明天' : '今天'
            const time = dayjs(value).format('HH:mm')
            return date + ' ' + time
            // return dayjs(value).format('MM-DD HH:mm')
        }
    },
    props: {
        showButtons: {
            type: Boolean,
            default: false
        }
    },
    components: {
        HotMatchCard
    },
    data () {
        return {
            pagination: {
                pageNumber: 1,
                pageSize: 20
            },
            matches: [],
            matchLogo: require('../../assets/images/common/team-icon.png'),
            leftMove: false,
            rightMove: false
        }
    },
    computed: {
        ...mapState('user', ['token']),
        apiParams () {
            return {
                pageNumber: this.pagination.pageNumber,
                pageSize: this.pagination.pageSize,
                day: dayjs().format('YYYY-MM-DD')
            }
        },
        ulWidth () {
            return this.matches.length * 210
        },
        ulStyle () {
            return {
                width: this.ulWidth + 'px'
            }
        }
    },
    created () {
        this.fetchData()
    },
    watch: {
        token: {
            handler () {
                this.fetchData()
            }
        }
    },
    mounted () {
        window.addEventListener('scroll', this.hidePopover)
        window.addEventListener('mousewheel', this.hidePopover)
    },
    methods: {
        hidePopover () {
            const assistBtn = document.getElementById('assistBtn')
            assistBtn.click()
        },
        initScroll () {
            this.$nextTick(() => {
                const wrapperInfo = this.$refs.ulBox.getBoundingClientRect()
                const wrapperWidth = wrapperInfo.width
                const innerUlInfo = this.$refs.matchUl.getBoundingClientRect()
                const innerUlWidth = innerUlInfo.width
                this.rightMove = this.$refs.ulBox.scrollLeft + wrapperWidth + 10 < innerUlWidth
                this.leftMove = this.$refs.ulBox.scrollLeft > 10
            })
        },
        async fetchData () {
            const { data } = await getHostMatches()
            if (data.list) {
                this.matches = data.list.reduce((all, match) => {
                    const competitionStatus = match.leagueType === 1 ? matchStatus : basketStatus
                    all.push({
                        ...match,
                        isSubscribe: match.appointment * 1 === 1,
                        isGoing: match.state !== 0,
                        isFuture: match.state === 0,
                        matchStatusString: competitionStatus[match.state]
                    })
                    return all
                }, [])
                this.initScroll()
            }
        },
        async book (match) {
            if (!match.isGoing) {
                if (this.token) {
                    // 已登录
                    const { code, msg } = await addSubscribeMatch(match.matchId, match.leagueType)
                    if (code === statusCode.success) {
                        Message.success(msg)
                        this.fetchData()
                    }
                } else {
                    Message.error('请先登录，无法预约！')
                    this.openLoginDialog()
                }
            }
        },
        viewLiveBroad (host) {
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: host.room_id }
            })
            window.open(href, '_blank')
        },
        prev () {
            if (this.leftMove) {
                const left = this.$refs.ulBox.scrollLeft
                this.$refs.ulBox.scrollTo({
                    left: left - 235,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        next () {
            if (this.rightMove) {
                const left = this.$refs.ulBox.scrollLeft
                this.$refs.ulBox.scrollTo({
                    left: left + 250,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        goToMore () {
            this.$router.push({
                name: 'Competition',
                params: {

                }
            })
        }
    },
    beforeRouteLeave () {
        window.removeEventListener('scroll', this.hidePopover)
        window.removeEventListener('mousewheel', this.hidePopover)
    }
}
</script>

<style lang="scss" scoped>
.left-list {
    .clear-scrollbar{
        margin-left: 60px;
        height: 145px;
        overflow-y: hidden;
        width: calc(100% - 110px);
    }
    .ul-box {
      overflow-y: hidden;
        height: calc(100% + 20px);
        width: 100%;
    }
    .list {
        min-width: 100%;
    }
    .match-item {
        width: 220px;
        height: 140px;
        margin-right: 15px;
        background-color: #fff;
        flex-shrink: 0;
        color: #141414;
      background-image: url('../../assets/images/home/card/card-bg.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .match-status {
            line-height: 22px;
            height: 22px;
            .hosts{
                background-image: url('../../assets/images/common/live.gif');
                background-position: left center;
                background-size: 12px 16px;
            }
            .match-buttons {
                width: 60px;
                .status-span {
                    background: linear-gradient(0deg, #3B5FFF, #A2B3FF);
                    color: #fff;
                    font-weight: 300;
                    border-radius: 3px;
                }
                .is-subscribe {
                    color: #939393;
                    border: 1px solid #939393;
                    background: #fff;
                }
                .is-going {
                    color: #4366FF;
                    background: #fff;
                    border: 1px solid #496AFF;
                }

            }
        }
        .book-icon {
            width: 14px;
            height: 13px;
            background-image: url('../../assets/images/common/book.png');
        }
        .header {
            border-bottom: 1px solid #DEE4FF;
            .match-title {
                width: calc(100% - 115px);
                line-height: 24px;
            }
        }
        .team-score {
            .team {
                margin-top: 5px;
                line-height: 33px;
                height: 33px;
            }
            margin: 0 auto;
            .score {
                font-size: 22px;
            }
        }
        .team-flag {
            width: 30px;
            height: 28px;
            background-image: url('../../assets/images/common/team-flag.png');
        }
    }
    .prev, .next {
        width: 44px;
        height: 140px;
        top: 0;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 12px 17px;
        background-color: #161C4F;
        border-radius: 10px;
        font-size: 20px;
    }
    .prev {
        left: 0;

    }
    .next {
        right: 0;
    }
    .show-more {
        right: 43px;
        top: 0;
        z-index: 5;
        height: 145px;
        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        .calender {
            width: 26px;
            height: 26px;
            background-image: url('../../assets/images/home/card/calender.png');
        }
        background-color: #fff;
        color: #999;
        .more-span {
            margin-top: 8px;
            letter-spacing: 3px;
        }
    }
}

.anchor-list {
    width: 350px;
    height: 300px;
    p {
        border-bottom: 1px solid #DEE4FF;
    }
    .ul-box {
        height: calc(100% - 40px);
    }
}
.right-button{
    width: 110px;
    background-image: url('../../assets/images/home/calender-bg.png');
    height: 217px;
    border-radius: 10px;
    margin-left: 40px;
    .calender {
        width: 45px;
        height: 45px;
        background-image: url('../../assets/images/common/calender.png');
    }
}
</style>
