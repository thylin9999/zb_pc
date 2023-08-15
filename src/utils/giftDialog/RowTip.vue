<template>
<div class="row-gift-tip p-absolute flex align-center justify-between"
     :style="style"
     :ref="ref"
>
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
/* eslint-disable ,no-undef */
import Gift from '@/views/LiveRoom/Components/Gift.vue'
import CustomSpan from '@/components/CustomSpan.vue'
export default {
    name: 'RowTip',
    components: {
        Gift,
        CustomSpan
    },
    data () {
        return {
            gift: {},
            indexCount: 1,
            show: false,
            position: {
                left: -300,
                top: 0
            },
            left: {
                value: -300
            },
            top: {
                value: 0
            },
            tween: null,
            isEntering: false,
            isToping: false,
            topIndex: 0
        }
    },
    computed: {
        giftId () {
            return this.gift.msgId
        },
        ref () {
            return `ref${this.giftId}`
        },
        style () {
            return {
                left: this.left.value + 'px',
                top: this.top.value + 'px'
            }
        }
    },
    mounted () {
        this.animate()
    },
    methods: {
        animate () {
            requestAnimationFrame(this.animate)
            TWEEN.update() // 这里将是tweenJs动画能否运行的关键
        },
        enter () {
            this.tween = new TWEEN.Tween(this.left)
                .to({
                    value: 0
                }, 500)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.isEntering = true
                })
                .onComplete(() => {
                    this.isEntering = false
                    this.tween.stop()
                    if (this.isToping) {
                        this.startToTop()
                    }
                }).start()
        },
        toTop (index) { // 从下到上滚动
            this.isToping = true
            this.topIndex = index
            if (!this.isEntering) { // 没有进入的动画，那么就直接进入
                this.startToTop()
            }
        },
        startToTop () {
            const tween = new TWEEN.Tween(this.top)
                .to({
                    value: this.topIndex * 90
                }, 300)
                .easing(TWEEN.Easing.Linear.None).onComplete(() => {
                    tween.stop()
                    // 开始下一个了啊啊 啊啊啊
                })
                .onComplete(() => {
                    this.isToping = false
                    this.topIndex = 0
                })
                .start()
        },
        stopAnimation () { // 回程
            // 当前只是删除了弹框
            new TWEEN.Tween(this.left)
                .to({
                    value: -300
                }, 300)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    this.close()
                }).start()
        },
        close () {
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
            this.userClose()
        }
    }

}
</script>

<style scoped lang="scss">
.row-gift-tip {
  width: 255px;
  height: 85px;
  background-image: url('../../assets/images/gift/row-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .avatar {
      left: 11px;
      top: 14px;
      width: 57px;
      height: 57px;
      position: absolute;
      background-image: url('../../assets/images/gift/gift-circle.png');
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
