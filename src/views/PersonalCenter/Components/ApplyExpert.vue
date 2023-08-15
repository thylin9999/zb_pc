<template>
<div class="header w-100 h-100">
    <header-tabs
        class="flex p-t-15 justify-center p-b-15 p-l-30 align-center header-tabs"
        :tabs="tabs"
        :current-tab="currentTab"
    />
    <div class="content" v-loading="isLoading" :key="currentTab">
        <identification
            v-if="currentTab===1"
            :apply-info="applyInfo"
            @changeTab="changeTab"
            @nextStep="nextStep"
        />
        <apply-expert-info
            v-if="currentTab===2"
            @changeTab="changeTab"
            @refreshResult="refreshResult"
        />
        <apply-result
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
import ApplyExpertInfo from './ApplyInfos/ApplyExpertInfo.vue'
import ApplyResult from './ApplyInfos/ApplyResult.vue'
import { getApplyResult, getApplyStatus } from '@/api/user'
import { statusCode } from '../../../utils/statusCode'
import { mapActions } from 'vuex'
export default {
    name: 'ApplyExpert',
    components: {
        HeaderTabs,
        Identification,
        ApplyExpertInfo,
        ApplyResult
    },
    data () {
        return {
            currentTab: null,
            applyInfo: {}, // 身份认证信息
            appliedInfo: {}, // 申请信息
            isConfirmed: false, // 是否已经认证
            isApplied: false // 是否已经申请
        }
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
    created () {
        this.init()
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        refresh () {
            this.init()
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
                    // 200 表示申请了，不代表认真通过了
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
            }
        },
        handleData (data) {
        // 验证过身份了
            if (data.status === 3) {
                // 审核中
                this.applyInfo = data
                this.isLoading = false
                this.appliedInfo = data
                this.currentTab = 3
            } else if (data.status === 1) {
                // 通过
                this.isConfirmed = true
                this.applyInfo = data
                this.getApplyStatus()
            } else {
                // 2 认真失败，查看原因
                this.currentTab = 3
                this.isLoading = false
                this.appliedInfo = data
            }
        },
        changeTab (tab) {
            this.currentTab = tab.id
        },
        applyAgain () {
            this.currentTab = 1
        },
        refreshResult () {
            this.getApplyStatus(3)
        },
        async getApplyStatus (tab) {
            try {
                const { code, data } = await getApplyStatus(2)
                if (code === 6004) {
                    // 未申请 直接 1，重新从第一步开始进入
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
