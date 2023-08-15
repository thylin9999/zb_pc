<template>
<span class="cancel font-14 pointer font-regular text-white text-center d-inline-block">
    {{ title }}
</span>
</template>

<script>
export default {
    name: 'CancelButton',
    props: {
        title: {
            type: String,
            default: '确定'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.cancel {
    background-color: $background-gray1;
    min-width: 100px;
    line-height: 30px;
    height: 30px;
    border-radius: 4px;
    color: #000;
    &:hover {
        opacity: 0.7;
    }
}
</style>
