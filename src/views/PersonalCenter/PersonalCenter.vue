<template>
<div class="user-center wrap-1200  p-t-15 hide-scrollbar">
    <div class="content h-100 w-100 flex justify-between " :key="menuKey">
        <div class="left-section bg-white">
            <UserHeader />
            <div class="apply-host " v-if="!isHostAnchor">
                <span @click="applyAnchor" class="w-100 pointer text-center h-100 d-inline-block" >我要开播</span>
            </div>
            <ul class="flex flex-column justify-center align-center p-t-30">
                <template
                    v-for="menu in menus"
                >
                    <li
                        class="menu-item font-18 flex pointer align-center  justify-between w-100"
                        :class="{'is-active': menu.id === currentMenu.id }"
                        v-if="!menu.isAuthorization || (menu.isAuthorization && isHostAnchor)"
                        :key="menu.id"
                        @click="selectMenu(menu)"
                    >
<!--                        <svg-icon class="icon-20" :icon-class="menu.icon"></svg-icon>-->
                        <div class="m-l-25">
                          <icon-png
                              class="vertical-middle"
                              :width="15" :height="15"
                              :icon="menu.id === currentMenu.id ? `${menu.icon}_h` :menu.icon" />
                          <span class="m-l-10 font-14 font-regular">{{ menu.text }}</span>
                        </div>
                        <i class="el-icon-arrow-right m-r-15 font-12"></i>
                    </li>
                </template>

            </ul>
        </div>
        <div class="right-info h-100 overflow-y-auto bg-white ">
            <component :is="comName" />
        </div>
    </div>
</div>
</template>

