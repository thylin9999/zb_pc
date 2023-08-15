<template>
<div class="w-100 box flex align-center bg-white overflow-hidden">
    <div class="date-list w-100 h-100 p-relative">
        <span class="prev flex align-center justify-center p-absolute text-center"
              @click="prev"
              :class="{
                  'is-active': rightMove
              }"
        >
          <i class="el-icon-caret-left font-18"></i>
        </span>
        <span class="next flex align-center justify-center p-absolute text-center"
              @click="next"
              :class="{
                  'is-active': rightMove
              }"
        >
          <i class="el-icon-caret-right font-18"></i>
        </span>

        <div class="date-box h-100 overflow-x-auto hide-scrollbar" ref="ulBox">
            <ul ref="matchUl" class="flex h-100 align-center flex-no-wrap " :style="ulStyle">
                <li
                    v-for="date in dates"
                    :key="date.id"
                    :class="{
                        'is-active': time === date.id && showHighLight,
                        'is-today': date.id === today
                    }"
                    @click="changeTime(date)"
                    class="flex h-100 font-400 flex-column pointer justify-center text-center date-item align-center font-regular font-400"
                >
                    <span class="m-t-5 week" >{{ date.weekName }}</span>
                    <div class="flex align-center justify-center">
                        <span class="font-14  font-regular date">{{ date.isToday ? '今天' : date.date}} </span>
                        <span v-if="date.isToday" class="p-l-5 p-r-5 text-white">-</span>
                        <span class="week" v-if="time === date.id && date.isToday && showHighLight">{{total}}场</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import { weekDay } from '@/utils/utils'
const isoweek = require('dayjs/plugin/isoWeek')
const isBetween = require('dayjs/plugin/isBetween')
export default {
    name: 'TimerFilter',
    props: {
        time: {
            type: String,
            default: ''
        },
        type: {
            type: Number,
            default: 1
        },
        showHighLight: {
            type: Boolean,
            default: false
        },
        total: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    title: '赛程',
                    icon: 'icons/calender'
                },
                {
                    id: 2,
                    title: '赛果',
                    icon: 'icons/result'
                }
            ],
            leftMove: false,
            rightMove: false,
            showTime: '',
            today: dayjs().format('YYYY-MM-DD')
        }
    },
    computed: {
        dates () {
            // 赛程往后14天，赛果，往前 7天
            const dates = []
            for (let i = 0; i <= 14; i++) {
                const date = dayjs().add(i, 'day')
                dates.push({
                    id: dayjs(date).format('YYYY-MM-DD'),
                    date: dayjs(date).format('MM-DD'),
                    week: dayjs(date).isoWeekday(),
                    isToday: i === 0,
                    weekName: weekDay[dayjs(date).isoWeekday()]
                })
            }
            for (let i = 1; i <= 7; i++) {
                const date = dayjs().subtract(i, 'day')
                dates.unshift({
                    id: dayjs(date).format('YYYY-MM-DD'),
                    date: dayjs(date).format('MM-DD'),
                    week: dayjs(date).isoWeekday(),
                    weekName: weekDay[dayjs(date).isoWeekday()]
                })
            }
            return dates
        },
        ulStyle () {
            return {
                width: this.dates.length * 120 + 'px'
            }
        },
        pickerOptions () {
            return {
                disabledDate: date => {
                    // return
                    return !dayjs(date).isBetween(dayjs(this.dates[0].id), dayjs(this.dates[this.dates.length - 1].id), 'day', '[[')
                }
            }
        },
        prevIcon () {
            return this.leftMove ? 'common/prev' : 'common/prev-dis'
        },
        nextIcon () {
            return this.rightMove ? 'common/next' : 'common/next-dis'
        }
    },
    watch: {
        time: {
            handler () {
                this.showTime = new Date(this.time)
            },
            immediate: true
        }
    },
    created () {
        dayjs.extend(isoweek)
        dayjs.extend(isBetween)
    },
    mounted () {
        this.$nextTick(() => {
            this.initScroll()
            this.showToday()
        })
    },
    methods: {
        showToday () {
            this.$refs.ulBox.scrollLeft = 470
        },
        initScroll () {
            this.$nextTick(() => {
                const wrapperInfo = this.$refs.ulBox.getBoundingClientRect()
                const wrapperWidth = wrapperInfo.width
                const innerUlInfo = this.$refs.matchUl.getBoundingClientRect()
                const innerUlWidth = innerUlInfo.width
                this.rightMove = this.$refs.ulBox.scrollLeft + wrapperWidth + 10 < innerUlWidth
                this.leftMove = this.$refs.ulBox.scrollLeft > 10
            })
        },
        changeTime (date) {
            if (!this.showHighLight) return
            this.$emit('update:time', date.id)
            this.$emit('loadData')
        },
        prev () {
            if (this.leftMove) {
                const left = this.$refs.ulBox.scrollLeft
                this.$refs.ulBox.scrollTo({
                    left: left - 250,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        next () {
            if (this.rightMove) {
                const left = this.$refs.ulBox.scrollLeft
                this.$refs.ulBox.scrollTo({
                    left: left + 250,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    height: 100px;
    border-radius: 10px;
}

.date-list {
    padding: 0 55px;
    .prev, .next {
      width: 20px;
      height: 70px;
      line-height: 70px;
      top: 15px;
      background-color: #F3F3F3;
        border-radius: 5px;
    }
    .prev {
      left: 15px;
    }
    .next {
        right: 15px;
    }
    .date-box {
        width: 100%;
        margin: 0 auto;
    }
   .date-box::-webkit-scrollbar {
     height: 5px;
   }

    .date-item {
        width: 120px;
        height: 60px;
        color: #142563;
        border-radius: 10px;
        line-height: 20px;
        .date{
          color: #333333;
        }
        .week {
          color: #999999;
          font-size: 14px;
        }
        &.is-active,&:hover {
          background: linear-gradient(90deg, #6F4E5E 0%, #161147 100%);
          .date{
            color: #fff;
          }
          .week {
            color: #DBDBDB;
          }
        }
    }
}
.calender{
    width: 90px;
    box-shadow: -2px 0 2px rgba(0,0,0,0.5);
    border-radius: 10px;
    .title {
        color: #10234B;
    }
    .time-picker {
        left: 0;
        top: 0;
        z-index: 2;
    }
}
</style>
