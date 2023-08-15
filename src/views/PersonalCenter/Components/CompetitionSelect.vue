<template>
    <el-button type="text" @click="open">
        <span class="highlight-text btn-label font-14 font-500 text-btn">查询</span>
        <el-dialog
            :show-close="false"
            lock-scroll
            destroy-on-close
            append-to-body
            close-on-press-escape
            @close="close"
            :visible="visible"

        >
            <div class="w-100 h-100">
                <search-input class="w-100" :search.sync="search" @search="searchCompetition" />
                <div class="flex align-center m-t-5">
                    <el-date-picker
                        class="time-picker"
                        :clearable="false"
                        v-model="showTime"
                        type="date"
                        @change="selectTime"
                        value-format="yyyy-MM-dd"
                        :disabled="!!search"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-select
                        class="m-l-30 flex-1"
                        v-model="leagueType"
                        placeholder="选择联赛"
                        clearable
                        filterable
                        :disabled="!!search"
                        @change="changeValue">
                        <el-option
                            v-for="item in leagueTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="table m-t-10">
                    <el-table
                        v-loading="loading"
                        :data="competitions"
                        :show-header="false"
                        height="100%"
                        @row-click="rowClick"
                        :row-class-name="dynamicRow"
                    >
                        <el-table-column
                            prop="matchTime"
                            :min-width="120"
                        />
                        <el-table-column
                            prop="leagueChsShort"
                            align="center"
                            :min-width="100"
                        />
                        <el-table-column
                            prop="matchTime"
                            :min-width="150"
                        >
                            <template slot-scope="scope">
                                <span>{{  scope.row.homeChs }} vs {{ scope.row.awayChs }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="footer p-t-20" slot="footer">
                <el-button class="confirm" @click="confirm">确定</el-button>
                <el-button class="cancel" type="info" @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </el-button>
</template>

<script>
import dayjs from 'dayjs'
import SearchInput from '../../../components/SearchInput.vue'
import { getLeagues, getMatchesByDay, getCompetitionBySearch } from '@/api/competition/competition'
import { statusCode } from '../../../utils/statusCode'
import { Message } from 'element-ui'
export default {
    name: 'CompetitionSelect',
    components: {
        SearchInput
    },
    props: {
        category: {
            type: [String, Number],
            default: 1
        },
        time: {
            type: String,
            default: ''
        },
        isBook: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            visible: false,
            showTime: '',
            leagueTypeOptions: [],
            leagueType: null,
            competitions: [],
            matchId: null,
            matchStr: '',
            search: ''
        }
    },
    created () {
        this.showTime = this.time
    },
    watch: {
        category: {
            handler () {
                this.leagueType = ''
                this.showTime = this.showTime || this.time
                this.init()
            },
            immediate: true
        }
    },
    methods: {
        async searchCompetition () {
            if (this.search) {
                this.clearChose()
                this.loading = true
                this.competitions = []
                try {
                    const { code, data } = await getCompetitionBySearch({
                        type: this.category,
                        search: this.search
                    })
                    if (code === statusCode.success) {
                        const temp = data || []
                        // 过滤掉时间问题
                        // const list = temp.filter(item => {
                        //     return dayjs(item.matchTime).isAfter(dayjs(), 'minute')
                        // })
                        this.competitions = temp.reduce((all, item) => {
                            const showLabel = `${item.leagueChsShort} ${item.homeChs} ${item.matchId ? 'VS' : ''} ${item.awayChs}`
                            all.push({
                                isSelect: false,
                                ...item,
                                id: item.matchId,
                                value: item.matchId,
                                label: showLabel
                            })
                            return all
                        }, [])
                    }
                } catch (e) {
                    console.log(e, '出错了')
                } finally {
                    this.loading = false
                }
            } else {
                this.init()
            }
        },
        init () {
            this.getLeagues()
            this.changeValue()
        },
        close () {
            this.visible = false
        },
        open () {
            this.visible = true
        },
        cancel () {
            this.close()
        },
        confirm () {
            this.$emit('update:time', this.showTime)
            this.$emit('update:liveType', this.leagueType)
            this.$emit('update:id', this.matchId)
            this.$emit('update:idStr', this.matchStr)
            this.close()
        },
        selectTime () {
            this.leagueType = null
            this.getLeagues()
            this.fetchData()
        },
        async getLeagues () { // 获取联赛 列表
            try {
                this.leagueTypeOptions = [
                    {
                        id: 'all',
                        label: '全部',
                        value: 'all'
                    }
                ]
                const time = dayjs(this.showTime).format('YYYY-MM-DD')
                const { data, code } = await getLeagues(this.category, time, 4000)
                if (code === statusCode.success) {
                    data && data.forEach(item => {
                        this.leagueTypeOptions.push({
                            ...item,
                            id: item.leagueId,
                            value: item.leagueId,
                            label: item.nameChsShort

                        })
                    })
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async fetchData () {
            this.clearChose()
            this.loading = true
            try {
                this.competitionOptions = []
                const { data, code, msg } = await getMatchesByDay({
                    leagueType: this.category,
                    leagueId: this.leagueType === 'all' ? null : this.leagueType,
                    day: this.showTime,
                    schedule: this.isBook ? 1 : null
                })
                if (code === statusCode.success) {
                    this.competitions = data && data.reduce((all, item) => {
                        const showLabel = `${item.leagueChsShort} ${item.homeChs} ${item.matchId ? 'VS' : ''} ${item.awayChs}`
                        all.push({
                            isSelect: false,
                            ...item,
                            id: item.matchId,
                            value: item.matchId,
                            label: showLabel
                        })
                        return all
                    }, [])
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.loading = false
            }
        },
        changeValue () {
            this.fetchData()
        },
        rowClick (row) {
            this.competitions.forEach(item => {
                if (item.id === row.id) {
                    item.isSelect = true
                } else {
                    item.isSelect = false
                }
            })
            this.matchId = row.matchId
            this.matchStr = row.homeChs + 'vs' + row.awayChs
        },
        clearChose () {
            this.matchId = null
            this.matchStr = ''
        },
        dynamicRow ({ row }) {
            return row.isSelect ? 'is-active' : ''
        }
    }
}

</script>

<style lang="scss" scoped>
::v-deep {
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        height: 450px;
        padding-bottom: 0!important;
    }
    .el-dialog__footer {
        padding-top: 0!important;
    }
    .footer {
        border-top: 1px solid #D8D8D8;
        .el-button {
            width: 100px;
            color: #fff;
        }
    }
    .confirm {
        background-color: #A05A77;
        &:hover {
            opacity: 0.9;
        }
    }
    .el-table__row.is-active {
        background-color: #D8D8D8;
    }
    .el-table {
      &:before {
        display: none;
      }
    }
}
.table {
    border-top: 1px solid #D8D8D8;
    height: calc(100% - 100px);
}

</style>
