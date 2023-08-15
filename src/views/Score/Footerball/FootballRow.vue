<template>
  <div class="text-center row w-100 flex font-14 text-333"
    :class="{
      'is-strip': showStrip
    }"
  >
    <div class="selection p-l-10 p-r-10">
      <slot name="selection" />
    </div>
    <div  class="leagueChsShort flex align-center " >
      <span class="team-icon d-inline-block bg-center bg-size-100 bg-no-repeat"
            :style="{
              backgroundImage: `url(${row.leagueLogo})`
            }"
      ></span>
      <div class="flex-1">
        <CustomSpan class="font-14 text-333" :content="filterLanguage(row, 'league', true)" />
      </div>
    </div>

    <div class="time">
      <span class="font-12 text-333">{{ row.matchTime | formatTime }}</span>
    </div>
    <div class="status">
      <template v-if="row.isNumber">
        <span class="font-12" style="color: #F7464E;">{{ row.stateString}}</span>
        <span class="fade-in-out" style="color: #F7464E;">'</span>
      </template>
      <span v-else class="font-12" style="color: #F7464E;">{{ row.stateString }}</span>
    </div>
    <div class="home-team flex-shrank-0 p-l-10 p-r-10 text-right">
      <div class="flex w-100 p-l-20 font-12 align-center flex-end">
          <div class="  corner-box flex align-center justify-center">
              <span v-if="showRed"
                    :class="{
                        'visibility-hidden': row.homeRed <= 0
                    }"
                    class="red-corner m-r-5 d-inline-block">{{ row.homeRed }}</span>
              <span v-if="showYellow"
                    :class="{
                        'visibility-hidden': row.homeYellow <= 0
                    }"
                    class="yellow-corner m-r-5 d-inline-block">{{ row.homeYellow }}</span>
          </div>
          <CustomSpan class="team-name text-right" :content="filterLanguage(row, 'name', true)"  />
      </div>
    </div>
    <div class="score">
        <PopoverDialog v-if="row.showPopover" :key="row.id" :info="row"/>
        <div v-else class="score-column flex align-center justify-center font-12"
                   :class="{
                      'red': !isFuture && !isWarning && row.status !== 2
                   }"
              >
                <template v-if="isFuture || isWarning">
                  <span>-</span>
                </template>
                <template v-else >
                  <span class="score-num">{{ row.homeScore }}</span>
                  <span class="line m-l-5 m-r-5">-</span>
                  <span class="score-num">{{ row.awayScore }}</span>
                </template>
              </div>
    </div>
    <div class="away-team flex-shrank-0 p-l-10 p-r-10 text-left">
      <div class="flex align-center font-12 ">

        <CustomSpan class="team-name text-left" :content="filterLanguage(row, 'name', false)" />
        <div class=" corner-box flex align-center justify-center">
          <span v-if="showYellow"
                :class="{
                    'visibility-hidden': row.awayYellow <= 0
                }"
                class="yellow-corner m-l-5 d-inline-block">{{ row.awayYellow }}</span>
          <span v-if="showRed" :class="{
              'visibility-hidden': row.awayRed <= 0
          }" class="red-corner m-l-5 d-inline-block">{{ row.awayRed }}</span>
        </div>
      </div>
    </div>
    <div class="half">
         <span class="font-12" v-if="isFuture || isWarning">-</span>
         <span class="font-12" v-else>{{ row.homeHalfScore }} - {{ row.awayHalfScore }}</span>
    </div>
    <div class="corner ">
        <span class="font-12" v-if="isFuture || isWarning">-</span>
        <div v-else class="flex font-12 align-center justify-center">
            <span class="corner-icon d-inline-block bg-no-repeat bg-center bg-size-100"></span>
            <span class="m-l-5">{{ row.homeCorner }} - {{ row.awayCorner }}</span>
        </div>
    </div>
    <div class="liveHost">
      <div class="flex h-100 align-center justify-center">
          <VirtualIcon  @click.native="goToVirtual(row)" />
        <div class="m-l-20 m-r-5 host" >
          <template v-if="!!(row.anchor_list && row.anchor_list.length)">
              <PopoverHost
                      :match="row"
                      is-dark
                      text-living
              >
            <span class="d-inline-block pointer h-100 flex align-center anchor-icon bg-center bg-no-repeat bg-size-cover"
                  :style="{
                backgroundImage: `url(${row.anchor_list[0].img})`
            }"
            ></span>
              </PopoverHost>
          </template>
        </div>
      </div>
    </div>
    <div class="operations flex align-center justify-center">
      <IconPng
          v-if="!row.isTop"
          :width="16" :height="16"
          class="pointer" icon="score/top"
          @click.native="setFirst(row)"
      />
      <IconPng
          v-else
          :width="16" :height="16"
          class="pointer rotate-reverse" icon="score/cancle-top"
          @click.native="cancleFirst(row)"
      />
    </div>
  </div>
