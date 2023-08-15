<template>
<div class="tab-title">
    <span class="font-20 font-500 font-medium text-333">{{ title }}</span>
</div>
</template>

<script>
export default {
    name: 'TabTitle',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.tab-title {
    border-left: 5px solid $background-color1;
    padding-left: 12px;
    span {
        line-height: 28px;
    }
}
</style>
