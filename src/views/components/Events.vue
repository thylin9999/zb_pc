<template>
<div class="w-100 p-t-15">
    <title-row
        icon="gift-event"
        title="精彩有礼"
    />
    <div class="w-100 events m-t-15">
        <ul class="flex justify-between">
            <li
                class="event-item bg-center bg-no-repeat bg-size-cover"
                v-for="event in events"
                :key="event.id"
                @click="clickBanner(event)"
            >
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import { getEvents } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'Events',
    components: {
        TitleRow
    },
    data () {
        return {
            events: [
                {
                    id: 1,
                    cover: require('../../assets/images/home/events/1.jpg')
                },
                {
                    id: 2,
                    cover: require('../../assets/images/home/events/2.jpg')
                }
            ]
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data, code } = await getEvents(3)
                if (code === statusCode.success) {
                    this.events = data.slice(0, 2)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        clickBanner (item) {
            if (item.type === 1) { // 1，无， 2.内跳，3.外跳
                return
            }
            if (item.type === 2) {
                this.$router.push(item.links)
            }
            if (item.type === 3) {
                window.open(item.links, 'blank')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.event-item {
    width: 595px;
    height: 200px;
    background-color: #C9CFED;
    border-radius: 10px;
}
.events {
    padding-bottom: 20px;
}
</style>
