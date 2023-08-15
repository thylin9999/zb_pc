<template>
<div class="box">
    <div class="lines p-t-10 min-h-300"
         v-loading="loading"
         v-infinite-scroll="load"
    >
        <template v-if="lives.length">
            <div class="row p-relative w-100 flex align-center">
            <span
                class="end-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
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
                        :class="{
                            'is-basketball': !isFootball
                        }"
                    >{{ row.matchTime}}'</span>
                    <span
                        class="text-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
                    ></span>
                    <div class="content m-l-25 flex ">
<!--                    <span class="type d-inline-block bg-size-100 bg-no-repeat bg-center"-->
<!--                          v-lazy:background-image="require(`../../../../assets/images/live-room/statics/${row.icon}.png`)"-->
<!--                    ></span>-->
                        <div class="m-l-5 font-12 font-regular text-999">{{ row.content}}</div>
                    </div>
                    <span v-if="lives.length -1 !== index" class="line p-absolute d-inline-block"></span>
                </div>
            </template>
        </template>
      <no-data v-if="!loading && !lives.length" />
    </div>
</div>
</template>

<script>
import { getTextLive } from '@/api/competition/competition'
import DynamicDot from '@/views/components/DynamicDot'
import NoData from '@/components/NoData'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'

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
        isFootball () {
            return this.matchInfo && this.matchInfo.leagueType === 1
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
                    this.matchInfo.leagueType,
                    null,
                    this.pagination.currentPage,
                    this.pagination.pageSize
                )
                if (code === statusCode.success) {
                    const tempList = (data && data.list) || []
                    this.pagination.total = data.total
                    const list = tempList.reduce((all, item) => {
                        /*
                        * content
                        * id
                        * time
                        * */
                        // const icon = this.footballStaticsKinds.find(x => x.id === item.kind)
                        const time = item.content.split("'")[0]
                        all.push({
                            ...item,
                            matchTime: time
                            // icon: icon.icon
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
        }
    }
}
</script>

<style lang="scss" scoped>
.lines {
    width: 850px;
    margin: 0 auto;
    padding-left: 100px;
    line-height: 17px;
    height: 500px;
    overflow-y: auto;
    .row {
        margin-bottom: 20px;
    }
    .time {
        left: -40px;
      &.is-basketball {
        left: -100px;
      }
    }
    .text-icon {
        width: 20px;
        height: 20px;
        background-image: url('../../../../assets/images/live-room/statics/text.png');
    }
    .end-icon {
        width: 20px;
        height: 20px;
        //background-image: url('../../../../assets/images/live-room/statics/end.png');
    }
    .type{
        width: 15px;
        height: 15px;
    }
    .line {
        width: 1px;
        height: 20px;
        background-color: #D8D8D8;
        top: 100%;
        left: 8px;
    }
}
</style>
