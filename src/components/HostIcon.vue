<template>
<div class="icon bg-center bg-no-repeat"
     :style="{
        backgroundImage: `url(${img})`
    }"
></div>
</template>

<script>
export default {
    name: 'HostIcon',
    props: {
        img: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: 100% 100%;
}
</style>
