<template>
<div class="list  p-relative"  >
    <Icon-png
        class="operate-button pointer left p-absolute"
        @click.native="prev"
        :class="{
            'not-allowed': !leftMove
          }"
        :width="30" :height="30" icon="home/left"/>
    <Icon-png
        :class="{
            'not-allowed': !rightMove
          }"
        class="operate-button pointer right p-absolute"
        @click.native="next"
        :width="30" :height="30" icon="home/right"/>
    <div class=" list-box overflow-x-auto" ref="listBox">
        <ul ref="listRef" class="flex  align-center" :style="style">
            <li
                v-for="host in hosts"
                :key="host.id"
                class="card text-center pointer m-l-15 m-r-15"
            >
                <div
                    v-if="host"
                    class="icon m-b-15 bg-center bg-no-repeat bg-size-cover"
                    v-lazy-container="{ selector: 'img' }"
                >
                  <img class="w-100 h-100" :data-src="host.logo" :data-error="errorUserLogo" alt="">
                </div>
                <CustomSpan :content="host.anchor_name" />
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import { getFlowedHosts } from '@/api/Host/Host'
import CustomSpan from '@/components/CustomSpan'
import IconPng from '@/components/IconPng'
export default {
    name: 'OfflineHosts',
    components: {
        CustomSpan,
        IconPng
    },
    data () {
        return {
            hosts: [],
            leftMove: false,
            rightMove: false
        }
    },
    created () {
        this.fetchData()
    },
    // mounted () {
    //     this.initScroll()
    // },
    computed: {
        style () {
            return {
                width: this.hosts.length * 100 + 'px'
            }
        }
    },

    methods: {
        async fetchData () {
            try {
                const { data } = await getFlowedHosts(1)
                this.hosts = data
                this.initScroll()
            } catch (e) {
                console.log('出错了')
            }
        },
        initScroll () {
            this.$nextTick(() => {
                const wrapperInfo = this.$refs.listBox.getBoundingClientRect()
                const wrapperWidth = wrapperInfo.width
                const innerUlWidth = this.hosts.length * 130
                this.rightMove = this.$refs.listBox.scrollLeft + wrapperWidth + 10 < innerUlWidth
                this.leftMove = this.$refs.listBox.scrollLeft > 10
                console.log(innerUlWidth, wrapperWidth)
            })
        },
        prev () {
            if (this.leftMove) {
                const left = this.$refs.listBox.scrollLeft
                this.$refs.listBox.scrollTo({
                    left: left - 130,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        },
        next () {
            if (this.rightMove) {
                const left = this.$refs.listBox.scrollLeft
                this.$refs.listBox.scrollTo({
                    left: left + 130,
                    behavior: 'smooth'
                })
                setTimeout(() => {
                    this.initScroll()
                }, 300)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    height: 100px;
    padding: 0 30px;
}
.list-box {
    width: calc(100% - 60px);
    margin-left: 30px;
}
.card {
    width: 100px;
    flex-shrink: 0;
    .icon{
        width: 55px;
        height: 55px;
        margin: 0 auto;
        //background-color: #C9CFED;
        border-radius: 10px;
    }
}
.operate-button{
    &.left {
        left: 20px;
        top: 15px;
    }
    &.right {
        right: 20px;
        top: 15px;
    }
}
</style>
