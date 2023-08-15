<template>
    <el-button
        class="font-16 font-400 text-center font-16 pointer"
        :disabled="disabled"
        :loading="loading"
    >{{ title }}</el-button>
</template>

<script>
export default {
    name: 'SubmitButton',
    props: {
        title: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.el-button {
    line-height: 40px;
    background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
    color: $text-white!important;
    padding: 0!important;
    &:hover {
        opacity: 0.7;
    }
}
</style>
