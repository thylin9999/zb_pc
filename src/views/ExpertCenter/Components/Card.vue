<template>
<div class="card pointer flex align-center flex-column p-t-15 p-b-15 justify-center">
  <span class="title font-14 font-500 text-333">{{ title }}</span>
  <div class="middle">
    <span class="number">{{ number }}</span>
    <span class="font-12 text-999 font-400">{{ unit }}</span>
  </div>
  <div class="total">
    <slot />
  </div>
</div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: {
            type: String,
            default: ''
        },
        number: {
            type: [String, Number],
            default: ''
        },
        unit: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
}
.title {
  line-height: 20px;
}
.middle {
  font-size: 35px;
  font-weight: bold;
  color: #FBA187;
  line-height: 40px;
}
</style>
