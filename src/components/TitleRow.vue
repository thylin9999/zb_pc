<template>
<div class="header flex align-center p-relative justify-between">
    <div class="flex align-center">
<!--        <span class="icon title-row-icon bg-no-repeat bg-center bg-size-cover" :style="{ backgroundImage: `url(${iconBg})`}"></span>-->
        <span class="font-600 m-l-10 text-333 d-inline-block font-22">{{ title }}</span>
    </div>
    <slot />
</div>
</template>

<script>
export default {
    name: 'TitleRow',
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconBg () {
            return require(`../assets/images/icons/${this.icon}.png`)
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    line-height: 30px;
}
.icon {
    width: 27px;
    height: 26px;
}
</style>
