<template>
<el-popover
        placement="top-start"
        popper-class="duty-popover"
        width="370"
        trigger="hover"
>
    <div slot="reference" class="flex flex-column text-center align-center justify-between " >
        <icon-png :icon="isLightHeader && !showDark ? 'header/duty_h' : 'header/duty'" :width="22" :height="22"></icon-png>
        <span class=" pointer text-color font-12"
              :class="{'text-white': isLightHeader && !showDark, 'text-333': !isLightHeader || showDark}"
        >任务</span>
    </div>
    <div class="content p-b-20">
        <p class="text-white font-14 title">看球宝箱</p>
        <div class="boxes w-100  m-t-10">
            <timing-box v-if="token" class="p-l-10 p-r-10"/>
            <div v-else class="w-100 not-login p-t-20">
                <div class="w-100 h-100 flex align-center justify-center">
                    <div class="line"></div>
                    <div class="text font-12 font-400 text-999 m-l-10 m-r-10">登录即可领取免费礼物和球票</div>
                    <div class="line"></div>
                </div>
                <div class="btn w-100 text-center m-t-20">
                    <span class="login pointer font-12 font-400 text-white d-inline-block" @click="openLoginDialogMixin">立即登录</span>
                </div>
            </div>
        </div>
    </div>
</el-popover>
</template>
<script>
import IconPng from '@/components/IconPng.vue'
import TimingBox from '@/components/TimingBox.vue'
import { mapState } from 'vuex'

export default {
    name: 'Mission',
    props: {
        isLightHeader: {
            type: Boolean,
            default: false
        },
        showDark: {
            type: Boolean,
            default: false
        }
    },
    components: {
        IconPng,
        TimingBox
    },
    computed: {
        ...mapState('user', ['token'])
    }
}
</script>
<style lang="scss" scoped>
.not-login{
    .login{
        width: 156px;
        height: 24px;
        line-height: 24px;
        background: #A05A77;
        border-radius: 19px;
    }
    .line {
        width: 40px;
        height: 1px;
        background-color: #D8D8D8;
    }
}
</style>
