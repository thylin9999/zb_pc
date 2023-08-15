<template>
<div class="edit-avatar p-b-30">
    <HeaderTitle title="修改头像" />
    <div class="upload-div flex p-l-30 p-t-10">
        <div class="preview m-r-20" >
            <div
                class="template-img border-radius-50 bg-center bg-size-cover bg-no-repeat w-100 h-100"
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
        <div class="upload-button h-100 flex flex-end flex-column">
            <upload-with-tip @changeFile="changeFile"/>
        </div>
    </div>
    <div class="buttons m-t-30 p-l-30">
        <ConfirmButton @click.native="submit" title="保存"/>
        <CancelButton @click.native="cancel" class="m-l-15" title="取消"/>
    </div>
</div>
</template>

<script>
import HeaderTitle from '@/views/PersonalCenter/Components/HeaderTitle'
import UploadWithTip from '@/components/UploadWithTip'
import ConfirmButton from '@/components/ConfirmButton'
import CancelButton from '@/components/CancelButton'
import { uploadImage } from '@/api/Common'
import { editUserInfo } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { mapState, mapActions } from 'vuex'
import { Message } from 'element-ui'
export default {
    name: 'editAvatar',
    components: {
        HeaderTitle,
        UploadWithTip,
        ConfirmButton,
        CancelButton
    },
    data () {
        return {
            file: null,
            url: ''
        }
    },
    computed: {
        ...mapState('user', ['avatar']),
        placementUrl () {
            return this.avatar ? this.avatar : require('../../../assets/images/common/avart.png')
        }
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        async changeFile (file) {
            const formData = new FormData()
            formData.append('file', file)
            const { data, code, msg } = await uploadImage(formData)
            if (code === statusCode.success) {
                this.url = data.url
                Message.success(msg)
            }
        },
        cancel () {
            this.$router.push('/')
        },
        async submit () {
            if (this.url) {
                const loadingBox = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                const { code, msg } = await editUserInfo({
                    avatar: this.url
                })
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.getUserInfo()
                }
                loadingBox.close()
            } else {
                Message.error('请先上传头像再保存！')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-div{
    height: 100px;
    .preview{
        width: 100px;
        height: 100px;
    }
}

.upload-button {
    width: 200px;
    vertical-align: bottom;
}
</style>
