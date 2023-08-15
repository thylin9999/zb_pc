<template>
  <div class="w-100 p-b-30">
    <div class="w-100" element-loading-background="transparent">
      <ul v-if="list.length" class="w-100 flex justify-around">
        <li
          v-for="(item, index) in list"
          :key="item.id"
          class="m-r-5 m-b-5"
        >
          <live-broad-card
            style="width: 270px;height: 225px;transform: scale(.8)"
            :index="index"
            :info="item"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 关播后的推荐
import LiveBroadCard from '@/components/LiveBroadCard'
import { getHotRooms } from '@/api/competition/competition'

export default {
    name: 'closeRecom',
    data () {
        return {
            list: []
        }
    },
    components: { LiveBroadCard },
    mounted () {
        this.getHotRooms()
    },
    methods: {
        async getHotRooms () {
            const { code, data } = await getHotRooms({ pageNumber: 1, pageSize: 3, type: 0 })
            if (code === 200) {
                this.list = data.list
            }
        }
    }
}
</script>
