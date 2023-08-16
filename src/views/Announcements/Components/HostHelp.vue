<template>
<div class="p-l-30 p-r-25 h-100">
    <ul class="buttons w-100 flex align-center">
        <li
            v-for="menu in menus"
            :key="menu.id"
            class="menu-item font-400 m-r-30 font-12 font-regular p-l-15 p-r-15 pointer"
            :class="{
                'is-active': currentId === menu.id
            }"
            @click="changeMenu(menu)"
        >
            <span>{{ menu.title }}</span>
        </li>
    </ul>
    <p class="title font-20 m-t-30 m-b-30 text-center w-100 font-500 font-regular text-333">{{ currentMenu.title }}</p>
    <div class="content overflow-y-auto" v-html="content">

    </div>
</div>
</template>

<script>
import { getContentList } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'HostHelp',
    data () {
        return {
            currentId: 1,
            content: null,
            // 5=开播教程  | 6=直播规范 | 7=开播工具  | 8=直播协议
            menus: [
                // {
                //     id: 1,
                //     type: 8,
                //     title: '直播协议'
                // },
                // {
                //     id: 2,
                //     type: 6,
                //     title: '直播规范'
                // },
                {
                    id: 3,
                    type: 5,
                    title: '直播教程'
                },
                {
                    id: 4,
                    type: 7,
                    title: '直播工具'
                }
                // {
                //     id: 5,
                //     type: 9,
                //     title: '注销协议'
                // }
                // {
                //     id: 5,
                //     title: '直播参数'
                // },
                // {
                //     id: 6,
                //     title: 'OBS技巧'
                // }

            ]
        }
    },
    watch: {
        '$route': {
            handler () {
                const { buttonId } = this.$route.params
                this.currentId = buttonId || 3
            },
            immediate: true,
            deep: true
        },
        requestType: {
            handler () {
                this.fetchData()
            },
            immediate: true
        }
    },
    computed: {
        currentMenu () {
            return this.menus.find(x => x.id === this.currentId)
        },
        requestType () {
            return this.currentMenu.type
        }
    },
    methods: {
        changeMenu (menu) {
            this.currentId = menu.id
        },
        async fetchData () {
            try {
                const { data, code } = await getContentList(this.requestType)
                if (code === statusCode.success) {
                    this.content = data.content
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-item {
    height: 30px;
    line-height: 30px;
    border: 1px solid #8E8E8E;
    border-radius: 3px;
    color: #8E8E8E;
    &.is-active {
        border-color: #333;
        color: #333;
    }
}
.content {
    height: calc(100% - 115px);
}
</style>
