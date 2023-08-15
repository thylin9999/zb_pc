<template>
    <div class="w-100 h-100 p-r-25">
        <div class="flex justify-between align-center">
            <el-radio-group
                v-model="tab" @change="changeTab"
                :disabled="isLoading"
                fill="#FBA187">
                <el-radio-button   :label="1">充值记录</el-radio-button>
                <el-radio-button   :label="2">消费记录</el-radio-button>
            </el-radio-group>
            <div class="flex-1 flex flex-end align-center">
                <span class="font-14 text-999 font-400 m-r-10">时间:</span>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="fetchData"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div class="table p-t-15">
            <el-table
                :data="tableData"
                height="100%"
                border
                fit
                v-loading="isLoading"
            >
            <template v-if="tab ===1">
                <el-table-column
                    prop="create_time"
                    align="center"
                    label="充值时间"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="typeString"
                    align="center"
                    label="类别"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="ball_coin"
                    align="center"
                    label="充值数量"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="statusString"
                    align="center"
                    label="充值状态"
                />
            </template>
            <template v-else>
                <el-table-column
                    min-width="150"
                    prop="date"
                    align="center"
                    label="消费时间"
                />
                <el-table-column
                    prop="name"
                    align="center"
                    label="消费名称"
                />
                <el-table-column
                    prop="absCount"
                    align="center"
                    label="消费金额"
                />
                <el-table-column
                    prop="currencyType"
                    align="center"
                    label="消费方式"
                />
                <el-table-column
                    prop="qty"
                    align="center"
                    label="数量"
                />
                <el-table-column
                    show-overflow-tooltip
                    prop="nickname"
                    align="center"
                    label="主播/专家"
                />
            </template>

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
import Pagination from '@/components/Pagination'
import { getChargeRecord, getCostRecord } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'

export default {
    name: 'WalletTables',
    components: {
        Pagination
    },
    data () {
        return {
            isLoading: false,
            tab: 1,
            date: null,
            tableData: [],
            pagination: {
                currentPage: 1,
                pageSize: 20,
                total: 0
            }
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
                end: this.date ? dayjs(this.date[1]).format('YYYY-MM-DD') : null
            }
        }
    },
    methods: {
        changeTab () {
            this.pagination.currentPage = 1
            this.pagination.total = 0
            this.tableData = []
            this.fetchData()
        },
        async fetchData () {
            this.isLoading = true
            const request = this.tab === 1 ? getChargeRecord : getCostRecord
            try {
                const { code, data } = await request(this.apiParams)
                if (code === statusCode.success) {
                    this.pagination.total = data.total
                    this.tableData = data.list.reduce((all, item) => {
                        all.push({
                            ...item,
                            absCount: Math.abs(item.amount | 0),
                            typeString: item.type === 1 ? '球币' : '贵族',
                            currencyType: item.currency === 1 ? '球币' : '球票',
                            statusString: item.status === 1 ? '成功' : (item.status === 2 ? '失败' : '处理中')
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
.table {
  height: calc(100% - 95px);
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
