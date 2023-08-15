<template>
<div class="box p-b-30">
    <div class="row header flex align-center justify-center">
        <div class="left cards flex align-center flex-end">
            <div class="card corner m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center "></span>
                <span>{{ cornerKick.home_team }}</span>
            </div>
            <div class="card  red m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center"></span>
                <span>{{ yellowCard.home_team}}</span>
            </div>
            <div class="card yellow m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center"></span>
                <span>{{ redCard.home_team }}</span>
            </div>
            <span class="m-l-15">{{ matchInfo.homeChs }}</span>
        </div>
        <div class="middle m-l-30 m-r-30">
            <div class="header w-100 flex justify-center align-center">
                <span>{{ matchInfo.homeScore }}</span>
                <span class="m-l-10 m-r-10">-</span>
                <span class="">{{ matchInfo.awayScore }}</span>
            </div>
        </div>
        <div class="right flex align-center">
            <span class="m-r-15">{{ matchInfo.awayChs }}</span>
            <div class="card corner m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center "></span>
                <span>{{ cornerKick.away_team }}</span>
            </div>
            <div class="card  red m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center"></span>
                <span>{{ redCard.away_team }}</span>
            </div>
            <div class="card yellow m-l-5 m-r-5">
                <span class="icon m-r-10 bg-size-100 bg-no-repeat bg-center"></span>
                <span>{{ yellowCard.away_team }}</span>
            </div>
        </div>
    </div>
    <template v-for="item in statics">
        <div v-if="!item.hide" class="row flex align-center justify-center" :key="item.event">
            <div class="left  cards flex align-center flex-end">
                <el-progress class="is-reverse" color="#FF5B5D" :percentage="item.homeVal" :show-text="false"></el-progress>
            </div>
            <div class="middle text-center m-l-15 m-r-15 text-333 flex align-center">
                <span class="team-value d-inline-block font-12 font-medium font-500">{{ item.home_team }}</span>
                <span class="font-12 event-name font-regular font-400">{{ item.event }}</span>
                <span class="team-value d-inline-block font-12 font-medium font-500">{{ item.away_team }}</span>
            </div>
            <div class="right cards flex align-center">
                <el-progress :percentage="item.awayVal" :show-text="false"></el-progress>
            </div>
        </div>
    </template>

</div>
</template>

<script>
import { keyOfKind } from '@/utils/enums'

export default {
    name: 'Statics',
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        },
        statics: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        redCard () {
            return this.statics[keyOfKind.red] || { home_team: 0, away_team: 0 }
        },
        yellowCard () {
            return this.statics[keyOfKind.yellow] || { home_team: 0, away_team: 0 }
        },
        cornerKick () {
            return this.statics[keyOfKind.cornerKick] || { home_team: 0, away_team: 0 }
        }
    },
    methods: {
        handleValue (value) {
            let flag
            if (value && value.includes('%')) {
                flag = value.slice(0)
            } else {
                flag = value * 1
            }
            console.log(flag, 'flag')
            return flag
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    .icon {
        width: 10px;
        height: 15px;
        border-radius: 1px;
        display: inline-block;
    }
    &.corner .icon {
        background-image: url("../../../../assets/images/live-room/statics/corner-kick.png");
    }
    &.red .icon {
        background-image: url("../../../../assets/images/live-room/statics/red-card.png");
    }
    &.yellow .icon {
        background-image: url("../../../../assets/images/live-room/statics/yellow-card.png");
    }
}
.row {
    .left, .right {
        width: calc(50% - 65px);
    }
    .middle {
        font-size: 22px;
        line-height: 33px;
        .team-value{
            width: 40px;
        }
        .event-name{
            width: 110px;
        }
    }
}
</style>
