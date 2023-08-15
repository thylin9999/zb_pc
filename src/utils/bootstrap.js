import { getToken } from './cookie'
import Store from '../store'

// 初始化用的
export default function init () {
    if (getToken()) {
        Store.commit('user/SET', { token: getToken() })
    }
}
