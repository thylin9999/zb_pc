<template>
<div>
    <header-tabs
      class="flex p-t-15 p-b-15 p-l-30 align-center header-tabs"
      :tabs="tabs"
      :current-tab.sync="currentTab"
    />
    <component  :is="comName" :key="comName"/>
</div>
</template>

<script>
import BookLiveBroadCast from '@/views/PersonalCenter/Components/BookLiveBroadCast'
import OpenLiveBroadCast from '@/views/PersonalCenter/Components/OpenLiveBroadCast'
import HeaderTabs from '@/views/PersonalCenter/Components/HeaderTabs'
export default {
    name: 'MyBroad1',
    components: {
        HeaderTabs,
        OpenLiveBroadCast,
        BookLiveBroadCast
    },
    data () {
        return {
            currentTab: 1,
            tabs: [
                {
                    id: 1,
                    title: '直播开播',
                    comName: 'OpenLiveBroadCast'
                },
                {
                    id: 2,
                    title: '预约直播',
                    comName: 'BookLiveBroadCast'
                }
            ],
            comName: 'OpenLiveBroadCast'
        }
    },
    watch: {
        currentTab: {
            handler () {
                const tab = this.tabs.find(x => x.id === this.currentTab)
                this.comName = tab.comName
                console.log(tab.comName, 'asdfasdf')
            }
        }
    },
    methods: {
        changeTab (tab) {
            this.currentTab = tab.id
            this.comName = tab.comName
        }
    }
}
</script>

<style lang="scss" scoped>

.header-tabs {
  border-bottom: 1px solid #d8d8d8;
}

::v-deep {
    .header-tabs {
      .tab-item {
        margin-right: 70px;
      }
    }
}
</style>
