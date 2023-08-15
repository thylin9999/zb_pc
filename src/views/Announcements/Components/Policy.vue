<template>
    <div class="h-100 overflow-y-auto p-10">
        <div class="word" v-html="content"></div>
    </div>
</template>

<script>
import { statusCode } from '@/utils/statusCode'
import { getContentList } from '@/api/Common'

export default {
    name: 'Policy',
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
                const { data, code } = await getContentList(3)
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
