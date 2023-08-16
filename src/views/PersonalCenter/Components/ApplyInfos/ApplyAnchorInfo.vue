<template>
    <div class="page p-l-30 p-t-15">
        <div class="row flex align-center p-relative">
            <div class="label">
                <span>直播赛事</span>
            </div>
            <el-radio-group v-model="leagueType" fill="#FBA187">
                <el-radio-button   :label="1">足球</el-radio-button>
                <el-radio-button   :label="2">篮球</el-radio-button>
                <el-radio-button   :label="3">电竞</el-radio-button>
                <el-radio-button   :label="4">其他</el-radio-button>
            </el-radio-group>
        </div>
        <select-with-error
            class="m-b-20 m-t-25"
            showLabel
            :label="form.experience.label"
            :error-info="errorInfo.experience"
            :row-info.sync="form.experience"
            @validate="validateRow"
            :key="form.experience.updateKey"
            :options="experiencesOptions"
        />
        <textarea-with-error
            class="m-b-20 m-t-25"
            showLabel
            :label="form.description.label"
            :error-info="errorInfo.description"
            :row-info.sync="form.description"
            @validate="validateRow"
            :key="form.description.updateKey"
        />
        <div class="radios row flex align-center">
            <div class="label visibility-hidden">
                <span class="">asdf</span>
            </div>
            <el-radio-group v-model="contactType" fill="#FBA187">
                <el-radio  :label="1">QQ</el-radio>
                <el-radio  :label="2">微信</el-radio>
                <el-radio  :label="3">电话号码</el-radio>
            </el-radio-group>
        </div>
        <input-with-error
            class="m-b-20"
            placehold="请输入QQ/微信/电话号码"
            showLabel
            :label="form.contact.label"
            :error-info="errorInfo.contact"
            :row-info.sync="form.contact"
            @validate="validateRow"
            :key="form.contact.updateKey"
        />
<!--        <div class="row flex">-->
<!--            <div class="label">手机验证</div>-->
<!--            <div class="phone-content flex-1">-->
<!--                <input-with-error-->
<!--                    class="m-b-20 phone-row"-->
<!--                    show-slot-->
<!--                    :label="form.phone.label"-->
<!--                    :error-info="errorInfo.phone"-->
<!--                    :row-info.sync="form.phone"-->
<!--                    @validate="validateRow"-->
<!--                    :key="form.phone.updateKey"-->
<!--                >-->
<!--                    <template #prepend>+86</template>-->
<!--                </input-with-error>-->
<!--                <div class="row p-relative">-->
<!--                    <el-input-->
<!--                        class="input  flex-1"-->
<!--                        placeholder="请输入验证码"-->
<!--                        v-model="form.code.value"-->
<!--                        @blur="validateRow('code')"-->
<!--                    >-->
<!--                        <el-button-->
<!--                            class="font-14 line-height-20 font-medium"-->
<!--                            @click="getCode"-->
<!--                            slot="append">{{  codeText  }}</el-button>-->
<!--                    </el-input>-->
<!--                    <span :key="form.code.updateKey" class="p-absolute code-error font-12 ">{{ errorInfo.code.isRequire }}</span>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        <div class="row procotol m-t-15 flex align-center">
            <div class="label">
                <span class="visibility-hidden">asdf</span>
            </div>
            <el-checkbox v-model="agreeUs">
                <!-- <span @click.prevent="viewProtocol">看球直播协议</span> -->
                <span >看球直播协议</span>
            </el-checkbox>
        </div>
        <div class="row-outer flex p-t-30 p-l-30  m-b-20">
            <div class="save-button font-medium font-16 overflow-hidden">
                <ConfirmButton class="w-100 h-100 d-inline-block w-100 text-center  font-medium font-16" title="提交" @click.native="submit"/>
            </div>
        </div>
        <ProtocolPopup :value.sync="showProtocol" :id="21"/>
    </div>
</template>

