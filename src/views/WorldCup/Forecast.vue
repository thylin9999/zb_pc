<template>
<div class="forecast">
    <div class="CupPrediction_steparr">
        <div class="CupPrediction_step"
             :class="{
                'is-active': currentStage >= 1
             }">小组赛</div>
        <div class="CupPrediction_step"
             :class="{
                'is-active': currentStage >= 2
             }">1/8决赛</div>
        <div class="CupPrediction_step"
             :class="{
                'is-active': currentStage >= 3
             }">1/4决赛</div>
        <div class="CupPrediction_step"
             :class="{
                'is-active': currentStage >= 4
             }"
        >半决赛</div>
        <div class="CupPrediction_step"
             :class="{
                'is-active': currentStage >= 5
             }"
        >决赛</div>
        <div class="CupPrediction_step">完成</div>
    </div>
    <div class="p-relative PredictionBall_PredictionBall">
        <div class="PredictionBall_notice">{{ tip }}</div>
        <div class="group-team flex flex-wrap align-center justify-center">
            <template v-if="currentStage === 1">
                <template
                    v-for="(group, key) in groupTeams"
                >
                    <Group
                        :class="{
                        'left-side': leftSides.includes(key)
                    }"
                        :key="key"
                        :groupName="key"
                        @changeGroup="changeGroup"
                        :group="group"/>
                </template>
            </template>
            <template v-if="currentStage === 2">
                <Battle1Vs8 :can-next-step.sync="canNextStep"/>
            </template>
            <template v-if="currentStage === 3">
                <Battle1Vs4 :can-next-step.sync="canNextStep"/>
            </template>
            <template v-if="currentStage === 4">
                <Battle1Vs2 :can-next-step.sync="canNextStep"/>
            </template>
            <template v-if="currentStage === 5">
                <Battle1Vs1 :can-next-step.sync="canNextStep"/>
            </template>
        </div>
        <div class="PredictionBall_confirm flex justify-center align-center">
            <div v-if="currentStage > 1" class="PredictionBall_button prev-button is-active" @click="prevStep">上一步</div>
            <div v-if="currentStage !== 5" class="PredictionBall_button" @click="nextStep">下一步</div>
            <div v-if="currentStage === 5" class="PredictionBall_button is-active" @click="submit">提交</div>
        </div>
    </div>
</div>
</template>

