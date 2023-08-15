<template>
  <div>
    <div class="w-100" element-loading-background="transparent">
      <ul v-if="list.length" class="w-100 flex justify-center">
        <li
          v-for="(item, index) in list"
          :key="item.id"
          class="li-item"
        >
          <live-broad-card
            style="width: 270px;height: 225px;"
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
<style scoped lang="scss">
  .li-item{
    width: 270px;
    height: 225px;
    margin: 0 5px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