<script>
import UserHeader from '@/views/PersonalCenter/Components/UserHeader'
import ConfirmButton from '@/components/ConfirmButton'
import BasicInfo from '@/views/PersonalCenter/Components/BasicInfo'
import editAvatar from '@/views/PersonalCenter/Components/editAvatar'
import UpdatePassword from '@/views/PersonalCenter/Components/UpdatePassword'
import Feedback from '@/views/PersonalCenter/Components/Feedback'
import OpenLiveBroadCast from '@/views/PersonalCenter/Components/OpenLiveBroadCast'
import BookLiveBroadCast from '@/views/PersonalCenter/Components/BookLiveBroadCast'
import MyBroadcast from '@/views/PersonalCenter/Components/MyBroadcast'
import ApplyAnchor from './Components/ApplyAnchor.vue'
import ApplyExpert from './Components/ApplyExpert.vue'
import MyBroad from '@/views/PersonalCenter/Components/MyBroad'
import MyFavorite from '@/views/PersonalCenter/Components/MyFavorite'
import MyWallet from './Components/MyWallet.vue'
import MyVip from '@/views/PersonalCenter/Components/MyVip.vue'
import DutyCenter from '@/views/PersonalCenter/Components/DutyCenter.vue'
import IconPng from '@/components/IconPng'
import { mapState, mapGetters } from 'vuex'
export default {
    name: 'PersonalCenter',
    props: ['tabId'],
    components: {
        UserHeader,
        BasicInfo,
        editAvatar,
        UpdatePassword,
        Feedback,
        OpenLiveBroadCast,
        BookLiveBroadCast,
        MyBroadcast,
        MyBroad,
        MyFavorite,
        ApplyAnchor,
        ApplyExpert,
        MyWallet,
        IconPng,
        ConfirmButton,
        MyVip,
        DutyCenter
    },
    data () {
        return {
            currentMenu: {},
            menuKey: +new Date().getTime()
        }
    },
    computed: {
        ...mapState('user', ['token', 'is_anchor', 'is_expert']),
        ...mapGetters('user', ['isHostAnchor']),
        comName () {
            return this.currentMenu.com
        },
        isAnchor () {
            return !!this.isHostAnchor
        },
        isExpert () {
            return this.is_expert === 1
        },
        trackMenuKey () {
            return {
                isAnchor: this.isAnchor,
                isExpert: this.isExpert
            }
        },
        menus () {
            let params = [
                {
                    id: 1,
                    name: 'userInfo',
                    text: '基础资料',
                    icon: 'personal/my',
                    com: 'BasicInfo'
                },
                {
                    id: 2,
                    name: 'myFavorite',
                    text: '我的关注',
                    icon: 'personal/favorite',
                    com: 'myFavorite'
                },
                {
                    id: 11,
                    name: 'myFavorite',
                    text: '我的钱包',
                    icon: 'personal/wallet',
                    com: 'myWallet'
                },
                {
                    id: 13,
                    name: 'dutyCenter',
                    text: '任务中心',
                    icon: 'personal/duty',
                    com: 'DutyCenter'
                }
                // {
                //     id: 14,
                //     name: 'myVip',
                //     text: '我的贵族',
                //     icon: 'personal/vip',
                //     com: 'MyVip'
                // }
            ]
            if (this.isAnchor) {
                params = [].concat(params, [{
                    id: 6,
                    name: 'notify',
                    text: '我的直播',
                    icon: 'personal/feed',
                    isAuthorization: true,
                    com: 'MyBroad'
                },
                {
                    id: 8,
                    name: 'myBroadcast',
                    text: '直播管理',
                    isAuthorization: true,
                    icon: 'personal/liveCast',
                    com: 'MyBroadcast'
                }])
            } else {
                params = [].concat(params, [
                    {
                        id: 10,
                        name: 'becomeExperts',
                        text: '我要开播',
                        icon: 'personal/expert',
                        isAuthorization: true,
                        com: 'ApplyAnchor'
                    }
                ])
            }
            if (this.isExpert) {
                params = [].concat(params, [
                    {
                        id: 12,
                        name: 'expertCenter',
                        text: '专家中心',
                        jump: true,
                        routerName: 'ExpertCenter',
                        icon: 'personal/expert'
                    }
                ])
            } else {
                params = [].concat(params, [
                    {
                        id: 9,
                        name: 'becomeExperts',
                        text: '成为专家',
                        icon: 'personal/expert',
                        com: 'ApplyExpert'
                    }
                ])
            }
            return params
        }
    },
    watch: {
        tabId () {
            this.changeMenu()
        },
        trackMenuKey: {
            handler () {
                this.menuKey = +new Date().getTime()
            },
            immediate: true
        }
    },
    created () {
        this.changeMenu()
    },
    methods: {
        changeMenu () {
            this.currentMenu = this.menus.find(x => x.id === this.tabId * 1)
        },
        selectMenu (menu) {
            this.currentMenu = { ...menu }
            this.$router.push({
                name: menu.jump ? menu.routerName : 'PersonalCenter',
                params: {
                    tabId: menu.jump ? 1 : menu.id
                }
            })
        },
        applyAnchor () {
            this.currentMenu = {
                id: 10,
                name: 'becomeAnchor',
                text: '我要开播',
                icon: 'personal/expert',
                com: 'ApplyAnchor'
            }
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 10
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.user-center{
    background-color: $background-gray2;
    height: calc(100vh - 70px);
    //min-height: 800px;
}
.content {
    padding-bottom: 50px;
    .apply-host {
        height: 40px;
        width: 177px;
        margin: 14px auto;
        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
        border-radius: 5px;
        color: #fff;
    }
}
.left-section {
    min-height: calc(100vh - 320px);
    width: 210px;
    .menu-item {
        line-height: 50px;
        border-left: 5px solid transparent;
        color: #999;
        &.is-active {
            border-left: 5px solid #E1A67A;
            background: linear-gradient(90deg, #FEF2E4 0%, #FFFFFF 100%);
            color: #E1A67A;
        }
        i {
          font-size: 14px;
          color: #999;
        }
    }
}
.right-info {
    width: calc(100% - 227px);
    min-height: calc(100vh - 320px);
}
::v-deep {
    .apply-host {
        span {
            line-height: 40px;
            border-radius: 3px;
        }
    }
}
</style>
