<template>
    <div class="left-menus w-100 h-100 bg-white is-live-room hide-scrollbar"
    >
        <div class="types p-b-10  w-100">
            <div
                class="type pointer p-l-20 w-100 font-14 flex align-center"

                @click="changeCategory(competitionType)"
                v-for="competitionType in  competitionTypes" :key="competitionType.id">
<!--                <HoverIcon-->
<!--                    :icon="competitionType.icon"-->
<!--                    :width="competitionType.width"-->
<!--                    :height="competitionType.height"-->
<!--                />-->
                <span class="icon flex-shrink-0 d-inline-block bg-center bg-no-repeat bg-size-100"
                  :class="`${competitionType.key}`"
                  :style="{
                    width: competitionType.width + 'px',
                    height: competitionType.height + 'px'
                  }"
                ></span>
                <span class="font-16  p-l-15  d-inline-block item   font-500">{{ competitionType.label }}</span>
            </div>
        </div>
        <div class="tree-menus p-b-15">
            <TreeMenus
                :key="updateKey"
                class="text-white"
                :close-league-filter="closeLeagueFilter"
                :league-id.sync="leagueId"
                :league-type.sync="leagueType"
                is-live-room
                live-path
                @changeLeagueId="changeLeagueId"
            />
        </div>
        <div class="footer-btns p-l-15 text-center p-r-15 flex align-center justify-center flex-column w-100 font-14 font-400 text-white">
            <span class="d-inline-block pointer hover-7 w-100 download-app" @click="goToDownload">下载APP</span>
            <span class="d-inline-block pointer hover-7 m-t-10 w-100" @click="openLiveCast">我要开播</span>
        </div>
    </div>
</template>

<script>
import TreeMenus from '@/components/TreeMenus'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
export default {
    name: 'LeftMenu',
    components: {
        TreeMenus
    },
    data () {
        return {
            competitionTypes: [
                {
                    id: 1,
                    label: '我的关注',
                    key: 'favorite',
                    icon: 'live-room/menus/favorite',
                    width: 21,
                    height: 18
                },
                {
                    id: 2,
                    label: '我的预约',
                    key: 'booked',
                    icon: 'live-room/menus/book',
                    width: 21,
                    height: 21
                },
                {
                    id: 3,
                    label: '全部直播',
                    key: 'all',
                    icon: 'live-room/menus/lives',
                    width: 21,
                    height: 21
                }

            ],
            updateKey: +new Date().getTime(),
            leagueId: null, // 联赛id，
            leagueType: null // 比赛类型， 足球、篮球
        }
    },
    computed: {
        ...mapState('user', ['token']),
        closeLeagueFilter () { // 我的预约
            return this.competitionTypeId === 2
        }
    },
    created () {
        this.updateLeagueTypesInLive()
    },
    methods: {
        changeCategory (type) {
            // if (type.id === this.competitionTypeId) return
            // if (type.id === 2 && !this.token) {
            //     this.openLoginDialogMixin()
            // } else {
            //     this.competitionTypeId = type.id
            //     // 切换到赛程时，足球展开，
            //     this.leagueType = null
            //     this.leagueId = null
            //     // this.loadData()
            // }
            this.goToPage(type)
        },
        changeLeagueId () {
            this.competitionTypeId = 3 // 统一代表第三类，非 全部和我的
            this.leagueId = this.leagueId ? this.leagueId : `全部-${this.leagueType}`
            // this.loadData()
            this.goToPage({
                id: this.leagueType

            })
        },
        goToDownload () {
            this.$router.push({
                name: 'DownloadApp'
            })
        },
        // beHost () {
        //     this.$router.push({
        //         name: 'PersonalCenter',
        //         params: {
        //             tabId: 10
        //         }
        //     })
        // },
        openLiveCast () {
            if (!this.token) {
                this.openLoginDialogMixin()
                return
            }
            if (!this.isHostAnchor) {
                Message.info('您目前还不是主播，请先申请主播，再开播！')
                this.queryHost()
                return
            }
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 6
                }
            })
        },
        goToPage (menu) {
            if (menu.key === 'favorite') {
                // 我的关注
                if (!this.token) {
                    this.openLoginDialogMixin()
                    return
                }
                this.$router.push({
                    name: 'LiveBroad',
                    params: {
                        categoryId: 2
                    }
                })
            } else if (menu.key === 'booked') {
                // 我的预约
                if (!this.token) {
                    this.openLoginDialogMixin()
                    return
                }
                this.$router.push({
                    name: 'Competition',
                    params: {
                        competitionTypeId: 2
                    }
                })
            } else {
                // 子类和 电竞以及 其他
                this.$router.push({
                    name: 'LiveBroad',
                    params: {
                        categoryId: menu.key === 'all' ? 1 : 3,
                        leagueId: this.leagueId,
                        leagueType: menu.key === 'all' ? null : menu.id
                    }
                })
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.left-menus {
    width: 210px;
    background: linear-gradient(180deg, #6F4E5E 0%, #161147 100%);
    border-radius: 0px 0px 10px 0px;
    .types {
        border-top: 1px solid #F1F2F5;
        border-bottom: 1px solid #F1F2F5;
    }
    .type {
        .item {
            line-height: 45px;
            color: #fff;
        }
        &.is-active, &:hover {
            background-color: rgba(0,0,0,0.2);
            .item {
              background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
              -webkit-background-clip: text;
              color: transparent;
            }
        }
        .icon {
          &.favorite {
            background-image: url('../../../assets/images/live-room/menus/favorite.png');
          }
          &.booked {
            background-image: url('../../../assets/images/live-room/menus/book.png');
          }
          &.all {
            background-image: url('../../../assets/images/live-room/menus/live.png');
          }

        }
      &:hover {
        .icon {
          &.favorite {
            background-image: url('../../../assets/images/live-room/menus/favorite_h.png');
          }
          &.booked {
            background-image: url('../../../assets/images/live-room/menus/book_h.png');
          }
          &.all {
            background-image: url('../../../assets/images/live-room/menus/live_h.png');
          }
        }
      }
    }
    .tree-menus {
        height: calc(100% - 250px);
        overflow-y: auto;
    }
    .footer-btns {
        line-height: 34px;
        border-top: 1px solid #F3F3F3;
        padding-top: 15px;
        span {
            border-radius: 5px;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('../../../assets/images/live-room/host-bg.png');
        }
        .download-app {
            background-image: url('../../../assets/images/live-room/download-bg.png');
        }
    }

    &.is-live-room {
        .types, .footer-btns {
            border-color: rgba(0,0,0,0.2);
        }
    }
}
</style>
