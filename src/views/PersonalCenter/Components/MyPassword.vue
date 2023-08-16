<template>
  <div class="p-t-15">
    <!-- <input-with-error
      class="m-b-20"
      showLabel
      :max-length="11"
      :label="form.password.label"
      :error-info="errorInfo.password"
      :row-info.sync="form.password"
      @validate="validateRow"
      :key="form.password.updateKey"
  /> -->
    <input-with-error
      class="m-b-20"
      showLabel
      :max-length="11"
      :label="form.account.label"
      :error-info="errorInfo.account"
      :row-info.sync="form.account"
      @validate="validateRow"
      :key="form.account.updateKey"
    />
    <input-with-error
      class="m-b-20"
      showLabel
      :max-length="11"
      :label="form.newPassword.label"
      :error-info="errorInfo.newPassword"
      :row-info.sync="form.newPassword"
      @validate="validateRow"
      :key="form.newPassword.updateKey"
    />
    <input-with-error
      class="m-b-20"
      showLabel
      :label="form.code.label"
      :error-info="errorInfo.code"
      :row-info.sync="form.code"
      @validate="validateRow"
      :key="form.code.updateKey"
    />
    <div class="code-btn">
      <span
        :class="{ 'not-allowed opacity-7': isSend }"
        class="btn pointer text-center font-14 font-400 d-inline-block"
        @click="startValidateCode"
        >{{ codeText }}</span
      >
    </div>
    <div class="confirm-btn flex justify-center">
      <div
        class="save-button overflow-hidden w-100 text-right font-medium font-16"
      >
        <ConfirmButton
          class="text-center font-medium font-16"
          @click.native="confirm"
          title="确认提交"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire, phone } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { getCode, updatePwd } from '@/api/user'
import { generateInstance } from '@/utils/validateCode'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
export default {
    name: 'MyPassword',
    components: {
        InputWithError,
        ConfirmButton
    },
    data () {
        return {
            form: {

                account: {
                    label: '我的手机',
                    value: '',
                    key: 'account',
                    validators: [isRequire('手机号'), phone],
                    validateLabel: ['isRequire', 'phone'],
                    updateKey: 'account-false'
                },
                newPassword: {
                    label: '更换密码',
                    value: '',
                    key: 'newPassword',
                    icon: 'phone',
                    validators: [isRequire('新密码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'newPassword-false'
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
                password: {},
                account: {},
                newPassword: {},
                code: {}
            },
            isSend: false,
            leftTime: 60,
            timer: null,
            captchaIns: null
        }
    },
    computed: {
        codeText () {
            return this.isSend ? `${this.leftTime}s` : '获取验证码'
        }
    },
    mounted () {
        this.initCode()
    },
    methods: {
        async confirm () {
            const isValidate = this.validate()
            if (isValidate) {
                const { code, msg } = await updatePwd({
                    // oldPwd: this.form.password.value,
                    newPwd: this.form.newPassword.value,
                    mobile: this.form.account.value,
                    code: this.form.code.value
                })
                if (code === statusCode.success) {
                    this.clearForm()
                    this.clearInterval()
                    Message.success(msg)
                } else {
                    Message.error(msg)
                }
            }
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        clearForm () {
            Object.keys(this.form).forEach((key) => {
                this.form[key].value = ''
                this.errorInfo[key] = {}
            })
        },
        validate () {
            const res = []
            Object.keys(this.form).forEach((key) => {
                res.push(this.validateRow(key))
            })
            return res.every((x) => x)
        },
        validateRow (key) {
            this.form[key].validators.forEach((validator) => {
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
                    if (this.leftTime <= 1) {
                        clearInterval(this.timer)
                        this.isSend = false
                        this.leftTime = 60
                    } else {
                        this.leftTime--
                    }
                }, 1000)
            }
        },
        startValidateCode () {
            if (this.isSend && this.timer) return
            const isValidate = this.validateRow('account')
            // 获取验证码操作
            if (isValidate) {
                this.captchaIns && this.captchaIns.verify()
            }
        },
        async getCode ({ validate }) {
            this.captchaIns.refresh()
            this.isSend = true
            this.startInterval()
            const { msg, code } = await getCode({
                mobile: this.form.account.value,
                msType: 5,
                validate
            })
            if (code === statusCode.success) {
                Message.success(msg)
            }
        },
        clearInterval () {
            this.isSend = false
            this.leftTime = 60
            window.clearInterval(this.timer)
            this.timer = null
        },
        // 行为验证码
        async initCode () {
            this.captchaIns = await generateInstance({ el: '#captchaContainer', cb: this.getCode })
        }
    }
}
</script>

<style lang="scss" scoped>

.code-btn {
  .btn {
    margin-left: 120px;
    width: 150px;
    border-radius: 5px;
    background-color: #409eff;
    color: #fff;
    line-height: 40px;
  }
}
::v-deep {
  .row-inner {
    max-width: 600px;
    padding-left: 30px !important;
    .label {
      width: 90px;
      line-height: 40px;
      padding-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #727272;
    }
    .input-section {
      background-color: transparent !important;
      border: 1px solid #e2e1e1;
      border-radius: 2px;
    }
    .error {
      left: 120px;
    }
  }
  .confirm-btn {
    margin-top: 90px;
    .save-button {
      width: 235px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      font-size: 16px;
      .confirm {
        background: #A05A77;
      }
    }
  }
}
</style>
