<template>
  <el-dialog
      :visible="showChargeDialog"
      custom-class="charge-dialog"
      append-to-body
      destroy-on-close
      lock-scroll
      close-on-click-modal
      close-on-press-escape
      :show-close="false"
      width="750"
      @close="close"
  >
    <div class="text-center p-relative" slot="title">
      <span class="font-14 text-333 font-500 lh-20">球币购买</span>
      <span class="p-absolute other-coin font-14 pointer text-999 lh-20 font-500"
        @click="choseInput"
            :class="{
              'opacity-7 events-none visibility-hidden': !firstStep
            }"
      >其他金额</span>
    </div>
    <div class="body p-t-15">
      <template v-if="showPays">
        <div class="justify-around w-100 pay-method flex align-center"
             :class="{
          'opacity-7 events-none': !firstStep
        }"
        >
          <template
              v-for="pay in  pays"
          >
            <div v-if="pay.show" class="card  pointer flex align-center justify-center"
                 :class="{
                            [`${pay.className}`]: true,
                            'is-active': pay.isSelect
                        }"
                 :key="pay.id"
                 :style="{
                            border: `1px solid ${pay.color}`
                        }"
                 @click="chose(pay)"
            >
              <!-- <icon-png :width="20" :height="20" :icon="pay.icon" /> -->
              <span class="icon d-inline-block"></span>
              <span class="font-14 font-400 text">{{ pay.title }}</span>
            </div>
          </template>
        </div>
        <template v-if="firstStep">
          <div class="flex p-t-20 flex-wrap align-center" :key="updateKey">
            <template
                v-for="coin in coins"
            >
              <wallet-card
                  :key="coin.id"
                  class="m-r-30 m-b-15 wallet-card"
                  small-card
                  :radio="radio"
                  :is-input="coin.isInput"
                  :value.sync="coin.value"
                  :is-select="coin.isSelect"
                  :coin="coin"
                  @updateCard="updateCard(coin)"
              />
            </template>

          </div>

        </template>
        <template v-else>
          <div class="pay-content flex justify-between align-center m-t-15">
            <div class="w-100 m-t-15 m-b-20 p-r-30 flex flex-column" v-if="payWay.key === 'bank'">
              <div class="row flex align-center ">
                <span class="label font-14 text-999">汇款人姓名:</span>
                <el-input class="flex-1" v-model="name"/>
              </div>
              <span class="font-12 error">注：2次汇款人姓名必须需一致，否则支付失败！</span>
              <div class="row flex m-t-15 align-center ">
                <span class="label  font-14 text-999">支付金额:</span>
                <el-input class="flex-1" readonly v-model="showValue"/>
              </div>

            </div>
            <template v-else>
              <div class="flex flex-column justify-center">
                <span class="font-14 text-333 font-500">请使用{{ payWay.payMethod}}扫码</span>
                <div class="m-t-10 ">
                  <span class="font-12 text-333 font-400">支付金额:</span>
                  <span v-if="selectCoin" class="font-14 p-l-5 font-500 pay-value">￥ {{ showValue  }}</span>
                </div>
              </div>
              <div class="code m-r-15">

              </div>
            </template>

          </div>
          <div class="procotol p-t-5">
            <el-checkbox v-model="agreeUs">
              <span class="font-14 font-400 text-999">我已阅读且同意</span>
              <span class="font-14 font-400 link" @click.prevent="viewProtocol">《看球购买服务协议》</span>
            </el-checkbox>
          </div>
          <ProtocolPopup :value.sync="showProtocol" :id="23"/>
        </template>
        <div class="m-t-30 flex text-center flex-end font-12 font-400 text-white footer">
          <template v-if="firstStep">
            <span class="cancel pointer" @click="close">取消</span>
            <span  class="m-l-15 confirm pointer" @click="nextStep">立即购买</span>
          </template>
          <template v-else>
            <span class="cancel pointer" @click="back">上一步</span>
            <span  class="m-l-15 confirm pointer" @click="initPayUrl"
                   :class="{
                 'is-disabled opacity-7 not-allowed': !name.length && payWay.key === 'bank'
              }"
            >立即支付</span>
          </template>
        </div>
      </template>
      <template v-else>
        <no-data>
          <div class="w-100 p-t-30 p-b-30 text-center">暂无支付渠道</div>
        </no-data>
      </template>

    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getRechargeList, getRechargeResult, getRechargeUrl } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import WalletCard from '@/views/PersonalCenter/Components/WalletCard'
