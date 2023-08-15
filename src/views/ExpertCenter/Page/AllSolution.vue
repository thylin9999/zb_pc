<template>
  <div class="page w-100 h-100 bg-white">
    <div class="title p-l-25 flex align-center justify-between p-r-25">
      <span class="text-333 font-16 font-500">{{ isList ? '全部方案' : '方案详情'}}</span>
      <span v-if="isList"
            class="delivery-solution d-inline-block font-14 pointer text-white font-400 text-center"
            @click="toDeliver"
      >发布方案</span>
      <span v-else class="pointer font-14 text-999 font-400" @click="goBack">
        <i class="el-icon-arrow-left font-14"></i>
        返回
      </span>
    </div>
    <div class="content p-t-15 p-l-30 p-r-25">
      <solution-list v-if="isList" />
      <solution-detail v-else />
    </div>
  </div>
</template>

<script>
import SolutionList from '@/views/ExpertCenter/Components/SolutionList'
import SolutionDetail from '@/views/ExpertCenter/Components/SolutionDetail'

export default {
    name: 'AllSolution',
    components: {
        SolutionList,
        SolutionDetail
    },
    data () {
        return {
            // 是否为 全部方案列表，否则为 方案详情页
            isList: true
        }
    },
    watch: {
        '$route': {
            handler () {
                const { isDetail } = this.$route.query
                this.isList = !isDetail
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        goBack () {
            this.isList = true
        },
        toDeliver () {
            this.$router.push({
                name: 'ExpertCenter',
                params: {
                    tabId: 2
                }
            })
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
}
.delivery-solution {
  width: 100px;
  height: 30px;
  line-height: 30px;
  background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
  border-radius: 5px;
}
</style>
