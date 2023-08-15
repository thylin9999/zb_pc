<template>
    <el-dialog
        :visible="showDownloadPopup"
        custom-class="modal-dialog"
        append-to-body
        destroy-on-close
        lock-scroll
        close-on-click-modal
        close-on-press-escape
        @close="setDownloadPopup"
        >
        <div class="box flex flex-column align-center justify-center">
            <img class="bg" :src="bg" alt="">
            <img class="login m-t-10 pointer" :src="loginUrl" alt="" @click="download">
            <i class="el-icon-circle-close m-t-25 pointer" @click="setDownloadPopup(false)"></i>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'DownloadPopup',
    data () {
        return {
            bg: require('../assets/images/download/download-app.png'),
            loginUrl: require('../assets/images/download/download-btn.png')
        }
    },
    computed: {
        ...mapState('modal', ['showDownloadPopup'])
    },
    methods: {
        download () {
            this.setDownloadPopup(false)
            this.$router.push({
                name: 'DownloadApp'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    .bg {
        width: 390px;
        height: 390px;
    }
    .login {
        width: 178px;
        height: 55px;
    }
    .el-icon-circle-close {
        font-size: 40px;
        color: #aaa;
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
