<template>
    <ul v-if="options.length" class=" flex align-center flex-wrap list">
        <li
            v-for="type in options"
            :key="type.id"
            @click="changeId(type)"
            class="  m-r-10 font-600 item pointer font-12 text-center bg-center bg-no-repeat bg-size-100"
            :class="{
                'is-active': activeId === type.id,
            }"
        >
            <span class="font-12 scale-9">{{ type.title }}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'MatchTypes',
    props: {
        activeId: {
            type: [String, Number],
            default: ''
        },
        options: {
            type: Array,
            default: () => ([])
        }
    },
    methods: {
        changeId (type) {
            this.$emit('update:activeId', type.id)
            this.$emit('changeActiveId', type.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    background: #FEF2E4;
    border-radius: 15px;
    height: 30px;
}
.item {
    width: 88px;
    height: 26px;
    line-height: 26px;
    border-radius: 15px;
    margin-top: 1px;
    color: #FBA187;
    &.is-active, &:hover {
        color:#fff;
        background-color: #FBA187;
    }
    &:last-child {
        margin-right: 0!important;
    }
}
</style>
