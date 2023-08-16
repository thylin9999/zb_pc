<template>
    <div>
      <div class="row flex ">
        <div class="label font-14 text-999 font-400">
          <span>选择赛事</span>
        </div>
        <div class="row-content p-t-10 font-14 font-400 text-333">
          <span class="label-btn pointer  p-l-20 p-r-20 font-14 font-500 text-orange">{{ this.isFootball ? '足球' : '篮球'}}</span>
          <div class="solution m-t-15 flex ">
            <div class="left-team table-right-border flex align-center flex-column justify-center">
              <span>{{ matchInfo.leagueChsShort }}</span>
              <span>{{ matchInfo.matchTime }}</span>
              <div class="team w-100 flex align-center justify-center">
                <div class="home flex align-center">
                  <span class="tag d-inline-block">[主]</span>
                  <custom-span class="name" :content=" matchInfo.homeChs" />
<!--                  <span class="">{{ matchInfo.homeChs }}</span>-->
                </div>
                <span>vs</span>
                <div class="away flex align-center">
<!--                  <span class="">{{ matchInfo.awayChs }}</span>-->
                    <custom-span class="name" :content=" matchInfo.awayChs" />
                  <span class="tag d-inline-block">[客]</span>

                </div>
              </div>

            </div>
            <div class="right-rate flex-1 flex flex-column align-center ">
              <span class="w-100 text-center d-inline-block table-bottom-border">{{ playObj.label }}</span>
              <div class="flex w-100 text-center rate-list">
                  <template v-for="(key, index) in playObj.keys">
                      <span
                              class="flex-1 pointer table-right-border"
                              v-if="key !== 'init_odds'"
                              :key="key"
                              :class="{
                      'is-active': index === rateIndex
                    }"
                      >
                      <custom-span :content="`${playObj.labels[index]}${matchInfo[playObj.value][key]}`"/>
                  </span>
                  </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input-with-error
          class="m-b-20 m-t-20"
          showLabel
          :label="form.title.label"
          :error-info="errorInfo.title"
          :row-info.sync="form.title"
          @validate="validateRow"
          :key="form.title.updateKey"
      />
      <textarea-with-error
          class="m-b-20 m-t-25"
          showLabel
          :label="form.description.label"
          :error-info="errorInfo.description"
          :row-info.sync="form.description"
          @validate="validateRow"
          :key="form.description.updateKey"
      />
      <div class="row flex ">
        <div class="label font-14 text-999 font-400">
          <span>方案售价</span>
        </div>
        <div class="price-content">
          <template
              v-for="price in prices"
          >
            <span
                :key="price.id"
                class="price-item p-l-10 p-r-10 pointer  m-b-10"
                :class="{
                  'm-r-10': price.value > 0,
                  'is-active': price.id === currentPrice
                }"
                @click="chosePrice(price)"
            >{{ price.value > 0 ? price.showValue : '免费'}}</span>
          </template>
        </div>
      </div>
      <div class="row-outer flex p-t-30 p-l-30  m-b-20">
        <div class="save-button font-medium font-16 overflow-hidden">
          <ConfirmButton class="w-100 h-100 d-inline-block w-100 text-center  font-medium font-16" title="发布" @click.native="submit"/>
        </div>
      </div>
    </div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import TextareaWithError from '@/components/Form/TextareaWithError'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire } from '@/utils/validator'
