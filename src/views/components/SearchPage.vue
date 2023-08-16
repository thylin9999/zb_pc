<template>
    <div class="p-relative"
         v-clickoutside="clickOut">
        <el-input
            placeholder="搜索主播、直播"
            @change="search"
            @focus="focusInput"
            class="search-input"
            v-model="value">
            <IconPng  slot="suffix" :width="20" :height="20" :icon="focus ? 'icons/search_h' : 'icons/search'" />
        </el-input>
        <div class="p-absolute hot-search-box" v-if="focus">
            <div class="hot-search font-14 font-500 text-center text-white">热门搜索</div>
            <div class="list p-t-10 p-l-15 p-r-15">
                <ul class="w-100 flex flex-wrap">
                    <li
                        v-for="item in list"
                        :key="item.id"
                        class="item flex align-center p-l-5 m-r-15"
                        @click="goSearch(item)"
                    >
                        <span class="number text-center d-inline-block border-radius-50">
                            <span class="font-12 font-400 d-inline-block">{{ item.id}}</span>
                        </span>
                        <span class="label m-l-10 font-12 font-400">{{ item.title}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import IconPng from '@/components/IconPng.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
export default {
    name: 'SearchPage',
    directives: { Clickoutside },
    components: {
        IconPng
    },
    data () {
        return {
            value: '',
            show: false,
            focus: false,
            list: [
                {
                    id: 1,
                    title: '欧冠'
                },
                {
                    id: 2,
                    title: 'NBA'
                },
                {
                    id: 3,
                    title: '英超'
                },
                {
                    id: 4,
                    title: '西甲'
                },
                {
                    id: 5,
                    title: '法甲'
                },
                {
                    id: 6,
                    title: '意甲'
                },
                {
                    id: 7,
                    title: '德甲'
                },
                {
                    id: 8,
                    title: 'CBA'
                },
                {
                    id: 9,
                    title: '中超'
                },
                {
                    id: 10,
                    title: 'UFC'
                }

            ]
        }
    },
    methods: {
        focusInput () {
            this.focus = true
        },
        clickOut () {
            this.focus = false
        },
        goSearch (item) {
            console.log(item, 'asdf')
            this.value = item.title
            this.search()
        },
        search () {
            if (!this.value) {
                return
            }
            this.$router.push({
                name: 'Search',
                params: {
                    search: this.value
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.hot-search-box {
    z-index: 1000;
    top: 40px;
    width: 316px;
    left: -80px;
    height: 181px;
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.35);
    border-radius: 10px;
    overflow: hidden;
    .hot-search {
        height: 40px;
        line-height: 40px;
        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%)
    }
    .list {
        .item {
            width: 135px;
            height: 25px;
            line-height: 25px;
            border-radius: 5px;
            color: #333;
            &:nth-child(2n) {
                margin-right: 0!important;
            }
            .number {
                width: 15px;
                height: 15px;
                line-height: 15px;
                background: #D8D8D8;
                span {
                    vertical-align: top;
                    transform: scale(0.9);
                }
            }
            &:hover {
                background: #FFF8F1;
                color: #409eff;
                .number {
                    background: #409eff;
                    span {
                        color: #fff;
                    }
                }
            }
        }
    }
}
::v-deep {
    .search-input {
        .el-input__inner {
            line-height: 35px;
            width: 160px;
            background: #fff;
            color: #999;
        }
        .el-input.is-active .el-input__inner, .el-input__inner:focus {
            border-color: #409eff;
            &::placeholder {
                color: #999999;
            }
        }
    }
    .el-input__inner{
        border-radius: 20px;
        font-size: 12px;
        height: 35px;
        &::placeholder {
            color: #d8d8d8;
        }
    }
    .el-input__suffix {
        line-height: 35px;
        .el-input__suffix-inner{
            height: 100%;
            display: inline-block;
            line-height: 35px;
            .icon {
                vertical-align: sub;
            }
        }
    }
}
</style>
