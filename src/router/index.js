import Vue from 'vue'
import VueRouter from 'vue-router'
import BasicLayout from '@/views/Layout/BasicLayout'
import EmptyRouterView from '@/views/Layout/EmptyRouterView'
import NProgress from 'nprogress'
// import { getToken, setItem, setToken } from '@/utils/cookie'
// import { loginWithCode } from '@/api/user'
// import Store from '../store/index'
// import { statusCode } from '@/utils/statusCode'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

NProgress.inc()
NProgress.configure({ showSpinner: false })

const routes = [
    {
        path: '/',
        component: BasicLayout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
                meta: {
                    subId: 1
                }
            },
            {
                path: '/live-broadcast',
                name: 'LiveBroad',
                component: () => import(/* webpackChunkName: "LiveBroad" */ '../views/Host/HostIndex'),
                meta: {
                    subId: 5
                }
            },
            {
                path: '/competition',
                name: 'Competition',
                component: () => import(/* webpackChunkName: "Competition" */ '../views/Competition/Competition'),
                meta: {
                    subId: 2
                }
            },
            {
                path: '/subscribe-list',
                name: 'SubscribeList',
                component: () => import(/* webpackChunkName: "SubscribeList" */ '../views/SubscribeList/SubscribeList'),
                meta: {
                    subId: 3
                }
            },
            {
                path: '/app-download',
                name: 'DownloadApp',
                component: () => import(/* webpackChunkName: "DownloadApp" */ '../views/DownloadApp'),
                meta: {
                    subId: 4
                }
            },
            {
                path: '/app-description/:id',
                name: 'Description',
                component: () => import(/* webpackChunkName: "Description" */ '../views/Descriptions/Description'),
                props ($route) {
                    return {
                        id: $route.params.id
                    }
                }
            },
            {
                path: '/personal-center/:tabId?',
                name: 'PersonalCenter',
                component: () => import(/* webpackChunkName: "PersonalCenter" */ '../views/PersonalCenter/PersonalCenter'),
                meta: {
                    subId: 7 //
                },
                props: true
            },
            {
                path: '/expert-center/:tabId?',
                name: 'ExpertCenter',
                component: () => import(/* webpackChunkName: "ExpertCenter" */ '../views/ExpertCenter/Index'),
                meta: {
                    subId: 12 //
                },
                props: true
            },
            {
                path: '/help-center/:tabId?',
                name: 'HelpCenter',
                component: () => import(/* webpackChunkName: "HelpCenter" */ '../views/Announcements/Index'),
                meta: {
                },
                props: true
            },
            {
                path: '/liveRoom',
                name: 'LiveRoom',
                component: () => import(/* webpackChunkName: "LiveRoom" */ '../views/LiveRoom/WrapperBox'),
                meta: {
                    subId: 6,
                    query: {
                        room_id: 'required'
                    }
                }
            },
            {
                path: '/virtual-liveRoom',
                name: 'VirtualLive',
                component: () => import(/* webpackChunkName: "VirtualLive" */ '../views/VirtualLiveRoom/WrapperBox'),
                meta: {
                    subId: 10,
                    query: {
                        matchId: 'required'
                    }
                }
            },
            {
                path: '/score',
                name: 'Score',
                component: () => import(/* webpackChunkName: "Score" */ '../views/Score/index'),
                meta: {
                    subId: 9
                }
            },
            {
                path: '/search',
                name: 'Search',
                component: () => import(/* webpackChunkName: "Score" */ '../views/Search/index'),
                meta: {
                    subId: 13
                }
            },
            {
                path: '/news',
                name: 'News',
                component: EmptyRouterView,
                redirect: '/news/',
                meta: {
                    subId: 10
                },
                children: [
                    {
                        path: '',
                        name: 'NewsIndex',
                        component: () => import(/* webpackChunkName: "NewsIndex" */ '../views/News/index'),
                        meta: {
                            subId: 10
                        }
                    },
                    {
                        path: '/news/detail/id',
                        name: 'NewsDetail',
                        component: () => import(/* webpackChunkName: "NewsDetail" */ '../views/News/NewsDetail'),
                        meta: {
                            subId: 10
                        }
                    }
                ]
            },
            {
                path: '/guide',
                name: 'Guide',
                component: () => import(/* webpackChunkName: "Guide" */ '../views/Guide/index'),
                meta: {
                    subId: 11
                }
            }

            // {
            //     path: '/world-cup',
            //     name: 'WorldCup',
            //     component: () => import(/* webpackChunkName: "WorldCup" */ '../views/WorldCup/index'),
            //     meta: {
            //     }
            // }
        ]
    }
]

const router = new VueRouter({
    routes
})
// 页面路由刚开始切换的时候
// eslint-disable-next-line
router.beforeEach(async (to,from,next) => {
    // 开启进度条
    NProgress.start()
    next()
})
// 页面路由切换完毕的时候
router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
})

// router.beforeEach(async (to, from, next) => {
//     const token = getToken()
//     if (token) {
//         Store.commit('user/SET', { token })
//     } else {
//         const hasCode = !!to.query.code
//         if (hasCode) {
//             const { data, code, token } = await loginWithCode(to.query.code)
//             if (code === statusCode.success) {
//                 setToken(token)
//                 const params = {
//                     ...data, token
//                 }
//                 setItem('userInfo', JSON.stringify(params))
//                 Store.commit('user/SET', params)
//             }
//         }
//     }
//     next()
// })

export default router
