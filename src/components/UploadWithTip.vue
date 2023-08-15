<template>
<div class="box flex flex-column ">
    <div class="p-relative upload-span pointer text-center">
        <span class="font-regular  w-100 font-12  text-center scale-9">上传本地图片</span>
        <input type="file"
               :key="updateKey"
               class="opacity-0 w-100 p-absolute h-100 d-inline-block"
               style="left: 0;top:0;"
               @change="submit"
        />
    </div>
    <span class="font-regular tips p-absolute m-t-5 font-12 text-d8">{{ tips }}</span>
</div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'UploadWithTip',
    props: {
        tips: {
            type: String,
            default: '仅支持上传.png.jpg.jpeg格式的文件'
        },
        maxSize: {
            type: Number,
            default: null
        }

    },
    data () {
        return {
            updateKey: +new Date().getTime()
        }
    },
    methods: {
        submit (e) {
            console.log(e.target.files, 'file')
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
            this.$emit('changeFile', file)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.upload-span{
    width: 80px;
    height: 22px;
    border: 1px solid #727272;
    border-radius: 2px;
    color: #727272;
    &:hover {
        opacity: 0.7;
    }
}
.tips{
    top: 30px;
    left: 100px;
    width: 200px;
    line-height: 15px;
    color: #d8d8d8;
}
</style>
