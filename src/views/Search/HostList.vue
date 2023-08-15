<template>
    <div class="page">
        <div class="flex align-center justify-between">
            <div>
                <span class="font-25 text-333">相关主播</span>
                <span class="m-l-15">共找到{{  total }}个结果</span>
            </div>
            <div class="more pointer font-14 text-333 font-400 flex align-center"
                :class="{
                    'visibility-hidden': !isAll || (!isLoading && !list.length)
                }"
                @click="changeToHost"
            >
                <span>查看更多</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="list" v-loading="isLoading">
            <ul class="w-100 h-100 flex align-center flex-wrap">
                <li
                    v-for="anchor in  list"
                    :key="anchor.id"
                    class="flex m-t-10 align-center p-l-20 p-r-10 anchor"
                >
                    <div class="icon p-relative"
                         :class="{
                                'is-living': anchor.live_status === 2
                         }"
                         v-lazy-container="{ selector: 'img' }"
                    >
                      <img class="w-100 h-100 border-radius-50 " :data-src="anchor.logo" :data-error="errorUserLogo" alt="">

                    </div>
                    <div class="info flex-1 m-l-15">
                        <custom-span class="font-16 w-100 font-400 text-333" :content="anchor.anchor_name"/>
                        <custom-span class="font-12 w-100 m-t-5 font-400 text-999" :content="anchor.sign"/>
                        <span
                            class="follow-btn m-t-5 pointer text-center font-12 d-inline-block"
                            :class="{
                                'is-active': anchor.is_follow === 1
                            }"
                            @click="subscribe(anchor)"
                        >
                            {{ anchor.is_follow === 0 ? '关注' : '取消关注' }}
                        </span>
                    </div>
                </li>
            </ul>
            <no-data v-if="!isLoading && !list.length">
                <span calss="font-14 text-333 font-400 m-t-20">暂无相关内容</span>
            </no-data>
        </div>
    </div>
</template>

<script>
import { searchAnchor, followHost } from '../../api/Host/Host'
import CustomSpan from '../../components/CustomSpan'
import { mapState } from 'vuex'
import NoData from '../../components/NoData.vue'
import { Message } from 'element-ui'
import { statusCode } from '../../utils/statusCode'
export default {
    name: 'HostList',
    components: {
        CustomSpan,
        NoData
    },
    props: {
        search: {
            type: String,
            default: ''
        },
        isAll: { // 是否位列表页
            type: Boolean,
            default: false
        },
        hasHost: { //
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            total: 0,
            list: [
            ],
            isLoading: false
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        ...mapState('user', ['token'])
    },
    methods: {
        async fetchData () {
            this.isLoading = true
            try {
                const { data, code } = await searchAnchor(this.search)
                if (code === statusCode.success) {
                    this.total = (data && data.length) || 0
                    if (!this.isAll) {
                        this.list = data || []
                    } else {
                        const list = data || []
                        this.list = list.slice(0, 10)
                        if (!list.length) {
                            this.$emit('update:hasHost', false)
                        } else {
                            this.$emit('update:hasHost', true)
                        }
                    }
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        async subscribe (anchor) {
            // 是否订阅的
            if (this.token) {
                // 取消订阅
                const { msg } = await followHost(anchor.member_id)
                Message.success(msg)
                this.fetchData()
            } else {
                // 未订阅
                this.openLoginDialog()
            }
        },
        changeToHost () {
            this.$emit('changeTab', 2)
        }
    }
}

</script>

<style lang="scss" scoped>
.page{
    min-height: 300px;
    .list {
      min-height: 250px;
    }
}
.info {
    width: 135px;
}
.anchor{
    width:230px;
    height: 115px;
    border-radius: 10px;
    margin-right: 12px;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
    background-color: #fff;
    &:nth-child(5n) {
        margin-right: 0;
    }
}
.icon {
    width: 60px;
    height: 60px;
    background-color: #D8D8D8;
    border-radius: 50%;
    flex-shrink: 0;
    &.is-living {
        &:after {
            bottom: 0;
            right: 0;
            position: absolute;
            content: '';
            width: 20px;
            height: 20px;
            background-color: #FB7674;
            border: 1px solid #FFFFFF;
            border-radius: 10px;
            background-image: url('../../assets/images/common/live-white.gif');
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }
    }
}
.follow-btn{
    width: 55px;
    height: 25px;
    line-height: 25px;
    background: #A05A77;
    border: 1px solid transparent;
    border-radius: 5px;
    color: #fff;
    &.is-active {
        background: transparent;
        border-color: #A05A77;
        color: #A05A77;
    }
}
</style>
