<template>
    <el-dialog
        :visible="needRefresh"
        custom-class="modal-dialog"
        append-to-body
        destroy-on-close
        lock-scroll
        @close="closeRefreshDialog"
        >
        <div class="box flex flex-column p-b-20 p-t-20 bg-white align-center justify-center">
            <p class="p-t-15 p-b-15 font-16 font-500">您的网络不佳，请检查网络！</p>
            <el-button type="primary" @click="reloadPage">重新加载</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'NetErrorPopup',
    inject: ['reload'],
    data () {
        return {

        }
    },
    computed: {
        ...mapState('commonData', ['needRefresh'])
    },

    methods: {
        ...mapMutations('commonData', ['SET']),
        closeRefreshDialog () {
            this.SET({
                needRefresh: false,
                requestFlag: {
                    hotMatch: false,
                    adv: false,
                    detail: false
                }
            })
        },
        reloadPage () {
            this.closeRefreshDialog()
            this.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    border-radius: 5px;
    .reload-btn{
      background-color: #184f94;
      color: #fff;
      border-radius: 2px;
    }
}
::v-deep {
    .el-dialog {
        width: 390px;
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
