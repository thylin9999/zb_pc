import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import Store from '../store/index'
import router from './index'
import { getToken } from '../utils/cookie'

Nprogress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['Login', 'Register'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/welcome'
// 权限控制
router.beforeEach(async (to, from, next) => {
    // 这里应该看是否获取用户信息
    Nprogress.start()
    const token = getToken()
    if (token) { // token 存在即登录了，获取用户信息 ，然后展示动态路由
        if (to.name === 'login') {
            next({ path: defaultRoutePath })
            Nprogress.done()
        } else {
            // 刷新时，可以少了数据，在这里也得处理
            const { permission } = Store.state
            if (!permission.menus.length) {
                try {
                    // 没有 获取权限 里列表，
                    const getUserInfoValidate = await Store.dispatch('user/getUserInfo')
                    const getUserMenuValidate = await Store.dispatch('permission/getUserMenus')
                    if (getUserInfoValidate && getUserMenuValidate) {
                        Store.dispatch('permission/generateRoutes')
                        router.addRoutes(Store.state.permission.routes)
                        next({ ...to, replace: true })
                    }
                    Nprogress.done()
                } catch (error) {
                    console.log(error, 'error')
                }
            } else {
                // 有权限的话，就直接 进入就好了
                next()
            }
        }
    } else { // token 不存在，跳转登录页就完了
        if (allowList.includes(to.name)) {
            // 在免登录名单，直接进入
            next()
        } else {
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            // NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})
router.afterEach(() => {
    Nprogress.done() // finish progress bar
})
