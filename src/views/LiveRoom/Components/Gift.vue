<template>
<div class="gift-item w-100 h-100" :id="id" ref="demoCanvas">
<!--<SvgaAnimation />-->
  <img v-if="showImg" class="w-100 h-100" :src="img" alt="">
</div>
</template>
<script>

import SVGA from 'svgaplayerweb'
export default {
    name: 'Gift',
    props: {
        showPercent: {
            type: Boolean,
            default: false
        },
        giftId: {
            type: [String, Number],
            default: ''
        },
        url: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            player: null,
            showImg: true
        }
    },
    computed: {
        id () {
            return 'svgContainer-' + this.giftId
        }
    },
    mounted () {
        if (this.player) {
            this.player.stopAnimation()
            this.player.clear()
        }
        this.initMachineSVGA()
    },
    methods: {
        initMachineSVGA () {
            let player = new SVGA.Player(`#${this.id}`)
            const parser = new SVGA.Parser(`#${this.id}`)
            // 必须是服务器地址或者是线上的地址本地是不可以的 会报错
            parser.load(this.url, (videoItem) => {
                // videoItem.videoSize.width = 50 // 给svga图片宽赋值
                // videoItem.videoSize.height = 50 // 给svga图片高赋值
                this.showImg = false
                player.setContentMode('AspectFill')
                player.setClipsToBounds(true)
                player.setVideoItem(videoItem)
                player.startAnimation()
                let isStop = false
                if (this.showPercent) {
                    player.onPercentage((percentage) => {
                        if (percentage >= 0.9) { // 动画结束了,结束时间有问题
                            if (!isStop) {
                                this.$emit('stop', this.giftId)
                                isStop = true
                                setTimeout(() => {
                                    player.stopAnimation()
                                    player.clear()
                                    player.videoItem = null
                                    player = null
                                }, 300)
                            }
                        }
                    })
                }
            }, () => {
                this.$emit('stop', this.giftId)
            })
        }
    }

}
</script>

<style scoped lang="scss">
.gift-item {
  width: 50px;
  height: 50px;
}
</style>
