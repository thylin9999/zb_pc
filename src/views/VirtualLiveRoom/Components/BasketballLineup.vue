<template>
<div class="lineup-box p-relative w-100" ref="lineupBox" v-loading="loading">
    <template v-if="competitionData">
      <div class="list"
        :class="{
          'is-live-room': isLiveRoom
        }"
      >
        <div v-if="competitionData"  class="row  flex justify-between align-center">
          <div class="left item p-t-15 p-b-15 flex align-center justify-between">
            <template >
              <div class="flex align-center">
                  <span
                      class="team-icon icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                      :style="{
                          backgroundImage: `url(${homeLogo})`
                      }"
                  ></span>
                <div class="player p-l-15 flex flex-column text-left">
                  <span class="font-medium font-14 text-333">{{ competitionData.homeNameChs }}</span>
                  <span class="font-12 m-t-5 font-regular text-999">主教练: {{ competitionData.homeCoachCn }}</span>
                </div>
              </div>

            </template>
          </div>
          <div class="right p-t-15 p-b-15 item flex align-center flex-end">
            <template >

              <div class="flex align-center">
                <div class="player p-r-15 flex flex-column text-right">
                  <span class="font-medium font-14 text-333">{{ competitionData.awayNameChs }}</span>
                  <span class="font-12 m-t-5 font-regular text-999">{{ competitionData.awayCoachCn }}: 主教练</span>
                </div>
                <span
                    class="team-icon icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                    :style="{
                          backgroundImage: `url(${awayLogo})`
                      }"
                ></span>
              </div>
            </template>
          </div>
        </div>

        <template v-if="competitionData">
          <template v-for="(i, index) in 5">
            <div :key="`${index}-lineup`" class="row flex justify-between align-center">
              <div
                  class="left p-b-15 p-t-15 item flex align-center justify-between"
                  :class="{
                    'border-none': !homePlayers[index]
                }"
              >
                <template v-if="homePlayers[index]">
                  <div class="flex align-center">
                          <span
                              class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                              :style="{
                                backgroundImage: `url(${homePlayers[index].photo})`
                              }"
                          ></span>
                    <div class="player p-l-15 flex flex-column text-left">
                      <span class="font-medium font-14 text-333">{{ homePlayers[index] ? homePlayers[index].nameChs : '' }}</span>
                      <span class="font-12 m-t-5 font-regular text-999">{{ homePlayers[index].nameEn }}</span>
                    </div>
                  </div>
                  <div class="flex flex-column align-center">
                    <span class="font-14 text-333">{{ homePlayers[index].number}}</span>
                    <span class="font-12 m-t-5 text-999">{{ homePlayers[index].positionCn}}</span>
                  </div>
                </template>
              </div>
              <div
                  class="right p-b-15 p-t-15 item flex align-center justify-between"
              >
                <template v-if="awayPlayers[index]">
                  <div class="flex flex-column align-center">
                    <span class="font-14 text-333">{{ awayPlayers[index].number}}</span>
                    <span class="font-12 m-t-5 text-999">{{ awayPlayers[index].positionCn}}</span>
                  </div>
                  <div class="flex align-center">
                    <div class="player p-r-15 flex flex-column text-right">
                      <span class="font-medium font-14 text-333">{{ awayPlayers[index] ? awayPlayers[index].nameChs : '' }}</span>
                      <span class="font-12 m-t-5 font-regular text-999">{{ awayPlayers[index].nameEn }}</span>
                    </div>
                    <span class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                          :style="{
                          backgroundImage: `url(${awayPlayers[index].photo})`
                        }"
                    ></span>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
        <div class="row m-t-25 m-b-20 flex justify-between align-center">
          <span class="left-backup p-l-10 font-14 text-333">替补名单</span>
          <span class="right-backup p-r-10 font-14 text-333">替补名单</span>
        </div>
        <template v-for="(i, index) in backupMaxCount">
          <div :key="i" class="row flex justify-between align-center">
            <div
                class="left p-b-15 p-t-15 item flex align-center justify-between"
                :class="{
                        'border-none': !homeBackups[index]
                    }"
            >
              <template v-if="homeBackups[index]">
                <div class="flex align-center">
                        <span
                            class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                            :style="{
                              backgroundImage: `url(${homeBackups[index].photo})`
                            }"
                        ></span>
                  <div class="player p-l-15 flex flex-column text-left">
                    <span class="font-medium font-14 text-333">{{ homeBackups[index] ? homeBackups[index].nameChs : '' }}</span>
                    <span class="font-12 m-t-5 font-regular text-999">{{ homeBackups[index].nameEn }}</span>
                  </div>
                </div>
                <div class="flex flex-column align-center">
                  <span class="font-14 text-333">{{ homeBackups[index].number}}</span>
                  <span class="font-12 m-t-5 text-999">{{ homeBackups[index].positionCn}}</span>
                </div>
              </template>
            </div>
            <div
                class="right p-b-15 p-t-15 item flex align-center justify-between"
                :class="{
                        'border-none': !awayBackups[index]
                    }"
            >
              <template v-if="awayBackups[index]">
                <div class="flex flex-column align-center">
                  <span class="font-14 text-333">{{ awayBackups[index].number}}</span>
                  <span class="font-12 m-t-5 text-999">{{ awayBackups[index].positionCn}}</span>
                </div>
                <div class="flex align-center">
                  <div class="player p-r-15 flex flex-column text-right">
                    <span class="font-medium font-14 text-333">{{ awayBackups[index] ? awayBackups[index].nameChs : '' }}</span>
                    <span class="font-12 m-t-5 font-regular text-999">{{ awayBackups[index].nameEn }}</span>
                  </div>
                  <span class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"
                        :style="{
                              backgroundImage: `url(${awayBackups[index].photo})`
                            }"
                  ></span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="player-box p-absolute bg-size-100 bg-center bg-no-repeat"
      >
        <template
            v-for="player in homePlayers"
        >
          <Member :key="player.playerId" :member="player" is-home/>
        </template>
        <template
            v-for="player in awayPlayers"
        >
          <Member :key="'away' + player.playerId" :member="player" />
        </template>
      </div>
    </template>
    <no-data
            v-if="!loading && !competitionData" />
