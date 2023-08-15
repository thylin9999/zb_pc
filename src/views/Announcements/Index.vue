<template>
    <div class="help-center wrap-1200  p-t-15">
        <div class="content h-100 w-100 flex justify-between ">
            <div class="left-section bg-white">
                <ul class="flex flex-column justify-center align-center p-t-30">
                    <template
                        v-for="menu in menus"
                    >
                        <li
                            class="menu-item font-18 flex pointer align-center  justify-center w-100"
                            :class="{'is-active': menu.id === currentMenu.id }"
                            v-if="!menu.isAuthorization || (menu.isAuthorization && isAnchor)"
                            :key="menu.id"
                            @click="selectMenu(menu)"
                        >
                            <icon-png :width="20" :height="16"
                                      :icon="menu.id === currentMenu.id ? `${menu.icon}_h` : menu.icon"></icon-png>
                            <span class="m-l-10 font-regular">{{ menu.text }}</span>
                        </li>
                    </template>

                </ul>
            </div>
            <div class="right-info bg-white p-t-25 ">
                <component v-if="comName !== 'AboutUs'" :is="comName"/>
                <template v-else>
                    <div data-v-c491a9b6="" class="right-info bg-white p-t-25">
                        <div data-v-a888eca2="" data-v-c491a9b6="" class="h-100 overflow-y-auto p-10">
                            <div data-v-a888eca2="" class="word"><p style="text-align:center;"><b><font
                                size="3">播球App</font></b></p>
                                <p style="text-align:left;"><br></p>
                                <p><font size="1">播球是一个全民参与的体育赛事平台，该网站平台涵盖了足球、篮球、羽毛球、乒乓球、台球、网球、赛车等热门体育项目以及世界杯、欧洲杯、英超、德甲、法甲、NBA等热门体育赛事。</font>
                                </p>
                                <p><font size="1">播球同时也是专业的赛事解说平台和人气社区，拥有海量弹幕，可以与球迷及主播零距离实时互动，在线为广大体育爱好者提供最新的体坛资讯，准确即时还原赛场战况和快速精准的战报集锦。</font>
                                </p>
                                <p><br></p>
                                <p style="text-align:center;">功能介绍</p>
                                <p><br></p>
                                <p><font size="1">【全新改版】体育大咖，比赛速递，伤停情报，实时更新，赛程预约提醒</font></p>
                                <p><font size="1">【实时直播】准确即时还原赛场战况，快速详细的战报集锦</font></p>
                                <p><font size="1">【高清画面】多路信号同步直播，有视频直播、动画直播等，告别延迟，全面进入实时4K高清直播时代</font></p>
                                <p><font size="1">【精彩回放】热门赛事录像回看，高清画面，传递实时高清画质与影音</font></p>
                                <p><font size="1">【解说阵容】明星解说、人气评球专家、足球宝贝，现场球迷个性解说，风格多样，才艺百变</font></p>
                                <p>

                                </p>
                                <p><font size="1">【球迷社区】体育圈子，畅聊社区，热门话题 ，球衣礼品</font></p></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex'
import Policy from '@/views/Announcements/Components/Policy'
import Protocols from '@/views/Announcements/Components/Protocols'
import AboutUs from '@/views/Announcements/Components/AboutUs'
import HostHelp from '@/views/Announcements/Components/HostHelp'
import IconPng from '@/components/IconPng'
import Announcement from '@/views/Announcements/Components/Announcement'

export default {
    name: 'AnnouncementIndex',
    props: ['tabId'],
    components: {
        Policy,
        Protocols,
        HostHelp,
        IconPng,
        AboutUs,
        Announcement
    },
    data () {
        return {
            menus: [
                {
                    id: 1,
                    name: 'announcements',
                    text: '播球公告',
                    icon: 'help-center/announcement',
                    com: 'Announcement'
                },
                {
                    id: 2,
                    name: 'hostHelp',
                    text: '主播帮助',
                    icon: 'help-center/help',
                    com: 'HostHelp'
                },
                {
                    id: 3,
                    type: 1,
                    name: 'userProtocol',
                    text: '用户协议',
                    icon: 'help-center/protocol',
                    com: 'Protocols'
                },
                {
                    id: 4,
                    type: 2,
                    name: 'policy',
                    text: '隐私政策',
                    icon: 'help-center/policy',
                    com: 'Policy'
                },
                {
                    id: 5,
                    type: 2,
                    name: 'about',
                    text: '关于我们',
                    icon: 'help-center/about',
                    com: 'AboutUs'
                }

            ],
            currentMenu: {}
        }
    },
    computed: {
        ...mapState('user', ['token', 'is_anchor']),
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
                name: 'HelpCenter',
                params: {
                    tabId: menu.id
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/theme/default-vars.scss';

    .help-center {
        background-color: $background-gray2;
        height: calc(100vh - 70px);
    }

    .content {
        padding-bottom: 50px;
    }

    .left-section {
        width: 232px;

        .menu-item {
            line-height: 50px;
            border-left: 5px solid transparent;
            color: #848484;

            &.is-active {
                border-left: 5px solid $background-color1;
                background-color: rgba(60, 96, 255, 0.1);
                color: $background-color1;
            }
        }
    }

    .right-info {
        width: calc(100% - 247px);
    }

</style>
