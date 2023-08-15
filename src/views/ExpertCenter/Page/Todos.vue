<template>
<div class="page w-100 h-100 bg-white">
  <div class="title p-l-25">
    <span class="text-333 font-16 font-500">专家奖励金</span>
  </div>
  <div class="content flex align-center flex-column justify-center">
      <img :src="img" alt="">
      <span class="font-16 m-t-30 text-333 font-500">功能尚在研发…</span>
  </div>
</div>
</template>

<script>
export default {
    name: 'Todos',
    data () {
        return {
            img: require('../../../assets/images/common/on-going.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #d8d8d8;
}
.content {
  height: calc(100% - 55px);
  img {
    width: 145px;
  }
}
</style>
