<template>
<div class="header  p-l-30">
    <span class="font-24 font-medium text-333">{{ title }}</span>
</div>
</template>

<script>
export default {
    name: 'HeaderTitle',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    line-height: 40px;
    border-left: 2px solid #333;
}
</style>
