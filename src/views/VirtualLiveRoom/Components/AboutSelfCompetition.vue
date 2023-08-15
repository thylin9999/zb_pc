<template>
<div class="w-100 ">
<!--    <div class="header flex justify-center align-center">-->
<!--        <div class="battle flex align-center ">-->
<!--            <div class="team flex align-center">-->
<!--                <span class="font-18 font-500 text-333 font-regular m-r-10">{{ matchInfo.homeChs}}</span>-->
<!--                <span class="score font-500 m-r-30 text-333 font-regular">{{ matchInfo.homeScore}}</span>-->
<!--                <span-->
<!--                    class="team-flag m-l-30 bg-center bg-repeat bg-size-cover"-->
<!--                    :style="{-->
<!--                        backgroundImage: `url(${matchInfo.homeLogo})`-->
<!--                    }"-->
<!--                ></span>-->
<!--            </div>-->
<!--            <span class="font-500 text-333 font-regular m-r-30 m-l-30">-</span>-->
<!--            <div class="team flex align-center">-->
<!--                <span class="team-flag m-r-30 bg-center bg-repeat bg-size-cover"-->
<!--                      :style="{-->
<!--                        backgroundImage: `url(${matchInfo.awayLogo})`-->
<!--                    }"-->
<!--                ></span>-->
<!--                <span class="font-500 text-333 font-regular m-l-30">{{ matchInfo.awayScore}}</span>-->
<!--                <span class="font-18 font-500 text-333 font-regular m-l-10">{{ matchInfo.awayChs}}</span>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="anchors m-l-30 p-l-25">-->
<!--            <span class="flag font-16 text-333 font-300 font-regular">{{ list.length }}位主播正在开播</span>-->
<!--        </div>-->
<!--    </div>-->
    <div class="card w-100 loading-height m-t-15"
         v-loading="isLoading"
         element-loading-background="transparent"
    >
        <ul
            v-if="list.length"

            class="cards w-100 flex flex-wrap align-center">
            <li
                v-for="item in list"
                :key="item.id"
                class="live-item"
            >
                <live-broad-card
                    :info="item"
                    bg-gray
                />
            </li>
        </ul>
        <el-empty
            v-if="list && !list.length && !isLoading"
            :image-size="108"
            description="暂无数据" />
    </div>
</div>
</template>

<script>
import { getHotRooms } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import LiveBroadCard from '@/components/LiveBroadCard'
export default {
    name: 'AboutSelfCompetition',
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        LiveBroadCard
    },
    data () {
        return {
            list: [],
            isLoading: false
        }
    },
    computed: {
        maskBg () {
            return {
                backgroundImage: `url(${process.env.VUE_APP_START_BUTTON})`
            }
        }
    },
    watch: {
        matchId: {
            handler () {
                this.fetchData()
                if (this.matchId) {
                    // this.fetchData()
                }
            },
            immediate: true
        }
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getHotRooms({})
                if (code === statusCode.success) {
                    this.list = data.list
                }
                console.log(data, code, msg)
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        goLiveRoom (item) {
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: item.room_id }
            })
            window.open(href, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    padding: 20px;
    .battle {
        .team-flag {
            display: inline-block;
            width: 50px;
            height: 50px;
            background-color: #C9CFED;
            border-radius: 50%;
        }
    }
    .anchors {
        background-image: url('../../../assets/images/common/live.gif');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left center;
    }
}
.cards {
    padding-left: 80px;
    .card {
        //border-radius: 10px 10px 0 0 ;
    }
    .live-item {
        width: 285px;
        height: 225px;
        margin-right: 30px;
        margin-bottom: 35px;
        border-radius: 10px;
        .cover {
            background-color: #F5F6F9;
            height: 180px;
            border-radius: 5px 5px 0 0 ;
            .mask {
                background-color: rgba(0,0,0,.7);
                display: none;
                background-size: auto;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 3;
            }
            &:hover {
                transform: scale(1.2);
                .mask {
                    display: block;
                }
            }
        }
        .host {
            border-left: 1px solid #BFBFBF;
            border-right: 1px solid #BFBFBF;
            border-bottom: 1px solid #BFBFBF;
            height: 43px;
            line-height: 43px;
            border-radius: 0 0 10px 10px;
            .avatar{
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #F5F6F9;
                border-radius: 50%;
            }
        }
    }
}
</style>
