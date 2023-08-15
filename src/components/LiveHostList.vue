<template>
<div class="p-t-10 p-b-10 p-l-20 p-r-20">
  <template v-if="selfList.length">
    <div class="self">
      <template
          v-for="host in  selfList"
      >
        <AnchorInfo
            class="m-t-10 m-b-10"
            :key="host.id"
            :anchor="host"
        />
      </template>
    </div>
    <div class="divide-line m-t-15 m-b-15"></div>
  </template>
  <div class="recommend">
    <p class="title">推荐主播</p>
    <div class="">
      <template
          v-for="host in  recommendList"
      >
        <AnchorInfo
            class="m-t-10 m-b-10"
            :key="host.id"
            :anchor="host"
        />
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { getHostList } from '@/api/Host/Host'
import { getMatchLive, getHotRooms } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import AnchorInfo from '@/views/Competition/Components/AnchorInfo'
export default {
    name: 'LiveHostList',
    props: {
        matchId: {
            type: [String, Number],
            default: ''
        }
    },
    components: {
        AnchorInfo
    },
    data () {
        return {
            hosts: [],
            recommendList: [],
            selfList: []
        }
    },
    created () {
        this.init()
        this.initRecommend()
        this.fetchData()
    },
    methods: {
        async initRecommend () {
            try {
                const { data, code } = await getHotRooms({
                    pageSize: 3,
                    pageNumber: 1
                })
                if (code === statusCode.success) {
                    this.recommendList = (data && data.list) || []
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async init () {
            try {
                const { data, code } = await getMatchLive({
                    pageSize: 3,
                    pageNumber: 1,
                    matchId: this.matchId
                })
                if (code === statusCode.success) {
                    this.selfList = (data && data.list) || []
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        async fetchData () {
            try {
                const { data, code, msg } = await getHostList(2)
                if (code === statusCode.success) {
                    this.hosts = (data || []).reduce((all, item) => {
                        all.push({
                            ...item,
                            img: item.logo
                        })
                        return all
                    }, [])
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.divide-line{
  width: 100%;
  height: 1px;
  background-color: #A4DCFF;
}
</style>
