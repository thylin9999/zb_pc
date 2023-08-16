<template>
    <div class="page w-100 h-100 bg-white">
        <div  class="title p-l-25 flex align-center justify-between p-r-25">
            <template v-if="isDetail">
                <div class="flex align-center">
                  <icon-png icon="wallet/qiu-coin" :width="25" :height="25"/>
                  <span class="text-333 font-16 font-500">球币数量: </span>
                  <span class="font-16 font-500 m-l-5 count">{{ ball_coin }}</span>
                </div>
                <span
                    class=" detail pointer text-333 font-14 text-center d-inline-block"
                    @click="goToList"
                >明细</span>
            </template>
            <div class="w-100 text-333 font-16 pointer font-500"
                v-else
                @click="isDetail = true"
            >
                <i class="el-icon-arrow-left"></i>
                <span>返回</span>
            </div>
        </div>
        <div class="content p-t-15 p-l-25" :key="updateKey">
            <my-wallet-detail v-if="isDetail"
                @refresh="refreshPage"
            />
            <wallet-tables v-else />
        </div>
    </div>
</template>

<script>
import IconPng from '@/components/IconPng'
import MyWalletDetail from './MyWalletDetail.vue'
import WalletTables from './WalletTables.vue'
import { mapState } from 'vuex'
export default {
    name: 'MyWallet',
    components: {
        MyWalletDetail,
        WalletTables,
        IconPng
    },
    data () {
        return {
            isDetail: true,
            updateKey: +new Date().getTime()
        }
    },
    computed: {
        ...mapState('user', ['ball_coin'])
    },
    methods: {
        goToList () {
            this.isDetail = false
        },
        refreshPage () {
            // this.updateKey = +new Date().getTime()
            this.isDetail = false
        }
    }
}

</script>

<style lang="scss" scoped>
.title {
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #d8d8d8;
  .detail {
    width: 90px;
    height: 27px;
    line-height: 25px;
    border-radius: 5px;
    border: 1px solid #000000;
  }
  .count {
    color: #409eff;
  }
}
.content {
  height: calc(100% - 55px);
}

</style>
