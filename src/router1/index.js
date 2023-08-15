import Vue from 'vue'
import VueRouter from 'vue-router'

import { stadicRoutes } from './router.config'

// 想通过路由跳转 报错的问题
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
const router = new VueRouter({
    routes: stadicRoutes
})

export default router
