<template>
  <div class="match-header flex align-center justify-between">
    <div class="left flex align-center">
      <span class="team-name m-r-10 font-16 font-medium text-333">{{ matchInfo.homeChs }}</span>
      <div class="team-logo bg-no-repeat bg-center bg-size-cover"
           :style="{
                backgroundImage: `url(${homeLogo})`
            }"
      >
      </div>
      <span class="team-score m-l-20 font-medium text-333">{{ matchInfo.homeScore }}</span>
    </div>
    <div class="middle flex-column font-14 font-regular text-999 flex align-center justify-center">
      <div class="league-info flex align-center flex-column font-14 font-regular text-999">
        <span class="">{{ matchInfo.leagueChsShort}}</span>
        <span>{{ matchInfo.matchTime }}</span>
      </div>
      <div class="match-info m-t-15 flex flex-column align-center">
        <template v-if="!isFootball">
          <span class="state" v-if="isGoing">{{ matchInfo.remainTime }}</span>
          <span v-else class="state">{{ stateString }}</span>
          <div class="m-t-5">
            <span>半:{{ halfScore }}</span>
          </div>
        </template>
        <template v-else>
          <template v-if="!matchInfo.nowTime">
            <span class="state ">{{ stateString }}</span>
          </template>
          <template v-else>
            <span class="state ">
              {{ matchInfo.nowTime }} <span class="fade-in-out">'</span>
            </span>
          </template>
          <div class="m-t-5">
            <span>半:{{ matchInfo.homeHalfScore }}-{{ matchInfo.awayHalfScore }}</span>
            <span class="m-l-30">角:{{ matchInfo.homeCorner }}-{{ matchInfo.awayCorner }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="right flex align-center">
      <span class="team-score m-r-20 font-medium text-333">{{ matchInfo.awayScore }}</span>
      <div class="team-logo bg-no-repeat bg-center bg-size-cover"
           :style="{
                backgroundImage: `url(${awayLogo})`
            }"
      >
      </div>
      <span class="team-name m-l-10 font-16 font-medium text-333">{{ matchInfo.awayChs }}</span>

    </div>
  </div>
</template>

<script>
import { isGoingCompetition, matchStatus, basketStatus } from '@/utils/utils'

export default {
    name: 'MatchHeader',
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            defaultB: require('@/assets/images/home/card/basketball.png'),
            defaultF: require('@/assets/images/common/team-flag.png')
        }
    },
    computed: {
        isFootball () {
            return this.matchInfo.leagueType === 1
        },
        homeLogo () {
            return this.matchInfo.homeLogo ? this.matchInfo.homeLogo : this.emptyLogo
        },
        awayLogo () {
            return this.matchInfo.awayLogo ? this.matchInfo.awayLogo : this.emptyLogo
        },
        emptyLogo () {
            return [this.defaultF, this.defaultB][this.matchInfo.leagueType - 1]
        },
        halfScore () {
            if (!this.isFootball) {
                const homeHalf = this.matchInfo.home1 * 1 + this.matchInfo.home2 * 1
                const awayHalf = this.matchInfo.away1 * 1 + this.matchInfo.away2 * 1
                return `${homeHalf}-${awayHalf}`
            } else {
                return ''
            }
        },
        leagueKey () {
            return this.isFootball ? 'football' : 'basketball'
        },
        isGoing () {
            return isGoingCompetition(this.matchInfo.state, this.leagueKey)
        },
        stateString () {
            let str = ''
            if (this.matchInfo.state === 0) {
                str = '未开'
            } else if (this.matchInfo.state === -1) {
                str = '完场'
            } else if (isGoingCompetition(this.matchInfo.state, this.leagueKey)) {
                str = this.matchInfo.timing ? (this.matchInfo.timing + "'") : this.matchInfo.timing
            } else {
                const status = this.isFootball ? matchStatus : basketStatus
                str = status[this.matchInfo.state] || '异常'
            }
            return str
        }
    }
}
</script>

<style lang="scss" scoped>
.match-header {
  width: 800px;
  margin: 0 auto;
  height: 110px;
  background-color: #fff;
}
.match-info {
  .state {
    color: #F7464E;
  }
}
.team-logo{
  width: 55px;
  height: 55px;
  background-color: #D8D8D8;
  border-radius: 50%;
}
.team-score{
  font-size: 35px;
  font-weight: 500;
}
</style>
