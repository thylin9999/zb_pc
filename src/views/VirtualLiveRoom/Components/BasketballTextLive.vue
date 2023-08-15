<template>
<div class="box ">
  <ul class="tab-box flex align-center ">
    <li
        v-for="node in nodes"
        :key="node.id"
        class="flex-1 tab-item pointer text-center font-14"
        :class="{
            'is-active': node.id === currentIndex
        }"
        @click="changeTab(node.id)"
    >
      <span v-if="node.isOt">
        {{ node.label }}
      </span>
        <span v-else>第{{ node.label }}节</span>
    </li>
  </ul>
    <div class="lines min-h-300 p-t-30"
         v-loading="loading"
         v-infinite-scroll="load"
         element-loading-background="transparent"
    >
        <template v-if="lives.length">
            <div class="row p-relative w-100 flex align-center">
            <span
                class="end-icon flex align-center justify-center"
            >
              <DynamicDot />
            </span>
                <span  class="line p-absolute d-inline-block"></span>
            </div>
            <template
                v-for="(row, index) in lives"
            >
                <div class="row p-relative w-100 flex align-center" :key="row.id">
                    <span
                        class="p-absolute time font-12 font-regular font-400 text-999"
                    >{{ row.remainTime }}'</span>
                    <span
                        class="text-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
                    ></span>
                    <div class="content m-l-25 flex ">
                        <span class="font-12  text-333 m-r-25">{{ row.score }}</span>
                        <div class="m-l-5 font-12 font-regular text-999">{{ row.content}}</div>
                    </div>
                    <span v-if="lives.length -1 !== index" class="line p-absolute d-inline-block"></span>
                </div>
            </template>
        </template>
      <no-data
          v-if="!loading && !lives.length"
          description="暂无数据" />
    </div>
</div>
</template>

<script>
import { getTextLive } from '@/api/competition/competition'
import DynamicDot from '@/views/components/DynamicDot'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import NoData from '@/components/NoData.vue'
export default {
    name: 'TextLive',
    components: {
        DynamicDot,
        NoData
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            currentIndex: 1,
            list: [],
            lives: [],
            loading: false,
            pagination: {
                total: 0,
                pageSize: 20,
                currentPage: 1
            }
        }
    },
    computed: {
        ...mapState('commonData', ['footballStaticsKinds']),
        nodes () {
            // overtimeCount
            console.log(this.matchInfo, '222')
            const staticList = [{
                id: 1,
                label: '一'
            },
            {
                id: 2,
                label: '二'
            },
            {
                id: 3,
                label: '三'
            }, {
                id: 4,
                label: '四'
            }]
            console.log(this.matchInfo.overtimeCount, 'overtimeCount')
            if (this.matchInfo.overtimeCount) {
                const list = []
                for (let i = 1; i <= this.matchInfo.overtimeCount; i++) {
                    list.push({
                        id: 4 + i,
                        value: `${i}OT`,
                        label: `OT${i}`,
                        isOt: true
                    })
                }
                return [].concat(staticList, list)
            }
            return staticList
        }
    },
    created () {
        this.init(true)
    },
    methods: {
        load () {
            this.pagination.currentPage++
            this.init(false)
        },
        async init (init) {
            try {
                this.loading = true
                const { code, data } = await getTextLive(
                    this.matchId,
                    2,
                    this.currentIndex,
                    this.pagination.currentPage,
                    this.pagination.pageSize
                )
                if (code === statusCode.success) {
                    if (!data) {
                        return
                    }
                    const tempList = (data && data.list) || []
                    this.pagination.total = data.total
                    const list = tempList.reduce((all, item) => {
                        /*
                        * content
                        * kind
                        * matchState
                        * recordId
                        * remainTime
                        * score
                        * */
                        all.push({
                            ...item
                        })
                        return all
                    }, [])
                    if (init) {
                        this.lives = list
                    } else {
                        this.lives = [].concat(this.lives, list)
                    }
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.loading = false
            }
        },
        changeTab (i) {
            this.currentIndex = i
            this.pagination = {
                total: 0,
                pageSize: 20,
                currentPage: 1
            }
            this.init(true)
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-box {
  width: 650px;
  margin: 0 auto;
  background: #FEF2E4;
  .tab-item{
    height: 38px;
    background: transparent;
    border-radius: 3px;
    color: #A7A7A7;
    line-height: 38px;
    &.is-active {
      color: #fff;
      background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
    }
  }
}
.lines {
    width: 651px;
    margin: 0 auto;
    padding-left: 100px;
    line-height: 17px;
    height: 430px;
    overflow-y: auto;
    .row {
        margin-bottom: 20px;
    }
    .time {
        left: -40px;
    }
    .text-icon {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #D8D8D8;
        margin-left: 3px;
        //background-image: url('../../../assets/images/live-room/statics/text.png');
    }
    .end-icon {
        width: 20px;
        height: 20px;
        margin-left: -1px;
        //background-image: url('../../../assets/images/live-room/statics/end.png');
    }
    .type{
        width: 15px;
        height: 15px;
    }
    .line {
        width: 1px;
        height: 30px;
        background-color: #D8D8D8;
        top: calc(100%  - 5px);
        left: 8px;
    }
}
</style>
