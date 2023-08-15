<template>
    <div class="page p-t-10 p-l-15 p-r-15 ">
        <div class="header flex align-center">
            <Icon-png :width="22" :height=22 icon="icons/experts"></Icon-png>
            <span class="font-18 text-333 m-l-5 title font-600">热门专家</span>
        </div>
        <ul class="list flex m-t-15 flex-column">
            <li
                v-for="expert in  list"
                :key="expert.id"
                class="flex align-center w-100 m-b-5 overflow-hidden p-10 row"
            >
                <div class="expert-icon"
                     v-lazy-container="{ selector: 'img' }"
                >
                  <img class="w-100 h-100" :data-src="expert.avatar" :data-error="errorUserLogo" alt="">

<!--                  <img class="h-100 w-100" :src="expert.avatar" alt="">-->
                </div>
                <div class="flex content flex-1 flex-shrank-0 m-l-5 justify-between align-center">
                    <div class="middle overflow-hidden p-relative">
                        <CustomSpan class="text-white nickname font-14 font-600 " :content="expert.nickname"></CustomSpan>
                        <div class="flex w-100 flex-column p-t-5">
<!--                            <span class="font-12">{{  expert.profession }}</span>-->
                            <CustomSpan class="font-12 w-100" :content="expert.profession"/>
                            <span class="font-12 fans scale-7">粉丝：{{  expert.fans_sum }}</span>
                        </div>
                        <span class='tag font-12 text-center d-inline-block p-absolute'>
                            <span class="scale-9 p-absolute d-inline-block">近{{ expert.return_sum }}场回报率{{ expert.return_rate }}</span>
                        </span>
                    </div>
                    <div class="shot flex flex-column">
                        <span class="font-18 percent font-500 text-gradient">{{  expert.hit_rate +'%' }}</span>
                        <span class="font-12 m-t-5 font-500 text-white">近{{ expert.near_sum}}场中{{  expert.hit_sum }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import IconPng from '../../components/IconPng.vue'
import CustomSpan from '../../components/CustomSpan'
import { searchExpert } from '@/api/user'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'ExpertList',
    components: {
        IconPng,
        CustomSpan
    },
    data () {
        return {
            list: [
                {
                    id: 1,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 2,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 3,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 4,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 5,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 6,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                },
                {
                    id: 7,
                    name: '名称',
                    title: 'title',
                    fans: 7891,
                    shot: '85%',
                    shotNumber: 6,
                    img: 'https://www.yulumi.cn/gl/uploads/allimg/201128/162003D24-2.jpg'
                }
            ]
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { code, data } = await searchExpert({})
                if (code === statusCode.success) {
                    this.list = data.list || []
                    // console.log(code, data, 'asdfasf')
                }
            } catch (e) {
                console.log('出错了', e)
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    height: 416px;
    //background: linear-gradient(180deg, #7C2246 0%, #251222 100%);
    border-radius: 10px;
    background-color: #fff;
}
.header {
    .title {
        line-height: 25px;
    }
}
.list {
    height: calc(100% - 45px);
    overflow-y: auto;
    .row {
        flex-shrink: 0;
        height: 75px;
        border-radius: 10px;
        color: #6C73AF;
        background-image: url('../../assets/images/home/expert.png');
        background-size: 100% 100%;
        background-repeat:no-repeat;
        background-position: center;
        border-image: linear-gradient(180deg, rgba(114, 114, 128, 1), rgba(23, 21, 42, 1)) 1 1;
        .expert-icon {
            width: 50px;
            height: 50px;
            background-color: #D8D8D8;
            border-radius: 50%;
            img {
              border-radius: 50%;
            }
        }
        .content {
            width: calc(100% - 55px);
        }
        .middle {
            width: calc(100% - 55px);
            .nickname {
              width: 65px;
            }
            span {
                line-height: 14px;
            }
            .tag {
                right: 10px;
                top: 0;
                width: 75px;
                height: 20px;
                background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
                border-radius: 3px;
                color: #2C1447;
                .scale-9 {
                    width: 140%;
                    word-break: break-all;
                    font-size: 12px;
                    left: 50%;
                    top: 2px;
                    color: #2C1447;
                    font-weight: 600;
                    transform: scale(0.7) translateX(-50%);
                }
            }
            .fans {
                margin-top: 2px;
            }
        }
        .shot {
            width: 51px;
            .percent {
                //color: #E1A579;
            }
        }
    }
}
</style>
