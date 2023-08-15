<template>
    <ul class="w-100 flex align-center flex-no-wrap justify-between"

    >
        <li
                v-for="(box) in  boxes"
                :key="box.id"
                class=" flex pointer text-center flex-column justify-center align-center"
                :class="{
                    'is-big': size === 'big'
                }"
                @click="operate(box)"
        >
            <IconPng :icon="box.status === 3 ? boxO : boxC" :width="width" :height="width" />
            <span v-if="box.status === 1" class="font-12 label  font-400 scale-9">{{ box.timeString }}</span>
            <span v-if="box.status === 2" class="font-12 label  font-400 scale-9">开启</span>
            <span v-if="box.status === 3" class="font-12 label w-100 d-inline-block is-open  font-400 scale-9">{{ box.remark }}</span>
        </li>
    </ul>
</template>
<script>
import IconPng from '@/components/IconPng.vue'
import { drawBox, openBox } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'TimingBox',
    props: {
        size: {
            type: String,
            default: 'default'
        },
        isLive: {
            type: Boolean,
            default: false
        }
    },
    components: { IconPng },
    data () {
        return {
            sizeMap: {
                'default': 30,
                'middle': 40,
                'big': 80
            }
        }
    },
    computed: {
        ...mapState('commonData', ['boxes', 'changeBoxStatus']),
        width () {
            return this.sizeMap[this.size]
        },
        boxO () {
            return this.size === 'big' ? 'gift/box_b_o' : 'gift/box_o'
        },
        boxC () {
            return this.size === 'big' ? 'gift/box_b_c' : 'gift/box_c'
        },
        currentBox () { // 第一个未开启的宝箱
            return this.boxes.find(x => x.status === 1)
        },
        isLiveRoom () {
            return this.$route.name === 'LiveRoom'
        }
    },
    watch: {
        '$route': {
            handler () {
                if (this.isLive && this.isLiveRoom) {
                    this.handleTime()
                }
            },
            immediate: true,
            deep: true
        },
        changeBoxStatus: {
            handler () {
                if (this.isLive && this.isLiveRoom && this.changeBoxStatus) {
                    this.openBox1(this.currentBox)
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions('commonData', ['getBoxes']),
        ...mapActions('user', ['getUserInfo']),
        ...mapMutations('commonData', ['START_INTERVAL', 'SET', 'CHANGE_BOX_STATUS', 'STOP_INTERVAL']),
        async operate (box) {
            if (box.status === 1) {
                // 未开启，无法打开
                return
            }
            if (box.status === 3) {
                // 已领取，无法打开
                return
            }
            // 已开启，待打开
            try {
                const { code } = await drawBox(box.id)
                if (code === statusCode.success) {
                    this.CHANGE_BOX_STATUS({ id: box.id })
                    this.getUserInfo()
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async openBox1 (box) {
            try {
                const { code } = await openBox(box.id)
                if (code === statusCode.success) {
                    // 开启成功，需要更新列表
                    this.refresh(this.handleTime)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        refresh (cb) {
            // 重置
            this.SET({ changeBoxStatus: false })
            this.getBoxes({ cb })
        },
        handleTime () {
            this.START_INTERVAL()
        },
        closeTimer () {
            // 停止计时
            this.refresh()
            this.STOP_INTERVAL()
        }
    },
    beforeDestroy () {
        this.closeTimer()
    }
}
</script>
<style lang="scss" scoped>
.label {
    color: #999;
    width: 50px;
}
.is-big {
    .label {
        width: 80px;
        height: 23px;
        line-height: 23px;
        border-radius: 12px;
        background-color: #A05A77;
        color: #fff;
        margin-top:10px;
    }
    .is-open {
        color: #999;
        background-color: #D8D8D8;
    }
}
</style>
