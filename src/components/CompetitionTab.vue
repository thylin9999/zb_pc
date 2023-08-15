<template>
<div class="tab-box">
    <ul class="flex align-center font-medium font-14">
        <li
            v-for="menu in menus"
            :key="menu.id"
            class="tab-item pointer"
            :class="{'is-active': currentId === menu.id }"
            @click="changeTab(menu)"
        >
            <span>{{ menu.text }}</span>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'CompetitionTab',
    props: {
        castId: {
            type: Number,
            default: 1
        }
    },
    created () {
        this.currentId = this.castId
    },
    data () {
        return {
            menus: [
                {
                    id: 1,
                    text: '全部'
                },
                {
                    id: 2,
                    text: '足球'
                },
                {
                    id: 3,
                    text: '篮球'
                }
            ],
            currentId: 1
        }
    },
    methods: {
        changeTab (menu) {
            this.currentId = menu.id
            this.$emit('changeBroadcastType', this.currentId)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.tab-box {
    .tab-item {
        color: $text-333;
        border-radius: 12px;
        line-height: 23px;
        padding: 0 10px;
        margin-right: 35px;
    }
    .is-active {
        background-color: $background-color1;
        color: $text-white;
    }
}
</style>
