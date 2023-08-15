<template>
<div class="event-box p-t-30 p-b-30 h-100 overflow-y-auto">
    <div class="current-end row p-relative" v-if="events.length">
        <span
            class="icon p-absolute flex align-center justify-center"
        >
          <DynamicDot />
        </span>

        <span class="line d-inline-block p-absolute"></span>
    </div>
    <template v-for="(event, index) in showData">
        <div
            class="row p-relative"
            :key="event.id"
        >
            <span class="time text-center p-absolute font-12 font-regular ">{{ event.time }}'</span>
            <div class="card p-5 p-absolute flex align-center"
                 :class="{
                    'is-right flex-reverse': event.isHome == 1,
                }">
                <span
                    v-if="event.icon"
                    class="icon d-inline-block m-l-5 m-r-5 bg-center bg-no-repeat bg-size-100"
                    v-lazy:background-image="require(`../../../../assets/images/live-room/statics/${event.icon}.png`)"
                ></span>
                <div class="content font-14 font-regular font-400 ">
                    <div class="up font-medium text-333">{{ event.nameChs || '--'}}</div>
                    <div class="down font-regular text-999">{{ event.kind ? event.kind.name : '--' }}</div>
                </div>
            </div>
            <span v-if="index !== showData.length -1 " class="line d-inline-block p-absolute"></span>
        </div>
    </template>
</div>
</template>

<script>
import DynamicDot from '@/views/components/DynamicDot'
export default {
    name: 'CompetitionEvents',
    components: {
        DynamicDot
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        },
        events: {
            type: Array,
            default: () => ([])
        },
        statics: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        showData () {
            return this.events
        }
    }
}
</script>

<style lang="scss" scoped>
.event-box {
    width: 620px;
    margin: 0 auto;
}
.row {
    width: 620px;
    height: 55px;
    .time {
        width: 25px;
        line-height: 14px;
        color: #999;
        left: 290px;
        top: 0;
    }
    .card {
        width: 290px;
        background: #F5F6F8;
        border-radius: 3px;
        .icon {
            width: 15px;
            height: 15px;
        }
        top: -22px;
        left: 325px;
        &.is-right{
            left: -15px;
        }
        .content {
            line-height: 17px;
            color: #999;
        }
    }
    .line {
        width: 1px;
        height: 45px;
        top: 14px;
        left: 300px;
        background-color: #D8D8D8;
    }
}
.current-end{
    .icon {
        left: 290px;
        top: -10px;
        width: 20px;
        height: 20px;
        //background-image: url('../../../../assets/images/live-room/statics/end.png');
    }
}
</style>
