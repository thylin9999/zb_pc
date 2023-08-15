<template>
<div>
    <div class="banner bg-center bg-no-repeat"></div>
    <div class="content">
        <div class="styles_headbox">
            <div class="styles_item" :class="{
                'is-active': tab === 1
            }" @click="goHome">活动首页</div>
            <div class="styles_item"
                 :class="{
                    'is-active': tab === 2
                }"
                 @click="myPredication">我的预测</div>
            <div class="styles_item"
                 :class="{
                    'is-active': tab === 3
                }"
                 @click="viewPrizeList">获奖名单</div>
        </div>
        <div v-if="tab===1" class="active-box">
            <div class="styles_topboxs" :class="{
                'forecast-bg': showForecast
            }">
                <Forecast  v-if="showForecast" @changeExpireTime="changeExpireTime"/>
                <div
                    v-if="!showForecast"
                    class="styles_bottombotons"
                    @click="forecast"
                >{{ showViewPrediction ? '查看我的预测' : '开始预测'}}</div>
            </div>
            <div class="second-content">
                <div class="styles_second">
                    <div class="styles_second_beforesss"></div>
                    <div class="styles_second_aftersss"></div>
                    活动规则</div>
                <div class="styles_title1">活动时间</div>
                <div class="styles_titlebox">
                    <div class="styles_timers"></div>
                    2022-11-01 00:00 至 2022-11-20 24:00</div>

                <div class="styles_title1">奖品设置</div>
                <div class="style-prizes">
                    <SwiperCom />
                </div>

                <div class="styles_title1">参与资格</div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>所有活动参与者必须阅读并同意此规则，方有资格参与本次活动</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>年满18周岁看球注册用户（以本活动开始之日起为准），且具有完全民事行为能力</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>凡在本次活动中，涉及作弊的活动参与者，或主办方有确实证据证明认为有舞弊行为的活动参与者，主办方有权取消其兑换奖品的权利，我方保留最终解释和取消资格的权利</p>
                </div>

                <div class="styles_title1">参与方式</div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>用户在活动截止前，按照规则提交预测</p>
                </div>

                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>用户一次完成世界杯十六强、八强、四强、半决赛以及冠军，共计31个选择</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>随世界杯赛程的进行，统计用户命中的预测数量并确认所获奖励</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>一台设备每日可进行一次竞猜，已完场赛事仍可参与，但不会计入竞猜总积分</p>
                </div>

                <div class="styles_title2">奖品的发放及领取</div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>获奖名单在活动页以及其他方式公布</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>获奖用户，请通过联系在线客服确认领取</p>
                </div>
                <div class="styles_describe">
                    <div class="styles_icon"> </div>
                    <p>用户参与活动前，需如实提供个人联系方式，因信息不全导致奖品无法发放的责任自负</p>
                </div>
            </div>
        </div>
        <MyPrediction v-if="tab === 2"/>
    </div>
</div>
</template>

<script>
import SwiperCom from '@/views/WorldCup/SwiperCom'
import Forecast from '@/views/WorldCup/Forecast'
import MyPrediction from '@/views/WorldCup/MyPrediction'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
import { getItem } from '@/utils/cookie'
import dayjs from 'dayjs'
export default {
    name: 'index',
    components: {
        SwiperCom,
        Forecast,
        MyPrediction
    },
    data () {
        return {
            tab: 1,
            showForecast: false,
            predictionInTime: false // 有效期门的 预测，无法预测了，只能 查看
        }
    },
    computed: {
        ...mapState('user', ['token']),
        showViewPrediction () {
            return this.token && this.predictionInTime
        }
    },
    created () {
        const prevSubmitInfo = getItem('submitTime')
        if (prevSubmitInfo) {
            const time = prevSubmitInfo.time
            this.predictionInTime = !dayjs().isAfter(time, 'day')
        }
    },
    methods: {
        changeExpireTime () {
            this.predictionInTime = true
        },
        forecast () {
            if (!this.token) {
                Message.warning('请先登录')
                this.openLoginDialogMixin()
                return
            }
            // 怕段

            const prevSubmitInfo = getItem('submitTime')
            if (!prevSubmitInfo) {
                // 没有 预测，直接点击
                this.showForecast = true
            } else {
                // 需要判断
            }

            this.showForecast = true
        },
        goHome () {
            this.tab = 1
            this.showForecast = false
        },
        myPredication () {
            if (!this.token) {
                Message.warning('请先登录')
                this.openLoginDialogMixin()
                return
            }
            if (!this.predictionInTime) {
                Message.warning('请先预测')
                return
            }
            this.tab = 2
            this.showForecast = true
        },
        viewPrizeList () {
            Message.warning('待世界杯结束公布获奖名单！')
        }
    }
}
</script>

