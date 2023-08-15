<template>
<div class="p-relative">
    <div class="time-line">
        <ul
            class="time-ul flex "
            :style="scrollStyle"
        >
            <li
                class="time-item font-12 p-t-5 p-b-5"
                v-for="time in times"
                :key="time.date"
            >
                <div class="flex-column flex align-center font-12">
                    <span>{{ time.date }}</span>
                    <span>{{ time.weekName }}</span>
                </div>
            </li>
        </ul>
        <div class="calender-button p-absolute h-100">
            <span>calender</span>
        </div>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import { weekDay } from '../../utils/utils'

const isoweek = require('dayjs/plugin/isoWeek')
export default {
    name: 'TimeLine',
    props: {
        showPrev: {
            type: Boolean,
            default: false
        },
        showDaysNumber: {
            type: Number,
            default: 14
        }
    },
    data () {
        return {
            times: [],
            scrollBox: {
                width: (this.showDaysNumber + 1) * 65 + 50
            }
        }
    },
    computed: {
        scrollStyle () {
            return {
                width: this.scrollBox.width + 'px'
            }
        }
    },
    created () {
        dayjs.extend(isoweek)
        this.initTimes()
    },
    methods: {
        initTimes () {
            const today = dayjs().format('MM-DD')
            const list = []
            list.push({
                date: dayjs().format('MM-DD'),
                week: dayjs().isoWeekday(),
                weekName: weekDay[dayjs().isoWeekday()]
            })
            for (let i = 1; i <= this.showDaysNumber; i++) {
                const num = this.showPrev ? -i : i
                const time = dayjs().add(num, 'day')
                const date = dayjs(time).format('MM-DD')
                const week = dayjs(time).isoWeekday()
                list.push({
                    date,
                    week,
                    weekName: weekDay[week]
                })
            }
            // dayjs().date(1).add(1, 'month').subtract(1, 'day')
            console.log(today, 'asdf', list)
            this.times = list
        }
    }
}
</script>

<style lang="scss" scoped>
.time-line {
    margin: 0 auto;
    width: 375px;
    height: 50px;
    background-color: #eee;
    overflow-x: overlay;
    .time-ul {
        width: fit-content;
    }
    .time-item {
        width: 65px;
    }
    .calender-button {
        right: 0;
        top: 0;
        width: 50px;
        background-color: #f0f;
    }
}
</style>
