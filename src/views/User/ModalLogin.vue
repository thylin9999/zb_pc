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
        <div class="w-100 h-100 content-body bg-no-repeat p-relative  bg-center">
            <span class="close-button p-absolute">
                <span  @click="closeModal">
                    <i class="el-icon-close font-20 pointer"></i>
                </span>
            </span>
            <div class="login-type highlight-text flex align-center p-absolute">
              <i class="el-icon-arrow-left font-18 font-600"></i>
              <span class=" highlight-text pointer " v-if="!isRegister" @click="changeType(1)">注册账号</span>
              <span class=" highlight-text pointer " v-else @click="changeType(2)">账号登录</span>
            </div>
            <div
                :key="showWxLogin"
                v-loading.body="isLoading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                class="box w-100 flex align-center  p-b-30">
                <div v-if="!showWxLogin" class="right-form  w-100 h-100 ">
                    <div
                        class="title  text-center m-t-25 m-b-20 font-16 text-333 font-500 font-medium"
                        >{{ isRegister ? (isResetPassword ? '找回密码' : '注册账号'): '账号登录'  }}
                    </div>
                    <div class="form">
                        <input-with-error
                            class="m-b-15 custom-input"
                            :label="form.account.label"
                            :error-info="errorInfo.account"
                            :row-info.sync="form.account"
                            :max-length="11"
                            show-slot
                            @validate="validateRow"
                            :key="form.account.updateKey"
                        >
                            <span class="phone-label font-12">+86</span>
                        </input-with-error>
                        <div v-if="showCode && isRegister" class="row row-inner code-input m-b-15 flex p-relative">
                            <div class="input-section flex align-center flex-1 " >
    <!--                            <svg-icon class="icon-14" icon-class="safe"></svg-icon>-->
                                <div class="left-code-input flex align-center ">
                                    <div class="icon-label text-center">
                                        <icon-png class="vertical-middle" :width="20" :height="20" icon="login/code" />
                                    </div>
                                    <el-input
                                        class="input  flex-1"
                                        placeholder="请输入验证码"
                                        v-model="form.code.value"
                                        @blur="validateRow('code')"
                                    />
                                </div>
                                <div class="code m-l-10 pointer text-center" :class="{'not-allowed opacity-7': isSend}" v-if=showCode @click="startValidateCode">
                                    <span class="font-12 line-height-20 font-medium">{{ codeText }}</span>
                                </div>
                            </div>
                            <span class="p-absolute error font-12 ">{{ errorInfo.code.isRequire }}</span>
                        </div>
                        <input-with-error
                            class="m-b-15 custom-input"
                            :label="form.password.label"
                            show-slot
                            :error-info="errorInfo.password"
                            :row-info.sync="form.password"
                            @validate="validateRow"
                            @keyUpEnter="submit"
                            :key="form.password.updateKey"
                        >
                        <icon-png class="vertical-middle" :width="20" :height="20" icon="login/password" />
                    </input-with-error>
                    </div>
                    <div class="button-text flex align-center justify-between font-12 line-height-20 ">
                        <div class="procotol font-12 font-400">
                            <el-checkbox v-model="agreeUs">
                                <div>我已阅读并同意
                                    <!-- <span @click.prevent="goToHelpCenter(3)">《用户协议》</span> -->
                                    <span >《用户协议》</span>
                                </div>
                            </el-checkbox>
                        </div>
                        <span @click="forgetPassword"  class="pointer forget-text highlight-text underline font-medium ">忘记密码</span>
                    </div>
                    <div class="submit text-center"
                        :class="{
                            'is-login-mode': !isRegister,
                            'm-t-20': isRegister
                        }"
                    >
                        <submit-button
                            class="w-100 font-16 font-400 d-inline-block text-center"
                            :disabled="!agreeUs"
                            :title="buttonTitle" @click.native="submit"
                            :loading="isLoading"
                        />
                    </div>
                </div>
                <div class="wx-box" id="wxBox" v-else>

                </div>
                <!-- <span id="ipBox">
                    <span @click="test">点我</span>
                </span> -->
            </div>
            <img class="wx-logo pointer p-absolute" :src="wxLogo" alt="" @click="useWxLogin">
        </div>
    </el-dialog>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import IconPng from '../../components/IconPng.vue'
