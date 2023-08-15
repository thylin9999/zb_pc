<template>
<el-button @click="visible = !visible">
    <span>更改密码</span>
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
            :label="form.oldPassword.label"
            :error-info="errorInfo.oldPassword"
            :row-info.sync="form.oldPassword"
            @validate="validateRow"
            :key="form.oldPassword.updateKey"
        />
        <input-with-error
            class="m-b-20"
            :label="form.newPassword.label"
            :error-info="errorInfo.newPassword"
            :row-info.sync="form.newPassword"
            @validate="validateRow"
            :key="form.newPassword.updateKey"
        />
        <input-with-error
            class="m-b-20"
            :label="form.password.label"
            :error-info="errorInfo.password"
            :row-info.sync="form.password"
            @validate="validateRow"
            :key="form.password.updateKey"
        />
        <div class="w-100 text-right">
            <el-button @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</el-button>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import { isRequire } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { updatePassword } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
export default {
    name: 'DialogUpdatePassword',
    components: {
        InputWithError
    },
    data () {
        return {
            visible: false,
            form: {
                password: {
                    label: '确认密码',
                    value: '',
                    key: 'password',
                    icon: 'lock',
                    validators: [isRequire('确认密码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'password-false'
                },
                newPassword: {
                    label: '新密码',
                    value: '',
                    key: 'newPassword',
                    icon: 'lock',
                    validators: [isRequire('新密码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'newPassword-false'
                },
                oldPassword: {
                    label: '旧密码',
                    value: '',
                    key: 'oldPassword',
                    icon: 'lock',
                    validators: [isRequire('旧密码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'oldPassword-false'
                }
            },
            errorInfo: {
                password: {},
                newPassword: {},
                oldPassword: {}
            }
        }
    },
    computed: {
        codeText () {
            return this.isSend ? `${this.leftTime}s` : '获取验证码'
        }
    },
    methods: {
        async confirm () {
            const isValidate = this.validate()
            console.log(isValidate, 'isValidate')
            if (!isValidate) {
                return
            }
            try {
                const { code, data, msg } = await updatePassword({
                    password: this.form.newPassword.value,
                    verPassword: this.form.password.value,
                    oldPassword: this.form.oldPassword.value
                })
                if (code && code === statusCode.success) {
                    Message.success(msg)
                    // this.reload()
                    this.close()
                } else {
                    console.log(data, 'data')
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
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
        validate () {
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
            })
            return res.every(x => x)
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        close () {
            Object.keys(this.form).forEach(key => {
                this.form[key].value = ''
                this.errorInfo[key] = {}
            })
            this.visible = false
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
