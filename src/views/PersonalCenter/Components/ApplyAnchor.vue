<template>
<div class="header w-100 h-100">
    <header-tabs
        class="flex justify-center p-t-15 p-b-15 p-l-30 align-center header-tabs"
        :tabs="tabs"
        :current-tab="currentTab"
    />
    <div class="content" v-loading="isLoading" :key="updateKey">
        <identification
            v-if="currentTab===1"
            :apply-info="applyInfo"
            @changeTab="changeTab"
            @nextStep="nextStep"
        />
        <apply-anchor-info
            v-if="currentTab===2"
            @changeTab="changeTab"
            @refreshResult="refreshResult"
        />
        <apply-result
            is-anchor
            :apply-info="appliedInfo"
            v-if="currentTab===3"
            @applyAgain="applyAgain"
        />
    </div>
</div>
</template>

<script>
import HeaderTabs from '@/views/PersonalCenter/Components/HeaderTabs'
import Identification from './ApplyInfos/Identification.vue'
import ApplyAnchorInfo from './ApplyInfos/ApplyAnchorInfo.vue'
import ApplyResult from './ApplyInfos/ApplyResult.vue'
import { getApplyResult, getApplyStatus } from '@/api/user'
import { statusCode } from '../../../utils/statusCode'
import { mapActions } from 'vuex'

export default {
    name: 'ApplyAnchor',
    components: {
        HeaderTabs,
        Identification,
        ApplyAnchorInfo,
        ApplyResult
    },
    data () {
        return {
            currentTab: null,
            applyInfo: {},
            appliedInfo: {}, // 申请信息
            isConfirmed: false, // 是否已经认证
            isApplied: false, // 是否已经申请
            updateKey: +new Date().getTime(),
            isLoading: false

        }
    },
    created () {
        this.init()
    },
    computed: {
        tabs () {
            return [
                {
                    id: 1,
                    title: '验证身份',
                    disabled: false
                },
                {
                    id: 2,
                    title: '填写申请信息',
                    disabled: !this.isConfirmed
                },
                {
                    id: 3,
                    title: '信息审核',
                    disabled: !(this.isConfirmed && this.isApplied)
                }
            ]
        }
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        refresh () {
            this.init()
            // this.updateKey = +new Date().getTime()
        },
        nextStep () {
            // 此处是刚刚提交 实名认证，可以进入第2步，提交申请
            this.currentTab = 2
        },
        async init () {
            this.isLoading = true
            try {
                const { code, data } = await getApplyResult()
                // 未通过认证，那么就需要认证
                if (code === statusCode.success) {
                    // 200 表示申请了，不代表认证通过了
                    if (!data) {
                        this.currentTab = 1
                        this.isLoading = false
                    } else {
                        this.handleData(data)
                    }
                } else if (code === 6004) {
                    // 未申请实名认证，需先申请
                    this.currentTab = 1
                    this.isLoading = false
                }
            } catch (e) {
                console.log('出错了', e)
            } finally {
                // this.isLoading = false
            }
        },
        handleData (data) {
            // 验证过身份了
            if (data.status === 3) {
                // 审核中
                this.applyInfo = data
                this.appliedInfo = data
                this.currentTab = 3
                this.isLoading = false
            } else if (data.status === 1) {
                // 通过
                this.isConfirmed = true
                this.applyInfo = data
                // this.currentTab = this.currentTab || 2
                this.isLoading = false
                // 在这里去查询是否填写了下一步的申请信息
                this.getApplyStatus()
            } else {
                // 2 认证失败，查看原因
                this.appliedInfo = data
                this.currentTab = 3
                this.isLoading = false
            }
        },
        changeTab (tab) {
            this.currentTab = tab.id
        },
        applyAgain () {
            // 此时要 判断下，是哪一步失败的额。。。
            this.currentTab = 1
        },
        refreshResult () {
            this.getApplyStatus(3)
        },
        async getApplyStatus (tab) {
            try {
                const { code, data } = await getApplyStatus(1)
                if (code === 6004) {
                    // 未申请 直接 第一步，不让编辑
                    this.currentTab = 1
                } else if (code === statusCode.success) {
                    this.isApplied = true
                    this.appliedInfo = data
                    // status是否通过审核 1是 2否 3审核中
                    // 审核中和失败都去3， 查看结果
                    this.currentTab = 3
                    if (data.status === 1) {
                        this.getUserInfo()
                    }
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.isLoading = false
                if (tab) {
                    this.currentTab = tab
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.header-tabs {
    border-bottom: 1px solid #d8d8d8;
}
.content{
    height: calc(100% - 55px);
}

::v-deep {
    .header-tabs {
        .tab-item {
        margin-right: 70px;
        }
    }
}
</style>