</div>
</template>

<script>
import Member from '@/views/VirtualLiveRoom/Components/Member'
import { getLineup } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { mapMutations } from 'vuex'
import NoData from '@/components/NoData.vue'
export default {
    name: 'BasketballLineup',
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        homeLogo: {
            type: String,
            default: ''
        },
        awayLogo: {
            type: String,
            default: ''
        },
        isLiveRoom: {
            type: Boolean,
            default: false
        }
    },
    components: {
        NoData,
        Member
    },
    data () {
        return {
            homePlayers: [],
            awayPlayers: [],
            homeBackups: [],
            awayBackups: [],
            backupMaxCount: 0,
            competitionData: null,
            loading: false
        }
    },
    created () {
        this.getLineup()
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        async getLineup () {
            try {
                this.loading = true
                const { code, data } = await getLineup(this.matchId, 2)
                if (code === statusCode.success && !!data) {
                    this.competitionData = data
                    // // 处理 主队 阵容，及位置
                    this.handleLineup(data.homeLineup, true)
                    this.handleLineup(data.awayLineup, false)
                    // // 处理 替补
                    this.backupMaxCount = Math.max(data.homeBackup.length, data.awayBackup.length)
                    this.homeBackups = data.homeBackup
                    this.awayBackups = data.awayBackup
                    this.handlePlayerNumber(data)
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.loading = false
            }
        },
        handleLineup (list, isHome) {
            const players = []
            list.forEach((item, i) => {
                let xGap, yGap, count, position
                if (isHome) {
                    xGap = i < 3 ? 340 / 4 : 390 / 3
                    yGap = i < 3 ? 105 : 190
                    count = i < 3 ? i : (i - 3)
                    position = {
                        x: (count + 1) * xGap + count * 50,
                        y: yGap
                    }
                } else {
                    xGap = i < 3 ? 340 / 4 : 390 / 3
                    yGap = i < 3 ? 105 : 190
                    count = i < 3 ? i : (i - 3)
                    position = {
                        x: (count + 1) * xGap + count * 50,
                        y: 900 - yGap
                    }
                }
                const player = {
                    position,
                    ...item
                }
                players.push(player)
            }, [])
            if (isHome) {
                this.homePlayers = players
            } else {
                this.awayPlayers = players
            }
        },
        handlePlayerNumber ({ homeLineup = [], homeBackup = [], awayLineup = [], awayBackup = [] }) {
            const homePlayers = [].concat(homeLineup, homeBackup)
            const awayPlayers = [].concat(awayLineup, awayBackup)
            this.SET({
                basketBallPlayers: {
                    home: homePlayers,
                    away: awayPlayers
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.lineup-box {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 300px;
  border-radius: 5px;
}
.list {
  border-radius: 5px;
    padding-left: 55px;
    padding-right: 55px;
    &.is-live-room {
      padding-left: 10px;
      padding-right: 10px;
    }
    .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #D8D8D8;
    }
    .team-icon {
      width: 50px;
      height: 50px;
    }
}
.player-box{
    width: 490px;
    height: 900px;
    top: 0;
    left: 50%;
  transform: translateX(-50%);
    background-image: url('../../../assets/images/common/basketball-plane.png');

    .member {
        .bg {
            width: 40px;
            height: 40px;
            background-image: url('../../../assets/images/common/b-player-h.png');
        }
    }
}
.row {
  .item {
    width: calc(50% - 250px);
    max-width: 245px;
    border-bottom: 1px solid #E9E9E9;
    &.border-none {
      border: none;
    }
  }
  .left-backup{
    position: relative;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      content: '';
      width: 3px;
      height: 16px;
      background-color: #3DB1FB;
      border-radius: 1px;
    }
  }
  .right-backup{
    position: relative;
    &::after {
      position: absolute;
      top: 0;
      right: 3px;
      display: inline-block;
      content: '';
      width: 3px;
      height: 16px;
      background-color: #3DB1FB;
      border-radius: 1px;
    }
  }
}
</style>