import omit from 'lodash.omit'
import isEmpty from 'lodash.isempty'
import { releaseSolutions, getPlanPrices } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import CustomSpan from '@/components/CustomSpan.vue'
export default {
    name: 'Solution2',
    props: {
        selectInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        CustomSpan,
        InputWithError,
        TextareaWithError,
        ConfirmButton
    },
    data () {
        return {
            form: {
                title: {
                    label: '方案标题',
                    value: '',
                    key: 'title',
                    validators: [isRequire('方案标题')],
                    validateLabel: ['isRequire'],
                    updateKey: 'title-false'
                },
                description: {
                    label: '推荐理由',
                    value: '',
                    key: 'description',
                    validators: [isRequire('推荐理由')],
                    validateLabel: ['isRequire'],
                    updateKey: 'description-false'
                }
            },
            errorInfo: {
                title: {},
                description: {}
            },
            selectIds: [],
            currentPrice: 9,
            prices: []
        }
    },
    computed: {
        matchInfo () {
            return this.selectInfo.match
        },
        selectId () {
            return this.selectInfo.id
        },
        isFootball () {
            return this.matchInfo.leagueType === 1
        },
        play () {
            return `${this.matchInfo.leagueType}${this.selectIds[2]}`
        },
        rateIndex () {
            return this.selectIds[3] - 1
        },
        playKeys () {
            const keys = this.isFootball ? [
                {
                    keys: ['init_home_win_odds', 'init_tie_odds', 'init_away_win_odds'],
                    labels: ['主胜', '平', '客胜'],
                    value: 'odds_europe',
                    label: '胜负平'
                },
                {
                    keys: ['init_home_odds', 'init_odds', 'init_away_odds'],
                    labels: ['主胜', '让1', '客胜'],
                    value: 'odds_handicap',
                    label: '让球'
                },
                {
                    keys: ['init_over_odds', 'init_odds', 'init_under_odds'],
                    labels: ['大', '1/1.5', '小'],
                    value: 'odds_over_under',
                    label: '大小'
                }
            ]
                : [
                    {
                        keys: ['init_home_win_odds', 'init_away_win_odds'],
                        labels: ['主胜', '客胜'],
                        value: 'odds_moneyline',
                        label: '胜平'
                    },
                    {
                        keys: ['init_home_odds', 'init_odds', 'init_away_odds'],
                        labels: ['主胜', '让1', '客胜'],
                        value: 'odds_spread',
                        label: '让分'
                    },
                    {
                        keys: ['init_over_odds', 'init_odds', 'init_under_odds'],
                        labels: ['大', '1/1.5', '小'],
                        value: 'odds_total',
                        label: '大小'
                    }
                ]
            return keys
        },
        playObj () {
            return this.playKeys[this.selectIds[2] - 1]
        },
        currentCoin () {
            return this.prices.find(x => x.id === this.currentPrice)
        }
    },
    created () {
        this.initPrices()
        this.handleSelectId()
    },
    methods: {
        async initPrices () {
            try {
                const { code, data } = await getPlanPrices()
                if (code === statusCode.success) {
                    this.prices = data.reduce((all, item, index) => {
                        const unit = item.type === 1 ? '球币' : '球票'
                        all.push({
                            ...item,
                            id: index,
                            value: item.price,
                            showValue: item.price + unit
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        handleSelectId () {
            this.selectIds = this.selectId.split('@')
        },
        validate () {
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
            })
            return res.every(x => x)
        },
        validateRow (key) {
            console.log('key', key)
            this.form[key].validators.forEach(validator => {
                const { message, type } = validator(this.form[key].value)
                if (message) {
                    this.errorInfo[key][type] = message
                } else {
                    this.errorInfo[key] = omit(this.errorInfo[key], type, message)
                }
            })
            this.changeKey(key)
            return isEmpty(this.errorInfo[key])
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        async submit () {
            const isValidate = this.validate()
            if (isValidate) {
                const params = this.finalData()
                const { code, msg } = await releaseSolutions(params)
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.$router.push({
                        name: 'ExpertCenter',
                        params: {
                            tabId: 3
                        }
                    })
                } else {
                    Message.error(msg)
                }
            }
        },
        finalData () {
            const oddsLabel = this.playObj.labels[this.rateIndex]
            return {
                play: this.play,
                odds: oddsLabel + this.matchInfo[this.playObj.value][this.playObj.keys[this.rateIndex]],
                type: this.matchInfo.leagueType,
                match_id: this.matchInfo.matchId,
                league_id: this.matchInfo.leagueId,
                title: this.form.title.value,
                recommend: this.form.description.value,
                coin: this.currentCoin && this.currentCoin.value,
                sales_type: this.currentCoin.type
            }
        },
        chosePrice (price) {
            this.currentPrice = price.id
        }
    }
}

</script>

<style lang="scss" scoped>
.row {
  .row-content {
    width: 480px;
  }
  .label {
    width: 100px;
  }
  .label-btn {
    border: 1px solid #409eff;
    border-radius: 5px;
    line-height: 25px;

    &:hover {
      color: #fff;
      background-color: #409eff;
    }
  }
  .solution {
    background-color: #FFFCFA;
    border: 1px solid #D8D8D8;
    border-radius: 10px;
    .left-team {
      width: 220px;
      line-height: 25px;
      .name {
        max-width: 70px;
      }
    }
    .right-rate {
      line-height: 50px;
      .rate-list {
        span {
          &:hover, &.is-active {
            background-color: #409eff;
            color: #fff;
          }
        }
      }
    }
    .tag {
      transform: scale(0.7);
      transform-origin: left bottom;
    }
    .home {
      .tag {
        transform-origin: right bottom;
      }
    }
  }

  .price-item {
    display: inline-block;
    //min-width: 70px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999999;
    border: 1px solid #d8d8d8;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    &:hover, &.is-active {
      background-color: #409eff;
      color: #fff;
    }
  }
}

::v-deep {
  .row {
    .label {
      width: 100px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 40px;
    }
    .error {
      left: 100px!important;
    }
  }
  .input-section, .input {
    max-width: 480px;
    background-color: #fff;
    .el-input__inner {
      line-height: 40px;
      height: 40px;
      border: 1px solid #D8D8D8!important;
    }
    .el-textarea__inner {
      border: 1px solid #D8D8D8!important;
    }
  }

  .row-outer {
    .el-input__inner {
      line-height: 40px;
      height: 40px;
    }
    .save-button {
      margin-left: 70px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      font-size: 16px;
      .confirm {
        background: #A05A77;

      }
    }
  }
}
</style>
