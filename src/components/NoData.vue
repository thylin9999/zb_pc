<template>
    <div class="w-100 h-100 flex align-center flex-column justify-center">
        <img class=" h-50" :src="imgUrl" alt="">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'v2',
    data () {
        return {
            imgUrl: require('../assets/images/common/no-data.png')
        }
    }
}

</script>

<style lang="scss" scoped>
img {
    max-width: 495px;
    max-height: 190px;
    min-width: 240px;
    min-height: 93px;
}
</style>
