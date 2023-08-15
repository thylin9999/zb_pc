<template>
    <el-dialog
        :visible="showLoginDialog"
        :custom-class="className"
        append-to-body
        destroy-on-close
        lock-scroll
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeModal"
    >
        <div class="w-100 h-100 content-body bg-no-repeat  bg-center">
            <span class="close-button p-absolute">
                <span  @click="closeModal">
                    <i class="el-icon-close font-20 pointer"></i>
                </span>
            </span>
            <div
                v-loading.body="isLoading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                class="box w-100 flex align-center bg-white p-b-30">
                <div v-if="!showWxLogin" class="right-form  w-100 h-100 bg-white ">
                    <div
                        class="title  text-center m-t-30 bg-no-repeat bg-center bg-size-auto"
                        :class="{'m-b-15': isRegister, 'm-b-30': !isRegister}">
                    </div>
                    <div class="form">
                        <input-with-error
                            class="m-b-20"
                            just-bottom
                            :label="form.account.label"
                            :error-info="errorInfo.account"
                            :row-info.sync="form.account"
                            :max-length="11"
                            show-slot
                            @validate="validateRow"
                            :key="form.account.updateKey"
                        >
                            <span class="phone-label font-16">+86</span>
                        </input-with-error>
                        <div v-if="showCode && isRegister" class="row row-inner code-input m-b-20 flex p-relative">
                            <div class="input-section flex align-center flex-1 " >
    <!--                            <svg-icon class="icon-14" icon-class="safe"></svg-icon>-->
                                <el-input
                                    class="input  flex-1"
                                    placeholder="请输入验证码"
                                    v-model="form.code.value"
                                    @blur="validateRow('code')"
                                />
                                <div class="code pointer text-center" :class="{'not-allowed opacity-7': isSend}" v-if=showCode @click="getCode">
                                    <span class="font-14 line-height-20 font-medium">{{ codeText }}</span>
                                </div>
                            </div>
                            <span class="p-absolute error font-12 ">{{ errorInfo.code.isRequire }}</span>
                        </div>
                        <input-with-error
                            class="m-b-20"
                            just-bottom
                            :label="form.password.label"
                            :error-info="errorInfo.password"
                            :row-info.sync="form.password"
                            @validate="validateRow"
                            @keyUpEnter="submit"
                            :key="form.password.updateKey"
                        />
                    </div>
                    <div class="button-text font-12 line-height-20 ">
                        <template v-if="!isRegister">
                            <div class="flex justify-between align-center">
                                <span class="pointer underline font-medium text-333" @click="changeType(1)">立即注册</span>
                                <span @click="forgetPassword"  class="pointer underline font-medium text-333">忘记密码</span>
                            </div>
                        </template>
                        <template v-else>
                            <span class="pointer" @click="changeType(2)">已有账号去登录</span>
                        </template>
                    </div>
                    <div class="procotol m-t-30 m-b-30 font-12 font-400">
                        <el-checkbox v-model="agreeUs">
                            <div>我已阅读且同意
                                <span @click.prevent="goToHelpCenter(3)">《播球用户协议》</span>
                                和
                                <span @click.prevent="goToHelpCenter(4)">《隐私政策》</span>
                            </div>
                        </el-checkbox>

                    </div>
                    <div class="submit m-t-15 text-center">
                        <submit-button
                            class="w-100 font-20 font-400 d-inline-block text-center"
                            :disabled="!agreeUs"
                            :title="buttonTitle" @click.native="submit"
                            :loading="isLoading"
                        />
                        <div class="wx-login">
                            <div class="line p-absolute ">
                                <span class="d-inline-block text p-absolute">其他方式登录</span>
                            </div>
                            <img class="wx-logo pointer" :src="wxLogo" alt="" @click="useWxLogin">
                        </div>
                    </div>
                </div>
                <div class="wx-box" id="wxBox" v-else>

                </div>
                <span id="ipBox">
                    <span @click="test">点我</span>
                </span>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SubmitButton from '@/components/SubmitButton'
