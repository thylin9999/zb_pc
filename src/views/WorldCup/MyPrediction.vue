<template>
    <div class="myPrediction_myPredictionssddd">
        <div class="myPrediction_topboxs">
            <div class="myPredictionitem_myPrediction">
                <div class="myPredictionitem_containbox">
                    <div class="index_container">
                        <template
                            v-for="(stage1, key) in stage1Datas"
                        >
                            <div class="index__step1list flex justify-between"
                                 :key="key"
                                 :class="{
                                'is-first': key === 'A/B'
                             }"
                            >
                                <div>
                                    <template
                                        v-for="item in stage1[0]"
                                    >
                                        <div class="index__itemchild" :key="item.id">
                                            <div class="index__icon">
                                                <img
                                                    :src="item.img"
                                                >
                                            </div>
                                            <div class="index__counters">{{ item.name }}</div>
                                        </div>
                                    </template>
                                </div>
                                <div>
                                    <template
                                        v-for="item in stage1[1]"
                                    >
                                        <div class="index__itemchild" :key="item.id">
                                            <div class="index__icon">
                                                <img
                                                    :src="item.img"
                                                >
                                            </div>
                                            <div class="index__counters">{{ item.name }}</div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>

                    </div>

                    <div class="index__container2">
                        <template
                            v-for="(stage2, key) in stage2Datas"
                        >
                            <div class="index__step2list p-relative flex justify-between"
                                 :key="key"
                            >
                                <template
                                    v-for="(item) in stage2"
                                >
                                    <div class="index__itemchild" :key="item.id">
                                        <div class="index__icon">
                                            <img
                                                :src="item.img"
                                            >
                                        </div>
                                        <div class="index__counters">{{ item.name }}</div>
                                    </div>
                                </template>
                                <div  class="index__linebox1-left"></div>
                                <div  class="index__linebox1-right"></div>
                            </div>
                        </template>
                    </div>

                    <div class="index__container3">
                        <template
                            v-for="(stage3, key) in stage3Datas"
                        >
                            <div class="index__step3list  p-relative flex justify-between"
                                 :key="key + 'stage3'"
                            >
                                <template
                                    v-for="(item) in stage3"
                                >
                                    <div class="index__itemchild" :key="item.id">
                                        <div class="index__icon">
                                            <img
                                                :src="item.img"
                                            >
                                        </div>
                                        <div class="index__counters">{{ item.name }}</div>
                                    </div>
                                </template>
                                <div class="index__linebox2-left"></div>
                                <div class="index__linebox2-right"></div>
                            </div>
                        </template>
                    </div>

                    <div class="index__container4">
                        <div class="myPredictionitem_topimg"></div>
                        <div class="index__topbox">
                            <div class="myPredictionitem_toptitle">总冠军</div>
                            <div class="index__item5child">
                                <div class="index__icon">

                                    <img
                                        :src="stage5Datas.img"
                                    >
                                </div>
                                <div class="index__counters">{{ stage5Datas.name }}</div></div></div>
                        <div class="index__step4list">
                            <template
                                v-for="(stage4) in stage4Datas"
                            >
                                <div
                                    v-for="item in stage4"
                                    class="index__item4child"
                                    :key="item.id">
                                    <div class="index__icon">

                                        <img
                                            :src="item.img"
                                        >
                                    </div>
                                    <div class="index__counters">{{ item.name }}</div>
                                </div>
                            </template>
                            <div class="index__step4title">决赛</div>
                            <div class="index__step4vs">vs</div>
                            <div class="index__linebox4-left"></div>
                            <div class="index__linebox4-right"></div>
                        </div>
                    </div>
                    <div class="myPredictionitem_bottombar">
                        生成我的冠军之路
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getItem } from '@/utils/cookie'
import { mapState } from 'vuex'
export default {
    name: 'MyPrediction',
    data () {
        return {
            groups: [
                'A/B',
                'C/D',
                'E/F',
                'G/H'
            ],
            group2: [
                'A/E',
                'B/F',
                'C/G',
                'D/H'
            ],
            stage1Datas: {},
            stage2Datas: {},
            stage3Datas: {},
            stage4Datas: {},
            stage5Datas: {}
        }
    },
    created () {
        this.initStage2()
        this.initStage3()
        this.initStage4()
        this.initStage5()
        this.initStage6()
    },
    computed: {
        ...mapState('commonData', ['stage2Res', 'stage1Res', 'stage3Res', 'stage4Res', 'stage5Res'])
    },
    methods: {
        initStage6 () {
            const stage5Res = getItem('stage5Res')
            const _stage5Res = stage5Res ? JSON.parse(stage5Res) : {}
            this.SET({ stage5Res: _stage5Res })
            this.stage5Datas = this.stage5Res.A
        },
        initStage5 () {
            const stage4Res = getItem('stage4Res')
            const _stage4Res = stage4Res ? JSON.parse(stage4Res) : {}
            this.SET({ stage4Res: _stage4Res })
            const groups = ['A/B']
            this.stage4Datas = groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage4Res[leftKey],
                    this.stage4Res[rightKey]
                ]
                return all
            }, {})
        },
        initStage4 () {
            const stage3Res = getItem('stage3Res')
            const _stage3Res = stage3Res ? JSON.parse(stage3Res) : {}
            this.SET({ stage3Res: _stage3Res })
            const groups = ['A/C', 'B/D']
            this.stage3Datas = groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage3Res[leftKey],
                    this.stage3Res[rightKey]
                ]
                return all
            }, {})
        },
        initStage3 () {
            const stage2Res = getItem('stage2Res')
            const _stage2Res = stage2Res ? JSON.parse(stage2Res) : {}
            this.SET({ stage2Res: _stage2Res })
            this.stage2Datas = this.group2.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[key] = [
                    this.stage2Res[leftKey],
                    this.stage2Res[rightKey]
                ]
                return all
            }, {})
        },
        initStage2 () {
            const stage1Res = getItem('stage1Res')
            const _stage1Res = stage1Res ? JSON.parse(stage1Res) : {}
            this.SET({ stage1Res: _stage1Res })
            const res = this.groups.reduce((all, key) => {
                const keys = key.split('/')
                const leftKey = keys[0] // A
                const rightKey = keys[1] // B
                // 要交叉
                const arr1 = this.stage1Res[leftKey]
                const arr2 = this.stage1Res[rightKey]
                all[leftKey] = [
                    arr1[0],
                    arr2[1]
                ]
                all[rightKey] = [
                    arr1[1],
                    arr2[0]
                ]
                return all
            }, {})
            this.stage1Datas = this.group2.reduce((all, item) => {
                const keys = item.split('/')
                const leftKey = keys[0]
                const rightKey = keys[1]
                all[item] = [
                    res[leftKey],
                    res[rightKey]
                ]
                return all
            }, {})
        }
    }
}
</script>

