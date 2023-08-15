<template>
  <span class="pointer" @click="copy">{{ content }}</span>
</template>
<script>
import { Copy } from '@/utils/validator'
export default {
    name: 'CopySpan',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    methods: {
        copy () {
            Copy(this.content)
        }
    }
}
</script>
<style lang="scss" scoped>
.pointer{
  color: #fff;
}
.pointer:hover{
  color: #fbe73d;
}
</style>
