<template>
    <div class="container p-l-10 p-r-10 p-b-20 text-center">
        <div class="font-14 font-500 title text-333">提示</div>
        <div class="content m-t-25 m-b-25">
            <span class="font-12 font-400 text-center">{{ giftUnit }}余额不足，请前往充值</span>
        </div>
        <div class="flex align-center justify-center font-12 font-400 text-white">
            <span class="cancel pointer text-center" @click="cancel">取消</span>
            <span class="recharge pointer m-l-15 text-center" @click="toCharge">立即充值</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'GiftLoginTips',
    computed: {
        ...mapState('modal', ['giftUnit'])
    },
    data () {
        return {
        }
    },
    methods: {
        cancel () {
            this.setGiftLogin(false)
        },
        toCharge () {
            this.setGiftLogin(false)
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 11
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 273px;
    height: 156px;
    background: #FFFFFF;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.27);
    border-radius: 10px;
    z-index: 120;
    .title {
        font-size: 14px;
        line-height: 35px;
        height: 35px;
        border-bottom: 1px solid #D8D8D8;
    }
    .cancel {
        width: 99px;
        height: 24px;
        line-height: 24px;
        background: #D8D8D8;
        border-radius: 19px;
    }
    .recharge {
        width: 99px;
        height: 24px;
        line-height: 24px;
        background: #A05A77;
        border-radius: 19px;
    }
}
</style>
