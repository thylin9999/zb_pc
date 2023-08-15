// import './mock'
// import './assets/fonts/font.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bootstrap from './utils/bootstrap'
import './utils/elements'
import { throttle, debounce } from './utils/validator'
import { modalMixin } from '@/mixins/modal'
import { globalMixin } from '@/mixins/globalMixin'
// 页面权限
// 清除默认样式
import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
// 全局样式
import './styles/index.scss'
// svg icon
import './icons/index'
// import 'alvin-space-tool/css/main.css'
import vueComTestAlvin from 'vue-com-test-alvin'

import { i18n } from './utils/lang/index'

import VueLazyload from 'vue-lazyload'

import infiniteScroll from 'vue-infinite-scroll'

// const errorimage = require('./assets/images/common/team-icon.png')

Vue.use(VueLazyload, {
    lazyComponent: true,
    preLoad: 1.3,
    attempt: 1,
    // error: require('./assets/images/common/team-flag.png'), // 错误图片
    // error: errorimage, // 错误图片
    loading: require('./assets/images/common/loading.gif') // 加载中图片
})

Vue.use(infiniteScroll)

Vue.use(vueComTestAlvin)
// 全局mixin
Vue.mixin(modalMixin)
Vue.mixin(globalMixin)
Vue.config.productionTip = false
// 注册全局节流指令
Vue.directive('throttle', {
    bind (el, binding) {
        let executeFunction
        if (binding.value instanceof Array) {
            const [func, timer] = binding.value
            executeFunction = throttle(func, timer)
        } else {
            console.error('throttle指令绑定的参数必须是数组，且需执行的事件类型或函数或时间间隔不能为空')
            return
        }
        el.addEventListener('click', executeFunction)
    }
})
// 注册全局防抖指令
Vue.directive('debounce', {
    bind (el, binding) {
        let executeFunction
        if (binding.value instanceof Array) {
            const [func, timer] = binding.value
            executeFunction = debounce(func, timer)
        } else {
            console.error('debounce指令绑定的参数必须是数组，且需执行的事件类型或函数或时间间隔不能为空')
            return
        }
        el.addEventListener('click', executeFunction)
    }
})
Vue.$console = console.log
new Vue({
    router,
    store,
    i18n, // 国际化
    created: bootstrap, // 刷新时，从localstorage中获取 token赋值给vuex
    render: h => h(App)
}).$mount('#app')
