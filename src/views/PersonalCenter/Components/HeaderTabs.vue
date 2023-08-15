<template>
  <ul class="tabs">
    <li
        class="tab-item pointer"
        v-for="tab in  tabs"
        :key="tab.id"
        :class="{
          'is-active': tab.id === currentTab,
        }"
        @click="changeTab(tab)"
    >{{ tab.title }}</li>
  </ul>
</template>

<script>
export default {
    name: 'HeaderTabs',
    props: {
        tabs: {
            type: Array,
            default: () => ([])
        },
        currentTab: {
            type: Number,
            default: 1
        }
    },
    methods: {
        changeTab (tab) {
            if (tab.disabled) {
                return
            }
            this.$emit('update:currentTab', tab.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-item {
  font-size: 16px;
  line-height: 20px;
  color: #999;
  font-weight: 400;
  position: relative;
  &.is-active {
    font-size: 18px;
    font-weight: 500;
    color: #FBA187;
    line-height: 22px;
    &::after {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      content: '';
      width: 1px;
      border-top: 6px solid transparent;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #FBA187;
    }
  }
  &.is-disabled {
    cursor: not-allowed!important;
  }
}
</style>
