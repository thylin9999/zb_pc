<template>
<el-dialog
    :visible="visible"
    lock-scroll
    destroy-on-close
    append-to-body
    close-on-press-escape
    @close="close"
    title="备注：为了更好的体验请先推流成功再点确认开播"
>
    <div class="body">
        <div class="font-medium obs font-16 obs p-b-25">
            <div class="flex align-center" >
                <div class="m-r-15">
                    OBS推流地址：{{obs.url }}
                </div>
                <el-tooltip content="复制">
                    <i class="el-icon-copy-document pointer" @click="copyObs(obs.url)"></i>
                </el-tooltip>
            </div>
            <div class="flex align-center m-t-5">
                <div class="m-r-15">
                    OBS串流秘钥：{{obs.key}}
                </div>
                <el-tooltip content="复制">
                    <i class="el-icon-copy-document pointer" @click="copyObs(obs.key)"></i>
                </el-tooltip>
            </div>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button class="confirm-button" @click="confirm">确认开播</el-button>
      </span>
</el-dialog>
</template>

<script>
import { getOBSAddress } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { Copy } from '@/utils/validator'

export default {
    name: 'DialogOpenLiveTip',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            obs: {}
        }
    },
    watch: {
        visible () {
            if (this.visible) {
                this.getAddress()
            }
        }
    },
    methods: {
        async getAddress (isFirst) {
            const { data, code, msg } = await getOBSAddress()
            if (code === statusCode.success) {
                this.obs = data
            } else {
                Message.error(msg)
            }
        },
        copyObs (value) {
            Copy(value)
        },
        close () {
            this.$emit('update:visible', false)
        },
        confirm () {
            this.close()
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss" scoped>
.obs {
    line-height: 25px;
}
::v-deep {
    .el-dialog {
        width: 900px;
    }
    .el-dialog__body {
        //padding-top: 0;
    }
}
</style>
