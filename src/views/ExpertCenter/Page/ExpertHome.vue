<template>
<div class="page h-100">
  <div class="card-list w-100 p-5 flex align-center justify-between">
    <card
      class="flex-1 "
      title="今日发布"
      :number="info.today_plan_count"
      unit="篇"
    >
      <span class="font-12 font-400 text-999">累计发布{{ info.accrue_plan_count}}篇</span>
    </card>
    <card
        class="flex-1 m-l-10 m-r-10"
        title="今日售出"
        :number="info.today_sales_count"
        unit="单"
    >
      <span class="font-12 font-400 text-999">累计发售{{ info.accrue_sales_count}}篇</span>
    </card>
    <card
        class="flex-1"
        title="今日销售额"
        :number="info.today_sales_sum"
        unit="元"
    >
      <span class="font-12 font-400 text-999">累计销售{{ info.accrue_sales_sum}}元</span>
    </card>
  </div>
  <div class="bg-white content m-t-5">
    <div class="table w-100">
      <ul v-if="list.length" class="w-100 h-100 overflow-y-auto">
        <li
          v-for="item in list"
          :key="item.id"
          class="p-l-15 p-r-10 w-100 pointer"
        >
          <div class="row w-100 flex justify-between align-center">
            <span class="font-12 font-500 text-333">{{ item.content }}</span>
            <span class="time font-12 font-400 text-999">{{ item.create_date }}</span>
          </div>
        </li>
      </ul>
      <no-data v-else />
    </div>
    <div class="w-100 text-center">
      <pagination
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          :total="pagination.total"
          @loadData="getPlansMessages"
      />
    </div>
  </div>
</div>
</template>

<script>
import Card from '../Components/Card'
import Pagination from '@/components/Pagination'
import { getExpertCenter, getMessages } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import NoData from '@/components/NoData.vue'
export default {
    name: 'ExpertHome',
    components: {
        Card,
        Pagination,
        NoData
    },
    data () {
        return {
            info: {},
            pagination: {
                currentPage: 1,
                pageSize: 20,
                total: 0
            },
            list: [
                // {
                //     id: 1,
                //     title: '啊束带结发束带结发手动阀送达方',
                //     content: '阿方索大是大非',
                //     create_date: '2020-12-20'
                // }
            ]
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                type: 'material'
            }
        }
    },
    created () {
        this.fetchData()
        this.getPlansMessages()
    },
    methods: {
        async getPlansMessages () {
            try {
                const { code, data } = await getMessages(this.apiParams)
                if (code === statusCode.success) {
                    this.pagination.total = data.total
                    this.list = data.list
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        async fetchData () {
            try {
                const { code, data } = await getExpertCenter()
                if (code === statusCode.success) {
                    this.info = data
                }
            } catch (e) {
                console.log('出错了', e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 135px);
}
.table {
  height: calc(100% - 50px);
  li {
    border-bottom: 1px solid #D8D8D8;
    &:hover {
      opacity: 0.7;
    }
  }
  .row {
    line-height: 44px;
  }
}
</style>
