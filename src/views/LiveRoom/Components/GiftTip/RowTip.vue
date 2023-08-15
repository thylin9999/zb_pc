<template>
<div class="row-gift-tip p-absolute flex align-center justify-between">
    <span class="avatar p-absolute flex align-center justify-center">
        <span class="d-inline-block border-radius-50 overflow-hidden bg-center bg-no-repeat bg-size-cover"
            :style="{
                backgroundImage: `url(${gift.avatar})`
            }"
        ></span>
    </span>
    <div class="name flex flex-column ">
        <div class="font-12 flex align-center  font-500   text-white">
            <custom-span class="font-12 d-inline-block w-100 nickname font-500 text-white" :content="gift.nickname" />
            <span>送出</span>
        </div>
        <span class="font-14 font-500 gift-name">{{ gift.gift_name }}</span>
    </div>
    <div class="svga-animations p-absolute">
        <Gift
            show-percent
            :gift-id="giftId"
            :url="gift.animation"
            :img="gift.img"
            @stop="stopAnimation"
        />
    </div>
</div>
</template>
<script>
import Gift from '@/views/LiveRoom/Components/Gift.vue'
import CustomSpan from '@/components/CustomSpan.vue'
export default {
    name: 'RowTip',
    components: {
        Gift,
        CustomSpan
    },
    props: {
        gift: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        giftId () {
            return this.gift.msgId
        }
    },
    methods: {
        stopAnimation () {
            this.$emit('stop', { msg: this.gift, animateInfo: this.gift.animateInfo || {} })
        }
    }

}
</script>

<style scoped lang="scss">
.row-gift-tip {
  width: 255px;
  height: 85px;
  background-image: url('../../../../assets/images/gift/row-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .avatar {
      left: 11px;
      top: 14px;
      width: 57px;
      height: 57px;
      position: absolute;
      background-image: url('../../../../assets/images/gift/gift-circle.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      span {
          width: 51px;
          height: 51px;
      }
  }
  .name {
    margin-left: 85px;
      width: 120px;
      .nickname {
          width: 80px;
      }
    .gift-name {
      line-height: 20px;
      background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .svga-animations{
    width:75px;
    height:75px;
    right: -30px;
  }
}
::v-deep {
    .gift-item {
        width:75px;
        height:75px;
    }
}
</style>
