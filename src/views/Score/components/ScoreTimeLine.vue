<template>
<div class="time-line w-100 flex ">
    <ul class="date-list flex-no-wrap flex"
    >
        <template v-for="date in times">
            <li
                class="date-item flex-column pointer flex justify-center align-center"
                :class="{
                    'is-active': today && today.title === date.title
                }"
                :key="date.key"
                @click="changeDate(date)"
            >
                <span class="time font-20 font-regular font-400 text-333">{{ date.title }}</span>
                <span class="font-12 font-regular week">{{ date.weekName }}</span>
            </li>
        </template>
    </ul>
    <div class="date-picker bg-white p-relative">
        <div class="w-100 h-100 flex align-center pointer justify-center">
            <IconPng :width="21" :height="21" icon="common/calender-gray"></IconPng>
            <span class="font-16 m-l-5 m-r-5 font-regular font-400 text-999">日历</span>
            <i class="el-icon-caret-bottom font-14 text-999"></i>
        </div>
        <el-date-picker
            class="w-100 h-100 p-absolute opacity-0 date-picker-input"
            v-model="choseTime"
            @change="changeTime"
            type="date"
            :picker-options="pickerOptions"
            placeholder="选择日期">
        </el-date-picker>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import IconPng from '@/components/IconPng'
import { weekDay } from '@/utils/utils'
const isBetween = require('dayjs/plugin/isBetween')
const isoweek = require('dayjs/plugin/isoWeek')
export default {
    name: 'ScoreTimeLine',
    props: {
        isCourse: {
            type: Boolean,
            default: true
        },
        day: {
            type: String,
            default: null
        }
    },
    components: {
        IconPng
    },
    data () {
        return {
            choseTime: '',
            today: null,
            times: [],
            calendarTimes: [],
            showNumber: 7, // 展示7天的日期
            calendarNumber: 14 // 日历14天
        }
    },
    created () {
        dayjs.extend(isoweek)
        dayjs.extend(isBetween)
        this.handleTimes()
    },
    computed: {
        startDate () {
            return this.calendarTimes[0].time
        },
        endDate () {
            return this.calendarTimes[13].time
        },
        pickerOptions () {
            return {
                disabledDate: date => {
                    return (dayjs(date).isBefore(this.startDate) || dayjs(date).isAfter(this.endDate))
                }
            }
        }
    },
    methods: {
        handleTimes () {
            this.today = {
                key: dayjs().format('MM-DD'),
                time: dayjs().format('YYYY-MM-DD'),
                title: dayjs().format('MM-DD'),
                weekName: weekDay[dayjs().isoWeekday()].replace('星期', '周')
            }
            this.choseTime = this.today.time
            const times = []
            const calendarTimes = []
            times.push(this.today)
            calendarTimes.push({
                time: dayjs().format('YYYY-MM-DD')
            })
            for (let i = 1; i < this.calendarNumber; i++) {
                const gap = this.isCourse ? i : (-i)
                const date = dayjs().add(gap, 'day')
                if (i <= 6) {
                    times.push({
                        key: dayjs(date).format('MM-DD'),
                        time: dayjs(date).format('YYYY-MM-DD'),
                        title: dayjs(date).format('MM-DD'),
                        weekName: weekDay[dayjs(date).isoWeekday()].replace('星期', '周')
                    })
                }
                calendarTimes.push({
                    time: dayjs(date).format('YYYY-MM-DD')
                })
            }
            this.times = this.isCourse ? times : times.reverse()
            this.calendarTimes = this.isCourse ? calendarTimes : calendarTimes.reverse()
        },
        changeTime (time) {
            const formatTime = dayjs(time).format('YYYY-MM-DD')
            this.today = this.times.find(x => x.time === formatTime)
            this.choseTime = formatTime
            this.$emit('update:day', this.choseTime)
        },
        changeDate (date) {
            this.today = { ...date }
            this.choseTime = this.today.time
            this.$emit('update:day', this.choseTime)
        }
    }
}
</script>

<style lang="scss" scoped>
.date-list {
    background-color: #fff;
    .date-item {
        width: 150px;
        height: 60px;
        border-right: 1px solid #FFE7D5;
        line-height: 17px;
        .time {
            line-height: 28px;
        }
        &.is-active, &:hover {
            span {
                color: #FBA187!important;
            }
        }
        .week {
            color: #999;
        }
    }
}
.date-picker{
    width: 150px;
    .date-picker-input{
        cursor: pointer;
        width: 100%;
        left: 0;
        top: 0;
    }
}
</style>