import InputWithError from '@/components/Form/InputWithError'
import { isRequire, phone } from '@/utils/validator'
import { omit, isEmpty } from '../../utils/lodashUtil'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { register, getCode, findBackPwd, loginWithCode } from '@/api/user'
import { setItem, setToken } from '@/utils/cookie'
import Store from '@/store'

export default {
    name: 'ModalLogin',
    components: {
        SubmitButton,
        InputWithError
    },
    inject: ['reload'],
    data () {
        return {
            showWxLogin: false,
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
                },
                password: {
                    label: '密码',
                    value: '',
                    key: 'password',
                    icon: 'lock',
                    validators: [isRequire('密码')],
                    validateLabel: ['isRequire'],
                    updateKey: 'password-false'
                }
            },
            errorInfo: {
                account: {},
                code: {},
                password: {}
            },
            isRegister: false,
            isSend: false,
            isResetPassword: false,
            isLoading: false,
            leftTime: 60,
            timer: null,
            agreeUs: true,
            wxLogo: require('../../assets/images/common/wechat.png')
        }
    },
    watch: {
        showLoginDialog: {
            handler () {
                if (!this.showLoginDialog) {
                    setTimeout(() => {
                        this.showWxLogin = false
                    }, 300)
                }
            }
        },
        '$route': {
            handler () {
                this.handleWxLogin()
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        ...mapState('modal', ['showLoginDialog']),
        ...mapState('user', ['token']),
        title () {
            return this.isResetPassword ? '忘记密码' : (this.isRegister ? '注册' : '登录')
        },
        buttonTitle () {
            return this.isResetPassword ? '立即找回' : (this.isRegister ? '注册' : '登录')
        },
        showCode () {
            return true
        },
        style () {
            return {
                height: this.isRegister ? '370px' : '350px'
            }
        },
        codeText () {
            return this.isSend ? `${this.leftTime}s` : '获取验证码'
        },
        className () {
            return this.showWxLogin ? 'modal-dialog wx-dialog' : 'modal-dialog'
        }
    },
    methods: {
        ...mapActions('user', ['login']),
        handleUrl () {
            const routeName = this.$route.name
            const query = this.$route.query
            const hasCode = !!query.code
            if (!hasCode) return
            const querys = Object.keys(query).reduce((all, key) => {
                if (key !== 'code' && key !== 'state') {
                    all[key] = query[key]
                }
                return all
            }, {})
            this.$router.push({
                name: routeName,
                query: {
                    ...querys
                }
            })
        },
        async handleWxLogin () {
            const hasCode = !!this.$route.query.code
            if (hasCode && !this.token) {
                const { data, code, token } = await loginWithCode(this.$route.query.code)
                if (code === statusCode.success) {
                    Message.success('登录成功！')
                    this.closeLoginDialogMixin()
                    setToken(token)
                    const params = {
                        ...data, token
                    }
                    setItem('userInfo', JSON.stringify(params))
                    Store.commit('user/SET', params)
                    this.closeModal()
                    this.reload()
                }
            }
            this.handleUrl()
        },
        initForm () {
            Object.keys(this.form).forEach(key => {
                this.form[key].value = ''
                this.errorInfo[key] = {}
            })
        },
        async submit () {
            const isValidate = this.validate()
            if (isValidate) {
                this.isLoading = true
                // const request = this.isResetPassword ? findBackPwd : (this.isRegister ? register : this.login)
                const params = {
                    account: this.form.account.value,
                    password: this.form.password.value
                }
                if (this.isRegister || this.isResetPassword) {
                    params.code = this.form.code.value
                }
                if (this.isResetPassword) {
                    try {
                        const { code, msg } = await findBackPwd(params)
                        if (code === statusCode.success) {
                            // this.loginRequest(params)
                            this.initForm()
                            this.form.account.value = params.account
                            this.changeType(2)
                            Message({
                                message: msg,
                                type: 'success'
                            })
                        } else {
                            Message.error(msg)
                        }
                    } catch (e) {
                        console.log('出错了')
                    }
                } else {
                    if (this.isRegister) {
                        try {
                            const { code, msg } = await register(params)
                            if (code === statusCode.success) {
                                this.loginRequest(params)
                            } else {
                                Message.error(msg)
                            }
                        } catch (e) {
                            console.log('出错了')
                        }
                    } else {
                        this.loginRequest(params)
                    }
                }
            }
        },
        async loginRequest (params) {
            try {
                const { code, msg } = await this.login(params)
                if (code === statusCode.success) {
                    this.closeLoginDialog()
                    this.initForm()
                    window.location.reload()
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
            }
        },
        validate () {
            const res = []
            Object.keys(this.form).forEach(key => {
                if (key === 'code') {
                    if (this.isRegister && this.showCode) {
                        res.push(this.validateRow(key))
                    }
                } else {
                    res.push(this.validateRow(key))
                }
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
                    msType: this.isResetPassword ? 2 : 1
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
        changeType (type) {
            this.clearCache()

            this.isRegister = type === 1
            this.isResetPassword = false
        },
        forgetPassword () {
            this.isRegister = true
            this.isResetPassword = true
        },
        clearCache () {
            this.isRegister = false
            this.isSend = false
            this.isResetPassword = false
            this.isLoading = false
            this.leftTime = 60
            window.clearInterval(this.timer)
            this.timer = null
        },
        closeModal () {
            this.initForm()
            this.clearCache()
            this.closeLoginDialogMixin()
        },
        goToHelpCenter (tabId) {
            this.closeModal()
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId
                }
            })
        },
        test () {
            window.location.href = 'http://192.168.5.228:8080/#/home?code=1111'
        },
        useWxLogin () {
            this.showWxLogin = true
            this.$nextTick(() => {
                // eslint-disable-next-line no-undef
                WxLogin({
                    self_redirect: false,
                    id: 'wxBox',
                    appid: 'wx63c18ec5cf76e9a2',
                    scope: 'snsapi_login',
                    redirect_uri: encodeURIComponent(window.location.href),
                    // redirect_uri: encodeURIComponent('https://haibao88.com/#/home'),
                    state: Date.now(),
                    href: 'aWZyYW1leyB3aWR0aDogNDIwcHg7feW/hemhu+S4uuaVsOWtlw=='
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
#ipBox {
    z-index: 999999;
    left: 500px;
    top: 100px;
}
.box {
    border-radius: 4px;
}
.right-form {
    padding: 0 40px;
    .title {
        width: 155px;
        height: 45px;
        margin: 0 auto;
        background-size: contain;
        background-image: url('../../assets/images/common/logo-dark.png');
    }
    .button-text {
        color: #717171;
        font-weight: 300;
    }
}
.wx-box{
    width: 100%;
    height: 400px;

}
.procotol {
    color: #BEBEBE;
    span {
        color: #9DB7FF;

    }
}
.code-input {
    .input-section {
        //background-color: $background-input;
        height: 45px;
        border-bottom: 1px solid #F1F1F1;
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

.close-button {
    right: 10px;
    top: 10px;
}

.wx-login {
    position: relative;
    .line {
        width: calc(100% - 20px);
        left: 10px;
        top: 25px;
        height: 1px;
        background-color: #000;
        padding: 0 10px;
    }
    .text {
        left: 50%;
        top: 0;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 0 10px;
    }
    .wx-logo {
        margin-top: 50px;
        width: 56px;
        height: 56px;
    }
}
::v-deep {
    .code-input {
        .el-input__inner {
            border: none!important;
            background-color: transparent;
            line-height: 45px;
            height: 45px;
            font-size: 14px;
            font-family: PingFang-SC-Regular;
        }
    }
    .slot-label {
        line-height: 45px;
        height: 35px;
        border-right: 1px solid #F1F1F1;
        width: 60px;
        text-align: center;
        color: #757575;
    }
    .el-dialog {
        width: 420px;
        margin: 0!important;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        width: 420px!important;
        padding: 0!important;
        border-radius: 3px;

    }

    .submit {
        .el-button {
            height: 50px;
            background: linear-gradient(90deg, #425FFB 0%, #9CAEFA 100%) !important;
            color: #CBE0FF;
            border-radius: 3px;
        }
    }

    .wx-box {
        iframe {
            width: 420px !important;
        }
    }
}
</style>
