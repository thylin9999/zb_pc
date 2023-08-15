<template>
<div class="w-100 h-100">
  <div class="abstract m-b-15 flex align-center justify-between">
    <mult-card
      :left-info="{
        number: sales0,
        label: '方案总数'
      }"
      :right-info="{
        number: sales1,
        label: '在售中'
      }"
    />
    <mult-card
      :left-info="{
        number: sales5,
        label: '待核实'
      }"
      :right-info="{
        number: sales4,
        label: '已核实'
      }"
    />
    <mult-card
     :left-info="{
        number: sales6,
        label: '已命中'
      }"
      :right-info="{
        number: sales7,
        label: '未命中'
      }"
    />
  </div>
  <div class="search flex align-center">
    <span class="font-14 text-999 font-400">购买日期：</span>
    <div>
      <el-select
          class="m-l-30 flex-1"
          v-model="dateRange"
          placeholder="全部"
          clearable
          filterable
          @change="changeStatus">
        <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div >
      <el-select
          class="m-l-30 flex-1"
          v-model="status"
          placeholder="全部在售"
          clearable
          filterable
          @change="changeStatus">
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
  <div class="table p-t-15 w-100">
    <el-table
        v-loading="isLoading"
        :data="list"
        height="100%"
        border
        fit
    >
      <el-table-column
          prop="create_time"
          align="center"
          label="发布时间"
          show-overflow-tooltip
      >
          <template slot-scope="scope">
              <div class="flex flex-column">
                  <span>{{ scope.row.dateString }}</span>
                  <span>{{ scope.row.timeString }}</span>
              </div>
          </template>
      </el-table-column>
      <el-table-column
          prop="title"
          align="center"
          label="方案标题"
          show-overflow-tooltip
      />
      <el-table-column
          prop="coin"
          align="center"
          label="方案售价(球币)"
      />
      <el-table-column
          prop="sales_num"
          align="center"
          label="购买人数"
      />
      <el-table-column
          prop="sales_volume"
          align="center"
          label="销售额(元)"
      />
      <el-table-column
          prop="statusString"
          align="center"
          label="状态"
      />
      <el-table-column
          align="center"
          label="操作"
      >
        <template slot-scope="scope">
          <div class="flex flex-column operation-text align-center justify-center">
            <span class="highlight-text pointer" @click="goTo(scope.row)">详情</span>
            <span class="highlight-text pointer" @click="goSales(scope.row)">购买明细</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="w-100 text-center m-t-10">
    <pagination
        :current-page.sync="pagination.currentPage"
        :page-size.sync="pagination.pageSize"
        :total="pagination.total"
        @loadData="fetchData"
    />
  </div>
</div>
</template>

<script>
// import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
import MultCard from '@/views/ExpertCenter/Components/MultCard'
import { getPlans, getSolutionStatistic } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { planStatus } from '@/utils/utils'
import dayjs from 'dayjs'
export default {
    name: 'SolutionList',
    components: {
        // SearchInput,
        Pagination,
        MultCard
    },
    data () {
        return {
            search: '',
            pagination: {
                currentPage: 1,
                pageSize: 20,
                total: 0
            },
            list: [
                {
                    id: 1,
                    time: '2022-12-19',
                    title: 'asdfasdf',
                    price: '20',
                    purchase: 30,
                    salesTotal: 2010,
                    status: '在售中'
                },
                {
                    id: 2,
                    time: '2022-12-19',
                    title: 'asdfasdf',
                    price: '25',
                    purchase: 15,
                    salesTotal: 1000,
                    status: '在售中'
                }
            ],
            isLoading: false,
            status: null,
            dateRange: 'all',
            statusArr: []
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                date: this.dateRange,
                hit: null,
                status: this.status
            }
        },
        statusOptions () {
            return Object.entries(planStatus).reduce((all, [key, value]) => {
                all.push({
                    id: key,
                    label: value,
                    value: key
                })
                return all
            }, [{
                id: 'all',
                label: '全部',
                value: 'all'
            }])
        },
        dateOptions () {
            return [
                {
                    id: 'all',
                    label: '全部',
                    value: 'all'
                },
                {
                    id: 'td',
                    label: '今日',
                    value: 'td'
                },
                {
                    id: 'tw',
                    label: '本周',
                    value: 'tw'
                },
                {
                    id: 'tm',
                    label: '本月',
                    value: 'tm'
                },
                {
                    id: 'l3m',
                    label: '近三月',
                    value: 'l3m'
                }
            ]
        },
        sales0 () { // 待核实
            const item = this.statusArr.find(x => x.status === 0)
            return item ? item.num : 0
        },
        sales1 () { // 待核实
            const item = this.statusArr.find(x => x.status === 1)
            return item ? item.num : 0
        },
        sales5 () { // 待核实
            const item = this.statusArr.find(x => x.status === 5)
            return item ? item.num : 0
        },
        sales4 () { // 待核实
            const item = this.statusArr.find(x => x.status === 4)
            return item ? item.num : 0
        },
        sales6 () { // 待核实
            const item = this.statusArr.find(x => x.status === 6)
            return item ? item.num : 0
        },
        sales7 () { // 待核实
            const item = this.statusArr.find(x => x.status === 7)
            return item ? item.num : 0
        }
    },
    created () {
        this.fetchData()
        this.getStatistic()
    },
    methods: {
        async getStatistic () {
            try {
                const { code, data } = await getSolutionStatistic()
                if (code === statusCode.success) {
                    this.statusArr = data
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        changeStatus () {
            this.pagination.currentPage = 1
            this.fetchData()
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getPlans(this.apiParams)
                if (code === statusCode.success) {
                    this.list = data.list.reduce((all, item) => {
                        all.push({
                            ...item,
                            statusString: planStatus[item.status],
                            dateString: dayjs(item.create_time).format('YYYY-MM-DD'),
                            timeString: dayjs(item.create_time).format('HH:mm:ss')
                        })
                        return all
                    }, [])
                    this.pagination.total = data.total
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.isLoading = false
            }
        },
        goTo (row) {
            this.$router.push({
                name: 'ExpertCenter',
                params: {
                    tabId: 3
                },
                query: {
                    isDetail: row.id
                }
            })
        },
        goSales (row) {
            // 去销售记录
            this.$router.push({
                name: 'ExpertCenter',
                params: {
                    tabId: 4,
                    mpId: row.id
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
  height: calc(100% - 185px);
}
.delivery-solution {
  width: 100px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
  border-radius: 5px;
  &:hover {
    opacity: 0.7;
  }
}
.operation-text{
  span {
    color: #A05A77;
    &:hover {
      text-decoration: underline;
    }
  }
}
::v-deep {
  .el-table {
    th {
      padding: 8px 0;
      background: #FFFCFA;
      color: #333333;
      font-size: 14px;
    }
  }
}
</style>
