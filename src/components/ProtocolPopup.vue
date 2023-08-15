<template>
    <el-dialog
        :visible="value"
        custom-class="modal-dialog"
        append-to-body
        destroy-on-close
        lock-scroll
        close-on-click-modal
        close-on-press-escape
        @close="close"
        >
        <div class="box p-15 overflow-y-auto" >
            <div class="title font-20 text-center font-500 p-t-10 p-b-10 text-333">{{ title }}</div>
            <div class="p-b-15" v-html="content"></div>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getContentList } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'ProtocolPopup',
    props: {
        id: {
            type: [Number, String],
            default: null
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            content: null,
            title: ''
        }
    },
    computed: {
        ...mapState('modal', ['showDownloadPopup'])
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            const { code, data } = await getContentList(this.id)
            if (code === statusCode.success) {
                this.content = data.content
                this.title = data.title
            }
        },
        close () {
            this.$emit('update:value', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    background-color: #fff;
    width: 75vw;
    height: 50vh;
    border-radius: 10px;
    max-width: 800px;
    .el-icon-circle-close {
        font-size: 40px;
        color: #aaa;
    }
}
::v-deep {
    .el-dialog {
        width: 75vw;
        max-width: 800px;
        background: transparent;
        box-shadow: unset;
    }
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        margin: 0 auto;
        padding: 0;
        background-color: transparent;
    }
}
</style>
