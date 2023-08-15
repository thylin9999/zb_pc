<template>
<el-button @click="visible = !visible">
    <span>更改手机号</span>
    <el-dialog
        :visible="visible"
        show-close
        append-to-body
        lock-scroll
        destroy-on-close
        @close="close"
    >
        <input-with-error
            class="m-b-20"
            :label="form.account.label"
            :error-info="errorInfo.account"
            :row-info.sync="form.account"
            @validate="validateRow"
            :key="form.account.updateKey"
        />
        <div class="row row-inner code-input m-b-20 flex p-relative">
            <div class="input-section flex align-center flex-1 " >
                <el-input
                    class="input  flex-1"
                    placeholder="请输入验证码"
                    v-model="form.code.value"
                    @blur="validateRow('code')"
                />
                <div class="code pointer text-center" :class="{'not-allowed opacity-7': isSend}"  @click="getCode">
                    <span class="font-14 line-height-20 font-medium">{{ codeText }}</span>
                </div>
            </div>
            <span class="p-absolute error font-12 ">{{ errorInfo.code.isRequire }}</span>
        </div>
        <div class="w-100 text-right">
            <el-button @click="confirm">{{ isFirst  ? '下一步' : '确定'}}</el-button>
        </div>
    </el-dialog>
</el-button>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import { isRequire, phone } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { getCode, updatePhone } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'DialogUpdatePassword',
    inject: ['reload'],
    components: {
        InputWithError
    },
    data () {
        return {
            visible: false,
            isFirst: true,
            form: {
                account: {
                    label: '手机号',
                    value: '',
                    key: 'account',
                    icon: 'phone',
                    validators: [isRequire('手机号'), phone],
                    validateLabel: ['isRequire', 'phone'],
                    updateKey: 'account-false'
                },
                code: {
                    label: '验证码',
                    value: '',
                    key: 'code',
                    icon: 'safe',
                    validators: [isRequire('验证码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'code-false'
                }
            },
            errorInfo: {
                account: {},
                code: {}
            },
            isSend: false,
            isLoading: false,
            leftTime: 60,
            timer: null
        }
    },
    computed: {
        ...mapState('user', ['account']),
        codeText () {
            return this.isSend ? `${this.leftTime}s` : '获取验证码'
        }
    },
    watch: {
        visible () {
            if (this.visible) {
                this.form.account.value = this.account
            }
        }
    },
    methods: {
        ...mapActions('user', ['logoutAction']),
        async confirm () {
            const isValidate = this.validate()
            if (isValidate) {
                this.isLoading = true
                const { code, msg } = await updatePhone({
                    mobile: this.form.account.value,
                    code: this.form.code.value,
                    isValidatePhone: this.isFirst
                })
                if (code === statusCode.success) {
                    this.clearForm()
                    this.clearInterval()
                    if (!this.isFirst) {
                        Message.success(msg)
                        this.close()
                        this.$router.push('/')
                        this.$nextTick(() => {
                            this.logoutAction()
                        })
                    }
                    this.isFirst = false
                } else {
                    Message.error(msg)
                }
                this.isLoading = false
            }
        },
        validate () {
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
            })
            return res.every(x => x)
        },
        validateRow (key) {
            this.form[key].validators.forEach(validator => {
                const { message, type } = validator(this.form[key].value)
                if (message) {
                    this.errorInfo[key][type] = message
                } else {
                    this.errorInfo[key] = omit(this.errorInfo[key], type, message)
                }
            })
            this.changeKey(key)
            return isEmpty(this.errorInfo[key])
        },
        startInterval () {
            if (this.isSend) {
                window.clearInterval(this.timer)
                this.timer = setInterval(() => {
                    if (this.leftTime <= 0) {
                        clearInterval(this.timer)
                        this.isSend = false
                        this.leftTime = 60
                    } else {
                        this.leftTime--
                    }
                }, 1000)
            }
        },
        async getCode () {
            if (this.isSend && this.timer) return
            const isValidate = this.validateRow('account')
            // 获取验证码操作
            if (isValidate) {
                this.isSend = true
                this.startInterval()
                const { msg, code } = await getCode({
                    mobile: this.form.account.value,
                    msType: 4
                })
                if (code === statusCode.success) {
                    Message.success(msg)
                }
            }
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        close () {
            this.clearForm()
            this.clearInterval()
            this.visible = false
            this.isFirst = true
        },
        clearForm () {
            Object.keys(this.form).forEach(key => {
                this.form[key].value = ''
                this.errorInfo[key] = {}
            })
        },
        clearInterval () {
            this.isSend = false
            this.leftTime = 60
            window.clearInterval(this.timer)
            this.timer = null
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
::v-deep {
    .el-dialog {
        width: 558px;
        .el-dialog__body {
            padding: 40px 45px 30px;
        }
    }
    .code-input {
        .el-input__inner {
            background-color: transparent;
            border: none;
        }
    }
}
.code-input {
    .input-section {
        background-color: $background-input;
        height: 45px;
        //border-bottom: 1px solid #F1F1F1;
    }
    .error {
        left: 0;
        top: 100%;
        color: $text-error;
    }
    .code {
        width: 100px;
        background-color: #4B6EFF;
        color: #FEFEFE;
        line-height: 35px;
        height: 35px;
        &.is-send{
            background-color: #eee;
        }
    }
}
</style>
