<template>
<div class="wrap bg-white">
    <div class="header font-14 font-regular  font-500 text-center">
        <span class="d-inline-block text">
            {{ title }}
        </span>

    </div>
    <div
        class="box"
        v-loading="isLoading"
        element-loading-background="transparent"
    >
        <div class="row header-row w-100 p-l-15 font-12 text-333 font-400 p-r-15 flex align-center">
            <div class="left flex justify-between text-center align-center">
                <div class="time flex font-12  flex-column justify-center text-333 align-center">
                    时间
                </div>
                <span class="font-12 league-name text-333 ">赛事</span>
                <span class="font-12 roundCn text-333 ">轮次</span>
            </div>
            <div class="middle flex align-center p-l-25 font-12 ">
                <div class="team1 flex flex-end align-center">
                        <span class="team-name text-right ">
                            主队
                        </span>
                    <span class="icon m-l-15 m-r-10 visibility-hidden bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"></span>
                    <span class="score text-center visibility-hidden">111</span>
                </div>
                <span class="m-l-10 m-r-10 visibility-hidden">-</span>
                <div class="team1 flex  align-center">
                    <span class="icon m-l-15 m-r-10 visibility-hidden bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"></span>
                    <span class="score text-center visibility-hidden">111</span>
                    <span class="team-name text-left "> 客队 </span>
                </div>
            </div>
            <div class="right flex align-center">直播</div>
        </div>
        <template v-if="list.length">
            <div
                v-for="item in list"
                :key="item.matchId"
                class="row w-100 p-l-15 p-r-15 flex align-center">
                <div class="left flex text-center justify-between align-center">
                    <div class="time flex font-12  flex-column justify-center text-333 align-center">
                        <span class="scale-9">{{ item.matchTime | getTime }}</span>
                        <span class="scale-9">{{ item.matchTime | getDate }}</span>
                    </div>
                    <template v-if="item.leagueType === 1">
                        <CustomSpan class="font-12 league-name text-333 " :content="item.leagueChsShort"/>
                        <CustomSpan class="font-12 roundCn text-333 " :content="item.roundCn ? `第${item.roundCn}轮` : '--'"/>
                    </template>
                    <template v-else>
                        <CustomSpan class="font-12 league-name text-333 " :content="item.leagueChs || item.leagueChsShort"/>
                        <CustomSpan class="font-12 roundCn text-333 " :content="item.season ? `${item.season}赛季` : '--'"/>
                    </template>

                </div>
                <div class="middle flex align-center p-l-25 font-12 ">
                    <div class="team1 flex flex-end align-center">
                        <span class="team-name text-right">
                            <CustomSpan :content="item.homeChs || item.homeTeamChs"/>
                        </span>
                        <span
                            class="icon m-l-15 m-r-10 bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"

                            v-lazy-container="{ selector: 'img' }"
                        >
                             <img class="w-100 h-100 " :data-src="item.homeLogo" :data-error="errorTeamLogo" alt="">
                        </span>
                        <span class="score text-center">{{ item.homeScore }}</span>
                    </div>
                    <span class="m-l-10 m-r-10">-</span>
                    <div class="team1 flex  align-center">
                        <span class="score text-center">{{ item.awayScore }}</span>
                        <span
                            class="icon m-l-10 m-r-15 flex align-center justify-center bg-center bg-no-repeat bg-size-cover border-radius-50 d-inline-block"
                            v-lazy-container="{ selector: 'img' }"
                        >
                            <img class="w-100 h-100 " :data-src="item.awayLogo" :data-error="errorTeamLogo" alt="">
                        </span>

                        <span class="team-name text-left">
                          <CustomSpan :content="item.awayChs || item.awayTeamChs"/>
                      </span>
                    </div>
                </div>
                <div class="right flex align-center">
                    <VirtualIcon @click.native="goToVirtual(item)" />
                    <div class="flex-1 p-l-10">
                      <ul v-if="item.anchor_list.length < 4" class="hosts flex align-center ">
                        <li
                            class="host border-radius-50  m-r-10"

                            v-for="anchor in item.anchor_list" :key="anchor.id">
                          <div
                              class="w-100 pointer overflow-hidden h-100 border-radius-50 bg-center bg-no-repeat bg-size-cover"

                              @click="goToLiveRoom(anchor)"
                              v-lazy-container="{ selector: 'img' }"
                          >
                              <img class="w-100 h-100" :data-src="anchor.img" :data-error="errorUserLogo" alt="">
                          </div>
                        </li>
                      </ul>
                      <template v-else>
                        <el-popover
                            popper-class="anchor-popper"
                            placement="right"
                            width="350"
                            height="300"
                            trigger="click">
                          <div class="anchor-list">
                            <p class="text-center text-14 font-12 p-t-10 p-b-10 font-300 font-regular">{{ item.anchor_list.length }}名主播正在播本场比赛</p>
                            <div class="ul-box p-b-15 p-l-20 p-r-20 flex flex-column overflow-y-auto">
                              <template
                                  v-for="anchor in item.anchor_list"
                              >
                                <AnchorInfo class="m-t-15" :anchor="anchor" :key="anchor.room_id"/>
                              </template>
                            </div>
                          </div>
                          <div
                              slot="reference"
                              class="hosts-row font-12 text-14 pointer bg-no-repeat p-l-20"
                              :class="{'visibility-hidden': false}"
                          >
                            {{ item.anchor_list.length }} 位主播
                          </div>
                        </el-popover>
                      </template>
                    </div>
                </div>
            </div>
        </template>
        <no-data v-if="list && !list.length && !isLoading" />
    </div>

