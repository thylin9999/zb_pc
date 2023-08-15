<template>
    <span class="more-button flex align-center pointer">
        <span class="font-16 text-333 font-medium m-r-10">更多</span>
        <span class="more d-inline-block bg-no-repeat bg-center bg-size-cover"></span>
    </span>
</template>

<script>
export default {
    name: 'MoreButton'
}
</script>

<style lang="scss" scoped>
.more-button {
    .more {
        width: 9px;
        height: 15px;
        background-image: url('../assets/images/icons/more.png');
    }
}
</style>