<script>
import { isRequire } from '../../../../utils/validator'
import SelectWithError from '../../../../components/Form/SelectWithError'
import InputWithError from '../../../../components/Form/InputWithError'
import TextareaWithError from '../../../../components/Form/TextareaWithError'
import ConfirmButton from '@/components/ConfirmButton'
import { mapState } from 'vuex'
import isEmpty from 'lodash.isempty'
import omit from 'lodash.omit'
import { statusCode } from '../../../../utils/statusCode'
import { getCode, applyAnchor } from '../../../../api/user'
import { Message } from 'element-ui'
import ProtocolPopup from '@/components/ProtocolPopup.vue'
export default {
    name: 'ApplyAnchorInfo',
    components: {
        ProtocolPopup,
        SelectWithError,
        InputWithError,
        TextareaWithError,
        ConfirmButton
    },
    data () {
        return {
            form: {
                experience: {
                    label: '直播经验',
                    value: '',
                    key: 'experience',
                    validators: [isRequire('直播经验')],
                    validateLabel: ['isRequire'],
                    updateKey: 'experience-false'
                },
                description: {
                    label: '个人简介',
                    value: '',
                    key: 'description',
                    validators: [isRequire('个人简介')],
                    validateLabel: ['isRequire'],
                    updateKey: 'description-false'
                },
                contact: {
                    label: '联系方式',
                    value: '',
                    key: 'description',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'contact-false'
                }
                // phone: {
                //     label: '手机号',
                //     value: '',
                //     key: 'phone',
                //     validators: [isRequire('手机号')],
                //     validateLabel: ['isRequire'],
                //     updateKey: 'phone-false'
                // }
                // code: {
                //     label: '验证码',
                //     value: '',
                //     key: 'code',
                //     icon: 'safe',
                //     validators: [isRequire('验证码')],
                //     validateLabel: ['isRequire'],
                //     updateKey: 'code-false'
                // }
            },
            errorInfo: {
                experience: {},
                description: {},
                contact: {}
                // phone: {}
                // code: {}
            },
            contactType: 1,
            leagueType: 1,
            isSend: false,
            leftTime: 60,
            timer: null,
            agreeUs: true,
            showProtocol: false
        }
    },
    computed: {
        ...mapState('commonData', ['experiences']),
        experiencesOptions () {
            return this.experiences.reduce((all, item) => {
                all.push({
                    ...item,
                    label: item.title,
                    value: item.id
                })
                return all
            }, [])
        },
        codeText () {
            return this.isSend ? `${this.leftTime}s` : '获取验证码'
        }
    },
    methods: {
        async submit () {
            if (!this.agreeUs) {
                return
            }
            const isValidate = this.validate()
            if (isValidate) {
                const params = this.finalData()
                const { code, msg } = await applyAnchor(params)
                if (code === statusCode.success) {
                    // this.$emit('changeTab', { id: 3 })
                    Message.success(msg)
                    this.$emit('refreshResult')
                } else {
                    Message.error(msg)
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
            console.log('key', key)
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
            const isValidate = this.validateRow('phone')
            // 获取验证码操作
            if (isValidate) {
                this.isSend = true
                this.startInterval()
                const { msg, code } = await getCode({
                    mobile: this.form.phone.value,
                    msType: 6
                })
                if (code === statusCode.success) {
                    Message.success(msg)
                }
            }
        },
        goToHelpCenter (tabId) {
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId
                }
            })
        },
        finalData () {
            const exp = this.experiencesOptions.find(x => x.id === this.form.experience.value)
            return {
                leagueType: this.leagueType,
                contact: this.contactType,
                contactValue: this.form.contact.value,
                description: this.form.description.value,
                // code: this.form.code.value,
                experience: exp.label
            }
        },
        viewProtocol () {
            this.showProtocol = true
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.code-error {
    left: 0;
    top: 100%;
    color: $text-error;
}
.procotol {
    color: #BCBAD8;
    span {
        color: #A05A77;
        text-decoration: underline;
    }
}
::v-deep {
    .input-section, .input {
        max-width: 480px;
        background-color: #fff;
        .el-input__inner {
            line-height: 40px;
            height: 40px;
            border: 1px solid #D8D8D8!important;
        }
        .el-textarea__inner {
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
        .phone-row {
            .error {
                left: 0!important;
            }
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
