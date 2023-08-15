<template>
    <div class="h-100 basic-layout">
        <Header />
        <div class="content-section"
             :class="{
            'is-not-home': !isHome,
             'has-no-footer': !showFooter,
             'is-home': isHome,
             'is-live-room': isLiveRoom,
             'is-competition': isCompetition,
        }">
            <router-view class="content-router "></router-view>
        </div>
        <template v-if="showFooter">
          <Footer  />
        </template>
        <SideBar v-if="isHome" />
    </div>
</template>
<script>
import Header from './Header.vue'
import Footer from '@/views/Layout/Footer'
import { mapState, mapMutations } from 'vuex'
import { getItem } from '@/utils/cookie'
import SideBar from '@/views/Layout/SideBar'
export default {
    name: 'BasicLayout',
    components: {
        Header,
        Footer,
        SideBar
    },
    data () {
        return {
            isHome: false
        }
    },
    computed: {
        ...mapState('user', ['token']),
        isHostPage () {
            return this.$route.meta.subId === 5
        },
        isLiveRoom () {
            return this.$route.meta.subId === 6
        },
        isCompetition () {
            return this.$route.meta.subId === 2
        },
        isScore () {
            return this.$route.meta.subId === 9
        },
        showFooter () {
            return !this.isHostPage && !this.isLiveRoom
        }
    },
    watch: {
        '$route': {
            handler () {
                const userInfo = getItem('userInfo')
                if (userInfo) {
                    this.SET(JSON.parse(userInfo))
                }
                this.isHome = this.$route.meta.subId === 1
            }
        },
        deep: true,
        immediate: true
    },
    created () {
        const userInfo = getItem('userInfo')
        if (userInfo) {
            this.SET(JSON.parse(userInfo))
        }
        this.isHome = this.$route.meta.subId === 1
    },
    methods: {
        ...mapMutations('user', ['SET'])
    }
}
</script>
<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.basic-layout {
    .content-section {
        min-height: calc(100vh - 250px);
        &.is-not-home {
            background-color: $background-gray2;
        }
        &.has-no-footer {
            height: calc(100vh - 60px);
        }
        &.is-home, &.is-live-room, &.is-competition{
            padding-top: 60px;
            height: auto;
        }
    }
}
.flex-column {
    height: auto;
}
</style>
