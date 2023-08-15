<template>
    <div class="left-menu p-relative ">
        <span>右侧菜单</span>
        <ul>
            <li
                @click="goToList('GoodsList')"
            >GoodsList</li>
            <li
                @click="goToList('DrugsList')"
            >DrugsList</li>
            <li
                @click="goToList('FruitsList')"
            >FruitsList</li>
        </ul>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'LeftMenu',
    data () {
        return {
            toggle: true
        }
    },
    computed: {
        ...mapState('permission', ['routes']),
        menus () {
            console.log(this.routes, 'routes')
            return this.routes.length ? this.routes[0].children : []
        },
        activeMenu () {
            // 激活的 路由
            return this.$route.name
        }
    },
    watch: {
        menus () {
            console.log(this.menus, 'menus')
        }
    },
    methods: {
        goToList (name) {
            this.$router.push({
                name
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.left-menu {
    width: 12.2vw;
    transition: 0.3s ease;
    background-color: #10c96a;
    color: #fff;
}
</style>
