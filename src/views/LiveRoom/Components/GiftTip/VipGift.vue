<template>
  <div class="w-100 h-100 p-absolute overflow-hidden page flex align-center justify-center" :style="style">
      <div class="box">
          <gift v-if="show" :key="gift.id" show-percent
                :gift-id="gift.id" :url="gift.url"
                :img="gift.img"
                @stop="stopAnimation" />
      </div>
  </div>
</template>
<script>
/* eslint-disable ,no-undef */
import Gift from '@/views/LiveRoom/Components/Gift'
import { useTip } from '@/utils/msgDialog'
export default {
    name: 'VipGift',
    components: {
        Gift
    },
    data () {
        return {
            gift: null,
            pageHeight: 0,
            show: false, // gift
            hide: true
        }
    },
    computed: {
        style () {
            return {
                height: this.hide ? 0 : this.pageHeight + 'px'
            }
        }
    },
    mounted () {
        const el = document.getElementById('chatRef')
        useTip.init({ vipCb: this.startAnimation })
        this.$nextTick(() => {
            this.pageHeight = el.offsetHeight
        })
    },
    methods: {
        emptyRow () {
            this.hide = true
        },
        stopAnimation (id) {
            this.show = false
            useTip.removeVipItem(this.emptyRow)
        },
        startAnimation (msg) {
            console.log(msg, 'asdf')
            this.hide = false
            this.gift = {
                id: msg.msgId,
                url: msg.giftUrl,
                img: msg.img
            }
            this.show = true
        }
    }
}
</script>

<style scoped lang="scss">
.page {
  left:0;
  top: 0;
  z-index: 6;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.box {
  width: 330px;
  height: 330px;
}
::v-deep {
  .gift-item {
    width:330px;
    height:330px;
  }
}
</style>