<style lang="scss" scoped>
.banner{
    width: 100%;
    height: 630px;
    background-size: cover;
    background-image: url('../../assets/images/worldCup/img-zhuanti-banner-bg.png');
}
.content{
    width: 1200px;
    margin: -160px auto 0;
    border-radius: 8px;
    background-color: #fff;
    padding: 58px 50px 0;
}
.styles_headbox {
    border-radius: 8px;
    border: 1px solid #ffcadb;
    background-image: linear-gradient(180deg,#fffafc,#fdeef3);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .styles_item {
        width: 367px;
        height: 53px;
        border-right: 1px solid #ffcadb;
        background-image: linear-gradient(180deg,#fffafc,#fdeef3);
        font-size: 18px;
        text-align: center;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.is-active , &:hover {
            font-size: 18px;
            box-shadow: 0 2px 10px 0 rgb(219 40 95 / 50%);
            background-image: linear-gradient(180deg,#ff8caf -29%,#db285f 36%);
            font-weight: 700;
            color: #fff!important;
        }
    }
}
.active-box {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
}
.styles_topboxs {
    width: 1100px;
    height: 890px;
    margin: 0 0 40px;
    border-radius: 8px;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
    background-image: url('../../assets/images/worldCup/img-yuce-bg.jpg');
    &.forecast-bg {
        background-image: url('../../assets/images/worldCup/img-bh.png');
    }
    .styles_bottombotons {
        background-position: 50%;
        width: 527px;
        height: 66px;
        box-shadow: inset 0 -2px 2px 0 rgb(255 212 104 / 67%);
        border-radius: 5.8px;
        cursor: pointer;
        font-size: 28px;
        font-weight: 700;
        color: #833600;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 70%;
        margin-left: 26%;
        background-image: url('../../assets/images/worldCup/btn-yuce-n.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &:hover {
            background-image: url('../../assets/images/worldCup/btn-yuce-hover.png');
        }
    }
}
.styles_second {
    width: 1100px;
    height: 38px;
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    color: #b70c3f;
    position: relative;
    .styles_second_beforesss {
        width: 223px;
        height: 22px;
        position: absolute;
        top: 10px;
        left: 220px;
        background-image: linear-gradient(270deg,#520a24 100%,#8d153a 0);
        background-image: url('../../assets/images/worldCup/img-biaoti-zuo.png');
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 100% 100%;
    }
    .styles_second_aftersss {
        width: 223px;
        height: 22px;
        position: absolute;
        top: 10px;
        right: 220px;
        background-image: linear-gradient(270deg,#520a24 100%,#8d153a 0);
        background-image: url('../../assets/images/worldCup/img-biaoti-you.png');
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 100% 100%;
    }
}
.styles_title1 {
    width: 151px;
    height: 32px;
    font-size: 16px;
    line-height: 1.38;
    color: #fff;
    background-image: url('../../assets/images/worldCup/data-biaoti-s.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    padding-left: 15px;
}
.styles_title2 {
    width: 180px;
    height: 32px;
    font-size: 16px;
    line-height: 1.38;
    color: #fff;
    background-image: url('../../assets/images/worldCup/data-biaoti-s.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    padding-left: 15px;
}
.styles_titlebox {
    width: 100%;
    font-size: 24px;
    font-weight: 700;
    color: #b70c3f;
    margin-top: 15px;
    display: flex;
    align-items: center;
    .styles_timers {
        width: 24px;
        height: 24px;
        background-image: url('../../assets/images/worldCup/icon-time.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 15px;
    }
}

.style-prizes{

}

.styles_describe {
    margin-top: 6px;
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: left;
    .styles_icon {
        width: 12px;
        height: 12px;
        background-image: url('../../assets/images/worldCup/icon-sanjiao.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 6px;
    }
}
</style>
