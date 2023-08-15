<template>
<div class="w-100 h-100 p-relative box" id="giftBox"  :style="style">
</div>
</template>
<script>
/* eslint-disable ,no-undef */
import { useTip } from '@/utils/msgDialog'
import GiftDialog from '@/utils/giftDialog/giftDialog'
export default {
    name: 'GiftBox',
    data () {
        return {
            currentGifts: [], // 当前正在展示的礼物列表
            currentIndex: 0,
            indexList: [], // 记录动画的顺序
            giftInstances: []
        }
    },
    computed: {
        style () {
            return {
                height: this.currentGifts.length > 0 ? 3 * 90 + 'px' : 0
            }
        }
    },
    mounted () {
        useTip.init({ cb: this.handleAnimation })
    },
    methods: {
        handleAnimation (msg) {
            if (this.currentGifts.length < 3) {
                // 记录tip 顺序的
                this.currentGifts.push(msg.msgId)
                const currentIndex = this.currentGifts.length
                this.indexList.push(currentIndex)
                const giftInstance = GiftDialog({
                    gift: msg,
                    indexCount: currentIndex,
                    onClose: () => {
                        // 移除
                        let index = -1
                        const instance = this.giftInstances.filter((instance, i) => {
                            if (instance.id === msg.msgId) {
                                index = i
                                return true
                            }
                            return false
                        })[0]
                        if (!instance) return
                        this.giftInstances.splice(index, 1)
                        this.currentGifts.splice(0, 1)
                        this.indexList.splice(0, 1)
                        if (!this.currentGifts.length) {
                            this.currentIndex = 0
                        }
                        // 其他动画上移
                        this.moveOthers()
                        useTip.removeItem(msg.msgId, () => {
                            this.$nextTick(() => {
                                useTip.start()
                            })
                        })
                    }
                })
                this.giftInstances.push(giftInstance)
                giftInstance.enter()
            }
        },
        moveOthers () {
            this.giftInstances.forEach((instance, index) => {
                instance.toTop(index)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.box {
    left:0;
    top: 0;
    z-index: 6;
    max-height: 300px;
    overflow: hidden;
}
</style>
