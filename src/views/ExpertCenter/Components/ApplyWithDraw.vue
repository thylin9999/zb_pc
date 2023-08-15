<template>
  <div class="form">
    <input-with-error
        class="m-b-15 m-t-25"
        showLabel
        :label="form.bank.label"
        :error-info="errorInfo.bank"
        :row-info.sync="form.bank"
        @validate="validateRow"
        :key="form.bank.updateKey"
    />
    <input-with-error
        class="m-b-15 "
        showLabel
        :label="form.name.label"
        :error-info="errorInfo.name"
        :row-info.sync="form.name"
        @validate="validateRow"
        :key="form.name.updateKey"
    />
    <input-with-error
        class="m-b-15 "
        showLabel
        :label="form.account.label"
        :error-info="errorInfo.account"
        :row-info.sync="form.account"
        @validate="validateRow"
        :key="form.account.updateKey"
    />
    <input-with-error
        class="m-b-15 "
        showLabel
        :label="form.count.label"
        :error-info="errorInfo.count"
        :row-info.sync="form.count"
        @validate="validateRow"
        :key="form.count.updateKey"
    />
    <div class="w-100  flex align-center justify-center m-t-30">
        <span class="btn pointer d-inline-block text-center font-14 font-400 text-white"
              @click="submit"
        >申请提款</span>
    </div>
  </div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import { isRequire, mustNumber } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { applyWithdraw } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { mapActions } from 'vuex'
export default {
    name: 'ApplyWithdraw',
    components: {
        InputWithError
    },
    data () {
        return {
            form: {
                bank: {
                    label: '收款银行:',
                    value: '',
                    key: 'bank',
                    validators: [isRequire('收款银行')],
                    validateLabel: ['isRequire'],
                    updateKey: 'bank-false'
                },
                name: {
                    label: '收款人姓名:',
                    value: '',
                    key: 'name',
                    validators: [isRequire('收款人姓名')],
                    validateLabel: ['isRequire'],
                    updateKey: 'name-false'
                },
                account: {
                    label: '收款账号:',
                    value: '',
                    key: 'account',
                    validators: [isRequire('收款账号'), mustNumber],
                    validateLabel: ['isRequire', 'mustNumber'],
                    updateKey: 'account-false'
                },
                count: {
                    label: '提现金额:',
                    value: '',
                    key: 'count',
                    validators: [isRequire('提现金额'), mustNumber],
                    validateLabel: ['isRequire', 'mustNumber'],
                    updateKey: 'count-false'
                }
            },
            errorInfo: {
                bank: {},
                name: {},
                account: {},
                count: {}
            }
        }
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
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
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        async submit () {
            const isValidate = this.validate()
            if (!isValidate) return
            const loadingBox = this.$loading({
                lock: true,
                text: 'Loading'
            })
            try {
                const { code, msg } = await applyWithdraw(this.finalData())
                console.log(code, msg, 'asdf')
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.getUserInfo()
                    this.$emit('changeTab')
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                loadingBox.close()
            }
        },
        finalData () {
            return {
                bank: this.form.bank.value,
                name: this.form.name.value,
                cardNumber: this.form.account.value,
                ballCoin: this.form.count.value
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.btn {
  width: 236px;
  height: 40px;
  background: #A05A77;
  border-radius: 5px;
  line-height: 40px;
}
::v-deep {
  .row-outer {
    .el-input__inner {
      line-height: 40px;
      height: 40px;
    }
    .save-button {
      margin-left: 50px;
      width: 100px;
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
  .row-inner {
    max-width: 580px;

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
      border-radius: 5px;
    }
    .error{
      left: 90px;
    }
  }
  .time-picker{
    width: 100% !important;
    .el-input__inner {
      line-height: 40px;
      height: 40px;
    }
  }
  .el-input__icon{
    line-height: 40px!important;
  }
  .el-textarea__inner {
    height: 150px;
  }
}
</style>
