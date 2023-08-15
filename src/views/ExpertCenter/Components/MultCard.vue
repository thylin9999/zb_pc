<template>
<div class="card flex align-center pointer">
  <div class="left flex-1 flex flex-column align-center justify-center">
    <span class="font-30 text-333 number">{{ leftInfo.number }}</span>
    <span class="font-14 text-999 label">{{ leftInfo.label }}</span>
  </div>
  <div class="line"></div>
  <div class="right  flex-1 flex flex-column align-center justify-center">
    <span class="font-30 text-333 number">{{ rightInfo.number }}</span>
    <span class="font-14 text-999 label">{{ rightInfo.label }}</span>
  </div>
</div>
</template>

<script>
export default {
    name: 'MultCard',
    props: {
        leftInfo: {
            type: Object,
            default: () => ({
                number: 30,
                label: '方案综述'
            })
        },
        rightInfo: {
            type: Object,
            default: () => ({
                number: 5,
                label: '在售中'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
  width: 300px;
  height: 80px;
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
}
.line {
  width: 1px;
  height: 40px;
  background-color: #D8D8D8;
}
.label {
  line-height: 20px;
}
.number {
  line-height: 35px;
}
</style>
