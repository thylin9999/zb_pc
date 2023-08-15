<template>
    <div class="live-room-wrapper-box p-relative flex  hide-scrollbar ">
        <div class="left-bar m-r-10 bg-white " >
            <left-menu />
        </div>
        <div class="right-room">
            <div class="content">
                <LiveRoom :match-id.sync="matchId" @changeMatchInfo="changeMatchInfo"/>
            </div>
        </div>
    </div>
</template>

<script>
import LiveRoom from './index'
import LeftMenu from './Components/LeftMenu.vue'
export default {
    name: 'WrapperBox',
    components: {
        LiveRoom,
        LeftMenu
    },
    data () {
        return {
            matchId: null, // 当前直播间的比赛id
            matchInfo: {}
        }
    },
    beforeRouteEnter (to, from, next) {
        const query = to.query
        const metaQuery = to.meta.query
        const paramsError = Object.keys(metaQuery).some(key => {
            return metaQuery[key] === 'required' && !query[key]
        })
        if (paramsError) {
            next('/')
        } else {
            next()
        }
    },
    methods: {
        changeMatchInfo (matchInfo) {
            this.matchInfo = matchInfo
        }
    }
}
</script>

<style lang="scss" scoped>
    .live-room-wrapper-box {
        width: 100%;
        min-height: 607px;
    }

    .left-bar {
        width: 210px;
        height: calc(100vh - 60px);
        z-index: 1;
        background-color: #003F67;
        overflow-y: auto;
        .menus {
            height: 180px;
            .item.is-hover {
                color: #3DB1FB;
            }
        }
        .item {
            color: #fff;
        }
        .types {
            height: 450px;
            .item.is-hover {
                color: #3DB1FB;
            }
        }
    }
    .right-room {
        width: calc(100% - 220px);
        overflow-y: auto;
        height: calc(100vh - 60px);
    }
    .down-section-box {
        width: 100%;
        padding-left: 100px;
        padding-right: 100px;
        min-width: 1325px;
        max-width: 1650px;
        margin: auto;
        background-color: #f3f5f9;
    }

    .down-section {
        width: 100%;

        .tabs {
            .tab-item {
                width: 50%;
                font-size: 18px;
                color: #818181;
                line-height: 55px;
                border-bottom: 1px solid #DEE4FF;
            }

            .row {
                border-right: 1px solid #DEE4FF;

            }

            .tab-item:last-child .row {
                border: none;
            }

            .inner-title {
                width: 215px;
            }

            .tab-item.is-active .inner-title {
                color: #5170FF;

                &::before {
                    content: '';
                    width: 100%;
                    height: 2px;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    background: linear-gradient(0deg, #3B5FFF, #A2B3FF);
                    z-index: 2;
                }

            }
        }
    }
</style>
