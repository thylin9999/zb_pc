import BasicLayout from '../views/Layout/BasicLayout'
const stadicRoutes = [
    {
        path: '/404',
        component: () =>
            import(/* webpackChunkName: "notFound" */ '../views/Layout/NotFound.vue')
    }
]

const asyncRoutes = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        redirect: '/welcome',
        meta: {
            hideInMenu: false
        },
        children: [
            {
                path: '/welcome',
                name: 'Welcome',
                component: () =>
                    import(/* webpackChunkName: "Welcome" */ '../views/Home.vue'),
                meta: {
                    permission: ['welcome'],
                    menuItem: true,
                    name: '首页',
                    icon: 'home'
                }
            },
            {
                path: '/list',
                name: 'List',
                redirect: '/list/goods-list',
                component: () =>
                    import(/* webpackChunkName: "List" */ '../views/List/index.vue'),
                meta: {
                    permission: ['list'],
                    name: '列表',
                    menuItem: true
                },
                children: [
                    // 子路由
                    {
                        path: '/list/goods-list',
                        name: 'GoodsList',
                        component: () =>
                            import(
                                /* webpackChunkName: "GoodsList" */ '../views/List/GoodsList.vue'
                            ),
                        meta: {
                            permission: ['list'],
                            menuItem: true,
                            name: '列表1'
                        }
                    },
                    {
                        path: '/list/drugs-list',
                        name: 'DrugsList',
                        component: () =>
                            import(
                                /* webpackChunkName: "GoodsList" */ '../views/List/DrugsList.vue'
                            ),
                        meta: {
                            permission: ['list', 'DrugsList'],
                            menuItem: true,
                            name: '列表2'
                        }
                    },
                    {
                        path: '/list/fruites-list',
                        name: 'FruitsList',
                        component: () =>
                            import(
                                /* webpackChunkName: "GoodsList" */ '../views/List/FruitesList.vue'
                            ),
                        meta: {
                            permission: ['list', 'fruites-list'],
                            menuItem: true,
                            name: '列表3'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () =>
            import(/* webpackChunkName: "NotFound" */ '../views/Layout/NotFound.vue'),
        meta: {
            hideInMenu: true
        }
    },
    // 未匹配到的路由走404
    {
        path: '*',
        redirect: '/404',
        meta: {
            hideInMenu: true
        }
    }
]

// 判断当前route是否有 权限
function hasPermission (permission, route) {
    if (route.meta && route.meta.permission) {
        return route.meta.permission.every((item) => {
            return permission.includes(item)
        })
    }
    return true
}

const filterRoutes = (menus, routes) => {
    return routes.filter((route) => {
        if (hasPermission(menus, route)) {
            if (route.children && route.children.length) {
                route.children = filterRoutes(menus, route.children)
            }
            return true
        }
        return false
    })
}

export { stadicRoutes, asyncRoutes, filterRoutes }
