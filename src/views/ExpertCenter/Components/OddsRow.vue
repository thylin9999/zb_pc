<template>
  <div class="list w-100">
    <div class="row-header w-100 p-t-15 p-b-15 flex justify-between">
      <div>
        <span class="text-333 font-14">{{ date.week }} {{ date.id }}</span>
        <span class="text-999 font-400 m-l-10">共{{ count }}场比赛</span>
      </div>
      <div class="filter p-t-5 p-b-5">
          <LeagueSelect
              :league-type="type"
              :leagues.sync="leagues"
              :day="date.id"
              @updateLeagues="fetchData"
              is-odds
          />
      </div>
    </div>
    <div class="row-content"
      :class="{
        'has-border': list.length,
        'no-competition': !list.length
      }"
     v-loading="isLoading"
     element-loading-background="transparent"
    >
      <template v-if="list.length">
        <OddRow
            v-for="item in list"
            :key="item.id"
            :info="item"
            :date="date"
            :select-id="selectId"
            :league-type="type"
            @setId="choseRate"
        />
      </template>
      <NoData v-if="!list.length && !isLoading" />
    </div>

  </div>
</template>

<script>
import { getCompetitionWithOdds } from '@/api/competition/competition'
import dayjs from 'dayjs'
import { weekDay } from '@/utils/utils'
import { statusCode } from '@/utils/statusCode'
import OddRow from '@/views/ExpertCenter/Components/OddRow'
import NoData from '@/components/NoData'
import LeagueSelect from '@/views/Score/components/LeagueSelect.vue'
export default {
    name: 'OddsRow',
    components: {
        LeagueSelect,
        OddRow,
        NoData
    },
    props: {
        date: {
            type: Object,
            default: () => ({
                id: dayjs().format('YYYY-MM-DD'),
                week: weekDay[dayjs.day()]
            })
        },
        type: {
            type: [Number, String],
            default: 1
        },
        selectId: {
            type: String,
            default: null
        }

    },
    data () {
        return {
            isLoading: false,
            list: [],
            leagueId: null,
            leagues: []
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        apiParams () {
            const leagueIds = this.leagues.join(',')
            return {
                date: this.date.id,
                type: this.type,
                leagueId: leagueIds,
                pageSize: 2000,
                pageNum: 1
            }
        },
        count () {
            return this.list.length || 0
        }
    },
    watch: {
        type: {
            handler () {
                this.fetchData()
            }
        }
    },
    methods: {
        changeValue () {
            this.fetchData()
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getCompetitionWithOdds(this.apiParams)
                if (code === statusCode.success) {
                    this.list = data.list.reduce((all, item) => {
                        all.push({
                            ...item,
                            isSelect: item.id === this.selectId,
                            time: item.matchTime.slice(-8),
                            battle: item.homeChs + 'vs' + item.awayChs
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.isLoading = false
            }
        },
        choseRate ({ id, play, odds, match }) {
            this.$emit('update:selectId', id)
            this.$emit('choseRate', {
                id,
                match
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.list {
  .row-content {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    line-height: 40px;

    &.has-border {
      border: 1px solid #D8D8D8;
    }
    &.no-competition{
      min-height: 200px;
    }
    &:last-child {
      border-bottom: none;
    }
    .row {
      border-radius: 0;
      line-height: 40px;
    }
  }
}
.filter {
  background: #FFFFFF;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.13);
  border-radius: 3px;
}
</style>
