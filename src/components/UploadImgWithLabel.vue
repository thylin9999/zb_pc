<template>
    <div class="box flex flex-column ">
        <span class="font-14 line-20 text-center w-100 m-b-15 d-inline-block text-333">{{   label  }}</span>
        <div class="p-relative upload-span pointer text-center bg-center bg-size-cover bg-no-repeat"
            :style="{
                backgroundImage: `url(${fileUrl})`
            }"
        >
            <div v-if="!fileUrl.length" class="p-absolute plus-btn w-100 h-100">
                <i class="el-icon-plus"></i>
            </div>
            <input type="file"
                :key="updateKey"
                class="opacity-0 w-100 p-absolute h-100 d-inline-block"
                style="left: 0;top:0;"
                @change="submit"
            />
            <div v-if="disabled" class="p-absolute mask"></div>
        </div>
    </div>
    </template>

<script>
import { Message } from 'element-ui'
import { uploadImage } from '../api/Common'
import { statusCode } from '../utils/statusCode'
export default {
    name: 'UploadImgsWithLabel',
    props: {
        label: {
            type: String,
            default: ''
        },
        maxSize: {
            type: Number,
            default: null
        },
        url: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            updateKey: +new Date().getTime(),
            fileUrl: ''
        }
    },
    created () {
        this.fileUrl = this.url
    },
    methods: {
        submit (e) {
            if (this.maxSize) {
                // 需要校验最大值
                const fileSize = Math.ceil(e.target.files[0].size / 1024)
                if (fileSize > this.maxSize) {
                    Message.info(`头像大小不能超过${this.maxSize}kb!`)
                    this.updateKey = +new Date().getTime()
                    return
                }
            }
            this.updateKey = +new Date().getTime()
            const file = e.target.files[0]
            this.uploadImg(file)
        },
        async uploadImg (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'idcard')
            const { data, code, msg } = await uploadImage(formData)
            console.log(data, code, msg, '12')
            if (code === statusCode.success) {
                this.fileUrl = data.url
                console.log(msg, 'msg')
                // Message.success(msg)
                // this.$emit('changeFile', url)
                this.$emit('update:url', this.fileUrl)
            }
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.upload-span{
    width: 209px;
    height: 130px;
    border-radius: 5px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    color: #727272;
    &:hover {
        opacity: 0.7;
    }
}
.plus-btn{
    font-size: 50px;
    line-height: 130px;
}
.mask {
  cursor: not-allowed;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255, 0.2);
}

</style>
