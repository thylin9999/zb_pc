<template>
<div class="row row-inner flex p-relative" :class="{'just-bottom': justBottom}">
    <div v-if="showLabel" class="label">
        <span>{{ label }}</span>
    </div>
    <div class="slot-label" v-if="showSlot">
      <slot />
    </div>
    <div class="input-section flex align-center flex-1" :class="{'p-l-15': !!icon , 'is-disabled': disabled}">
        <svg-icon class="icon-14" v-if="hasIcon" :icon-class="icon"></svg-icon>
        <el-input
            :disabled="disabled"
            class="input  flex-1"
            type="textarea"
            :placeholder="placeholder"
            v-model="rowInfo.value"
            @blur="submit"
            @change="submit"
            resize="none"
            :maxLength="maxLength"
            @keyup.enter.native="confirm"
        />
        <div class="code h-100 text-center" v-if=showCode @click="getCode">
            <span class="font-14 line-height-20 font-medium">{{ codeText }}</span>
        </div>
    </div>
    <span class="p-absolute error font-12 ">{{ errorMessage}}</span>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
export default {
    name: 'InputWithError',
    props: {
        icon: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        showLabel: {
            type: Boolean,
            default: false
        },
        rowInfo: {
            type: Object,
            default: () => ({})
        },
        errorInfo: {
            type: Object,
            default: () => ({})
        },
        showCode: {
            type: Boolean,
            default: false
        },
        isSendCode: {
            type: Boolean,
            default: false
        },
        showSlot: {
            type: Boolean,
            default: false
        },
        justBottom: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number,
            default: 15
        }

    },
    data () {
        return {
            leftTime: 60,
            timer: null
        }
    },
    watch: {
        isSendCode () {
            if (this.isSendCode) {
                this.timer = setInterval(() => {
                    if (this.leftTime <= 0) {
                        clearInterval(this.timer)
                    } else {
                        this.leftTime--
                    }
                }, 1000)
            }
        }
    },
    computed: {
        hasIcon () {
            return !!this.icon
        },
        isPassword () {
            return this.rowInfo.key.toLowerCase().includes('password')
        },
        inputType () {
            return this.isPassword ? 'password' : 'text'
        },
        errorMessage () {
            const errors = this.rowInfo.validateLabel.reduce((all, key) => {
                if (this.errorInfo[key]) {
                    all.push(this.errorInfo[key])
                }
                return all
            }, [])
            return errors[0]
        },
        placeholder () {
            return this.rowInfo.placeholder || `请输入${this.label}`
        },
        codeText () {
            return this.isSendCode ? `${this.leftTime}s` : '获取验证码'
        }
    },
    methods: {
        submit: debounce(function () {
            this.$emit('validate', this.rowInfo.key)
        }, 200),
        getCode () {
            this.$emit('getCode')
        },
        confirm () {
            console.log('11111')
            this.$emit('keyUpEnter')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';

.input-section {
    height: 150px;
    &.is-disabled{
        border: none!important;
    }
}
.error {
    left: 0;
    top: 100%;
    color: $text-error;
}
.code {
    width: 100px;
    background-color: #E67A40;
    color: $text-white;
    line-height: 45px;
    &.is-send{
        background-color: #eee;
    }
}
::v-deep {
    .el-textarea__inner {
        border: none!important;
        background-color: transparent;
        line-height: 20px;
        height: 150px;
        font-size: 14px;
        font-family: PingFang-SC-Regular;
    }
    .input-section.is-disabled {
        .el-textarea__inner {
            border: 1px solid #E4E7ED!important;
        }
    }
}
</style>
