<template>
<div class="ranks bg-white w-100 h-100">
    <div class="header bg-white text-center flex align-center font-regular">
        <span @click="changeType(1)" class="football pointer flex-1 item font-14 font-400" :class="{'is-active': leagueType === 1}">足球积分榜</span>
        <span @click="changeType(2)"  class="basketball pointer flex-1 item font-14 font-400" :class="{'is-active': leagueType === 2}">篮球积分榜</span>
    </div>
    <div class="w-100">
        <div class="types m-l-10 m-r-10 flex p-l-10 p-r-10 align-center justify-between"

        >
            <div class="type font-14 pointer flex-1 text-center"
                 :class="{
                    'is-active': type.id === activeId,
                    'disabled not-allowed': type.disable,
                    'no-border': !isFootball
                 }"
                v-for="type in showOptions"
                 @click="changeTab(type)"
                 :key="type.id"
            >{{ type.label }}</div>
        </div>
        <div v-if="showSecondTab" class="section-tabs m-t-5 types m-l-10 m-r-10 flex p-l-10 p-r-10 align-center justify-between">
            <div class="type font-16 pointer flex-1 text-center"
                 :class="{
                    'is-active': type.id === sectionTabId
                 }"
                 v-for="type in sectionTabs"
                 @click="changeSectionTab(type)"
                 :key="type.id"
            >{{ type.title }}</div>
        </div>
    </div>

    <div class="tables w-100 bg-white" :class="{
        'has-second': showSecondTab
    }">
        <div class="table-box ">
            <el-table
                :data="list"
                height="100%"
                fit
                align="center"
                v-loading="isLoading"
                class="custom-table p-l-5 p-r-5"
            >
                <el-table-column
                    prop="rank"
                    label="排名"
                    align="center"
                    width="50"
                ></el-table-column>
                <el-table-column
                    prop="team"
                    label="球队"
                    align="center"
                    min-width="60"
                >
                    <template slot-scope="scope">
                        <div class="flex w-100 align-center">
                            <span
                                class="team-icon flex align-center justify-center flex-shrank-0  border-radius-50"
                                v-lazy-container="{ selector: 'img' }"
                            >
                                 <img class="w-100 h-100 " :data-src="scope.row.flag" :data-error="errorTeamLogo" alt="">
                            </span>
                            <span class="m-l-5 score-span text-left">
                          <custom-span class="w-100 text-left" :content="scope.row.nameChs"/>
                        </span>
                        </div>
                    </template>
                </el-table-column>
                <template v-if="isFootball">
                    <el-table-column
                        prop="score"
                        label="胜/负/平"
                        align="center"
                        min-width="50"
                    >
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.winCount}} / {{ scope.row.loseCount }} / {{ scope.row.drawCount }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="integral"
                        label="积分"
                        align="center"
                        min-width="30"
                    ></el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                        prop="win"
                        label="胜"
                        align="center"
                        min-width="25"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="lose"
                        label="负"
                        align="center"
                        min-width="25"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="winRate"
                        label="胜率"
                        align="center"
                        min-width="30"
                    ></el-table-column>
                </template>

            </el-table>
        </div>
        <div class="update-time text-center font-12 font-regular">
            数据更新于：{{ updateTime }}
        </div>
    </div>
</div>
</template>

<script>
import { getTeamStanding, getBasketballStanding, getTeamStandingZC } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import CustomSpan from '@/components/CustomSpan'
import dayjs from 'dayjs'
export default {
    name: 'ScoreRanks',
    components: {
        CustomSpan
    },
    data () {
        return {
            leagueType: 1,
            activeId: 36,
            options: [
                {
                    id: 36,
                    label: '英超'
                },
                {
                    id: 8,
                    label: '德甲'
                },
                {
                    id: 34,
                    label: '意甲'
                },
                {
                    // id: 2185,
                    id: 60,
                    label: '中超',
                    isChinese: true
                },
                {
                    id: 11,
                    label: '法甲'
                },
                {
                    id: 31,
                    label: '西甲'
                }

            ],
            basketBallOptions: [
                {
                    id: 1,
                    label: 'NBA'
                },
                {
                    id: 5,
                    // disable: true,
                    label: 'CBA'
                }
            ],
            list: [],
            isLoading: false,
            updateTime: null,
            sectionTabs: [{
                id: 1,
                label: 'west',
                title: '西部'
            },
            {
                id: 2,
                label: 'east',
                title: '东部'
            }],
            sectionTabId: 1,
            basketballData: {}
        }
    },
    computed: {
        currentTab () {
            return this.options.find(x => x.id === this.activeId)
        },
        isFootball () {
            return this.leagueType === 1
        },
        showSecondTab () {
            return this.leagueType === 2 && this.activeId === 1
        },
        showOptions () {
            return this.leagueType === 1 ? this.options : this.basketBallOptions
        },
        isZC () {
            return !!this.currentTab.isChinese
        },
        requestFn () {
            return this.isFootball ? (this.isZC ? getTeamStandingZC : getTeamStanding) : getBasketballStanding
        }
    },
    watch: {
        activeId: {
            handler () {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        changeTab (type) {
            if (type.disable) {
                return
            }
            this.activeId = type.id
        },
        changeType (leagueType) {
            this.leagueType = leagueType
            this.activeId = this.showOptions[0].id

            this.sectionTabId = 1
        },
        async fetchData () {
            try {
                this.isLoading = true
                this.list = []
                const request = this.requestFn
                const { data, code, timestamp } = await request(this.activeId)
                if (code === statusCode.success) {
                    if (this.isFootball) {
                        this.list = data
                    } else {
                        // 篮球
                        if (this.activeId === 1) {
                            this.handleBasketball(data)
                        } else {
                            this.list = data.list[0].team.reduce((all, item) => {
                                all.push({
                                    win: item.homeWin + item.awayWin,
                                    lose: item.homeLose + item.awayLose,
                                    rank: item.totalRank,
                                    flag: item.logo,
                                    ...item
                                })
                                return all
                            }, [])
                        }
                    }
                    this.updateTime = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        handleBasketball (data) {
            this.basketballData = {
                'west': data.list[0].team,
                'east': data.list[1].team
            }
            const sectionTab = this.sectionTabs.find(x => x.id === this.sectionTabId)
            this.list = this.basketballData[sectionTab.label].reduce((all, item) => {
                all.push({
                    win: item.homeWin + item.awayWin,
                    lose: item.homeLose + item.awayLose,
                    rank: item.totalRank,
                    flag: item.logo,
                    ...item
                })
                return all
            }, [])
        },
        changeSectionTab (tab) {
            this.sectionTabId = tab.id
            this.list = this.basketballData[tab.label].reduce((all, item) => {
                all.push({
                    win: item.homeWin + item.awayWin,
                    lose: item.homeLose + item.awayLose,
                    rank: item.totalRank,
                    flag: item.logo,
                    ...item
                })
                return all
            }, [])
        }
    }
}
</script>

<style lang="scss" scoped>
.header{
    line-height: 42px;
    span {
        color: #757575;
        position: relative;
        &.is-active {
            font-size: 16px;
            color: #409eff;
            font-weight: 500;
            &::after {
              position: absolute;
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
              content: '';
              width: 1px;
              border-top: 6px solid transparent;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid #409eff;
            }
        }
    }
}
.types {
    height: 38px;
    background: #FFF8F1;
    border-radius: 19px;
    .type {
        //max-width: 52px;
        height: 28px;
        line-height: 28px;
        color: #333;
        font-weight: 400;
        &.is-active{
            color: #fff;
            font-weight: 500;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 14px;
        }
        &.no-border {
            border:none;
            //line-height: 45px;
        }
    }
}
.tables{
    height: calc(100% - 80px);
    color: #757575;
    &.has-second {
        height: calc(100% - 122px);
    }
    .table-box {
        height: calc(100% - 40px);
    }
    .update-time{
        height: 40px;
        line-height: 40px;
        color: #b6bccb;
    }
    .team-icon {
        width: 15px;
        height: 15px;
        background-color: #C9CFED;
    }
  .score-span {
    width: 85px;
    display: inline-block;
  }
}
</style>
