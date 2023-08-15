<template>
    <el-tooltip
        class="item"
        effect="dark"
        :disabled="isShowTooltip"
        :content="showContent"
        placement="top"
    >
        <div
            class="over-flow w-100"
            @mouseover="onMouseOver('refName')"
        >
            <span ref="refName">{{ content }}</span>
        </div>
    </el-tooltip>

</template>

<script>
export default {
    name: 'CustomSpan',
    props: {
        content: {
            type: [Number, String],
            default: ''
        }
    },
    computed: {
        showContent () {
            return this.content + ''
        }
    },
    data () {
        return {
            isShowTooltip: true
            // content: '内容'
        }
    },
    methods: {
        onMouseOver (str) {
            const parentWidth = this.$refs[str].parentNode.offsetWidth
            const contentWidth = this.$refs[str].offsetWidth
            // 判断是否开启tooltip功能
            if (contentWidth > parentWidth) {
                this.isShowTooltip = false
            } else {
                this.isShowTooltip = true
            }
        }
    }
}
</script>
<style lang="scss" scope>
.over-flow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
p {
    margin: 0;
}
</style>
