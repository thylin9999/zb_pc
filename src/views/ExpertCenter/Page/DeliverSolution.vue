<template>
  <div class="page  w-100 h-100 bg-white overflow-y-auto">
    <div class="title p-l-25 flex align-center justify-between">
      <span class="text-333 font-16 font-500">{{ title }}</span>
        <span v-if="!isFirst" class="font-14 pointer text-999 font-400 p-r-30" @click="backFirst">返回</span>
    </div>
    <div class="content p-relative p-t-15 p-l-25 p-r-25">
      <solution1
          v-if="isFirst"
          :init-league.sync="initLeague"
          :init-info="selectInfo"
          :is-first.sync="isFirst"
          @setSelectInfo="setSelectInfo"
      />
      <solution2 v-if="!isFirst && selectInfo"
        :select-info="selectInfo"
      />
    </div>
  </div>
</template>

<script>
import Solution1 from '../Components/Solution1.vue'
import Solution2 from '../Components/Solution2.vue'
export default {
    name: 'DeliverSolution',
    components: {
        Solution1,
        Solution2
    },
    data () {
        return {
            selectId: '',
            isFirst: true,
            selectInfo: null,
            initLeague: 1
        }
    },
    computed: {
        title () {
            return this.isFirst ? '选择赛事' : '发布方案'
        }
    },
    methods: {
        setSelectInfo (selectInfo) {
            this.selectInfo = selectInfo
        },
        backFirst () {
            this.selectId = this.selectInfo.id
            this.isFirst = true
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

</style>
