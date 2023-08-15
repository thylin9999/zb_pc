<template>
<div class="page w-100 h-100 bg-white">
  <div class="title p-l-25">
    <span class="text-333 font-16 font-500">销售记录</span>
  </div>
  <div class="bg-white content p-t-15 p-l-30 p-r-25">
    <div class="search flex align-center">
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
            width="80"
            label="序号"
        />
        <el-table-column
            prop="update_time"
            align="center"
            label="购买时间"
            show-overflow-tooltip
        />
        <el-table-column
            prop="nickname"
            align="center"
            label="用户昵称"
            show-overflow-tooltip
        />
        <el-table-column
            prop="title"
            align="center"
            label="方案"
        />
        <el-table-column
            prop="coin"
            align="center"
            label="售价"
        />
        <el-table-column
            prop="status"
            align="center"
            label="状态"
        >
            <template slot-scope="scope">
                <span>{{ scope.row.status === 1 ? '成功' : '失败' }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="share_percent"
            align="center"
            label="分成比例"
        />
        <el-table-column
            prop="share_amount"
            align="center"
            label="奖励金"
        />
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
</div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSalesPurchase } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'
export default {
    name: 'Sales',
    components: {
        Pagination
    },
    data () {
        return {
            isLoading: false,
            search: '',
            pagination: {
                currentPage: 1,
                pageSize: 20,
                total: 0
            },
            list: [
                {
                    id: 1,
                    time: '2020-12-32',
                    nickname: 'aaa',
                    solution: 'asdfasdf',
                    price: '20',
                    status: '成功',
                    rate: '1.2',
                    prize: '30'
                }
            ],
            date: null
        }
    },
    computed: {
        apiParams () {
            return {
                pageNum: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                id: this.mpId,
                start: this.date ? dayjs(this.date[0]).format('YYYY-MM-DD') : null,
                end: this.date ? dayjs(this.date[1]).format('YYYY-MM-DD') : null
            }
        }
    },
    created () {
        this.mpId = this.$route.params.mpId || null
        this.fetchData()
    },
    methods: {
        async fetchData () {
            this.isLoading = true
            try {
                const { code, data } = await getSalesPurchase(this.apiParams)
                if (code === statusCode.success) {
                    this.pagination.total = data.total
                    this.list = data.list
                }
            } catch (e) {
                console.log('出错了', e)
            } finally {
                this.isLoading = false
            }
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
  }
}
</style>
