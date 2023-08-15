<template>
<div class="gift-item w-100 h-100">
    <el-popover
        placement="top-start"
        popper-class="gift-popover"
        width="245"
        :visible-arrow="false"
        trigger="hover"
        @show="showAnimation"
    >
        <div class="content p-t-10 flex align-center justify-between p-b-15 p-l-20 p-r-10">
          <div class="flex align-center">
              <div class="img" >
                  <gift v-if="show"
                        :url="gift.animation"
                        :img="gift.img"
                        :gift-id="gift.id" />
              </div>
              <div class="info m-l-10 flex flex-column">
                  <div class="name">
                      <span class="font-12 text-333 font-600">{{ gift.name}}</span>
                      <span class="price font-12 m-l-5 font-500 d-inline-block scale-9">{{ gift.amount }} {{ unit}}</span>
                  </div>
                  <div class="description">
                      <span class="font-12 font-400 text-333">{{ gift.remark }}</span>
                  </div>
              </div>
          </div>
          <span class="btn font-12 text-white font-500 text-center pointer d-inline-block"
                @click="giveGift"
          >赠送</span>
        </div>
        <div slot="reference" class="w-100 h-100 show-img" :class="{
            'is-hot': isHot
        }">
          <img  class="w-100 h-100 "  :src="gift.img" alt="">
        </div>
    </el-popover>
</div>
</template>
<script>
import Gift from '@/views/LiveRoom/Components/Gift.vue'
import { mapState, mapGetters } from 'vuex'
export default {
    name: 'GiftCard',
    components: {
        Gift
    },
    props: {
        gift: {
            type: Object,
            default: () => ({})
        },
        isHot: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            show: false
        }
    },
    computed: {
        ...mapState('user', ['token', 'ball_coin', 'ball_ticket']),
        ...mapGetters('user', ['isLoginMode']),
        unit () {
            return this.gift.sales_type === 1 ? '球币' : '球票'
        },
        userCoin () {
            return this.gift.sales_type === 1 ? this.ball_coin : this.ball_ticket
        }
    },
    methods: {
        // giveGift: debounce(function () {
        //     if (!this.isLoginMode) {
        //         this.openLoginDialogMixin()
        //     } else {
        //     // 判断球币是否足够
        //         if (this.userCoin >= this.gift.amount) {
        //             this.$emit('charge')
        //         } else {
        //             this.setGiftLogin(true)
        //         }
        //     }
        // }, 200),
        giveGift () {
            if (!this.isLoginMode) {
                this.openLoginDialogMixin()
            } else {
            // 判断球币是否足够
                if (this.userCoin >= this.gift.amount) {
                    this.$emit('charge')
                } else {
                    this.setGiftLogin(true, this.unit)
                }
            }
        },
        showAnimation () {
            this.show = true
        }
    }

}
</script>

<style scoped lang="scss">
.show-img{
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #FBA187;
  &.is-hot {
    &:before {
      content: '';
      position: absolute;
      left: -3px;
      top: -5px;
      background-image: url('../../../assets/images/gift/hot-flag.png');
      width: 30px;
      height: 15px;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
.content {
    .img {
        width: 50px;
        height: 50px;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #FBA187;
    }
  .price {
    color: #FBA187;
  }
  .btn {
    width: 50px;
    height: 20px;
    line-height: 20px;
    background: #A05A77;
    border-radius: 10px;
  }
}
</style>
