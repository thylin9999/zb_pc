<template>
<div>
    <HeaderTitle title="意见反馈" />
    <div class="content p-t-30 p-l-30">
        <el-input
            type="textarea"
            placeholder="请将您遇到的问题/产品建议反馈给我们，建议您尽可能详细描述问题，以便运营同学帮您解决"
            v-model="feedback"
        />
    </div>
    <div class="submit-buttons p-t-30 p-l-30">
        <ConfirmButton :disable="!feedback" @click.native="submit" title="提交"/>
    </div>
</div>
</template>

<script>
import HeaderTitle from '@/views/PersonalCenter/Components/HeaderTitle'
import ConfirmButton from '@/components/ConfirmButton'
export default {
    name: 'Feedback',
    components: {
        HeaderTitle,
        ConfirmButton
    },
    data () {
        return {
            feedback: ''
        }
    },
    methods: {
        submit () {
            console.log(this.feedback, 'feedback')
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    width: 600px;
}
::v-deep {
    .content {
        .el-textarea__inner {
            height: 250px;
        }
    }
}
</style>