</template>

<script>
import IconPng from '@/components/IconPng'
import CustomSpan from '@/components/CustomSpan'
import PopoverDialog from '@/views/Score/Footerball/PopoverDialog'
import PopoverHost from '@/components/PopoverHost'
import dayjs from 'dayjs'
import { getItem, setItem, setLocal } from '@/utils/cookie'
import VirtualIcon from '@/components/VirtualIcon.vue'
export default {
    name: 'FootballRow',
    components: {
        CustomSpan,
        PopoverDialog,
        PopoverHost,
        IconPng,
        VirtualIcon
    },
    filters: {
        formatTime (time) {
            return dayjs(time).format('HH:mm')
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
    props: {
        row: {
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
        },
        showCards: {
            type: Array,
            default: () => []
        },
        showStrip: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showYellow () {
            return this.showCards.includes('yellow')
        },
        showRed () {
            return this.showCards.includes('red')
        },
        isFuture () {
            return this.type === 'isFuture'
        },
        isGoing () {
            return this.type === 'isGoing'
        },
        isEnd () {
            return this.type === 'isEnd'
        },
        isWarning () {
            return this.type === 'warning'
        }
    },
    data () {
        return {
            isSelect: false
        }
    },
    methods: {
        filterLanguage (row, type, isHome) {
            let ret = ''
            if (type === 'name') {
                const prefix = isHome ? 'home' : 'away'
                ret = this.language === 'zh'
                    ? row[`${prefix}Chs`]
                    : (this.language === 'tw' ? row[`${prefix}Cht`] : row[`${prefix}En`])
                ret = ret || row[`${prefix}Chs`]
            } else if (type === 'league') {
                ret = this.language === 'zh'
                    ? row.leagueChsShort
                    : (this.language === 'tw' ? row.leagueChtShort : row.leagueEn)
                ret = ret || row.leagueChsShort
            }
            return ret
        },
        goToVirtual (row) {
            setLocal('matchInfo', JSON.stringify({ ...row }))
            this.$nextTick(() => {
                const { href } = this.$router.resolve({
                    name: 'VirtualLive',
                    query: {
                        matchId: row.matchId,
                        leagueType: row.leagueType
                    }
                })
                window.open(href, '_blank')
            })
        },
        setFirst (row) {
            const key = 'footballCaches'
            const values = getItem(key) ? JSON.parse(getItem(key)) : []
            values.unshift(row.matchId)
            setItem(key, JSON.stringify(values))
            this.$emit('refresh')
        },
        cancleFirst (row) {
            const key = 'footballCaches'
            const values = getItem(key) ? JSON.parse(getItem(key)) : []
            const newVals = values.filter(x => x !== row.matchId)
            setItem(key, JSON.stringify(newVals))
            this.$emit('refresh')
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
  line-height: 40px;
  &.is-strip {
    background-color: #F3F3F3;
  }
  .leagueChsShort {
    width: 170px;
  }
  .time, .score {
    width: 100px;
  }
  .score {
    .score-num {
      display: inline-block;
      width: calc(50% - 10px);
    }
    .team-name {
      width: 90px;
    }
  }
  .status{
    width: 110px;
  }
  .home-team  {
    width: 180px;
  }
  .away-team {
    width: 160px;
  }
  .half {
    width: 75px;
  }
  .corner{
    width: 80px;
  }
  .liveHost {
    width: 160px;
    .host {
      width: 65px;
    }
    .anchor-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .operations {
    width: 50px;
  }
}

.team-icon{
  width: 20px;
  height: 20px;
}

.corner-box {
  width: 50px;
  flex-shrink: 0;
  .red-corner, .yellow-corner{
    padding: 0 2px;
    color: #fff;
    font-size: 12px;
    height: 15px;
    line-height: 15px;
    border-radius: 1px;
  }
  .red-corner {
    background-color: #FF5B5D;
  }
  .yellow-corner {
    background-color: #FFC460;
  }
}
.corner-icon {
  width: 12px;
  height: 15px;
  background-image: url('../../../assets/images/live-room/statics/corner-kick.png');
}
</style>
