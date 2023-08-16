<template>
<div class="page w-100 h-100 bg-white">

    <div class="title p-l-25 flex p-r-10 align-center justify-between">
      <span class="text-333 font-16 font-500">专家奖励金</span>
      <span v-if="!isRecord" class="font-14 pointer text-999 font-400 p-r-30" @click="toRecord">提现记录</span>
    </div>
    <withdraw-record v-if="isRecord" />
    <div v-else class="content p-15">
      <div class="cards w-100 flex align-center">
        <div class="card flex align-center flex-column justify-center">
          <span class="count">{{ ball_coin }}</span>
          <span class="label font-14 text-999 font-400">球币余额</span>
        </div>
        <div class="card m-l-10 flex align-center flex-column justify-center">
          <span class="count">{{ ball_coin_wd }}</span>
          <span class="label font-14 text-999 font-400">可提现球币余额</span>
        </div>
      </div>
      <apply-with-draw @changeTab="toRecord" />
    </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ApplyWithDraw from '@/views/ExpertCenter/Components/ApplyWithDraw'
import WithdrawRecord from '@/views/ExpertCenter/Components/WithdrawRecord'
export default {
    name: 'Bonus',
    components: {
        ApplyWithDraw,
        WithdrawRecord
    },
    data () {
        return {
            isRecord: false
        }
    },
    computed: {
        ...mapState('user', ['ball_coin', 'ball_coin_wd'])
    },
    created () {
        this.getUserInfo()
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        toRecord () {
            this.isRecord = true
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
.cards {
  .card {
    width: 300px;
    height: 80px;
    background: #FFFFFF;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
    border-radius: 10px;
    .count {
      height: 35px;
      font-size: 30px;
      font-weight: bold;
      color: #409eff;
      line-height: 35px;
    }
    .label {
      line-height: 20px;
    }
  }
}

</style>
