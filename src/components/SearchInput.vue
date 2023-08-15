<template>
<div class="input-box">
  <el-input
      :placeholder="placeholder"
      v-model="searchSting"
      clearable
      @change="searchFn"
  >
    <i slot="suffix" class="el-input__icon el-icon-search inp" @click="searchFn"></i>
  </el-input>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
export default {
    name: 'SearchInput',
    props: {
        search: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '搜索'
        }
    },
    data () {
        return {
            searchSting: ''
        }
    },
    created () {
        this.searchSting = this.search
    },
    methods: {
        searchFn: debounce(function () {
            this.$emit('update:search', this.searchSting)
            this.$emit('search')
        }, 100)
    }
}
</script>

<style lang="scss" scoped>
.input-box{
  // width: 250px;
  height: 40px;
}
.input-box{
    margin-right: 15px;
    font-size: 12px;
}
::v-dee {
  .el-input__inner {
    height: 38px;
    line-height: 38px;
  }
}
</style>
