<template>
<span
    :class="{'is-disabled not-allowed': disable }"
    class="confirm w-100 font-14 pointer font-regular text-white text-center d-inline-block"
>
    {{ title }}
</span>
</template>

<script>
export default {
    name: 'ConfirmButton',
    props: {
        title: {
            type: String,
            default: '确定'
        },
        disable: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.confirm {
    background-color: $background-color1;
    min-width: 100px;
    &:not(.is-disabled):hover {
        opacity: 0.7;
    }
    &.is-disabled {
        opacity: 0.7;
    }
}
</style>
