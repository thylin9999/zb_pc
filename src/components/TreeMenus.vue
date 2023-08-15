<template>
<ul class="menu-tree">
    <li class="menu p-l-15 p-r-15 font-14 p-t-25 p-b-25 pointer transition-3"
        v-for="menu in showMenus"
        :key="menu.id"
        :class="{
            'is-active': menu.isActive,
            'is-live-room': isLiveRoom
        }"
    >
        <div
            class="content p-l-5 p-r-5 w-100 flex justify-between align-center"
        >
            <div class="flex align-center" @click="changeOpen(menu)">
                <icon-png class="icon d-inline-block" :width="20" :height="20" :icon="noHover ? `${iconPath}${menu.icon}_b` : `${iconPath}${menu.icon}`"></icon-png>
                <span class="font-16 m-l-5">{{ menu.label}}</span>
            </div>
            <span class="font-14 font-400" v-if="[1,2].includes(menu.id) && isCompetition">({{ menu.id === 1 ? footballCount : basketballCount }}场)</span>
        </div>
        <Leagues
            :key="menu.id"
            :type="menu.id"
            :show-high-light="menu.id === leagueType"
            :league-id.sync="currentLeagueId"
            :is-live-room="isLiveRoom"
            :has-third="isCompetition"
            @changeLeagueId="() => changeLeagueId(menu)"
        />
    </li>
</ul>
</template>

<script>
import Leagues from '@/components/Leagues'
import IconPng from '@/components/IconPng'
import { mapState } from 'vuex'
export default {
    name: 'TreeMenus',
    components: {
        Leagues,
        IconPng
    },
    props: {
        noHover: {
            type: Boolean,
            default: false
        },
        isCompetition: {
            type: Boolean,
            default: false
        },
        isLiveRoom: {
            type: Boolean,
            default: false
        },
        closeLeagueFilter: {
            type: Boolean,
            default: false
        },
        leagueId: {
            type: [Number, String],
            default: null
        },
        leagueType: { // 控制 下来框的
            type: Number,
            default: null
        }
    },
    data () {
        return {
            menus: [
                {
                    id: 1,
                    label: '足球',
                    icon: 'football',
                    isOpen: false,
                    isActive: false
                },
                {
                    id: 2,
                    label: '篮球',
                    icon: 'basketball',
                    isOpen: false,
                    isActive: false
                },
                {
                    id: 3,
                    label: '电竞',
                    icon: 'esport',
                    isOpen: false,
                    isActive: false
                },
                {
                    id: 4,
                    label: '其他',
                    icon: 'other',
                    isOpen: false,
                    isActive: false
                }
            ],
            currentLeagueId: null,
            openId: null
        }
    },
    computed: {
        ...mapState('competition', ['competitionStatics']),
        showMenus () {
            return this.isCompetition ? this.menus.filter(x => ![3, 4].includes(x.id)) : this.menus
        },
        footballCount () {
            return this.competitionStatics.football
        },
        basketballCount () {
            return this.competitionStatics.basketball
        },
        iconPath () {
            // return this.livePath ? 'live-room/menus/' : 'icon-status/'
            return 'live-room/menus/'
        }
    },
    created () {
        this.currentLeagueId = this.leagueId
    },
    watch: {
        leagueId: {
            handler () {
                this.currentLeagueId = this.leagueId
            },
            immediate: true
        },
        leagueType: {
            handler () {
                this.menus.forEach(x => {
                    x.isActive = x.id === this.leagueType
                })
            },
            immediate: true
        }
    },
    methods: {
        changeOpen (menu) {
            if (menu.isActive) {
                return
            }
            this.menus.forEach(item => {
                if (item.id === menu.id) {
                    item.isActive = !item.isActive
                } else {
                    item.isActive = false
                }
            })
            this.currentLeagueId = `全部-${menu.id}`
            this.changeLeagueId(menu)
        },
        changeLeagueId (menu) { // 打开和关闭
            // menu.id 正好对应赛事分类 足球，篮球，。。。
            // 更新联赛id
            this.$emit('update:leagueId', this.currentLeagueId)
            // 更新 分类
            this.$emit('update:leagueType', menu.id)
            this.$emit('changeLeagueId')
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-tree {
    // width: 235px;
    margin: 0 auto;
    .menu {
        color: #333;
        &.is-active {
            height: fit-content;
            // color: #7990FF;
        }
        &.is-live-room {
            color: #fff;
        }
    }
    .content {
        .icon {
            width: 20px;
            height: 20px;
        }
    }
}
</style>
