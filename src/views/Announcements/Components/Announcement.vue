<template>
<div class="announce overflow-y-auto h-100 p-l-25 p-r-10">
    <template v-if="announces.length">
        <ul v-if="!showDetail" class="list">
            <template v-for="announce in announces">
                <li :key="announce.id" class="item pointer p-b-10 p-t-10 flex font-12 flex align-center justify-between" @click="goToDetail(announce)">
                    <span class="badge d-inline-block p-l-10 p-r-10 text-center font-12 font-400 font-regular font-14">播球公告</span>
                    <div class="flex title p-l-10 text-333">
                        <custom-span :content="announce.title"></custom-span>
                    </div>
                    <span class="time d-inline-block font-400 text-center">{{ announce.update_time | timeFilter}}</span>
                </li>
            </template>
        </ul>
        <div v-else class="detail h-100">
            <AnnouncementDetail :detail="showAd" @backToList="backToList"/>
        </div>
    </template>
</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
import AnnouncementDetail from '@/views/Announcements/Components/AnnouncementDetail'
import { getAd } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'
export default {
    name: 'Announcement',
    filters: {
        timeFilter (value) {
            if (!value) return
            return dayjs(value).format('YYYY-MM-DD')
        }
    },
    components: {
        CustomSpan,
        AnnouncementDetail
    },
    data () {
        return {
            showDetail: false,
            announces: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data, code } = await getAd({})
                if (code === statusCode.success) {
                    this.announces = data.list
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        goToDetail (announce) {
            this.showDetail = true
            this.showAd = announce
        },
        backToList () {
            this.showDetail = false
        }
    }
}
</script>

<style lang="scss" scoped>
.announce {
    li.item {
        border-bottom: 1px solid #C7C7C7;
    }
    .badge {
        width: 80px;
        line-height: 23px;
        color: #848484;
        border: 1px solid #C7C7C7;
        border-radius: 3px;
    }
    .time {
        width: 80px;
        color: #848484;
    }
    .title {
        width: calc(100% - 160px);
    }
}

</style>
