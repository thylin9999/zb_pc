<template>
  <div
      class=" row bg-white font-14 text-999 font-400 text-center table-bottom-border"
  >
    <div class="competition-title battle-title table-right-border">{{ info.leagueChsShort }}</div>
    <div class="time competition-title table-right-border">{{ info.time }}</div>
    <div class="battle-info battle-item table-right-border">
      <CustomSpan class="w-100 overflow-hidden text-ellipsis" :content="info.battle "/>
    </div>
    <template
      v-for="(row, index) in rows"
    >
      <div
          class="battle-item "
          :class="[
              `item${index+1}`,
              index === rows.length - 1 ? '' :  'table-right-border'
          ]"
        :key="row.key">
        <div class="ul flex align-center ">
            <template v-for="(item, itemIndex) in row.keys">
                <div class="item pointer"
                     :key="item"
                     :class="[
                   itemIndex === row.keys.length -1 ? '' :  'table-right-border',
                   `${date.id}@${info.matchId}@${index+1}@${itemIndex+1}` === selectId ? 'is-active' : '',
                   row.value ? '' :'not-allowed',
                    index > 0 && itemIndex === 1 ? 'not-allowed' : ''
               ]"
                     @click="choseRate(row, row.key, item,index, itemIndex, `${date.id}@${info.matchId}@${index+1}@${itemIndex+1}`)"
                >{{ row.value ? row.value[item] : '-'}}
                </div>
            </template>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'

export default {
    name: 'OddRow',
    components: {
        CustomSpan
    },
    props: {
        date: {
            type: Object,
            default: () => ({})
        },
        info: {
            type: Object,
            default: () => ({})
        },
        selectId: {
            type: String,
            default: null
        },
        leagueType: {
            type: [Number, String],
            default: 1
        }
    },
    data () {
        return {

        }
    },
    computed: {
        isFootball () { // 足球
            return this.leagueType * 1 === 1
        },
        oddEuropeKeys () {
            return ['init_home_win_odds', 'init_tie_odds', 'init_away_win_odds']
        },
        oddsHandicapKeys () {
            return ['init_home_odds', 'init_odds', 'init_away_odds']
            // return ['init_home_odds', 'init_away_odds']
        },
        oddsOverUnderKeys () {
            return ['init_over_odds', 'init_odds', 'init_under_odds']
            // return ['init_over_odds', 'init_under_odds']
        },
        // 足球
        oddEurope () {
            return this.info && this.info.odds_europe
        },
        oddsHandicap () {
            return this.info && this.info.odds_handicap
        },
        oddsOverUnder () {
            return this.info && this.info.odds_over_under
        },
        rows () {
            return this.isFootball ? [
                {
                    key: 'oddEurope',
                    value: this.oddEurope,
                    keys: this.oddEuropeKeys
                },
                {
                    key: 'oddsHandicap',
                    value: this.oddsHandicap,
                    keys: this.oddsHandicapKeys
                },
                {
                    key: 'oddsOverUnder',
                    value: this.oddsOverUnder,
                    keys: this.oddsOverUnderKeys
                }]
                : [
                    {
                        key: 'oddsMoneyLine',
                        value: this.oddsMoneyLine,
                        keys: this.oddsMoneyLineKeys
                    },
                    {
                        key: 'oddsSpread',
                        value: this.oddsSpread,
                        keys: this.oddsSpreadKeys
                    },
                    {
                        key: 'oddsTotal',
                        value: this.oddsTotal,
                        keys: this.oddsTotalKeys
                    }
                ]
        },
        // 篮球
        oddsMoneyLineKeys () {
            return ['init_home_win_odds', 'init_away_win_odds']
        },
        oddsTotalKeys () {
            return ['init_over_odds', 'init_odds', 'init_under_odds']
            // return ['init_over_odds', 'init_under_odds']
        },
        oddsSpreadKeys () {
            return ['init_home_odds', 'init_odds', 'init_away_odds']
            // return ['init_home_odds', 'init_away_odds']
        },
        oddsMoneyLine () { //  胜负
            return this.info && this.info.odds_moneyline
        },
        oddsTotal () { // 大小
            return this.info && this.info.odds_total
        },
        oddsSpread () { // 让分
            return this.info && this.info.odds_spread
        }
    },
    methods: {
        choseRate (row, key, item, index, itemIndex, selectId) {
            if (!row.value) {
                return
            }
            // row 整条数据， key 某个 子项 item 子项里面的 具体方法
            this.$emit('setId', {
                id: selectId,
                play: `${this.leagueType}${index}`,
                odds: row.value[item],
                match: this.info
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  line-height: 30px;

  border-radius: 10px;
  overflow: hidden;
  background-color: #FFFCFA;
  .competition-title {
    width: 110px;
  }
  .battle-info {
    width: 175px;
    flex-shrink: 0;
  }
  .battle-item{
    flex: 1;
    .item {
      flex: 1;
      &:hover, &.is-active {
        background-color: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
