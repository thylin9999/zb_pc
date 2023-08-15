<template>
<div class=" p-t-15">
    <title-row icon="tv" title="正在直播" />
    <div class="online-broadcast"
         v-loading="isLoading"
    >
        <ul v-if="tableData.length" class="w-100 flex flex-wrap">
            <li
                class=" p-t-15 p-b-15"
                v-for="competition in tableData"
                :key="competition.id"
            >
                <live-broad-card
                    :info="competition"
                />
            </li>
        </ul>
        <el-empty
            v-else
            :image-size="108"
            description="暂无数据" />
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import LiveBroadCard from '@/components/LiveBroadCard'
import { getOnlineBroadcast } from '@/api/competition/competition'

export default {
    name: 'OnlineBroadcast',
    components: {
        TitleRow,
        LiveBroadCard
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
    methods: {
        async fetchData () {
            this.isLoading = true
            const { data } = await getOnlineBroadcast({})
            console.log(data, 'data')
            this.isLoading = false
            this.tableData = data.list
            console.log(this.tableData, 'adf')
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-white {
    min-height: 230px;
    .empty-div {
        height: 185px;
    }
}
.empty-div {
    background-image: url('../../assets/images/common/empty.png');
    background-size: 105px 80px;
}
.online-broadcast {
    li {
        width: 284px;
        margin-right: 25px;
    }
}
::v-deep {
    .el-empty {
        padding: 0!important;
    }
}

</style>