import SubmitButton from '@/components/SubmitButton'
import InputWithError from '@/components/Form/InputWithError'
import { isRequire, phone } from '@/utils/validator'
import { omit, isEmpty } from '../../utils/lodashUtil'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { register, getCode, findBackPwd, loginWithCode } from '@/api/user'
import { setItem, setToken } from '@/utils/cookie'
import Store from '@/store'
import { generateInstance } from '@/utils/validateCode'
export default {
    name: 'ModalLogin',
    components: {
        SubmitButton,
        InputWithError,
        IconPng
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
            wxLogo: require('../../assets/images/login/wechat.png'),
            captchaIns: null // 验证码实例
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
    mounted () {
        this.initCode()
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
                    } finally {
                        this.isLoading = false
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
                        } finally {
                            this.isLoading = false
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
                    // 其实不需要刷新页面
                    window.location.reload()
                    // this.reload()
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
                msType: this.isResetPassword ? 2 : 1,
                validate
            })
            if (code === statusCode.success) {
                Message.success(msg)
            }
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        changeType (type) {
            this.showWxLogin = false
            this.clearCache()
            this.isRegister = type === 1
            this.isResetPassword = false
        },
        forgetPassword () {
            this.clearCache()
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
                    href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7DQogICAgd2lkdGg6IDIxMHB4Ow0KICAgIG1hcmdpbi10b3A6IDE1cHg7DQogICAgYm9yZGVyOiAxcHggc29saWQgI2UyZTJlMjsNCn0='
                })
            })
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
@import '@/theme/default-vars.scss';
#ipBox {
    z-index: 999999;
    left: 500px;
    top: 100px;
}
.box {
    border-radius: 4px;
}
.content-body{
    width: 478px;
    height: 336px;
    border-radius: 5px;
    overflow: hidden;
    background-image: url('../../assets/images/common/login-bg.png');
    background-size: 100%;
    position: relative;
    .login-type {
        font-size: 14px;
        color: #A3ACCA;
        line-height: 20px;
        left: 15px;
        top: 15px;
        z-index: 5;
    }
    .wx-logo {
        width: 35px;
        height: 35px;
        right: 0;
        bottom: 0;
    }

    &:before {
      content: '';
      width: 68px;
      height: 61px;
      position: absolute;
      right: 0;
      bottom: 0;
      background-image: url('../../assets/images/login/corner.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
}

.right-form {
    padding: 0 95px;
    .title {
        width: 155px;
        line-height: 22px;
        margin: 0 auto;
    }
    .button-text {
        color: #717171;
        font-weight: 300;
    }

    .custom-input {
        background: #FFFFFF;
        border-radius: 24px;
    }
}
.wx-box{
    width: 100%;
    height: 400px;
    // background-color: #fff;
    position: relative;
    z-index: 3;
}
.procotol {
    color: #BCBAD8;
    span {
        color: #A05A77
    }
}
.forget-text {
  color: #A3ACCA;
}
.code-input {
    .input-section {
        //background-color: $background-input;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #F1F1F1;
        .left-code-input{
            width: 165px;
            background-color: #fff;
            border-radius: 20px;
            overflow: hidden;
        }
    }
    .icon-label {
        width: 45px;
        display: inline;
        line-height: 45px;
        border-right: 1px solid #eee;
    }
    .error {
        left: 0;
        top: 100%;
        color: $text-error;
    }
    .code {
        width: 110px;
        background: #FEF2E4;
        border-radius: 24px;
        line-height: 45px;
        box-shadow: inset 0px 0px 2px 0px rgba(0,0,0,0.25);
        height: 45px;
        color: #E6B48E;
        &.is-send{
            background-color: #eee;
        }
    }
}

.close-button {
    right: 10px;
    top: 15px;
    z-index: 5;
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
        text-align: center;
        line-height: 40px;
        vertical-align: middle;
        height: 40px;
        border-right: 1px solid #F1F1F1;
        width: 40px;
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
        background-color: transparent!important;
    }
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        width: 100%!important;
        padding: 0!important;
        border-radius: 3px;
        background-color: transparent;

    }

    .submit {
        &.is-login-mode {
            margin-top: 45px;
        }
        .el-button {
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
            box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
            color: #CBE0FF;
            border-radius: 24px;
        }
    }

    .custom-input {
        .input-section {
            line-height: 40px;
            height: 40px;
            background-color: transparent;
        }
    }

    .wx-box {
        iframe {
            width: 100%!important;
            height: 100%!important;
        }
    }

    .el-checkbox__label {
        color: #BCBAD8!important;
        font-size: 12px!important;
    }
    .row-inner {
      .el-input__inner {
        height: 45px!important;
        line-height: 45px!important;
      }
    }
}
</style>
