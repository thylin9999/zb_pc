<template>
<div class="side-bar">
    <ul class="list p-t-5 p-b-25 flex flex-column align-center">
        <template
            v-for="item in list"
        >
            <li
                v-if="!item.hide"
                :key="item.key"
                class="flex m-t-15 item flex-column pointer align-center justify-center font-14 p-relative"
                @click="command(item)"
            >
                <div class="icon">
                    <icon-png :icon="item.icon" :width="25" :height="25"/>
                </div>
                <span class="font-14 d-inline-block title">{{ item.title }}</span>
                <div v-if="item.key === 'download'" class="p-absolute transition-3 download-code bg-size-cover bg-no-repeat bg-center">
                    <div class="box">
                        <QR url="https://m.haibao88.com/"/>
                    </div>
                </div>
            </li>
        </template>
    </ul>
    <div class="m-t-20  pointer" v-show="showTop" @click="goTop">
        <icon-png
            icon="common/top"
            :width="60"
            :height="60"
        />
    </div>
</div>
</template>

<script>
import QR from '@/views/Layout/QR'
import { Copy } from '@/utils/validator'
import { mapState } from 'vuex'
import IconPng from '@/components/IconPng.vue'
export default {
    name: 'SideBar',
    components: {
        QR,
        IconPng
    },
    data () {
        return {
            showTop: false
        }
    },
    computed: {
        ...mapState('user', ['token', 'is_anchor', 'anchor_status']),
        ...mapState('commonData', ['serviceSite']),
        isAnchor () {
            return this.is_anchor === 2 && this.anchor_status === 1 // 1 非主播， 2，主播
        },
        list () {
            return [
                {
                    key: 'download',
                    icon: 'common/download',
                    title: '下载'
                },
                // {
                //     key: 'broadcast',
                //     title: '开播',
                //     hide: !this.isAnchor
                // },
                {
                    key: 'share',
                    icon: 'common/share',
                    title: '分享'
                },
                {
                    key: 'service',
                    icon: 'common/service',
                    title: '客服'
                }
            ]
        }
    },
    mounted () {
        window.addEventListener('scroll', this.initTop)
    },
    methods: {
        command (item) {
            if (item.key === 'broadcast') {
                this.$router.push({
                    name: 'PersonalCenter',
                    params: {
                        tabId: 6
                    }
                })
            } else if (item.key === 'share') {
                // 分享链接
                const { origin } = window.location
                Copy(origin)
            } else if (item.key === 'service') {
                // 客服地址
                window.open(this.serviceSite, '_blank')
            }
        },
        initTop () {
            this.showTop = document.documentElement.scrollTop > 60
        },
        goTop () {
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.initTop)
    }
}
</script>

<style lang="scss" scoped>
.side-bar {
    position: fixed;
    right: 20px;
    bottom: 200px;
    z-index: 999;
}
.list {
  background-image: url('../../assets/images/common/rect.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  width: 62px
}
.item {
    color: #6C73AF;
    height: 40px;
    width: 48px;
    .title {
        line-height: 14px;
    }
    .icon {
      width: 25px;
      height: 25px;
    }
    &:hover {
        .download-code {
            display: inline-block;
        }
    }
    .download-code{
        width: 200px;
        height: 280px;
        top: 0;
        right: 60px;
        background-image: url('../../assets/images/common/download-code-bg.png');
        display: none;
        .box {
            width: 145px;
            height: 145px;
            margin: 75px auto 0;
        }
    }
}
::v-deep {
    .item {
        .svg-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
        }
        canvas {
            width: 100% !important;
            height: 100% !important;
        }
    }
}

</style>
