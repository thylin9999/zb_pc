<template>
<div class="box p-relative">
  <div class="inner dot-inner-animate p-absolute"></div>
  <div class="outer dot-outer-animate"></div>
</div>
</template>

<script>
export default {
    name: 'DynamicDot'
}
</script>

<style lang="scss" scoped>
.box {
  width: 12px;
  height: 12px;
}
.outer {
  width: 12px;
  height: 12px;
  background-color: #f8474f;
  opacity: 0.5;
  border-radius: 12px;
}
.inner {
  width: 6px;
  height: 6px;
  left: 3px;
  top: 3px;
  border-radius: 3px;
  background-color: #F7464E;
}
</style>
