<template>
    <el-pagination
        background
        layout=" prev, pager, next, jumper, sizes, total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @current-change="currentChange"
        @size-change="changeSize"
        :total="total">
    </el-pagination>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        total: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 20
        }
    },
    data () {
        return {
            pageSizes: [2, 5, 10, 20, 30, 40, 50, 100]
        }
    },
    methods: {
        currentChange (page) {
            this.$emit('update:currentPage', page)
            this.loadData()
        },
        changeSize (size) {
            this.$emit('update:pageSize', size)
            this.loadData()
        },
        loadData () {
            this.$emit('loadData')
        }
    }
}
</script>

<style scoped>

</style>
