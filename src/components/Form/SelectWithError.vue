<template>
    <div class="row row-inner flex p-relative">
        <div v-if="showLabel" class="label">
            <span>{{ label }}</span>
        </div>
        <div class="input-section flex align-center flex-1" :class="{'is-disabled': disabled}" >
            <el-select
                :disabled="disabled"
                class="w-100"
                v-model="rowInfo.value"
                placeholder="请选择"
                filterable
                @change="changeValue">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <span class="p-absolute error font-12 ">{{ errorMessage}}</span>
    </div>
</template>

<script>
export default {
    name: 'SelectWithError',
    props: {
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
        options: {
            type: Array,
            default: () => ([])
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            value: ''
        }
    },
    computed: {
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
            return `请输入${this.label}`
        }
    },
    methods: {
        changeValue () {
            this.$emit('validate', this.rowInfo.key)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.input-section {
    background-color: $background-input;
    height: 40px;
  &.is-disabled{
    border: none!important;
  }
}
.error {
    left: 0;
    top: 100%;
    color: $text-error;
}

::v-deep {
    .el-input__inner {
        border: none!important;
        background-color: transparent;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        font-family: PingFang-SC-Regular;
    }
  .input-section.is-disabled {
    .el-input__inner {
      border: 1px solid #E4E7ED!important;
    }
  }
}
</style>
