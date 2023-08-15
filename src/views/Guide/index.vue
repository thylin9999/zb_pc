<template>
    <div class="w-100 h-100 page p-t-30" :style="style">
        <div class="w-100 flex  p-t-30 flex-column align-center justify-center">
            <span class="font-30 text-333 font-500 p-t-5 p-b-5 d-inline-block">看球有料·数字化解球</span>
            <span class="font-16 text-333 font-400 p-t-5">大咖多方位解析精彩赛事</span>
        </div>
        <div class="p-t-10">
            <Carousle3d
                class="wrap-1200"
                :slides="slides"
                :options="carouselOptions"/>
        </div>
        <div class="download-section  flex align-center justify-center">
            <div class="code text-center">
                <div class="code-box m-auto">
                    <Qrcode :url="downloadUrl"/>
                </div>
                <div class="font-16 flex flex-column aign-center justify-center font-600 m-t-15">
                    <span class="m-b-5">扫码下载APP</span>
                    <span>独家赛事解读等你来拿</span>
                </div>
            </div>
            <div class="bts m-l-30 p-l-30 ">
                <span @click="tab=1" class="d-inline-block m-r-30 android"></span>
                <span  @click="tab=2" class="d-inline-block ios"></span>
            </div>
        </div>
    </div>
</template>

<script>
import Carousle3d from '../../components/Carousle3d.vue'
import Qrcode from '@/components/Qrcode'
export default {
    name: 'Guide',
    components: {
        Carousle3d,
        Qrcode
    },
    data () {
        return {
            slides: [
                {
                    id: 1,
                    src: require('./../../assets/images/guide/bg1.png')
                },
                {
                    id: 2,
                    src: require('./../../assets/images/guide/bg2.png')
                },
                {
                    id: 3,
                    src: require('./../../assets/images/guide/bg3.png')
                }
            ],
            carouselOptions: {
                width: 705,
                height: 375,
                space: 450,
                inverseScaling: 420,
                noPerspective: true,
                showControls: true
            },
            tab: 1
        }
    },
    computed: {
        downloadUrl () {
            return this.tab === 1 ? this._appDownloadUlr : this._appDownloadUlrIOS
        },
        style () {
            return {
                height: window.innerWidth / 1920 * 840 + 'px'
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background-image: url('../../assets/images/guide/bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    min-height: 840px;
}
.download-section{
    padding-bottom: 80px;
}
.bts {
    span {
        width: 178px;
        height: 55px;
        border-radius: 10px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
        &.android {
            background-image: url('../../assets/images/guide/android.png');
        }
        &.ios {
            background-image: url('../../assets/images/guide/ios.png');
        }
        &:hover {
            opacity: 0.7;
        }
    }
}
.code {
    margin-left: 55px;
    span{
        color: #6C73AF;
    }
}
.code-box {
    width: 125px;
    height: 125px;
}
</style>
