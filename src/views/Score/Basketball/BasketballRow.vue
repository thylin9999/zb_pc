<template>
<div class="row m-b-15 flex align-center font-regular justify-between w-100">
    <div class="selection status">
      <span class="title  w-100 d-inline-block text-center font-12 text-999"></span>
      <div class="value flex align-center justify-center">
        <slot name="selection" />
      </div>
    </div>
    <div class="status flex-shrank-0 time-column right-border">
        <span class="title w-100 p-r-10 d-inline-block text-center font-12 text-999">{{ info.stateString}}</span>
        <div class="value text-center p-r-10 flex align-center justify-center font-16 text-333">{{ info.matchTime | formatTime }}</div>
    </div>
    <div class="team-column ">
        <span class="title p-l-10 w-100 d-inline-block text-left font-14 text-333">{{ info | filterLanguage(language, true, 'league') }}</span>
        <div class="value right-border p-l-10 flex flex-column justify-center">
            <div class="team flex align-center">
                <span class="icon m-r-5 bg-center bg-no-repeat bg-size-100 d-inline-block"
                  :style="{
                    backgroundImage: `url(${info.homeLogo})`
                  }"
                ></span>
                <CustomSpan class="font-12 flex-1 text-999" :content="filterLanguage('name', true)"/>
            </div>
            <div class="team m-t-5 flex align-center">
                <span
                    class="icon m-r-5 bg-center bg-no-repeat bg-size-100 d-inline-block border-50"
                    :style="{
                    backgroundImage: `url(${info.awayLogo})`
                  }"
                ></span>
                <CustomSpan class="font-12 flex-1 text-999" :content="filterLanguage('name', false)"/>
            </div>
        </div>
    </div>
    <div class="wrapper flex-shrank-0 score-column flex align-center justify-between"
        :class="{
            'is-not-ot': !isOt
        }"
    >
        <div class="status flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center font-12 text-999">第一节</span>
            <div class="value flex flex-column align-center justify-center">
                <span>{{ info.home1 | filterScore }}</span>
                <span class="m-t-15">{{ info.away1 | filterScore}}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999 justify-between">
            <span class="title w-100 d-inline-block text-center">第二节</span>
            <div class="value flex flex-column align-center justify-center">
                <span>{{ info.home2 | filterScore}}</span>
                <span class="m-t-15">{{ info.away2 | filterScore }}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999 justify-between">
            <span class="title w-100 d-inline-block text-center">第三节</span>
            <div class="value flex flex-column align-center justify-center">
                <span>{{ info.home3 | filterScore}}</span>
                <span class="m-t-15">{{ info.away3 | filterScore}}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999 justify-between">
            <span class="title w-100 d-inline-block text-center">第四节</span>
            <div class="value  flex flex-column align-center justify-center"
                 :class="{
                        'right-border': !(info.homeOT1 || info.awayOT1) && !isOt
                    }"
            >
                <span>{{ info.home4 | filterScore}}</span>
                <span class="m-t-15">{{ info.away4 | filterScore}}</span>
            </div>
        </div>
        <template v-if="isOt">
            <div v-if="info.homeOT1 || info.awayOT1" class="status flex-1 font-12 text-999 justify-between">
                <span class="title w-100 d-inline-block text-center">OT1</span>
                <div class="value flex flex-column align-center justify-center"
                    :class="{
                        'right-border': !(info.homeOT2 || info.awayOT2)
                    }"
                >
                <span>{{ info.homeOT1 }}</span>
                <span class="m-t-15">{{ info.awayOT1 }}</span>
                </div>
            </div>
            <div v-if="info.homeOT2 || info.awayOT2" class="status flex-1 font-12 text-999 justify-between">
                <span class="title w-100 d-inline-block text-center">OT2</span>
                <div class="value flex flex-column align-center justify-center"
                     :class="{
                        'right-border': !(info.homeOT3 || info.awayOT3)
                    }"
                >
                <span>{{ info.homeOT2 }}</span>
                <span class="m-t-15">{{ info.awayOT2 }}</span>
                </div>
            </div>
            <div v-if="info.homeOT3 || info.awayOT3" class="status  flex-1 font-12 text-999 justify-between">
                <span class="title w-100 d-inline-block text-center">OT3</span>
                <div class="value right-border flex flex-column align-center justify-center">
                <span>{{ info.homeOT3 }}</span>
                <span class="m-t-15">{{ info.awayOT3 }}</span>
                </div>
            </div>
        </template>
    </div>
    <div class="wrapper flex-shrank-0 score-column flex align-center justify-between">
        <div class="status h-100 flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center">全场</span>
            <PopoverDialog v-if="info.showPopover" :info="info"/>
            <div v-else class="value font-16 all-score text-333 flex flex-column align-center justify-center">
              <span>{{ info.homeScore | filterScore}}</span>
              <span class="m-t-15">{{ info.awayScore | filterScore}}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center">上下</span>
            <div class="value flex flex-column align-center justify-center">
                <span>{{ homeHalfScore | filterScore(type) }}</span>
                <span class="m-t-15">{{ awayHalfScore | filterScore(type)}}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center">分差</span>
            <div class="value flex flex-column align-center justify-center">
                <span>全：{{ scorePoor.all | filterScore(type)}}</span>
                <span class="m-t-15">半：{{ scorePoor.half | filterScore(type)}}</span>
            </div>
        </div>
        <div class="status flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center">总分</span>
            <div class="value right-border flex flex-column align-center justify-center">
                <span>全：{{ scoreTotal.all | filterScore(type) }}</span>
                <span class="m-t-15">半：{{ scoreTotal.half | filterScore(type)}}</span>
            </div>
        </div>
    </div>
    <div class="operations flex-shrank-0 wrapper flex justify-between">
        <div class="room-buttons flex-1 font-12 text-999">
            <span class="title w-100 d-inline-block text-center">直播</span>
            <div class="value w-100 justify-around flex-column flex align-center ">
                <VirtualIcon  @click.native="goToVirtual" />
              <div class="host" >
                <template v-if="!!(info.anchor_list && info.anchor_list.length)">
                    <PopoverHost
                        :match="info"
                        show-button
                    />
                </template>
              </div>
              <!-- <div v-if="!!(info.anchor_list && info.anchor_list.length > 1)">
                <span class="d-inline-block pointer anchor-icon bg-center bg-no-repeat bg-size-100"
                      :style="{
                        backgroundImage: `url(${info.anchor_list[0].img})`
                    }"
                      @click="goToLive(info.anchor_list[0])"
                ></span>
              </div> -->

            </div>
        </div>
        <div class="top-button  font-12 text-999">
            <span class="title w-100 d-inline-block text-center">操作</span>
            <div class="value flex flex-column align-center justify-around">
                <span class="hold-span d-inline-block"></span>
                <div class="top-btn flex align-center justify-center">
                    <IconPng
                        v-if="!info.isTop"
                        :width="16" :height="16"
                        class="pointer"
                        @click.native="setFirst"
                        icon="score/top"/>
                    <IconPng
                        v-else
                        :width="16" :height="16"
                        class="pointer rotate-reverse" icon="score/cancle-top"
                        @click.native="cancelFirst()"
                    />
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
import PopoverHost from '@/components/PopoverHost'
import IconPng from '@/components/IconPng'
import PopoverDialog from '@/views/Score/Basketball/PopoverDialog'
import dayjs from 'dayjs'
import { getItem, setItem, setLocal } from '@/utils/cookie'
import { addCollect, cancelCollect } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import VirtualIcon from '@/components/VirtualIcon.vue'
export default {
    name: 'BasketballRow',
    filters: {
        formatTime (time) {
            return dayjs(time).format('HH:mm')
        },
        filterScore (value, type) {
            if (['isFuture', 'warning'].includes(type)) {
                return '-'
            } else {
                return value || '-'
            }
        },
        filterLanguage (row, language, isHome, type) {
            if (type === 'name') {
                const prefix = isHome ? 'home' : 'away'
                return language === 'zh'
                    ? row[`${prefix}Chs`]
                    : (language === 'tw' ? row[`${prefix}Cht`] : row[`${prefix}En`])
            } else if (type === 'league') {
                return language === 'zh'
                    ? row.leagueChsShort
                    : (language === 'tw' ? row.leagueChtShort : row.leagueEn)
            }
        }
    },
    components: {
        VirtualIcon,
        CustomSpan,
        PopoverDialog,
        IconPng,
        PopoverHost
    },
    props: {
        info: {
            type: Object,
            default: () => ({})
        },
        type: {
            type: String,
            default: ''
        },
        isCollect: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: 'zh'
        }
    },
    computed: {
        isOt () { // 是否超时
            return this.otStatus.includes(this.info.state)
        },
        list () {
            return [{ ...this.info }]
        },
        otStatus () {
            return [5, 6, 7, -1] // 已结束的比赛也需要展示
        },
        homeHalfScore () {
            const home1 = this.info.home1 || 0
            const home2 = this.info.home2 || 0
            const home3 = this.info.home3 || 0
            const home4 = this.info.home4 || 0
            const preHalf = home1 * 1 + home2 * 1
            const nextHalf = home3 * 1 + home4 * 1
            return `${preHalf}/${nextHalf}`
        },
        awayHalfScore () {
            const away1 = this.info.away1 || 0
            const away2 = this.info.away2 || 0
            const away3 = this.info.away3 || 0
            const away4 = this.info.away4 || 0
            const preHalf = away1 * 1 + away2 * 1
            const nextHalf = away3 * 1 + away4 * 1
            return `${preHalf}/${nextHalf}`
        },
        scorePoor () {
            const homeHalf = this.info.home1 * 1 + this.info.home2 * 1
            const awayHalf = this.info.away1 * 1 + this.info.away2 * 1
            return {
                all: this.info.homeScore - this.info.awayScore,
                half: homeHalf - awayHalf
            }
        },
        scoreTotal () {
            const homeHalf = this.info.home1 * 1 + this.info.home2 * 1
            const awayHalf = this.info.away1 * 1 + this.info.away2 * 1
            return {
                all: this.info.homeScore * 1 + this.info.awayScore * 1,
                half: homeHalf * 1 + awayHalf * 1
            }
        },
        homeOtScore () {
            return this.otStatus.includes(this.info.state)
                ? this.getOtScore('home')
                : '-'
        },
        awayOtScore () {
            return this.otStatus.includes(this.info.state)
                ? this.getOtScore('away')
                : '-'
        }
    },
    methods: {
        filterLanguage (type, isHome) {
            let ret = ''
            if (type === 'name') {
                const prefix = isHome ? 'home' : 'away'
                ret = this.language === 'zh'
                    ? this.info[`${prefix}Chs`]
                    : (this.language === 'tw' ? this.info[`${prefix}Cht`] : this.info[`${prefix}En`])
                ret = ret || this.info[`${prefix}Chs`]
            }
            return ret
        },
        goToVirtual () {
            setLocal('matchInfo', JSON.stringify({ ...this.info }))
            const { href } = this.$router.resolve({
                name: 'VirtualLive',
                query: {
                    matchId: this.info.matchId,
                    leagueType: this.info.leagueType
                }
            })
            window.open(href, '_blank')
        },
        goToLive (anchor) {
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: anchor.room_id }
            })
            window.open(href, '_blank')
        },
        async collect () {
            const { code, msg } = await addCollect({ matchId: this.info.matchId, type: 2 })
            if (code === statusCode.success) {
                this.$emit('refresh')
            }
            Message.success(msg)
        },
        async cancelCollect () {
            const { code, msg } = await cancelCollect(this.info.matchId)
            if (code === statusCode.success) {
                this.$emit('refresh')
            }
            Message.success(msg)
        },
        setFirst () {
            const key = 'basketballCaches'
            const values = getItem(key) ? JSON.parse(getItem(key)) : []
            values.unshift(this.info.matchId)
            setItem(key, JSON.stringify(values))
            this.$emit('refresh')
        },
        cancelFirst () {
            const key = 'basketballCaches'
            const values = getItem(key) ? JSON.parse(getItem(key)) : []
            const newVals = values.filter(x => x !== this.info.matchId)
            setItem(key, JSON.stringify(newVals))
            this.$emit('refresh')
        },
        getOtScore (prefix) {
            let score = 0
            switch (this.info.state) {
            case 5:
                score += this.info[`${prefix}OT1`] * 1
                break
            case 6:
                score += this.info[`${prefix}OT1`] * 1 + this.info[`${prefix}OT2`] * 1
                break
            case 7:
                score += this.info[`${prefix}OT1`] * 1 + this.info[`${prefix}OT2`] * 1 + this.info[`${prefix}OT3`] * 1
                break
            }
            return score === 0 ? '-' : score
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    border-radius: 10px;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.19);
}
.status{
    width: 80px;
    &.time-column {
        width:60px;
    }
}
.team-column{
    width: 300px;
    .icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #d8d8d8;
    }
}
.anchor-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #d8d8d8;
}
.score-column, .is-not-ot{
    width: 370px;
}
.operations{
    width: 200px;
  .room-buttons {
    width: 150px;
  }
  .top-button{
    width: 50px;
  }
}
.title {
    height: 30px;
    line-height: 30px;
    background-color: #FEF2E4;
}
.value {
    height: 70px;
    .host {
        width: 65px;
    }
    .hold-span {
        height: 20px;
        width: 100%;
    }
    .top-btn{
        height: 30px;
        width: 100%;
    }
}

.all-score{
    color: #F7464E;
}
.host-box {
  height: 50px;
}

.right-border {
    border-right: 1px solid #FFE7D5;
}
::v-deep {
  .operations{
    .living-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

}
.selection{
    position: relative;
  height: 100px;
  .value {
    height: 63px;
  }
}
</style>
