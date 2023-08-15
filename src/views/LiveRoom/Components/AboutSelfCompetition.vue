<template>
<div class="w-100 "
    :class="{
        'is-live-room': isLiveRoom
    }"
    :style="style"
>
    <div class="card w-100 loading-height m-t-15"
         v-loading="isLoading"
         element-loading-background="transparent"
    >
        <ul
            v-if="list.length"
            :class="[singleRow ? 'justify-center': '', `rows${count}`]"
            class="cards w-100 flex flex-wrap  align-center">
            <li
                v-for="item in list"
                :key="item.id"
                class="live-item"
            >
                <live-broad-card
                    :info="item"
                    :bg-gray="bgGray"
                />
            </li>
        </ul>
        <no-data v-if="list && !list.length && !isLoading" />
    </div>
</div>
</template>

<script>
import { getHotRooms } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import LiveBroadCard from '@/components/LiveBroadCard'
import NoData from '@/components/NoData.vue'
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
        },
        bgGray: {
            type: Boolean,
            default: true
        },
        anchorId: {
            type: [Number, String],
            default: null
        },
        isLiveRoom: {
            type: Boolean,
            default: false
        }
    },
    components: {
        LiveBroadCard,
        NoData
    },
    data () {
        return {
            list: [],
            isLoading: false,
            count: 3
        }
    },
    computed: {
        maskBg () {
            return {
                backgroundImage: `url(${process.env.VUE_APP_START_BUTTON})`
            }
        },
        singleRow () {
            return this.list.length < this.count
        },
        style () {
            return this.isLiveRoom ? {
                'max-width': this.count * 260 - 30 + 'px'
            } : {

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
    mounted () {
        const el = document.getElementById('liveroom-downsection')
        const count = Math.floor(el.offsetWidth / 260)
        this.count = count >= 4 ? 4 : count
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getHotRooms({
                    anchorId: this.anchorId
                })
                if (code === statusCode.success) {
                    this.list = data.list
                } else {
                    console.log(msg)
                }
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
.is-live-room {
    margin: 0 auto;
    .cards {
        &.rows4{
            .live-item:nth-child(4n) {
                margin-right:0!important;
            }
        }
        &.rows3{
            .live-item:nth-child(3n) {
                margin-right:0!important;
            }
        }
    }
}
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
    .live-item {
        width: 230px;
        //height: 225px;
        margin-right: 30px;
        margin-bottom: 25px;
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
