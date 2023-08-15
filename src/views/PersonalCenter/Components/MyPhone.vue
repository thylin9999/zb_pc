<template>
<div class="p-t-15">
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
      :label="form.newAccount.label"
      :error-info="errorInfo.newAccount"
      :row-info.sync="form.newAccount"
      @validate="validateRow"
      :key="form.newAccount.updateKey"
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
        :class="{'not-allowed opacity-7': isSend}"
        class="btn pointer text-center font-14 font-400 d-inline-block"
        @click="startValidateCode"
    >{{ codeText }}</span>
  </div>
  <div class="confirm-btn flex align-center justify-center">
    <div class="save-button overflow-hidden w-100 text-right font-medium font-16">
      <ConfirmButton
          class="text-center font-medium font-16"
          @click.native="confirm" title="确认提交" />
    </div>
  </div>
</div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire, phone } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { getCode, updatePhone2 } from '@/api/user'
import { generateInstance } from '@/utils/validateCode'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { mapActions } from 'vuex'
export default {
    name: 'MyPhone',
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
                    icon: 'phone',
                    validators: [isRequire('手机号'), phone],
                    validateLabel: ['isRequire', 'phone'],
                    updateKey: 'account-false'
                },
                newAccount: {
                    label: '更换手机',
                    value: '',
                    key: 'newAccount',
                    icon: 'phone',
                    validators: [isRequire('新手机号'), phone],
                    validateLabel: ['isRequire', 'phone'],
                    updateKey: 'newAccount-false'
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
                newAccount: {},
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
        ...mapActions('user', ['logoutAction']),
        async confirm () {
            const isValidate = this.validate()
            if (isValidate) {
                this.isLoading = true
                const { code, msg } = await updatePhone2({
                    newPhone: this.form.newAccount.value,
                    code: this.form.code.value,
                    oldPhone: this.form.account.value
                })
                if (code === statusCode.success) {
                    this.clearForm()
                    this.clearInterval()
                    Message.success(msg)
                    this.$router.push('/')
                    this.$nextTick(() => {
                        this.logoutAction()
                    })
                } else {
                    Message.error(msg)
                }
                this.isLoading = false
            }
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        clearForm () {
            Object.keys(this.form).forEach(key => {
                this.form[key].value = ''
                this.errorInfo[key] = {}
            })
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
                msType: 4,
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
            console.log(this.captchaIns, 'captchaIns')
        }
    }
}
</script>

<style lang="scss" scoped>
.confirm-btn {
  margin: 90px auto 0;
}
.code-btn {
  .btn {
      margin-left: 120px;
      width: 150px;
      border-radius: 5px;
      background-color: #FBA187;
      color: #fff;
      line-height: 40px;
  }
}
::v-deep {
  .row-inner {
    max-width: 600px;
    padding-left: 30px!important;
    .label {
      width: 90px;
      line-height: 40px;
      padding-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #727272;
    }
    .input-section {
      background-color: transparent!important;
      border: 1px solid #E2E1E1;
      border-radius: 2px;
    }
    .error{
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
      font-family: PingFang-SC-Medium;
      .confirm {
        background: #A05A77;
      }
    }
  }
}
</style>
