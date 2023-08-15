<template>
<div class="h-100 overflow-y-auto p-10">
    <div class="words" v-html="content"> </div>
</div>
</template>

<script>
import { getContentList } from '@/api/Common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'Protocols',
    data () {
        return {
            content: null
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data, code } = await getContentList(2)
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

<style scoped>

</style>
