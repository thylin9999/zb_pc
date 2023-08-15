<template>
  <div class="box w-100 p-b-30">
    <template
      v-for="(team, index) in players"
    >
      <div class="item m-t-10 w-100" :key="index">
          <div class=" flex p-l-20  align-center m-b-10">
              <span
                  class="icon logo d-inline-block bg-center bg-no-repeat bg-size-100"
                  :style="{
                    backgroundImage: `url(${team.logo})`
                  }"
              ></span>
              <span class="font-20 m-l-15 text-333 font-400">{{ team.name }}</span>
          </div>
        <el-table
                class="w-100"
            :data="team.players || []"
            fit
            align="center"
            stripe
            show-summary
            :summary-method="summaryColumn"
            row-class-name="player-score-row"
            header-row-class-name="player-score-table-header">
          >
          <el-table-column
              fixed
              align="center"
              label="#"
              show-overflow-tooltip
              min-width="80"
          >
            <template slot-scope="scope">
              <template v-if="index === 0">
                <span v-if="homePlayers[scope.row.playerId]">{{ homePlayers[scope.row.playerId] }}</span>
                <span v-else>--</span>
              </template>
              <template v-else>
                <span v-if="awayPlayers[scope.row.playerId]">{{ awayPlayers[scope.row.playerId] }}</span>
                <span v-else>--</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
              fixed
              align="center"
              prop="playerChs"
              label="球员"
              show-overflow-tooltip
              :min-width="140"
          />
          <el-table-column
              fixed
              align="center"
              prop="positionCn"
              label="首发"
              :min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.positionCn ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="playtime"
              label="上场时间"
              :min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.playtime}}'</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="score"
              label="得分"
              :min-width="60"
          />
          <el-table-column
              align="center"
              prop="rebound"
              label="篮板"
              :min-width="60"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.offensiveRebound * 1 + scope.row.defensiveRebound * 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="assist"
              label="助攻"
              :min-width="60"
          />
          <el-table-column
              align="center"
              prop="shoot"
              label="投篮"
              :min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.shootHit}}/{{ scope.row.shoot }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="threePoint"
              label="三分"
              :min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.threePointHit}}/{{ scope.row.threePointShoot }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="freeThrow"
              label="罚球"
              :min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.freeThrowHit}}/{{ scope.row.freeThrowShoot }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="steal"
              label="抢断"
              :min-width="60"
          />
          <el-table-column
              align="center"
              prop="block"
              label="盖帽"
              :min-width="60"
          />
          <el-table-column
              align="center"
              prop="foul"
              label="犯规"
              :min-width="60"
          />
          <el-table-column
              align="center"
              prop="turnover"
              label="失误"
              :min-width="60"
          />
          </el-table>
      </div>
    </template>
  </div>
</template>

<script>
import { getMatchBasketball } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
export default {
    name: 'Statics',
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        players: {
            type: Array,
            default: () => []
        },
        homeLogo: {
            type: String,
            default: ''
        },
        awayLogo: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            datas: []
        }
    },
    computed: {
        ...mapState('competition', ['basketBallPlayers']),
        homePlayers () {
            return this.basketBallPlayers.home.reduce((all, player) => {
                if (!all[player.playerId]) {
                    all[player.playerId] = player.number
                }
                return all
            }, {})
        },
        awayPlayers () {
            return this.basketBallPlayers.away.reduce((all, player) => {
                if (!all[player.playerId]) {
                    all[player.playerId] = player.number
                }
                return all
            }, {})
        }
    },
    created () {
        // this.init()
    },
    methods: {
        async init () {
            try {
                const { data, code } = await getMatchBasketball(this.matchId)
                if (code === statusCode.success && data) {
                    this.handleData(data)
                }
            } catch (e) {
                console.log(e, '错了')
            }
        },
        handleData (data) {
            const teams = ['home', 'away']
            let homeData, awayData
            teams.forEach(key => {
                const params = {
                    name: data[`${key}TeamCn`],
                    score: data[`${key}Score`],
                    logo: this[`${key}Logo`],
                    players: data[`${key}PlayerList`]
                }
                if (key === 'home') {
                    homeData = { ...params }
                } else {
                    awayData = { ...params }
                }
            })
            this.datas = [homeData, awayData]
        },
        summaryColumn ({ columns, data }) {
            const sums = []
            const needHandleProperty = {
                'rebound': ['offensiveRebound', 'defensiveRebound'],
                'shoot': ['shootHit', 'shoot'],
                'threePoint': ['threePointHit', 'threePointShoot'],
                'freeThrow': ['freeThrowHit', 'freeThrowShoot']
            }
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '全队'
                    return
                }
                if ([1, 2].includes(index)) {
                    sums[index] = ''
                    return
                }
                const property = column.property
                if (!needHandleProperty[property]) {
                    // 其他正常处理
                    const values = data.map(item => Number(item[property]))
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr)
                            if (!isNaN(value)) {
                                return prev + curr
                            } else {
                                return prev
                            }
                        }, 0)
                    } else {
                        sums[index] = 'N/A'
                    }
                    if (property === 'playtime') {
                        sums[index] += "'"
                    }
                } else {
                    // 单独处理
                    if (property === 'rebound') {
                        sums[index] = this.handleRebound(property, data, needHandleProperty.rebound)
                    } else {
                        sums[index] = this.handleOthers(property, data, needHandleProperty[property])
                    }
                }
            })
            return sums
        },
        handleOthers (property, data, keys) {
            const res = data.reduce((sum, item) => {
                const prev = Number(item[keys[0]])
                const next = Number(item[keys[1]])
                sum.prev += Number(prev)
                sum.next += Number(next)
                return sum
            }, { prev: 0, next: 0 })
            return `${res.prev}/${res.next}`
        },
        handleRebound (property, data, keys) {
            return data.reduce((sum, item) => {
                const prev = Number(item[keys[0]])
                const next = Number(item[keys[1]])
                sum += prev + next
                return sum
            }, 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #D8D8D8;
  }
}
</style>
