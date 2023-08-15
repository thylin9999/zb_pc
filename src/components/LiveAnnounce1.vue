<template>
  <div class="test-box p-relative  w-100 h-100 overflow-hidden flex align-center">
      <div class="clock ">
          <img  :src="trumpet" width="14" height="14" alt="">
      </div>
     <div class="flex-1 running-box overflow-hidden p-relative">
         <div class="test p-absolute font-14 text-333 flex align-center" ref="domRef"
              @mouseenter="stopAnimation"
              @mouseout="continueAnimation"
         >
             {{ currentAnnounce ? currentAnnounce.content : '' }}
         </div>
     </div>
  </div>
</template>

<script>
/* eslint-disable ,no-undef */
import { getAd } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'
import { getTextWidth, marqueeConfig } from '@/utils/utils'

export default {
    name: 'LiveAnnounce',
    data () {
        return {
            currentAnnounceId: 0, // 当前播放的公告
            announces: [], // 公告列表
            targetAnnounce: {
                left: 0,
                top: 0
            },
            trumpet: require('@/assets/images/common/trumpet.png'),
            tween: null,
            upDownTween: null // 上下翻转动画
        }
    },
    computed: {
        currentAnnounce () {
            return this.announces.find(x => x.itemIndex === this.currentAnnounceId) || {}
        },
        startId () {
            return this.announces[0].itemIndex
        },
        endId () { // 有可能是一样的
            return this.announces[this.announces.length - 1].itemIndex
        }
    },
    created () {
        // 初始化 TweenJs 监听
        this.getPlard()
    },
    methods: {
        stopAnimation () {
            this.tween && this.tween.pause()
        },
        continueAnimation () {
            this.tween && this.tween.resume()
        },
        animate () {
            requestAnimationFrame(this.animate)
            // eslint-disable-next-line no-undef
            // console.log(this.targetAnnounce, 'currentAnnounce')
            TWEEN.update() // 这里将是tweenJs动画能否运行的关键
        },
        getNewTween () { // 更新动画使用，主要是 横向滚动时间不好控制
            this.tween = new TWEEN.Tween(this.targetAnnounce)
                .delay(500)
                .to({
                    left: -this.currentAnnounce.width
                }, this.currentAnnounce.stayTime)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.$refs.domRef && this.$refs.domRef.style.setProperty('left', this.targetAnnounce.left + 'px')
                })
                .onComplete(() => {
                    // 动画完成后，需要重置
                    this.targetAnnounce.left = 0
                    this.targetAnnounce.top = 50
                    this.currentAnnounceId = this.currentAnnounceId + 1 > this.endId ? this.startId : this.currentAnnounceId + 1
                    this.$refs.domRef && this.$refs.domRef.style.setProperty('left', this.targetAnnounce.left + 'px')
                    this.$refs.domRef && this.$refs.domRef.style.setProperty('top', this.targetAnnounce.top + 'px')
                    this.upDownTween && this.upDownTween.start()
                })
        },
        startMarquee () {
            if (this.tween) {
                this.tween.stop()
            }
            this.upDownTween = new TWEEN.Tween(this.targetAnnounce)
                .to({
                    top: 0
                }, 800)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.$refs.domRef && this.$refs.domRef.style.setProperty('top', this.targetAnnounce.top + 'px')
                }).onComplete(() => {
                    console.log('切换完成了, 更新tween')
                    // 更新tween
                    this.getNewTween()
                    this.tween && this.tween.start()
                })
            // 假设没有动画
            this.getNewTween()
            this.tween && this.tween.start()
        },
        async getPlard () {
            try {
                const { code, data } = await getAd({ type: 2 })
                if (code === statusCode.success) {
                    this.announces = data.list.reduce((all, item, index) => {
                        const width = getTextWidth(item.content)
                        all.push({
                            ...item,
                            width,
                            itemIndex: index,
                            // 每秒走20px,走完这段文本，需要多长时间
                            stayTime: Math.ceil((width + 15) / marqueeConfig.speed * 1000)
                        })
                        return all
                    }, [])
                    if (this.announces.length) {
                        this.animate()
                        this.startMarquee()
                    }
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        }
    },
    beforeDestroy () {
        this.tween && this.tween.stop()
        this.upDownTween && this.upDownTween.stop()
        TWEEN.removeAll()
    }
}
</script>

<style lang="scss" scoped>
.test-box {
  line-height: 20px;
  height: 20px;
}
.test {
  z-index: 5;
  white-space: nowrap;
}
.clock{
  position: relative;
  width: 20px;
  z-index: 6;
  line-height: 20px;
}
.running-box{
  height:20px;
  line-height: 20px;
}
</style>
