<template>
<div class=" p-t-15 ">
    <title-row class="title-row m-b-25" icon="un-live" title="未开播" />
    <div
        class="list bg-white p-t-15 p-b-25"
        :class="{'flex align-center justify-center': !tableData.length}"
        v-loading="isLoading">
        <div v-if="tableData.length" class="host-list">
            <ul v-if="tableData.length" class="w-100 flex flex-wrap">
                <li
                    v-for="host in tableData"
                    :key="host.id"
                    class="flex  host-item align-center"
                >
                    <div class="left-section flex align-center">
                        <div
                            class="icon border-radius-50 m-r-10 bg-no-repeat bg-center bg-size-cover"
                            :style="{
                                backgroundImage: `url(${host.logo})`
                            }"
                        ></div>
                        <div class="flex host-info flex-column ">
                            <span class="font-16 host-name font-regular">{{ host.anchor_name }}</span>
                            <custom-span
                                class="font-12 m-t-10 text-888 w-100"
                                :content="host.sign || replaceSign"
                            />
                        </div>
                    </div>
                    <span
                        class="subscribe-button text-center font-16 pointer"
                        :class="{'is-subscribed': host.isSubscribe }"
                        v-throttle="[()=>followOrUnFollowHost(host),3000]"
                    >{{ host.isSubscribe ? '已订阅' : '订阅'}}</span>
                </li>
            </ul>
        </div>
        <el-empty v-else :image-size="108"></el-empty>
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import { followHost, getOfflineHost } from '@/api/Host/Host'
import CustomSpan from '@/components/CustomSpan'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
export default {
    name: 'NotSubscribeBroadcast',
    components: {
        TitleRow,
        CustomSpan
    },
    data () {
        return {
            tableData: [],
            isLoading: false

        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        ...mapState('user', ['token']),
        replaceSign () {
            return '暂无主播简介'
        }
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const res = await getOfflineHost(1)
                console.log(res, 'res')
                this.tableData = res.data.reduce((all, item) => {
                    all.push({
                        ...item,
                        isSubscribe: item.is_follow * 1 === 1
                    })
                    return all
                }, [])
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        async followOrUnFollowHost (host) {
            if (!this.token) {
                Message.error('请先登录，无法预约！')
                this.openLoginDialogMixin()
                return
            }
            try {
                const { msg } = await followHost(host.member_id)
                Message.success(msg)
                this.fetchData()
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    //min-height: 300px;
    .item {
        width: 290px;
    }
}
.host-list {
    padding: 0 20px 0 30px;
    .host-item {
        margin: 12.5px 50px 12.5px 0;

    }
    .left-section {
        width: calc(100%  - 120px);
        .host-info {
            width: calc(100% - 65px);
        }
        .host-name{
            line-height: 16px;
            color: #444343;
        }
        .icon {
            width: 49.5px;
            height: 47.5px;
        }
    }
}
.subscribe-button {
    color: #05195A;
    font-weight: 400;
    line-height: 30px;
    width: 120px;
    height: 30px;
    border-radius: 16px;
    border: 1px solid #05195A;
    &.is-subscribed {
        color: #6B6B6B;
        border: 1px solid #6B6B6B;
    }
    &:hover {
        background-color: #05195A;
        color: #fff;
    }
}
::v-deep {
    .el-empty {
        padding: 0!important;
    }
    .title-row {
        .icon {
            width: 24px!important;
        }
    }
}
</style>
