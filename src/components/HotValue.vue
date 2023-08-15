<template>
<div class="flex w-100 align-center">
    <icon-png class="m-r-5" :width="18" :height="20" icon="icons/hot"/>
    <custom-span class="value" :content="value" />
</div>
</template>

<script>
import IconPng from '@/components/IconPng'
import CustomSpan from '@/components/CustomSpan'
export default {
    name: 'HotValue',
    components: {
        IconPng,
        CustomSpan
    },
    props: {
        value: {
            type: [Number, String],
            default: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.value {
    width: calc(100% - 23px);
    font-size: 27px;
    font-weight: 600;
    color: #3C3F5B;
}
</style>
