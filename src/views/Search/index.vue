<template>
<div class="wrap-1200 h-100">
    <div class="header p-t-30 m-t-5">
        <div class="input-box p-relative">
            <el-input
                ref="searchInput"
                placeholder="请输入内容"
                @change="searchList"
                v-model="search" class="input-with-select" />
            <span class="p-absolute search-btn text-center font-12 pointer font-400 text-white" @click="searchList">搜索</span>
        </div>
    </div>
    <div class="content" :key="comKey">
        <div class="buttons wrap-1200 flex p-t-15 p-b-20 align-center justify-center">
            <template v-for="button in buttons">
                <span
                    :Key="button.id"
                    class="pointer button m-r-5 m-l-5 font-14 text-center font-500 font-medium"
                    :class="{
                        'is-active': button.id === activeTab
                    }"
                    @click="changeButton(button)">{{ button.title }}</span>
            </template>
        </div>
        <div class="list m-t-20 p-t-20">
            <template v-if="isAll && !hasOne">
                <!--推荐直播-->
                <span class="tips font-14 font-400">暂无"{{search}}"相关内容，为您推荐以下直播</span>
                <div class="m-t-30 font-20 font-500 text-333">推荐直播</div>
                <AboutSelfCompetition class="lives" :bg-gray="false"/>
            </template>
            <template v-if="hasOne">
                <host-list
                    v-if="!isLive"
                    class="m-b-30"
                    :search="search"
                    :is-all="isAll"
                    :has-host.sync="hasHost"
                    @changeTab="changeTab"
                />
                <broadcast-list
                    v-if="!isHost"
                    :search="search"
                    :is-all="isAll"
                    :has-live.sync="hasLive"
                    @changeTab="changeTab"
                />
            </template>

        </div>
    </div>
</div>
</template>

<script>
import HostList from './HostList.vue'
import BroadcastList from './BroadcastList.vue'
import debounce from 'lodash.debounce'
import AboutSelfCompetition from '@/views/LiveRoom/Components/AboutSelfCompetition.vue'
export default {
    name: 'SearchPage',
    components: {
        HostList,
        BroadcastList,
        AboutSelfCompetition
    },
    data () {
        return {
            search: '',
            activeTab: 1,
            buttons: [
                {
                    id: 1,
                    title: '综合',
                    key: 'all'
                },
                {
                    id: 2,
                    title: '直播',
                    key: 'live'
                },
                {
                    id: 3,
                    title: '主播',
                    key: 'host'
                }
            ],
            updateKey: +new Date().getTime(),
            comKey: +new Date().getTime() + 23,
            hasHost: true,
            hasLive: true
        }
    },
    created () {
        const { search } = this.$route.params
        this.search = search
    },
    mounted () {
        this.$refs.searchInput.focus()
    },
    computed: {
        isAll () {
            return this.activeTab === 1
        },
        isHost () {
            return this.activeTab === 3
        },
        isLive () {
            return this.activeTab === 2
        },
        traceKey () {
            return {
                updateKey: this.updateKey,
                isAll: this.isAll
            }
        },
        hasOne () {
            return this.hasHost || this.hasLive
        }
    },
    watch: {
        traceKey () {
            this.comKey = +new Date().getTime()
        }
    },
    methods: {
        changeButton (button) {
            this.activeTab = button.id
            if (this.activeTab !== 1) {
                // 非综合
                this.hasHost = true
                this.hasLive = true
            }
        },
        changeTab (tabId) {
            this.activeTab = tabId
            this.searchList()
        },
        searchList: debounce(function () {
            this.hasLive = true
            this.hasHost = true
            this.updateKey = +new Date().getTime()
        }, 100)
    }
}
</script>

<style lang="scss" scoped>
.header {
    width: 400px;
    margin: 0 auto;
}
.buttons {
    border-bottom: 1px solid #409eff;
    .button {
        width: 116px;
        height: 33px;
        color: #333;
        line-height: 33px;
        position: relative;
        &.is-active {
            color: #409eff;
          &:after {
            position: absolute;
            width: 0;
            height: 0;
            left: calc(50% - 3px);
            top: calc(100% + 6px);
            content: "";
            border-right: 6px solid transparent;
            border-top: 6px solid transparent;
            border-left: 6px solid transparent;
            border-bottom: 6px solid #409eff;
          }
        }
    }
}
.input-box{
    width: 400px;
    height: 35px;
    line-height: 35px;
    .search-btn {
        width: 65px;
        height: 35px;
        background: #409eff;
        border-radius: 18px;
        right: 0;
        &:hover {
            opacity: 0.7;
        }
    }
}
.tips {
    line-height: 20px;
}
::v-deep {
    .el-input__inner{
        border-radius: 20px;
        line-height: 35px;
        height: 35px;
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus {
        border: 1px solid #409eff;
    }
    .lives {
        .card {
            padding-left: 0!important;
            .live-item {
                margin-right: 12px!important;
                &:nth-child(5n) {
                    margin-right: 0!important;
                }
            }
        }
    }
}
</style>