<script>
import Group from '@/views/WorldCup/Group'
import Battle1Vs8 from '@/views/WorldCup/Battle1Vs8'
import Battle1Vs4 from '@/views/WorldCup/Battle1Vs4'
import Battle1Vs2 from '@/views/WorldCup/Battle1Vs2'
import Battle1Vs1 from '@/views/WorldCup/Battle1Vs1'
import { Message } from 'element-ui'
import { getItem, setItem } from '@/utils/cookie'
import { mapMutations, mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
    name: 'Forecast',
    components: {
        Group,
        Battle1Vs8,
        Battle1Vs4,
        Battle1Vs2,
        Battle1Vs1
    },
    data () {
        return {
            teams: [
                {
                    id: 1,
                    name: '荷兰',
                    group: 'A',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160309103_512x512.png&w=64&q=75'
                },
                {
                    id: 2,
                    name: '塞内加尔',
                    group: 'A',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160359016_512x512.png&w=128&q=75'
                },
                {
                    id: 3,
                    name: '厄瓜多尔',
                    group: 'A',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160243772_512x512.png&w=128&q=75'
                },
                {
                    id: 4,
                    name: '卡塔尔',
                    group: 'A',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160330559_512x512.png&w=128&q=75'
                },
                {
                    id: 5,
                    name: '威尔士',
                    group: 'B',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160550348_512x512.png&w=128&q=75'
                },
                {
                    id: 6,
                    name: '英格兰',
                    group: 'B',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160441250_512x512.png&w=128&q=75'
                },
                {
                    id: 7,
                    name: '美国',
                    group: 'B',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160528311_512x512.png&w=128&q=75'
                },
                {
                    id: 8,
                    name: '伊朗',
                    group: 'B',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160504920_512x512.png&w=128&q=75'
                },
                {
                    id: 9,
                    name: '波兰',
                    group: 'C',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160714024_512x512.png&w=128&q=75'
                },
                {
                    id: 10,
                    name: '墨西哥',
                    group: 'C',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160646819_512x512.png&w=128&q=75'
                },
                {
                    id: 11,
                    name: '阿根廷',
                    group: 'C',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160612915_512x512.png&w=128&q=75'
                },
                {
                    id: 12,
                    name: '沙特阿拉伯',
                    group: 'C',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160740862_512x512.png&w=128&q=75'
                },
                {
                    id: 13,
                    name: '丹麦',
                    group: 'D',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160843165_512x512.png&w=128&q=75'
                },
                {
                    id: 14,
                    name: '法国',
                    group: 'D',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160908653_512x512.png&w=128&q=75'
                },
                {
                    id: 15,
                    name: '突尼斯',
                    group: 'D',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160929705_512x512.png&w=128&q=75'
                }, {
                    id: 16,
                    name: '澳大利亚',
                    group: 'D',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160821412_512x512.png&w=128&q=75'
                },
                {
                    id: 17,
                    name: '西班牙',
                    group: 'E',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161150151_512x512.png&w=128&q=75'
                },
                {
                    id: 18,
                    name: '德国',
                    group: 'E',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161053848_512x512.png&w=128&q=75'
                },
                {
                    id: 19,
                    name: '哥斯达黎加',
                    group: 'E',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803160956688_512x512.png&w=128&q=75'
                },
                {
                    id: 20,
                    name: '日本',
                    group: 'E',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161118128_512x512.png&w=128&q=75'
                },
                {
                    id: 21,
                    name: '克罗地亚',
                    group: 'F',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161611067_512x512.png&w=128&q=75'
                },
                {
                    id: 22,
                    name: '比利时',
                    group: 'F',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161526902_512x512.png&w=128&q=75'
                },
                {
                    id: 23,
                    name: '加拿大',
                    group: 'F',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161549317_512x512.png&w=128&q=75'
                },
                {
                    id: 24,
                    name: '摩洛哥',
                    group: 'F',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161636531_512x512.png&w=128&q=75'
                },
                {
                    id: 25,
                    name: '瑞士',
                    group: 'G',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161819686_512x512.png&w=128&q=75'
                },
                {
                    id: 26,
                    name: '巴西',
                    group: 'G',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161700191_512x512.png&w=128&q=75'
                },
                {
                    id: 27,
                    name: '喀麦隆',
                    group: 'G',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161726504_512x512.png&w=128&q=75'
                },
                {
                    id: 28,
                    name: '塞尔维亚',
                    group: 'G',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161751628_512x512.png&w=128&q=75'
                },
                {
                    id: 29,
                    name: '葡萄牙',
                    group: 'H',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161931351_512x512.png&w=128&q=75'
                },
                {
                    id: 30,
                    name: '乌拉圭',
                    group: 'H',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161952664_512x512.png&w=128&q=75'
                },
                {
                    id: 31,
                    name: '韩国',
                    group: 'H',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161904186_512x512.png&w=128&q=75'
                },
                {
                    id: 32,
                    name: '加纳',
                    group: 'H',
                    img: 'https://www.dqty.com/_next/image?url=https%3A%2F%2Fsta-prod-score01.zkreen.com%2Fteams%2F20220803%2F20220803161839201_512x512.png&w=128&q=75'
                }
            ],
            groupTeams: {},
            leftSides: [
                'A',
                'C',
                'E',
                'G'
            ],
            currentStage: 1, // 小组赛
            stage1Res: {}, // 小组赛结果
            stageRes: [],
            showStage2: false, // 1/8决赛
            canNextStep: false,
            tips: [
                '请选择每个小组的前两名晋级16强',
                '请选择每个小组的前1名晋级8强',
                '请选择每个小组的前1名晋级4强',
                '请选择每个小组的前1名晋级半决赛',
                '请选择本届世界杯冠军'
            ]
        }
    },
    computed: {
        ...mapState('commonData', ['stage2Res']),
        tip () {
            return this.tips[this.currentStage - 1]
        }
    },
    created () {
        const stage1Res = getItem('stage1Res')
        this.stage1Res = stage1Res ? JSON.parse(stage1Res) : {}
        this.SET({ stage1Res: this.stage1Res })

        const stage2Res = getItem('stage2Res')
        this.SET({ stage2Res: stage2Res || {} })
        this.canNextStep = this.handleStage1Res()
        this.init()
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        submit () {
            const prevSubmitInfo = getItem('submitTime')
            const _info = prevSubmitInfo ? JSON.parse(prevSubmitInfo) : ''
            let canSubmit = !_info // 没有信息是可以提交的
            if (_info) {
                const time = _info.time
                canSubmit = dayjs().isAfter(dayjs(time), 'day')
            }
            if (canSubmit) {
                const stage1Res = getItem('stage1Res')
                const stage2Res = getItem('stage2Res')
                const stage3Res = getItem('stage3Res')
                const stage4Res = getItem('stage4Res')
                const stage5Res = getItem('stage5Res')
                const submitInfo = JSON.stringify({
                    token: this.token,
                    stageDatas: {
                        stage1Res,
                        stage2Res,
                        stage3Res,
                        stage4Res,
                        stage5Res
                    },
                    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                setItem('submitTime', submitInfo)
                Message.success('提交成功')
                this.$emit('changeExpireTime')
            } else {
                const originData = _info.stageDatas
                setItem('stage1Res', originData.stage1Res)
                setItem('stage2Res', originData.stage2Res)
                setItem('stage3Res', originData.stage3Res)
                setItem('stage4Res', originData.stage4Res)
                setItem('stage5Res', originData.stage5Res)
                Message.warning('一天只能提交一次！')
            }
        },
        init () {
            this.groupTeams = this.teams.reduce((all, item) => {
                const groupKey = item.group
                if (!all[groupKey]) {
                    all[groupKey] = []
                }
                all[groupKey].push({ ...item })
                return all
            }, {})
        },
        changeGroup ({ key, res }) {
            this.stage1Res[key] = [...res]
            this.canNextStep = this.handleStage1Res()
            this.SET({ stage1Res: this.stage1Res })
            setItem('stage1Res', JSON.stringify(this.stage1Res))
        },
        handleStage1Res () {
            const keys = Object.keys(this.stage1Res)
            return keys.every(key => this.stage1Res[key] && this.stage1Res[key].length === 2) && keys.length === 8
        },
        nextStep () {
            if (!this.canNextStep) return
            this.currentStage++
            this.canNextStep = false
        },
        prevStep () {
            this.currentStage--
        }
    }
}
</script>

<style lang="scss" scoped>
.CupPrediction_steparr {
    padding: 20px 12px 12px;
    display: flex;
    justify-content: center;
    margin-top: 141px;
    .CupPrediction_step {
        width: 120px;
        height: 42px;
        background-image: url('../../assets/images/worldCup/btn-zu-xuanzhong-n.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        color: hsla(0,0%,100%,.7);
        display: flex;
        justify-content: center;
        align-items: center;
        &.is-active {
            margin-right: 12px;
            background-image: url('../../assets/images/worldCup/zhong-h.png');
        }
    }
}
.group-team {
    .left-side {
        margin-right: 12px;
    }
}
.PredictionBall_confirm {
    width: 632px;
    left: 234px;
    height: 68px;
    position: absolute;
    bottom: -4px;
    padding: 12px 0;
    display: flex;
    justify-content: center;
    .PredictionBall_button {
        width: 310px;
        height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 700;
        text-align: justify;
        color: hsla(0,0%,100%,.5);
        background-image: url('../../assets/images/worldCup/btn-xiayibu-no@.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        &:hover {
            background-image: url('../../assets/images/worldCup/btn-xiayibu-hover.png');
        }
        &.is-active {
            width: 310px;
            height: 60px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-radius: 8px;
            box-shadow: inset 0 -1.7px 11px 0 #ff004c;
            background-image: linear-gradient(180deg,#c90c46,#a0103e);
            cursor: pointer;
            font-size: 18px;
            font-weight: 700;
            text-align: justify;
            color: #fff;
        }
        &.prev-button {
            margin-right: 12px;
        }
    }
}
.PredictionBall_PredictionBall {
    padding: 12px;
    position: relative;
    height: 600px;
    .PredictionBall_notice {
        height: 17px;
        font-size: 20px;
        text-align: center;
        color: #fff;
        margin-bottom: 30px;
    }
}
</style>
