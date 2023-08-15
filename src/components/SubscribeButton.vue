<template>
<div class="subscribe pointer" :class="{'un-subscribe': isSubscribe}">
    <span >{{ title }}</span>
</div>
</template>

<script>
export default {
    name: 'SubscribeButton',
    props: {
        hostId: {
            type: [String, Number],
            default: 1
        },
        isSubscribe: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        title () {
            return this.isSubscribe ? '已订阅' : '订阅'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.subscribe{
    background-color: #fff;
    border: 1px solid #3C3F5B;
    color: #3C3F5B;
    line-height: 35px;
    border-radius: 10px;
    &.un-subscribe {
        background-color: #C3C3C3;
        border: 1px solid transparent;
        color: $text-white;
    }
}
</style>
