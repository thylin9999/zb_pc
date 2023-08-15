<template>
<div class="live-broad-cast flex h-100 overflow-hidden hide-scrollbar">
    <div class="left-menus w-100  bg-white">
        <div class="categories w-100 p-t-20 p-b-10">
            <div
                class="category pointer w-100 m-b-10 flex align-center"
                :class="{
                    'is-active': categoryId === category.id
                }"
                @click="changeCategory(category)"
                v-for="category in  categories" :key="category.id">
                <span class="font-14 d-inline-block item text-center  font-500">{{ category.label }}</span>
            </div>
        </div>
        <div class="tree-menus p-b-25">
            <TreeMenus
                :close-league-filter="closeLeagueFilter"
                :league-id.sync="leagueId"
                :league-type.sync="leagueType"
                no-hover
                @changeLeagueId="changeLeagueId"
            />
        </div>
        <div class="footer-btns p-l-15 text-center p-r-15 flex align-center justify-center flex-column w-100 font-14 font-400 text-white">
            <span class="d-inline-block hover-7 pointer w-100 download-app" @click="goToDownload">下载APP</span>
            <span class="d-inline-block hover-7 pointer m-t-10 w-100" @click="openLiveCast">我要开播</span>
        </div>
<!--        <div class="footer-buttons font-regular text-center m-t-25 m-b-30 font-16 font-500 text-white">-->
<!--            <span class="btn d-inline-block pointer" @click="goToDownload">下载App</span>-->
<!--            <div class="info flex align-center p-l-25 p-r-25 m-t-15">-->
<!--                <span class="live-broad flex-1 pointer" @click="queryCustom">直播咨询</span>-->
<!--                <span class="question flex-1 pointer" @click="queryCustom">问题咨询</span>-->
<!--            </div>-->
<!--        </div>-->
    </div>
    <div class="right-content overflow-y-auto h-100  p-r-30 m-l-15">
        <component
            :is="com"
            :category-id.sync="categoryId"
            :league-id.sync="leagueId"
            :league-type.sync="leagueType"
            @changeCategoryIdByRows="changeLeagueId"
        />
    </div>
</div>
</template>

<script>
import MyLiveHost from '@/views/Host/MyLiveHost'
import MyFavorite from '@/views/Host/Components/MyFavorite'
import TreeMenus from '@/components/TreeMenus'
import IconPng from '@/components/IconPng'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
export default {
    name: 'HostIndex',
    components: {
        MyLiveHost,
        MyFavorite,
        TreeMenus,
        IconPng
    },
    data () {
        return {
            categoryId: 1,
            leagueId: '', // 联赛id
            leagueType: 1, // 分类，默认是足球
            categories: [
                {
                    id: 1,
                    label: '全部直播',
                    icon: 'icon-status/live-cast',
                    com: 'MyLiveHost'
                },
                {
                    id: 2,
                    label: '我的关注',
                    icon: 'icon-status/favorite',
                    com: 'MyFavorite'
                }
            ]
        }
    },
    computed: {
        ...mapState('user', ['token']),
        closeLeagueFilter () {
            return this.categoryId === 2
        },
        com () {
            return this.categoryId === 2 ? 'MyFavorite' : 'MyLiveHost'
        },
        treeMenuKey () {
            return this.categoryId + '-' + this.leagueId
        }
    },
    created () {
        const { leagueId, categoryId, leagueType } = this.$route.params
        this.categoryId = categoryId || 1
        this.leagueType = leagueType
        this.leagueId = leagueId
        this.updateLeagueTypesInLive()
    },
    methods: {
        changeCategory (category) {
            if (category.id === this.categoryId) return
            if (category.id === 2 && !this.token) {
                this.openLoginDialogMixin()
            } else {
                this.categoryId = category.id
                // 切换时，赛程 足球，关注 null
                this.leagueType = null
                this.leagueId = null
            }
        },
        changeLeagueId () {
            this.categoryId = 3 // 切换到 其他子类去了，非 全部直播这类
            this.leagueId = this.leagueId ? this.leagueId : `全部-${this.leagueType}`
        },
        goToDownload () {
            this.$router.push({
                name: 'DownloadApp'
            })
        },
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
        }
    }
}
</script>

<style lang="scss" scoped>
.left-menus {
    width: 210px;
    .categories {
        border-top: 1px solid #F1F2F5;
        border-bottom: 1px solid #F1F2F5;
    }
    .category {
        .item {
            width: 178px;
            margin: 0 auto;
            line-height: 35px;
            background-color: #F1F2F5;
            color: #ccc;
            border-radius: 5px;
        }
        &.is-active, &:hover {
            span{
                color: #fff;
                background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);

            }
        }
    }
    .tree-menus{
        border-bottom: 1px solid #F1F2F5;
        height: calc(100% - 245px);
        overflow-y: auto;
    }
    .footer-btns {
        line-height: 34px;
        border-top: 1px solid #F3F3F3;
        height: 125px;
        span {
            border-radius: 5px;
            background: linear-gradient(90deg, #22307C 0%, #121325 100%);
        }
        .download-app {
            background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
        }
    }

}
.right-content {
    width: calc(100% - 225px);
}

.live-broad-cast {
    //min-height: calc(100vh - 255px);
}
::v-deep {
    .live-broad-cast {
        .left-list {
           padding: 30px 0 ;
        }
    }
}
</style>