<style lang="scss" scoped>
.myPrediction_myPredictionssddd {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;

    .myPrediction_topboxs {
        width: 1100px;
        height: 890px;
        margin: 0 0 40px;
        border-radius: 8px;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 100% 100%;
        .myPredictionitem_myPrediction {
            background-color: #781231;
            width: 100%;
            position: relative;
        }
        .myPredictionitem_containbox {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 890px;
            padding-top: 160px;
            padding-left: 66px;
            border-radius: 8px;
            overflow: hidden;
        }
    }
    .myPredictionitem_containbox {
        background-image: url('../../assets/images/worldCup/imgs-top-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        padding: 80px 13px 0;
        .index_container {
            width: 960px;
            height: 644px;
        }

        .index__container2 {
            width: 724px;
            height: 609px;
            position: absolute;
            left: 183px;
            top: 204px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 2;

        }

        .index__container3 {
            width: 488px;
            height: 428px;
            position: absolute;
            left: 300px;
            top: 290px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 1;
        }

        .index__container4 {
            width: 200px;
            height: 402px;
            position: absolute;
            left: 443px;
            top: 233px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .myPredictionitem_topimg{
                width: 40px;
                height: 103px;
                background-image: url('../../assets/images/worldCup/img-jiangb-h.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                margin-top: 20px;

            }
        }
    }
    .index__step1list {
        margin-top: 16px;
        &.is-first {
            margin-top: 0;
        }
    }

    .index__itemchild {
        width: 86px;
        height: 68px;
        border-radius: 4px;
        background-color: #fff;
        margin-bottom: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

    }

    .index__icon {
        width: 28px;
        height: 28px;
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 46px;
        }
    }
    .index__counters{
        font-size: 13px;
        color: #333;
        margin-top: 8px;
        white-space: nowrap;
        text-align: center;
    }

    .index__step2list {
        .index__linebox1-left {
            width: 7px;
            height: 78px;
            left: -19px;
            top: -6px;
            position: absolute;
            border-radius: 2px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
            &:after {
                width: 7px;
                height: 2px;
                color: #da89a6;
                font-size: 20px;
                font-weight: 700;
                content: "-";
                position: absolute;
                top: 20px;
                left: 5px;
            }
        }
        .index__linebox1-right {
            width: 7px;
            height: 78px;
            right: -19px;
            top: -6px;
            position: absolute;
            border-radius: 2px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
            &:after {
                width: 7px;
                height: 2px;
                color: #da89a6;
                font-size: 20px;
                font-weight: 700;
                content: "-";
                position: absolute;
                top: 20px;
                right: 7px;
            }
        }
    }

    .index__step3list {
        .index__linebox2-left {
            width: 7px;
            height: 179px;
            left: -23px;
            top: -54px;
            position: absolute;
            border-radius: 2px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
            &:after {
                width: 7px;
                height: 2px;
                color: #da89a6;
                font-size: 20px;
                font-weight: 700;
                content: "-";
                position: absolute;
                top: 73px;
                left: 5px;
                &:after {
                    width: 7px;
                    height: 2px;
                    color: #da89a6;
                    font-size: 20px;
                    font-weight: 700;
                    content: "-";
                    position: absolute;
                    top: 73px;
                    right: 7px;
                }
            }
        }
        .index__linebox2-right {
            width: 7px;
            height: 179px;
            right: -23px;
            top: -54px;
            position: absolute;
            border-radius: 2px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
    }
    .index__step4list {
        width: 200px;
        height: 104px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        background-image: url('../../assets/images/worldCup/ing-juesai-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        align-items: end;
        .index__item4child {
            width: 100px;
            height: 104px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .index__icon {
                width: 36px;
                height: 36px;
                overflow: hidden;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
                img {
                    width: 60px;
                    height: 60px;
                }
            }
            .index__counters {
                font-size: 13px;
                color: #333;
                margin-top: 5px;
                white-space: nowrap;
            }
        }
        .index__step4title{
            position: absolute;
            font-size: 12px;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            color: #9f6324;
            left: 43%;
            top: 4px;
        }
        .index__step4vs {
            position: absolute;
            font-size: 19px;
            font-weight: 500;
            line-height: 1;
            text-align: center;
            color: #333;
            left: 43%;
            top: 40%;
        }
        .index__linebox4-left {
            width: 7px;
            height: 352px;
            left: -53px;
            top: -204px;
            position: absolute;
            border-radius: 2px;
            border-right: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;

        }
        .index__linebox4-right {
            width: 7px;
            height: 352px;
            right: -53px;
            top: -204px;
            position: absolute;
            border-radius: 2px;
            border-left: 2px solid #da89a6;
            border-top: 2px solid #da89a6;
            border-bottom: 2px solid #da89a6;
        }
    }

    .index__topbox {
        width: 140px;
        margin-top: -57px;
        background-image: url('../../assets/images/worldCup/img-zongguan-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        position: relative;
        .myPredictionitem_toptitle{
            white-space: nowrap;
            position: absolute;
            font-size: 12px;
            color: #9f6324;
            font-weight: 700;
            top: 2px;
            left: 37%;
        }
        .index__item5child {
            width: 140px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 40px;
            .index__icon {
                width: 36px;
                height: 36px;
                overflow: hidden;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 58px;
                    vertical-align: middle;
                }
            }
        }
    }
}

.myPredictionitem_bottombar {
    width: 310px;
    height: 60px;
    border-radius: 8px;
    box-shadow: inset 0 -1.7px 11px 0 #ff004c;
    background-image: linear-gradient(180deg,#c90c46,#a0103e);
    font-size: 18px;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 31%;

}
</style>
