<template>
<div class="update-password p-b-30">
    <div class="content font-16 font-regular text-333 p-t-30">
        <input-with-error
            class="m-b-20"
            show-label
            :label="form.oldPassword.label"
            :error-info="errorInfo.oldPassword"
            :row-info.sync="form.oldPassword"
            @validate="validateRow"
            :key="form.oldPassword.updateKey"
        />
        <input-with-error
            class="m-b-20"
            show-label
            :label="form.newPassword.label"
            :error-info="errorInfo.newPassword"
            :row-info.sync="form.newPassword"
            @validate="validateRow"
            :key="form.newPassword.updateKey"
        />
        <input-with-error
            class="m-b-20"
            show-label
            :label="form.password.label"
            :error-info="errorInfo.password"
            :row-info.sync="form.password"
            @validate="validateRow"
            :key="form.password.updateKey"
        />
    </div>
    <div class="submit-buttons p-t-20">
        <ConfirmButton @click.native="confirm" title="保存"/>
    </div>
</div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import ConfirmButton from '@/components/ConfirmButton'
import { updatePassword } from '@/api/user'
import { isRequire } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
export default {
    name: 'UpdatePassword',
    components: {
        InputWithError,
        ConfirmButton
    },
    inject: ['reload'],
    data () {
        return {
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
                    this.reload()
                } else {
                    console.log(data, 'data')
                    Message.error(data.msg)
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
        }
    }
}
</script>

<style lang="scss" scoped>
.content, .submit-buttons{
    width: 600px;
}
.submit-buttons{
    padding-left: 155px;
}
::v-deep {
    .content {
        .row-inner {
            max-width: 540px;
            padding-left: 30px!important;
            .label {
                width: 80px;
                line-height: 40px;
                margin-right: 45px;
            }
            .input-section {
                background-color: transparent!important;
                border: 1px solid #E2E1E1;
                border-radius: 2px;
            }
            .error{
                left: 155px;
            }
        }
    }
}
</style>
