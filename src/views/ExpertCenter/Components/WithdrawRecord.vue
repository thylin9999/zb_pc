<template>
<div class="p-l-30 p-r-30 p-t-15 p-b-30 page w-100 h-100 bg-white">
  <div class="search flex align-center">
    <div>
        <span class="font-14 text-999 font-400">购买日期：</span>
        <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                @change="fetchData"
                end-placeholder="结束日期">
        </el-date-picker>
    </div>
    <div>
        <el-select
                class="m-l-30 flex-1"
                v-model="status"
                placeholder="提现状态"
                clearable
                filterable
                @change="changeStatus">
            <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.id">
            </el-option>
        </el-select>
    </div>
  </div>
  <div class="table p-t-15 w-100">
    <el-table
        :data="list"
        height="100%"
        border
        fit
        v-loading="isLoading"
    >
      <el-table-column
          align="center"
          type="index"
          width="60"
          label="序号"
      />
      <el-table-column
          prop="order_no"
          align="center"
          label="订单号"
          show-overflow-tooltip
      />
      <el-table-column
          prop="bank"
          align="center"
          label="收款银行"
          show-overflow-tooltip
      />
      <el-table-column
          prop="name"
          align="center"
          label="收款人姓名"
          show-overflow-tooltip
      />
      <el-table-column
          prop="card_number"
          align="center"
          label="收款账号"
          show-overflow-tooltip
      />
      <el-table-column
          prop="ball_coin"
          align="center"
          label="提现球币数量"
      />
      <el-table-column
          prop="create_time"
          align="center"
          label="申请时间"
          :min-width="150"
          show-overflow-tooltip
      />
      <el-table-column
          prop="statusString"
          align="center"
          label="状态"
      />
    </el-table>
  </div>
  <div class="w-100 text-center m-t-10 m-b-10">
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
import { getWithdrawRecord } from '@/api/user'
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'WithdrawRecord',
    components: {
        Pagination
    },
    data () {
        return {
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            list: [],
            date: null,
            isLoading: false,
            statusOptions: [
                {
                    id: 4,
                    label: '全部',
                    value: '全部'
                },
                {
                    id: 1,
                    label: '成功',
                    value: '成功'
                },
                {
                    id: 2,
                    label: '失败',
                    value: '失败'
                },
                {
                    id: 3,
                    label: '审核中',
                    value: '审核中'
                }
            ],
            status: null
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                start: this.date ? dayjs(this.date[0]).format('YYYY-MM-DD') : null,
                end: this.date ? dayjs(this.date[1]).format('YYYY-MM-DD') : null,
                status: this.status === 4 ? null : this.status
            }
        }
    },
    methods: {
        changeStatus () {
            this.pagination.currentPage = 1
            this.fetchData()
        },
        async fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getWithdrawRecord(this.apiParams)
                if (code === statusCode.success) {
                    this.pagination.total = data.total
                    this.list = data.list.reduce((all, item) => {
                        all.push({
                            ...item,
                            statusString: item.status === 1 ? '成功' : (item.status === 2 ? '失败' : '审核中')
                        })
                        return all
                    }, [])
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
  height: calc(100% - 55px);
  .table {
    height: calc(100% - 90px);
  }
}
::v-deep {
  .el-table {
    border-radius: 10px 10px 0 0;
    th {
      padding: 8px 0;
      background: #FFFCFA;
      color: #333333;
      font-size: 14px;
    }
    //thead {
    //  border-radius: 10px 10px 0 0;
    //}
  }
}
</style>
