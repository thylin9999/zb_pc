<template>
    <div class="validate-auth p-l-30 p-t-15" v-loading="isLoading">
        <input-with-error
            class="m-b-20 m-t-25"
            showLabel
            :label="form.name.label"
            :error-info="errorInfo.name"
            :row-info.sync="form.name"
            @validate="validateRow"
            :disabled="isSuccess"
            :key="form.name.updateKey"
        />
        <input-with-error
            class="m-b-20 m-t-25"
            showLabel
            :disabled="true"
            :label="form.type.label"
            :error-info="errorInfo.type"
            :row-info.sync="form.type"
            :key="form.type.updateKey"
        />
        <input-with-error
            class="m-b-20 m-t-25"
            showLabel
            :disabled="isSuccess"
            :label="form.idCard.label"
            :error-info="errorInfo.idCard"
            :row-info.sync="form.idCard"
            @validate="validateRow"
            :key="form.idCard.updateKey"
        />
        <div class="row flex align-center">
            <div class="label">
                <span>证件照片</span>
            </div>
            <div class="upload-imgs flex-1 flex align-center">
                <upload-img-with-label
                    class="m-r-30"
                    label="身份证正面照"
                    :url.sync="imgs.frontImg"
                    :disabled="isSuccess"
                />
                <upload-img-with-label
                    class="m-r-30"
                    label="身份证反面照"
                    :url.sync="imgs.backImg"
                    :disabled="isSuccess"
                />
                <upload-img-with-label
                    label="手持身份证拍照"
                    :url.sync="imgs.handInImg"
                    :disabled="isSuccess"
                />
            </div>
        </div>
        <div class="row-outer flex p-t-30 p-l-30  m-b-20">
            <div class="save-button font-medium font-16 overflow-hidden">
                <ConfirmButton
                    class="w-100 h-100  d-inline-block w-100 text-center  font-medium font-16"
                    title="下一步" @click.native="submit"/>
            </div>
        </div>

    </div>
</template>

<script>
import InputWithError from '../../../../components/Form/InputWithError.vue'
import UploadImgWithLabel from '../../../../components/UploadImgWithLabel.vue'
import ConfirmButton from '@/components/ConfirmButton'
import { isRequire } from '../../../../utils/validator'
import isEmpty from 'lodash.isempty'
import omit from 'lodash.omit'
import { Message } from 'element-ui'
import { validateAuth } from '../../../../api/user'
import { statusCode } from '../../../../utils/statusCode'
export default {
    name: 'Identification',
    components: {
        InputWithError,
        UploadImgWithLabel,
        ConfirmButton
    },
    props: {
        applyInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            isLoading: false,
            form: {
                name: {
                    label: '真实姓名',
                    value: '',
                    key: 'name',
                    validators: [isRequire('真实姓名')],
                    validateLabel: ['isRequire'],
                    updateKey: 'name-false'
                },
                type: {
                    label: '证件类型',
                    value: '居民身份证',
                    key: 'type',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'type-false'
                },
                idCard: {
                    label: '证件号码',
                    value: '',
                    key: 'idCard',
                    validators: [isRequire('证件号码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'idCard-false'
                }
            },
            imgs: {
                frontImg: '',
                backImg: '',
                handInImg: ''
            },
            errorInfo: {
                name: {},
                type: {},
                idCard: {}
            }
        }
    },
    computed: {
        hasImg () {
            return this.imgs.backImg && this.imgs.frontImg && this.imgs.handInImg
        },
        isSuccess () {
            return this.applyInfo && this.applyInfo.status === 1
        },
        isGoing () { // 审核中
            return this.applyInfo && this.applyInfo.status === 3
        },
        isFail () { // 认证失败
            return this.applyInfo && this.applyInfo.status === 2
        }
    },
    created () {
        this.handleOriginalData()
    },
    methods: {
        handleOriginalData () {
            if (!isEmpty(this.applyInfo)) {
                this.form.name.value = this.applyInfo.name
                this.form.idCard.value = this.applyInfo.id_card
                this.imgs.frontImg = this.applyInfo.id_card_front_photo
                this.imgs.backImg = this.applyInfo.id_card_back_photo
                this.imgs.handInImg = this.applyInfo.hand_held_id_card_photo
            }
        },
        async submit () {
            if (this.isSuccess) {
                // 跳转第2步
                this.$emit('changeTab', { id: 2 })
                return
            }
            const isValidate = this.validate()
            if (isValidate) {
                if (this.hasImg) {
                    this.isLoading = true
                    const params = this.finalData()
                    const { code, msg } = await validateAuth(params)
                    if (code === statusCode.success) {
                        // 提交之后不用刷新页面
                        this.$emit('nextStep')
                        Message.success(msg)
                    } else {
                        Message.error(msg)
                    }
                    this.isLoading = false
                } else {
                    Message.error('请上传证件照片')
                }
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
        finalData () {
            return {
                name: this.form.name.value,
                idCard: this.form.idCard.value,
                imgs: this.imgs
            }
        }
    }
}

</script>

<style lang="scss" scoped>

::v-deep {
    .input-section, .input {
        max-width: 480px;
        background-color: #fff;
        .el-input__inner {
            line-height: 40px;
            height: 40px;
            border-radius: 5px;
            border: 1px solid #D8D8D8!important;
        }
    }
    .row {
        .label {
            width: 100px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 40px;
        }
        .error {
            left: 100px!important;
        }
    }
    .row-outer {
        .el-input__inner {
        line-height: 40px;
        height: 40px;
        }
        .save-button {
        margin-left: 90px;
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
}
</style>
