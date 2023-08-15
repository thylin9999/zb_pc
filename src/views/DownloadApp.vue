<template>
<div class="download-page overflow-y-auto" :style="style">
    <div class="w-100 wrap-1200   h-100">
        <div class="upper-div  flex  justify-between ">
            <div class="left-info ">
                <div class="logo-text bg-no-repeat  bg-size-auto "></div>
                <div class="app-info w-100 flex align-center justify-center p-relative">
                    <div class="code">
                        <div class="code-box">
                            <Qrcode :url="downloadUrl"/>
                        </div>

                    </div>
                    <div class="buttons flex align-center flex-column m-l-15 text-white">
                        <span @click="tab=1" class="d-inline-block android"></span>
                        <span  @click="tab=2" class="d-inline-block m-t-15 ios"></span>
                    </div>
                    <span class="font-16  w-100 text-center label font-400 p-absolute m-t-10">扫码下载APP 独家赛事解读等你来拿</span>
                </div>
            </div>
            <div class="right-imgs" :style="carouselPadding">
                <carousle3d
                    class="download-3d"
                    :options="carouselOptions"
                    :slides="slides"
                />
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Qrcode from '@/components/Qrcode'
import Carousle3d from '../components/Carousle3d.vue'
export default {
    name: 'DownloadApp',
    components: {
        Qrcode,
        Carousle3d
    },
    data () {
        return {
            tab: 1,
            scale: window.innerWidth / 1920,
            slides: [
                {
                    id: 1,
                    src: require('../assets/images/download/01.png')
                },
                {
                    id: 2,
                    src: require('../assets/images/download/02.png')
                },
                {
                    id: 3,
                    src: require('../assets/images/download/03.png')
                },
                {
                    id: 4,
                    src: require('../assets/images/download/04.png')
                }
            ],
            carouselOptions: {
                width: 265,
                height: 536,
                space: 250,
                visible: 3,
                inverseScaling: 590,
                noPerspective: true,
                showControls: false
            }
        }
    },
    computed: {
        downloadUrl () {
            return this.tab === 1 ? this._appDownloadUlr : this._appDownloadUlrIOS
        },
        style () {
            return {
                height: window.innerWidth / 1920 * 855 + 'px'
            }
        },
        carouselPadding () {
            return {
                'margin-right': this.scale * 30 + 'px',
                transform: `scale(${this.scale})`
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.download-page {
    min-height: calc(100vh - 245px);
    margin: 0 auto;
    background-image: url('../assets/images/download/bg.png');
    background-size: cover;
    background-position: center;
    .upper-div {
        width: 1200px;
        padding-top: 7.55vw;
        margin: 0 auto;
        color: #0E3F6A;
        .logo-text{
            width: 23.75vw;
            height: 13.44vw;
            background-position: left bottom;
            background-size: contain;
            background-image: url('../assets/images/download/text-logo.png');
        }
        .site {
            line-height: 48px;

        }
        .features {
            span{
                color: #6C73AF;
            }
        }
        .app-info {
            margin-top: 2.34vw;
            .label {
                display: inline-block;
                color: #6C73AF;
                line-height: 22px;
                bottom: -30px;
                left: 0;
            }
        }
        .code {
            span{
                color: #6D9FCB;
            }
        }
        .code-box {
            width: 7.55vw;
            height: 7.55vw;
            border-radius: 10px;
            overflow: hidden;
        }
    }
    .right-imgs {
        width: 23.54vw;
        margin-top: -50px;
        min-width: 400px;
    }
}
.buttons {
    span {
        width: 9.27vw;
        height: 2.92vw;
        border-radius: 0.5vw;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
        &.android {
            background-image: url('../assets/images/download/android-d.png');
        }
        &.ios {
            background-image: url('../assets/images/download/ios-d.png');
        }
        &:hover {
            opacity: 0.7;
        }
    }
}

::v-deep {
  .download-3d {
    padding-top: 0!important;
    .carousel-3d-slide {
      &:not(.current) {
        top: -120px;
        opacity: 0!important;
        &.left-1, &.right-1 {
            opacity: 0.4!important;
        }
      }
    }
  }
}
</style>
