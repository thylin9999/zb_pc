<template>
<div class="page bg-white flex align-center justify-between p-r-20">
    <div class="left-box h-100 p-t-5 p-l-20">
      <el-popover
          placement="top-start"
          popper-class="box-popover"
          width="457"
          :visible-arrow="false"

      >
          <div class="w-100" slot="reference">
              <IconPng  icon="live-room/box" :width="85" :height="85" />
          </div>
          <div class="content p-t-30 w-100 h-100 p-10">
              <div class="p-t-30" v-if="isLoginMode">
                  <timing-box class="p-l-20 p-r-20" is-live size="middle" />
              </div>
              <div v-else class="w-100 not-login p-t-20">
                  <div class="w-100 h-100 flex align-center justify-center">
                      <div class="line"></div>
                      <div class="text font-12 font-400 text-999 m-l-10 m-r-10">登录即可领取免费礼物和球票</div>
                      <div class="line"></div>
                  </div>
                  <div class="btn w-100 text-center m-t-20">
                      <span class="login pointer font-12 font-400 text-white d-inline-block" @click="openLoginDialogMixin">立即登录</span>
                  </div>
              </div>
          </div>
      </el-popover>
    </div>
    <div class="right-gifts flex flex-column">
        <div class="w-100 flex align-center flex-end">
            <div class="hot-gifts">
                <ul class="w-100 flex align-center">
                    <li class="gift m-r-10"
                        v-for="gift in hotGifts"
                        :key="gift.id"
                    >
                        <gift-card :gift="gift" is-hot  @charge="charge(gift)"/>
                    </li>
                </ul>
            </div>
            <el-popover
                placement="top-end"
                popper-class="gift-popover other-gift"
                width="395"
                :visible-arrow="false"
            >
                <div class="gift-box">
                    <div class="title p-l-15 font-600 font-12 text-333 -t-10 p-b-10">礼物</div>
                    <div class="p-l-15 gift-list p-r-30 p-t-15">
                        <ul class="w-100 flex flex-wrap align-center">
                            <li class="gift m-r-10 m-b-10"
                                v-for="gift in leftGifts"
                                :key="gift.id"
                            >
                                <gift-card :gift="gift"
                                    @charge="charge(gift)"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <span slot="reference" class="up-icon pointer d-inline-block">
                <i class="el-icon-arrow-up font-12"></i>
            </span>
            </el-popover>
        </div>
        <div class="info p-t-10 w-100 flex align-center flex-end">
            <div class="qiu-bi flex align-center">
                <IconPng icon="wallet/qiu-coin" :width="20" :height="20" />
                <span class="font-12 text-333">球币： <span class="coin">{{ ball_coin }}</span></span>
            </div>
            <div class="qiu-bi flex align-center m-l-30">
                <IconPng icon="wallet/qiu-coin" :width="20" :height="20" />
                <span class="font-12 text-333">球票： <span class="coin">{{ ball_ticket }}</span></span>
            </div>
            <span class="recharge m-l-25 pointer text-center d-inline-block font-12 text-white font-400"
              @click="recharge"
            >充值</span>
        </div>
    </div>
</div>
</template>
<script>
import IconPng from '@/components/IconPng.vue'
import TimingBox from '@/components/TimingBox.vue'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { getGiftList, giveGift } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import GiftCard from '@/views/LiveRoom/Components/GiftCard.vue'
export default {
    name: 'Gifts',
    props: {
        anchorInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        IconPng,
        TimingBox,
        GiftCard
    },
    data () {
        return {
            hotGifts: [],
            leftGifts: []
        }
    },
    computed: {
        ...mapState('user', ['ball_coin', 'ball_ticket']),
        ...mapGetters('user', ['isLoginMode'])
    },
    created () {
        this.init()
    },
    methods: {
        ...mapActions('modal', ['changePopup']),
        ...mapMutations('user', ['SET']),
        async init () {
            try {
                const { code, data } = await getGiftList()
                if (code === statusCode.success) {
                    const res = data.reduce((all, item) => {
                        if (item.flag === 2) {
                            // 热门礼物
                            all.hot.push(item)
                        } else {
                            all.common.push(item)
                        }
                        return all
                    }, {
                        hot: [],
                        common: []
                    })
                    this.hotGifts = res.hot.sort((a, b) => a.sort - b.sort)
                    this.leftGifts = res.common.sort((a, b) => a.sort - b.sort)
                    this.SET({ giftList: data || [] })
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        recharge () {
            if (!this.isLoginMode) {
                this.openLoginDialogMixin()
            } else {
                // this.$router.push({
                //     name: 'PersonalCenter',
                //     params: {
                //         tabId: 11
                //     }
                // })
                this.changePopup({
                    showChargeDialog: true
                })
            }
        },
        async charge (gift) {
            try {
                const { code, data } = await giveGift({
                    giftId: gift.id,
                    ...this.anchorInfo
                })
                if (code === statusCode.success) {
                    this.SET({
                        ball_coin: data.ball_coin,
                        ball_ticket: data.ball_ticket
                    })
                }
            } catch (e) {
                console.log('出错了', e)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.page {
  height:100px;
  border-radius: 0 0 10px 10px;
  .left-box {
    width: 85px;
  }
}
.not-login{
    .login{
        width: 156px;
        height: 24px;
        line-height: 24px;
        background: #A05A77;
        border-radius: 19px;
    }
    .line {
        width: 80px;
        height: 1px;
        background-color: #D8D8D8;
    }
}
.gift-btn {
    width: 15px;
    height: 50px;
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #FBA187;
}
.right-gifts {
    .up-icon {
        width: 15px;
        height: 50px;
        line-height: 50px;
        background: #FFFFFF;
        border-radius: 10px;
        text-align: center;
        color: #FBA187;
        border: 1px solid #FBA187;
    }
    .hot-gifts {
        .gift {
            width: 50px;
            height: 50px;
            background: #D8D8D8;
            border-radius: 10px;
            border: 1px solid #FBA187;
            position: relative;
        }
    }
    .info {
        .recharge {
            width: 50px;
            height: 20px;
            line-height: 20px;
            background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
            border-radius: 10px;
        }
        .coin {
            color: #FBA187;
        }
    }
}
</style>
