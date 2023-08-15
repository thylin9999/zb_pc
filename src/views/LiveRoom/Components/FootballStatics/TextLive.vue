<template>
<div class="box">
    <div class="lines">
        <template v-if="lives.length">
            <div class="row p-relative w-100 flex align-center">
            <span
                class="end-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
            ></span>
                <span  class="line p-absolute d-inline-block"></span>
            </div>
            <template
                v-for="(row, index) in lives"
            >
                <div class="row p-relative w-100 flex align-center" :key="row.id">
                    <span class="p-absolute time font-12 font-regular font-400 text-999">{{ row.matchTime}}'</span>
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
    </div>
</div>
</template>

<script>
import { getTextLive } from '@/api/competition/competition'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'TextLive',
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
            list: [
                {
                    id: 1,
                    time: '2022-09-22',
                    content: '啊是打发第三方',
                    kind: 1
                },
                {
                    id: 2,
                    time: '2022-09-22',
                    content: '啊啊啊阿萨德',
                    kind: 2
                },
                {
                    id: 3,
                    time: '2022-09-22',
                    content: '2121212112',
                    kind: 3
                },
                {
                    id: 7,
                    time: '2022-09-22',
                    content: '阿斯顿发送到发斯蒂芬',
                    kind: 7
                }
            ],
            lives: []
        }
    },
    computed: {
        ...mapState('commonData', ['footballStaticsKinds'])
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            try {
                const { code, data } = await getTextLive(this.matchId)
                if (code === statusCode.success) {
                    const tempList = (data && data.list) || []
                    this.lives = tempList.reduce((all, item) => {
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
                }
            } catch (e) {
                console.log(e, '出错了')
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
    min-height: 80px;
    .row {
        margin-bottom: 20px;
    }
    .time {
        left: -40px;
    }
    .text-icon {
        width: 20px;
        height: 20px;
        background-image: url('../../../../assets/images/live-room/statics/text.png');
    }
    .end-icon {
        width: 20px;
        height: 20px;
        background-image: url('../../../../assets/images/live-room/statics/end.png');
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
