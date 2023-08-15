<template>
<div class="header">
<!--    <header-tabs-->
<!--      class="flex p-t-15 p-b-15 p-l-30 align-center header-tabs"-->
<!--      :tabs="tabs"-->
<!--      :current-tab.sync="currentTab"-->
<!--    />-->
  <div class="tabs p-l-30">
    <span class="basic-info" @click="currentTab =1">基本信息</span>
    <span class="item pointer" :class="{
      'is-active': currentTab === 2
    }"  @click="currentTab = 2">修改手机号</span>
    <span class="item pointer" :class="{
      'is-active': currentTab === 3
    }" @click="currentTab = 3">修改密码</span>
  </div>
  <my-info v-if="currentTab===1" />
  <my-phone v-if="currentTab===2"/>
  <MyPassword v-if="currentTab===3" class="update-pwd"/>

</div>
</template>

<script>
import MyPhone from '@/views/PersonalCenter/Components/MyPhone'
import MyInfo from '@/views/PersonalCenter/Components/MyInfo'
import MyPassword from '@/views/PersonalCenter/Components/MyPassword'
export default {
    name: 'BasicInfo',
    components: {
        MyInfo,
        MyPhone,
        MyPassword
    },
    data () {
        return {
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    title: '基本资料'
                },
                {
                    id: 2,
                    title: '修改手机号'
                },
                {
                    id: 3,
                    title: '修改密码'
                }
            ]
        }
    },
    methods: {
        changeTab (tab) {
            this.currentTab = tab.id
        }
    }
}
</script>

<style lang="scss" scoped>
.header-tabs {
  border-bottom: 1px solid #d8d8d8;
}
.tabs  {
  line-height: 55px;
  height: 55px;
  border-bottom: 1px solid #d8d8d8;
  .basic-info {
    width: 64px;
    height: 22px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-right: 60px;
  }
  .item {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    margin-right: 60px;
    &.is-active {
      font-size: 16px;
    }
  }
}

::v-deep {
    .header-tabs {
      .tab-item {
        margin-right: 70px;
      }
    }
}
</style>
