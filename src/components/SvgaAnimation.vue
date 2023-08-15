<template>
    <div class="text-center m-auto" id="svgContainer" ref="demoCanvas" :style="style"></div>
</template>

<script>
import SVGA from 'svgaplayerweb'
export default {
    name: 'SvgaAnimation',
    props: {
        url: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: window.innerWidth
        },
        height: {
            type: Number,
            default: window.innerHeight
        },
        position: {
            type: Object,
            default: () => ({
                x: 0,
                y: 0
            })
        }
    },
    computed: {
        style () {
            return {
                width: this.width + 'px',
                height: this.height + 'px'
            }
        }
    },
    data () {
        return {
            player: null
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
        initMachineSVGA1 () {
            const player = new SVGA.Player('#svgContainer')
            const parser = new SVGA.Parser('#svgContainer')
            // 必须是服务器地址或者是线上的地址本地是不可以的 会报错
            parser.load('http://img.wuhaicj.com/gift/2023051815539819249.svga', function (videoItem) {
                console.log(videoItem, 'asdf')
                player.setVideoItem(videoItem)
                player.startAnimation()
            })
        },
        initMachineSVGA () {
            const player = new SVGA.Player('#svgContainer')
            const parser = new SVGA.Parser('#svgContainer')
            // const w = this.width // 拿页面宽
            // const h = this.height // 拿页面高
            // 必须是服务器地址或者是线上的地址本地是不可以的 会报错
            parser.load(this.url, function (videoItem) {
                // videoItem.videoSize.width = w // 给svga图片宽赋值
                // videoItem.videoSize.height = h// 给svga图片高赋值
                console.log(videoItem, '2222222222222', player)
                player.setVideoItem(videoItem)
                player.startAnimation()
            })
        }
    }
}
</script>