import ProtocolPopup from '@/components/ProtocolPopup.vue'
import { Message } from 'element-ui'
import { LoopTool } from '@/utils/loop'
import NoData from '@/components/NoData'
export default {
    name: 'ChargeDialog',
    components: {
        WalletCard,
        ProtocolPopup,
        NoData
    },
    data () {
        return {
            pays: [
                {
                    id: 2,
                    icon: 'expert/wechat',
                    title: '微信支付',
                    payMethod: '微信',
                    color: '#28B836',
                    key: 'weixin',
                    className: 'wechat',
                    isSelect: false,
                    show: false
                },
                // {
                //     id: 1,
                //     icon: 'expert/alipay',
                //     title: '支付宝支付',
                //     payMethod: '支付宝',
                //     key: 'alipay',
                //     color: '#00A3FE',
                //     className: 'alipay',
                //     isSelect: false,
                //     show: false
                // },
                {
                    id: 3,
                    icon: 'expert/union',
                    title: '银联支付',
                    key: 'bank',
                    color: '#269B90',
                    className: 'union',
                    isSelect: false,
                    show: false
                }
            ],
            payList: [],
            coins: [],
            updateKey: +new Date().getTime(),
            radio: 10, // 默认兑换比例,后台可配置
            firstStep: true,
            agreeUs: true,
            showProtocol: false,
            showBtn: false,
            name: '',
            orderNo: '',
            loop: null
        }
    },
    computed: {
        ...mapState('modal', ['showChargeDialog']),
        payWay () {
            return this.pays.find(x => x.isSelect)
        },
        selectCoin () {
            return this.coins.find(x => x.isSelect)
        },
        showValue () {
            return this.selectCoin ? this.selectCoin.value : 0
        },
        trackPay () {
            return {
                coin: this.selectCoin,
                payWay: this.payWay
            }
        },
        showPays () {
            return this.pays.some(x => x.show)
        }

    },
    watch: {
        trackPay: {
            handler () {
                this.showBtn = !!(this.payWay && this.selectCoin)
            },
            immediate: true,
            deep: true
        },
        showChargeDialog: {
            handler () {
                if (this.showChargeDialog) {
                    this.init()
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions('modal', ['changePopup']),
        choseInput () {
            // this.coins.forEach(x => {
            //     x.isSelect = false
            //     if (x.id === 'input') {
            //         x.isSelect = true
            //     }
            // })
            this.changePopup({
                showChargeDialog: false
            })
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 11
                }
            })
        },
        back () {
            this.firstStep = true
        },
        nextStep () {
            if (this.showBtn) {
                this.firstStep = false
            }
        },
        async init () {
            try {
                const { code, data } = await getRechargeList()
                if (code === statusCode.success) {
                    this.payList = data.list
                    this.radio = data.radio
                    this.handleDefault()
                    if (this.showPays) {
                        this.handleShowCoins()
                    }
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        close () {
            this.changePopup({
                showChargeDialog: false
            })
        },
        chose (pay) {
            this.showTip = false
            this.pays.forEach(item => {
                item.isSelect = item.id === pay.id
            })
            this.handleShowCoins()
        },
        // 默认值的问题
        handleDefault () {
            let count = 0
            this.pays.forEach((item, index) => {
                const pay = this.payList.find(x => x.pay_channel === item.key)
                if (pay) {
                    item.show = true
                    if (count === 0) {
                        item.isSelect = true
                        count++
                    }
                }
            })
            // 默认第一个选中
        },
        handleShowCoins () {
            const pay = this.payList.find(x => x.pay_channel === this.payWay.key)
            const coins = pay.list.reduce((all, item, index) => {
                all.push({
                    ...item,
                    id: index,
                    isSelect: false,
                    value: item.amount
                })
                return all
            }, [])
            coins.push({
                id: 'input',
                value: 0,
                isSelect: false,
                isInput: true,
                min: pay.min,
                max: pay.max
            })
            this.coins = coins.slice(0, 6)
            // this.coins = [].concat(coins, [{
            //     id: 'input',
            //     value: 0,
            //     isSelect: false,
            //     isInput: true,
            //     min: pay.min,
            //     max: pay.max
            // }])
            this.updateKey = +new Date().getTime()
        },
        async initPayUrl () {
            if (!this.name.length && this.payWay.key === 'bank') {
                if (!this.showTip) {
                    this.showTip = true
                    Message.info('请填写汇款人姓名！')
                }
                return
            }
            try {
                const res = await getRechargeUrl({
                    payWay: this.payWay.key,
                    amount: this.selectCoin.value,
                    realName: this.name
                })
                if (res.code === statusCode.success) {
                    this.orderNo = res.data.order_no
                    this.loop = new LoopTool(this.startQueryOrder, 5000, false)
                } else {
                    Message.info(res.msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async startQueryOrder () {
            try {
                const { code } = await getRechargeResult(this.orderNo)
                if (code === statusCode.success) {
                    // Message.success(msg)
                    this.loop.stop()
                    // 跳转充值列表
                    // this.$emit('refresh')
                } else {
                    // 没有成功，就继续
                    this.loop.loop()
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        updateCard (card) {
            this.coins.forEach(item => {
                item.isSelect = item.id === card.id
            })
        },
        viewProtocol () {
            this.showProtocol = true
        }
    }
}
</script>

<style lang="scss" scoped>
.other-coin {
  right: 0;
  top: 1px;
}
.body {
  border-top: 1px solid #D8D8D8;
}

.pay-method {
  .card {
    width: 180px;
    height: 40px;
    border-radius: 5px;
    span {
      line-height: 20px;
    }
    .icon {
      margin-right: 2px;
      width: 20px;
      height: 20px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .wechat {
    color: #28B836;
    .icon {
      background-image: url('../assets/images/expert/wechat.png');
    }
    &:hover, &.is-active {
      background-color: #28B836;
      color: #fff;
      .icon {
        background-image: url('../assets/images/expert/wechat_h.png');
      }
    }
  }
  .alipay {
    color: #00A3FE;
    .icon {
      background-image: url('../assets/images/expert/alipay.png');
    }
    &:hover , &.is-active{
      color: #fff;
      background-color: #00A3FE;
      .icon {
        background-image: url('../assets/images/expert/alipay_h.png');
      }
    }
  }
  .union {
    color: #269B90;
    .icon {
      background-image: url('../assets/images/expert/union.png');
    }
    &:hover, &.is-active {
      color: #fff;
      background-color: #269B90;
      .icon {
        background-image: url('../assets/images/expert/union_h.png');
      }
    }
  }
}
.wallet-card:nth-child(3n) {
  margin-right: 0!important;
}

.footer{
  span {
    width: 100px;
    line-height: 24px;
    border-radius: 18px;
    background-color: #d8d8d8;
    &.confirm, &:hover {
      background-color: #A05A77;
    }
  }
}

.pay-content {
  width: 100%;
  min-height: 124px;
  border-radius: 10px;
  border: 1px solid #D8D8D8;
  padding-left: 35px;
  .label {
    width: 100px;
    text-align: right;
    padding-right: 8px;
  }
  .pay-value{
    color: #409eff;
  }
  .code{
    width: 100px;
    height: 100px;
    border: 1px solid #D8D8D8;
  }
  .pay-btn {
    width: 120px;
    height: 40px;
    background: #A05A77;
    border-radius: 5px;
    line-height: 40px;
    &:hover {
      opacity: 0.7;
    }
  }
  .error {
    color: #fa0505;
    padding-left: 100px;
  }
}
.procotol {
  color: #BCBAD8;
  .link {
    color: #A05A77;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
