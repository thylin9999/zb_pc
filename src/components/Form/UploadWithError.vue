<template>
    <div class="row row-inner flex p-relative" :class="{'events-none': disabled}">
        <div v-if="showLabel" class="label">
            <span>{{ label }}</span>
        </div>
        <div class=" flex flex-1"
             :class="{
                'not-allowed': disabled
             }"
             style="align-items: end;">
            <div
                v-if="rowInfo.value"
                class="show-image bg-no-repeat bg-center bg-size-cover"
                :style="{
                    backgroundImage: `url(${fileUrl})`
                }"
            >
                <span class="delete-mask d-inline-block w-100 h-100 text-center">
                    <i @click="deletePic" class="el-icon-delete font-16 text-white"></i>
                </span>
            </div>
            <div class="upload-div p-relative" v-else>
                <span class="upload-button text-center p-absolute w-100 h-100 d-inline-block">
                    <i class="el-icon-plus "></i>
                </span>
                <input
                    class="d-inline-block opacity-0 w-100 h-100"
                    :key="updateKey"
                    type="file" @change="beforeSubmit">
            </div>
            <div class="flex flex-column m-l-15">
                <span class="font-14 text-d8">(友情提示：仅支持jpg, jpeg, png)</span>
                <span class="font-14 m-t-10 text-d8">推荐图片封面尺寸为 340 * 190</span>
            </div>
        </div>
        <span v-if="showError" class="p-absolute error font-12 ">直播封面不能为空</span>
    </div>
</template>

<script>
import { uploadImage } from '@/api/Common'
import { Message } from 'element-ui'
export default {
    name: 'SelectWithError',
    props: {
        fileType: {
            type: String,
            default: 'cover'
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
        showError: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            fileName: '',
            fileUrl: '',
            updateKey: +new Date().getTime()
        }
    },
    watch: {
        rowInfo: {
            handler () {
                this.fileUrl = this.rowInfo.value
            },
            immediate: true,
            deep: true
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
        async beforeSubmit (e) {
            const file = e.target.files[0]
            if (this.maxSize) {
                const fileSize = file.size / 1024
                if (fileSize > this.maxSize) {
                    Message.info('直播封面不能超过300kb!')
                    this.updateKey = +new Date().getTime()
                    return
                }
            }
            this.updateKey = +new Date().getTime()
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', this.fileType)
            const { data } = await uploadImage(formData)
            this.fileUrl = data.url
            this.$emit('update:rowInfo', {
                ...this.rowInfo,
                value: data.url
            })
            this.$emit('changeFile', data.url)
        },
        deletePic () {
            this.fileUrl = ''
            this.$emit('update:rowInfo', {
                ...this.rowInfo,
                value: ''
            })
            this.$emit('changeFile', '')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.input-section {
    background-color: $background-input;
    height: 45px;
}
.error {
    left: 0;
    top: 100%;
    color: $text-error;
}
.show-image {
    width: 200px;
    height: 112px;
    .delete-mask {
        display: none;
        line-height: 100px;
        background-color: rgba(0,0,0,0.7);
    }
    &:hover{
        .delete-mask {
            display: inline-block;
        }
    }
}
.upload-div {
    width: 100px;
    height: 100px;
    .upload-button {
        left: 0;
        top: 0;
        border: 1px dashed #E2E1E1;
        line-height: 100px;
        .el-icon-plus {
            font-size: 30px;
            color: #E2E1E1;
        }
    }
}
::v-deep {
    .el-input__inner {
        border: none!important;
        background-color: transparent;
        line-height: 45px;
        height: 45px;
        font-size: 14px;
        font-family: PingFang-SC-Regular;
    }
}
</style>
