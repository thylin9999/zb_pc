<template>
<div class="styles_huandengboxlist">
    <section>
        <swiper
            ref="domSwiper"
            class="swiper"
            :options="swiperOption"
            @slide-change="onSlideChange"
        >
            <swiper-slide
                v-for="prize in prizes"
                :key="prize.id"
            >
                <div class="styles_item">
                    <div class="styles_heads">{{ prize.level }}</div>
                    <img :alt="prize.title"
                         :src="prize.img"
                         width="500" height="288"
                         style="color:transparent">
                    <div class="styles_bottom">{{ prize.title }}</div>
                    <div class="styles_detail">{{ prize.info}}</div>
                </div>
            </swiper-slide>

        </swiper>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </section>
    <div class="styles_swapbox">
        <div class="styles_pointlist">
            <div class="styles_point flex justify-center align-center"
                 v-for="(prize, index) in prizes"
                 :key="prize.id + 'point'"
                 :class="{
                     'is-active': index === activeIndex
                 }"
            >
                <div class="styles_activepointafter"></div>
            </div>
        </div>
        <div class="styles_giftboxlist">
            <div class="styles_gift1"
                 v-for="(prize, index) in prizes"
                 :key="prize.id + 'prize'"
                 :class="{
                     'is-active': index === activeIndex
                 }"
            >
                <img :width="index === 0 ? 88 : 130" :height="index === 0 ? 51 : 79" :src="prize.img">
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
    name: 'SwiperCom',
    components: {
        Swiper,
        SwiperSlide
    },
    data () {
        return {
            swiperOption: {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            prizes: [
                {
                    id: 0,
                    title: '保时捷帕拉梅拉汽车',
                    info: '命中31个选项',
                    level: '特等奖',
                    img: require('../../assets/images/worldCup/img-gift-che.png')
                },
                {
                    id: 1,
                    title: '劳力士水鬼系列手表',
                    info: '命中29~30个选项',
                    level: '一等奖',
                    img: require('../../assets/images/worldCup/img-gift-biao.png')
                },
                {
                    id: 2,
                    title: '苹果电脑IMAC',
                    info: '命中27-28个选项',
                    level: '二等奖',
                    img: require('../../assets/images/worldCup/img-gift-mac.png')
                },
                {
                    id: 3,
                    title: ' 华为Nova10 Pro',
                    info: '命中25~26个选项',
                    level: '三等奖',
                    img: require('../../assets/images/worldCup/img-gift-shouji.png')
                },
                {
                    id: 4,
                    title: '小米空气净化器',
                    info: '命中21~24个选项',
                    level: '四等奖',
                    img: require('../../assets/images/worldCup/img-gift-xiaomi.png')
                },
                {
                    id: 5,
                    title: '奖励 ZIPP打火机',
                    info: '命中17~20个选项',
                    level: '五等奖',
                    img: require('../../assets/images/worldCup/img-gift-huoji.png')
                }
            ],
            activeIndex: 0
        }
    },
    methods: {
        onSlideChange () {
            this.activeIndex = this.$refs.domSwiper.$swiper.activeIndex
        }
    }
}
</script>

<style lang="scss" scoped>
.styles_huandengboxlist {
    height: 673px;
    position: relative;
}
.swiper {
    width: 500px;
    z-index: 0!important;
}
.swiper-slide {
    border-radius: 10px;
    overflow: hidden;
    width: 500px!important;
    .styles_item {
        width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .styles_heads {
            width: 205px;
            height: 82px;
            position: relative;
            margin-top: 15px;
            margin-bottom: 18px;
            background-image: url('../../assets/images/worldCup/img-jiang-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .styles_bottom {
            font-size: 32px;
            font-weight: 600;
            color: #333;
            text-align: center;
        }
        .styles_detail {
            margin-top: 5px;
            font-size: 20px;
            text-align: center;
            color: #333;
        }
    }
    img {
        width: 100%;
    }
}

.styles_giftboxlist {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    .styles_gift1 {
        width: 88px;
        height: 88px;
        border-radius: 8px;
        border: 1px solid #dfe6f0;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 8px 0;
        &.is-active {
            border: 1px solid #b70c3f;
        }
        img {
            vertical-align: middle;
        }
    }
}
.styles_pointlist {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    margin: 16px auto 0;
    .styles_point {
        width: 10px;
        height: 10px;
        border: 1px solid rgba(218,40,94,.5);
        margin: 0 5px;
        border-radius: 50%;
        &.is-active {
            .styles_activepointafter {
                height: 6px;
                width: 6px;
                content: "";
                border-radius: 50%;
                background-color: #da285e;
            }
        }
    }
}
::v-deep {
    .swiper-button-prev {
        width: 36px;
        height: 36px;
        background-image: url('../../assets/images/worldCup/icon-jiantou-zuo.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        left: 150px;
        top: 35%;
        cursor: pointer;
        &:after {
            display: none;
        }
    }
    .swiper-button-next {
        width: 36px;
        height: 36px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        right: 150px;
        top: 35%;
        cursor: pointer;
        &:after {
            display: none;
        }
        background-image: url('../../assets/images/worldCup/icon-jiantou-you.png');
    }
}
</style>
