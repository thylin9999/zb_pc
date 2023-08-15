<template>
<div class="hot-match w-100 h-100 p-relative">
    <div class="time text-center p-t-10">
      <span class=" font-12 font-medium text-white  font-400">{{ match.matchTime | filterTime }}</span>
    </div>
    <div class="card-title p-absolute w-100 text-center font-12 font-600 font-regular text-gradient">
        {{ title }}
    </div>
    <div class="content m-t-15 w-100">
        <div class="teams flex p-l-10 p-r-10">
            <div class="left team flex flex-column">
                <div class="team-flag-box flex align-center justify-center  w-100 text-center">
                    <span
                        class=" team-flag flex align-center bg-no-repeat bg-center bg-size-cover justify-center  border-radius-50  "
                    >
                        <span class="bg-no-repeat overflow-hidden w-100 h-100 bg-center bg-size-cover d-inline-block"
                              v-lazy-container="{ selector: 'img' }">
                            <img class="w-100 h-100" :data-src="match.homeLogo" :data-error="leagueIcon" alt="">
                        </span>
                    </span>
                </div>
                <div class="team-info flex m-t-5 text-center">
                    <CustomSpan class="font-12 name text-white font-400" :content="match.homeChs"/>
                </div>
            </div>
            <div class="vs h-100 font-18 text-center font-500 font-regular text-white">
                <div class="scores" v-if="!match.isFuture">
                  <span class="score text-center">{{ match.homeScore }}</span>
                  <span class="p-l-5 p-r-5 font-12 vertical-middle">:</span>
                  <span class="score text-center">{{ match.awayScore }}</span>
                </div>
                <div v-else class="font-14 font-500 text">VS</div>
            </div>
            <div class="right team flex flex-column">
                <div class="flex flex-end">
                    <div class="team-flag-box flex align-center justify-center w-100 text-center">
                        <span
                                class=" team-flag bg-no-repeat bg-center bg-size-cover flex align-center justify-center border-radius-50  "
                        >
                          <span class="bg-no-repeat overflow-hidden border-radius-50 w-100 h-100 bg-center bg-size-cover d-inline-block"

                                v-lazy-container="{ selector: 'img' }"
                          >
                              <img class="w-100 h-100" :data-src="match.awayLogo" :data-error="leagueIcon" alt="">
                          </span>
                      </span>
                    </div>
                </div>
                <div class="team-info m-t-5 flex text-center">
                    <CustomSpan class="font-12 name  text-white font-400" :content="match.awayChs"/>
                </div>
            </div>
        </div>
    </div>
    <div class="btns flex align-center justify-center">
        <div class="button m-t-5 status-button text-center">
            <PopoverHost is-home v-if="hasLiveRooms" :match="match"/>
            <template v-else>
                <span v-if="match.isGoing"  class="font-12 status-span pointer d-inline-block  h-100 text-center">
                    {{ match.matchStatusString }}
                </span>
                <span
                    v-else
                    v-throttle="[()=>book(match),3000]"
                    class="font-12 status-span subscribe-span pointer d-inline-block  h-100 text-center"
                    :class="{
                    'is-subscribe': match.isSubscribe,
                    'not-subscribe': !match.isSubscribe,
                    'is-going': match.isGoing,
                 }"
                >{{ match.isSubscribe ? '已预约' : '预约' }}</span>
            </template>

        </div>
    </div>
</div>
</template>

<script>
import dayjs from 'dayjs'
import { addSubscribeMatch } from '@/api/competition/competition'
import PopoverHost from '@/components/PopoverHost'
import CustomSpan from '@/components/CustomSpan'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
    name: 'HotMatchCard',
    components: {
        PopoverHost,
        CustomSpan
    },
    filters: {
        filterTime (value) {
            const date = dayjs(value).isAfter(dayjs(), 'day') ? '明天' : '今天'
            const time = dayjs(value).format('HH:mm')
            return date + ' ' + time
            // return dayjs(value).format('MM-DD HH:mm')
        }
    },
    props: {
        match: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapState('user', ['token']),
        isFootball () {
            return this.match.leagueType === 1
        },
        title () {
            return this.match.leagueChsShort
        },
        leagueIcon () {
            return require('../../../assets/images/common/team-icon.png')
            // return this.isFootball ? require('../../../assets/images/home/card/football.png') : require('../../../assets/images/home/card/basketball.png')
        },
        hasLiveRooms () {
            return this.match.anchor_list.length
        }
    },
    methods: {
        async book (match) {
            if (!match.isGoing) {
                if (this.token) {
                    // 已登录
                    const { code, msg } = await addSubscribeMatch(match.matchId, match.leagueType)
                    if (code === statusCode.success) {
                        Message.success(msg)
                        this.$emit('refresh')
                    }
                } else {
                    Message.error('请先登录，无法预约！')
                    this.openLoginDialog()
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-title{
    line-height: 12px;
    //color: #F5DEB3;
    left: 0;
    top: 35px;
}
.league-icon{
    width: 20px;
    height: 20px;
    left: 10px;
    top: 18px;
}
.content {

    .teams {
        .vs {
            width: 78px;
          .text {
            color: #6C73AF;
            line-height: 42px;
          }
          .scores {
            line-height: 42px;
          }
          .status-button {
            margin: 0 auto;
            width: 64px;
          }
        }
        .team {
            width: calc( 50% - 39px);
        }
        .team-flag-box{
          text-align: center;
        }
        .team-flag {
            width: 42px;
            height: 42px;
            background-image: url('../../../assets/images/common/team-bg.png');
          span {
            width: 25px;
            height: 25px;
          }
        }
        .score {
            width: 30px;
        }
        .team-info{
          width: 100%;
            .name {
                width: 100%;
            }
        }
    }
}
.btns {
  .button {
      max-width: 120px;
      .status-span {
          width: 75px;
          height: 22px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #fff;
          line-height: 22px;
          background-color: #6C73AF;
          &.not-subscribe {
              background-image: url('../../../assets/images/common/book-btn.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100% 100%;
              &:hover {
                  background-image: url('../../../assets/images/common/book-btn_h.png');
              }
          }
          &.is-subscribe {
              background-color: #2B1845;
              &:hover {
                  background-color: #6C73AF;
              }
          }
      }
  }

}
</style>
