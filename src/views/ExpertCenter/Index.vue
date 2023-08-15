<template>
<div class="expert-center wrap-1200  p-t-15  hide-scrollbar">
    <div class="header w-100 flex align-center justify-between">
        <span class="font-20 text-333">专家中心</span>
        <span
            class="font-14 d-inline-block pointer highlight-text p-l-10 p-r-10 text-333 user-btn"
            @click="goPersonCenter"
        >个人中心</span>
    </div>
    <div class="content m-t-10 w-100 flex justify-between ">
        <div class="left-section bg-white">
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
        <div class="right-info h-100 overflow-y-auto ">
            <component :is="comName" />
        </div>
    </div>
</div>
</template>

<script>
import ExpertHome from '@/views/ExpertCenter/Page/ExpertHome'
import Reward from '@/views/ExpertCenter/Page/Reward'
import Bonus from '@/views/ExpertCenter/Page/Bonus'
import AllSolution from '@/views/ExpertCenter/Page/AllSolution'
import DeliverSolution from '@/views/ExpertCenter/Page/DeliverSolution'
import Sales from '@/views/ExpertCenter/Page/Sales'
import ConfirmButton from '@/components/ConfirmButton'
import IconPng from '@/components/IconPng'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'ExpertCenter',
    props: ['tabId'],
    components: {
        ExpertHome,
        IconPng,
        Reward,
        Bonus,
        AllSolution,
        DeliverSolution,
        Sales,
        ConfirmButton
    },
    data () {
        return {
            menus: [
                {
                    id: 1,
                    name: 'expertHome',
                    text: '专家首页',
                    icon: 'expert/home',
                    com: 'ExpertHome'
                },
                {
                    id: 2,
                    name: 'deliverSolution',
                    text: '发布方案',
                    icon: 'expert/solution',
                    com: 'DeliverSolution'
                },
                {
                    id: 3,
                    name: 'allSolution',
                    text: '所有方案',
                    icon: 'expert/all-solutions',
                    com: 'AllSolution'
                },
                {
                    id: 4,
                    name: 'sales',
                    text: '销售记录',
                    icon: 'expert/sales',
                    com: 'Sales'
                },
                {
                    id: 5,
                    name: 'reward',
                    text: '我的战绩',
                    icon: 'expert/reward',
                    com: 'Reward'
                },
                {
                    id: 6,
                    name: 'bonus',
                    text: '专家奖励金',
                    icon: 'expert/bonus',
                    com: 'Bonus'
                }
            ],
            currentMenu: {}
        }
    },
    computed: {
        ...mapState('user', ['token', 'is_anchor']),
        ...mapGetters('user', ['isHostAnchor']),
        comName () {
            return this.currentMenu.com
        },
        isAnchor () {
            return this.is_anchor === 2
        }
    },
    watch: {
        token () {
            if (!this.token) {
                this.$router.push('/')
            }
        },
        tabId () {
            this.changeMenu()
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
                name: 'ExpertCenter',
                params: {
                    tabId: menu.id
                }
            })
        },
        goPersonCenter () {
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 1
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.expert-center{
    background-color: $background-gray2;
    height: calc(100vh - 70px);
}
.header {
    height: 60px;
    background-color: #fff;
    border-radius: 10px;
    padding: 0 45px 0 65px;
    .user-btn{
        line-height: 20px;
        border-radius: 5px;
        border: 1px solid #000;
    }
}
.content {
    height: calc(100% - 80px);
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
