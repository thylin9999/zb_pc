<template>
<div class="box">
    <div class="title p-l-25">
        <span class="text-333 font-16 font-600">我关注的直播</span>
    </div>
    <div class="hosts p-15 loading-height"
         v-loading="isLoading"
         element-loading-background="transparent"
    >
        <ul v-if="list.length" class="list flex flex-wrap">
            <li
                v-for="host in list"
                :key="host.id"
                class="host-item m-r-10 m-b-10"
            >
                <HostCard class="w-100 h-100 p-t-10 p-b-10 p-l-15 p-r-15" :host-info="host" @refresh="fetchData"/>
            </li>
        </ul>
        <NoData v-if="list && !list.length && !isLoading" >
            <span>暂无数据</span>
        </NoData>
    </div>
</div>
</template>

<script>
import { getSubscribeHosts } from '@/api/Host/Host'
import HostCard from '@/components/HostCard'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import NoData from '@/components/NoData.vue'
export default {
    name: 'MyFavorite',
    components: {
        HostCard,
        NoData
    },
    data () {
        return {
            list: [],
            isLoading: false
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                const { data, code, msg } = await getSubscribeHosts()
                if (code === statusCode.success) {
                    console.log(data, 'data')
                    this.list = (data && data.list) || []
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
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
.box {
    min-height: 500px;
    height: 100%;
}
.host-item{
    width: 285px;
    height: 60px;
}
</style>