</div>
</template>

<script>
import { getMatchList } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import CustomSpan from '@/components/CustomSpan'
import dayjs from 'dayjs'
import AnchorInfo from '@/views/Competition/Components/AnchorInfo'
import NoData from '@/components/NoData'
import { setLocal } from '@/utils/cookie'
import VirtualIcon from '@/components/VirtualIcon.vue'
export default {
    name: 'MatchWithStatus',
    components: {
        CustomSpan,
        AnchorInfo,
        VirtualIcon,
        NoData
    },
    filters: {
        getTime (value) {
            return dayjs(value).format('HH:mm')
        },
        getDate (value) {
            return dayjs(value).format('MM-DD')
        }
    },
    props: {
        status: {
            type: [Number, String],
            default: 1000
        },
        title: {
            type: String,
            default: '进行中的比赛'
        },
        leagueType: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        isFootball () {
            return this.leagueType === 1
        },
        matchLogo () {
            return this.isFootball ? require('../../../assets/images/home/card/football.png') : require('../../../assets/images/home/card/basketball.png')
        }
    },
    data () {
        return {
            list: [],
            isLoading: false
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code } = await getMatchList({
                    playing: this.status,
                    pageSize: 4,
                    leagueType: this.leagueType
                })
                if (code === statusCode.success) {
                    this.list = data.list.reduce((all, item) => {
                        all.push({
                            ...item
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        goToLiveRoom (anchor) {
            const roomId = anchor.room_id
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: roomId }
            })
            window.open(href, '_blank')
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
        }
    }
}
</script>

<style lang="scss" scoped>
//.virtualImg{
//  width: 27.5px;
//  height: 19px;
//}
.wrap {
    width: 850px;
    height: 239px;
    border-radius: 10px;
    overflow: hidden;
    .box {
      height: 168px;
    }
}
.header {
    line-height: 42px;
    background-color: #fff;
    color: #E6B48E;
  .text {
    width: 194px;
    height: 30px;
    border-radius: 15px;
    line-height: 30px;
  }
}
.header-row.row {
  line-height: 30px;
  background-color: #FFF8F1;
  border:none;
}
.row {
    line-height: 41px;
    border-top: 1px solid #FFE7D5;
    .left {
        width: 25%;
        .time {
          width: 45px;
            span {
                line-height: 12px;
            }
        }
      .league-name {
        width: 60px;
      }
      .roundCn {
        width: 70px;
      }
    }
    .middle {
        width: 50%;
    }
    .right {
        width: 25%;
        .host {
            width: 30px;
            height: 30px;
            background-color: #C9CFED;
        }
        .hosts-row{
          width: 100px;
          background-image: url('../../../assets/images/common/live.gif');
          background-position: left center;
          background-size: 12px 16px;
        }
    }
    .team1 {
        flex: 1;
        .icon {
            width: 15px;
            height: 15px;
            background-color: #C9CFED;
            line-height: 15px;
        }
        .score {
            display: inline-block;
            width: 30px;
        }
        .team-name {
            width: 100px;
            display: inline-block;
        }
    }
}
</style>
