<template>
    <div class="w-100 flex align-center row">
        <img :src="trumpet" width="14" height="14" alt="">
        <div class="flex-1 marquee">
            <marquee v-if="currentAnnounce" height="24" style="color: #d8ad66;" behavior=scroll>
                <!-- 这里可以填写走马灯内容 -->
                {{  currentAnnounce.content }}
            </marquee>
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
            announces: [], // 公告列表
            trumpet: require('@/assets/images/common/trumpet.png')
        }
    },
    computed: {
        currentAnnounce () {
            return this.announces[0]
        }
    },
    created () {
        // 初始化 TweenJs 监听
        this.getPlard()
    },
    methods: {
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
                    console.log(this.announces, 'announces')
                    // if (this.announces.length) {
                    //     this.animate()
                    //     this.startMarquee()
                    // }
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.row , .marquee{
  line-height: 24px;
  height: 24px;
}
</style>
