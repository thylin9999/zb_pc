<template>
    <el-dialog
        :visible="showDialog"
        custom-class="modal-dialog"
        append-to-body
        destroy-on-close
        lock-scroll
        close-on-click-modal
        close-on-press-escape
    >
        <div  class="modal" @click.stop>
            <span class="close-button p-absolute">
                <slot name="close"/>
            </span>
            <slot/>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Modal',
    computed: {
        ...mapState('modal', ['showDialog'])
    }
}
</script>

<style lang="scss" scoped>

.modal {
    z-index: 999;
    width: 640px;
    .close-button {
        right: 10px;
        top: 10px;
    }
}
::v-deep {
    .el-dialog {
        width: 640px;
        margin: 0!important;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        width: 640px!important;
        padding: 0!important;
    }
}
</style>
