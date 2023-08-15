<template>
    <ul class="flex align-center font-regular text-333 ">
        <li
            v-for="tab in tabs"
            :key="tab.id"
            class="font-14 pointer text-center"
            :class="{'is-active': currentId === tab.id }"
            @click="changeTab(tab)"
        >
            <span class="icon"></span>
            <span class="name">{{ tab.name }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        currentId: {
            type: [String, Number],
            default: 1
        },
        tabs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        changeTab (tab) {
            this.$emit('update:currentId', tab.id)
            this.$emit('updateTab', tab)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
li {
    width: 120px;
    border-radius: 16px;
    line-height: 30px;
    &.is-active {
        background-color: $background-color1;
        color: $text-white;
    }
}
</style>
