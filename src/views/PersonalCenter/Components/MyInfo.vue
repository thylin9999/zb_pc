<template>
  <div class=" info  font-16 font-regular text-333">
    <input-with-error
        class="m-b-20 m-t-25"
        showLabel
        :label="form.nickname.label"
        :error-info="errorInfo.nickname"
        :row-info.sync="form.nickname"
        @validate="validateRow"
        :key="form.nickname.updateKey"
    />
    <select-with-error
        class="m-b-20 m-t-25"
        showLabel
        :label="form.label.label"
        :options="labelOptions"
        :disabled="!labelDisabled"
        :error-info="errorInfo.label"
        :row-info.sync="form.label"
        @validate="validateRow"
        :key="form.label.updateKey"
    />
    <textarea-with-error
        class="m-b-30"
        showLabel
        :label="form.sign.label"
        :error-info="errorInfo.sign"
        :row-info.sync="form.sign"
        @validate="validateRow"
        :key="form.sign.updateKey"
    />
    <div class="upload-div flex p-l-30 p-t-10">
           <span class="label">
                头像:
            </span>
      <div class="flex-column p-relative">
        <div class="preview m-r-20" >
          <div
              class="template-img  bg-center bg-size-cover bg-no-repeat w-100 h-100"
              :style="{
                    backgroundImage: `url(${placementUrl})`
                }"
              v-if="!url"></div>
          <el-image
              v-else
              class="w-100 h-100 border-radius-50"
              :src="url"
              fit="cover"></el-image>
        </div>
        <div class="upload-button m-t-10 flex flex-end flex-column">
          <upload-with-tip
              @changeFile="changeFile"
              :max-size="100"
          />
        </div>
      </div>
    </div>
    <div class="row-outer flex p-t-30  m-b-20">
      <div class="save-button font-medium font-16 overflow-hidden">
        <ConfirmButton class="w-100 h-100  d-inline-block w-100 text-center  font-medium font-16" title="保存" @click.native="saveInfo"/>
      </div>
    </div>
  </div>
</template>

<script>

import InputWithError from '@/components/Form/InputWithError'
import SelectWithError from '@/components/Form/SelectWithError'
import TextareaWithError from '@/components/Form/TextareaWithError'
import UploadWithTip from '@/components/UploadWithTip'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire } from '@/utils/validator'
import { mapActions, mapState } from 'vuex'
import dayjs from 'dayjs'
import { editUserInfo, getMemberDetail } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { uploadImage } from '@/api/Common'
export default {
    name: 'MyInfo',
    components: {
        InputWithError,
        TextareaWithError,
        UploadWithTip,
        ConfirmButton,
        SelectWithError
    },
    data () {
        return {
            labelOptions: [],
            form: {
                nickname: {
                    label: '我的昵称:',
                    value: '',
                    key: 'nickname',
                    validators: [isRequire('昵称')],
                    validateLabel: ['isRequire'],
                    updateKey: 'nickname-false'
                },
                label: {
                    label: '我的标签:',
                    value: '',
                    key: 'label',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'label-false'
                },
                sign: {
                    label: '个人简介:',
                    placeholder: '这个人很懒，什么也没有留下',
                    value: '',
                    key: 'sign',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'sign-false'
                }
            },
            errorInfo: {
                nickname: {},
                label: {},
                sign: {},
                birth: {}
            },
            userInfo: {
                nickname: '',
                signature: ''
            },
            file: null,
            url: ''
        }
    },
    computed: {
        ...mapState('user', ['nickname', 'sign', 'account', 'token', 'avatar']),
        pickerOptions () {
            return {
                disabledDate: date => {
                    return dayjs().isBefore(dayjs(date), 'day')
                }
            }
        },
        placementUrl () {
            return this.avatar ? this.avatar : ''
        },
        labelDisabled () {
            let count = 0
            this.labelOptions.forEach(item => {
                if (item.value === '11' || item.value === '12') {
                    count++
                }
            })
            return count === 2
        }
    },
    created () {
        this.fetchMemberDetail()
    },
    mounted () {
        this.userInfo = {
            nickname: this.nickname,
            signature: this.sign
        }
        this.form.nickname.value = this.nickname
        this.form.sign.value = this.sign
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        async fetchMemberDetail () {
            try {
                const { code, data } = await getMemberDetail()
                if (code === statusCode.success) {
                    this.labelOptions = data.labels.reduce((all, item) => {
                        all.push({
                            value: item.label,
                            label: item.text,
                            disabled: item.label === '1'
                        })
                        if (item.selected) {
                            this.form.label.value = item.label
                        }
                        return all
                    }, [])
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        async saveInfo () {
            const isValidate = this.validate()
            if (!isValidate) return
            const loadingBox = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            try {
                const { code, msg } = await editUserInfo(this.finalData())
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.getUserInfo()
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
                'nickname': this.form.nickname.value,
                'sign': this.form.sign.value,
                'avatar': this.url,
                label: this.form.label.value
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
            console.log(key, 'key')
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
        async changeFile (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'avatar')
            const { data, code, msg } = await uploadImage(formData)
            if (code === statusCode.success) {
                this.url = data.url
                console.log(msg, 'msg')
                // Message.success(msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.row-outer {
  width: 600px;
  .label {
    width: 90px;
    padding-right: 10px;
    font-size: 14px;
    color: #727272;
  }
  .content {
    line-height: 40px;
    height: 40px;
  }
}
.upload-div{
  height: 120px;
  .label {
    width: 90px;
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    color: #727272;
  }
  .preview{
    width: 80px;
    height: 80px;
    .template-img {
      border-radius: 5px;
      border: 1px solid #D8D8D8;
    }
  }
}
.update-info {
  margin-top: 45px;
  .update-pwd {
    margin-left: 35px;
  }
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
      border-radius: 5px;
    }
    .error{
      left: 120px;
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
