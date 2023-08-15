<template>
<div class="my-broadcasts">
    <div class="title p-l-25">
        <span class="text-333 font-16 font-600">我的直播</span>
    </div>
    <div class="m-l-30 p-t-10 p-b-10 p-r-15 flex justify-between align-center">
        <ul class="flex align-center ">
            <li
                v-for="item in menus"
                :key="item.id"
                class="pointer p-l-15 p-r-15 text-center item-type"
                :class="{'is-active': item.id === currentType}"
                @click="changeType(item)"
            >{{ item.title }}</li>
        </ul>
    </div>
    <div class="table w-100 p-l-15 m-t-15 p-r-15 p-b-15">
        <el-table
            :key="currentType"
            :data="list"
            border
            fit
            :height="tableHeight"
            v-loading="isLoading"
        >
            <el-table-column
                v-if="!isBooked"
                prop="id"
                align="center"
                label="比赛id"
                min-width="120" />
            <el-table-column
                prop="type"
                align="center"
                label="比赛类型"
                min-width="100" />
            <el-table-column
                prop="title"
                align="center"
                label="直播标题"
                show-overflow-tooltip
                min-width="120" />
            <el-table-column
                :prop="isBooked ? 'matchTime' : 'start_time'"
                align="center"
                label="开始时间"
                min-width="180" />
            <el-table-column
                v-if="isFinished"
                prop="end_time"
                align="center"
                label="结束时间"
                min-width="180" />
            <template v-if="!isFinished">
                <el-table-column
                    prop="placard"
                    label="直播公告"
                    align="center"
                    show-tooltip-when-overflow
                    min-width="120" />
            </template>
            <template v-else>
                <el-table-column
                    prop="liveTime"
                    label="直播时长"
                    align="center"
                    show-tooltip-when-overflow
                    min-width="120" />
            </template>
            <el-table-column
                v-if="!isFinished"
                prop="leagueType"
                align="center"
                label="操作"
                :min-width="isGoing ? 150 : 250" >
                <template slot-scope="scope">
                    <template v-if="isBooked">
                        <el-button class="confirm-button" small @click="beforeStartBroadcast(scope.row)">开播</el-button>
                        <el-button  small @click="cancel(scope.row)">取消</el-button>
                    </template>
<!--                    <el-button v-if="isFinished" small @click="cancel(scope.row)">取消预约</el-button>-->
                    <el-button v-if="isGoing" small @click="closeBroadcast(scope.row)">下播</el-button>
<!--                    <span @click="cancel(scope.row)">取消预约</span>-->
                </template>
            </el-table-column>
        </el-table>
        <div v-if="isGoing" class="obs m-t-15">
            <div class="font-medium obs font-16 obs p-b-25">
                <div class="flex align-center" >
                    <div class="m-r-15">
                        OBS推流地址：{{obs.url }}
                    </div>
                    <el-tooltip content="复制">
                        <i class="el-icon-copy-document pointer" @click="copyObs(obs.url)"></i>
                    </el-tooltip>
                </div>
                <div class="flex align-center m-t-5">
                    <div class="m-r-15">
                        OBS串流秘钥：{{obs.key}}
                    </div>
                    <el-tooltip content="复制">
                        <i class="el-icon-copy-document pointer" @click="copyObs(obs.key)"></i>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
    <DialogOpenLiveTip :visible.sync="showOpenLive" @confirm="startBroadcast"/>
</div>
</template>

<script>
import DialogOpenLiveTip from '@/views/PersonalCenter/Components/DialogOpenLiveTip'
import {
    getBookedMatches,
    bookOpenBroadcast,
    cancelSubscribe,
    getMyBroadcastHistory,
    closeLive,
    getOBSAddress
} from '@/api/Host/Host'
import { matchTypes, calcTime } from '@/utils/utils'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { Copy } from '@/utils/validator'
export default {
    name: 'MyBroadcast',
    components: {
        DialogOpenLiveTip
    },
    data () {
        return {
            list: [],
            currentType: 3,
            isLoading: false,
            menus: [
                {
                    id: 3,
                    title: '未开始'
                },
                {
                    id: 1,
                    title: '直播中'
                },
                {
                    id: 2,
                    title: '已结束'
                }
            ],
            showOpenLive: false,
            currentRow: null,
            obs: {}
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        apiParams () {
            return this.currentType === 3 ? null : {
                pageNumber: 1,
                pageSize: 2000,
                status: this.currentType
            }
        },
        isBooked () {
            return this.currentType === 3
        },
        isFinished () {
            return this.currentType === 2
        },
        isGoing () {
            return this.currentType === 1
        },
        tableHeight () {
            return this.isGoing ? null : '100%'
        }
    },
    watch: {
        currentType () {
            this.fetchData()
        }
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const request = this.currentType === 3 ? getBookedMatches : getMyBroadcastHistory
                const { data } = await request(this.apiParams, this.currentType === 3 ? 100 : null)
                if (data) {
                    if (this.currentType === 3) {
                        this.list = data.list.reduce((all, item) => {
                            all.push({
                                ...item,
                                type: matchTypes[item.leagueType]
                            })
                            return all
                        }, [])
                    } else {
                        // 进行中,已结束
                        this.list = data.list.reduce((all, item) => {
                            all.push({
                                ...item,
                                type: matchTypes[item.type],
                                title: item.room_title,
                                matchTime: new Date(item.start_time),
                                liveTime: this.isFinished ? calcTime(item.live_time) : null
                            })
                            return all
                        }, [])
                        if (this.isGoing) {
                            this.getAddress()
                        }
                    }
                } else {
                    this.list = []
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        changeType (item) {
            this.currentType = item.id
            this.list = []
        },
        async cancel (row) {
            try {
                const { code, msg } = await cancelSubscribe(row.matchId, row.leagueType)
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.fetchData()
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async closeBroadcast (row) {
            // 主播下播
            try {
                const { code, msg } = await closeLive()
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.fetchData()
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        beforeStartBroadcast (row) {
            this.showOpenLive = true
            this.currentRow = {
                ...row
            }
        },
        async startBroadcast () {
            // 一键开播
            const row = this.currentRow
            const { code, msg } = await bookOpenBroadcast(row.id)
            if (code === statusCode.success) {
                Message.success('开播成功')
                this.fetchData()
            } else {
                Message.error(msg)
            }
        },
        openLive () {
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 6
                }
            })
        },
        copyObs (url) {
            Copy(url)
        },
        async getAddress () {
            const { data, code, msg } = await getOBSAddress()
            if (code === statusCode.success) {
                this.obs = data
            } else {
                Message.error(msg)
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
.my-broadcasts {
    min-height: 500px;
    height: 100%;
}
.table {
    height: calc(100% - 105px);
}
.item-type {
    width: 150px;
    height: 40PX;
    line-height: 40px;
    border-bottom: 2px solid transparent;
    &.is-active {
        border-bottom: 2px solid #FBA187;
    }
}
</style>
