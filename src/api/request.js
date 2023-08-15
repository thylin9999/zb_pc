/* eslint-disable */
import axios from 'axios'
import { statusCode } from '@/utils/statusCode'
import { removeToken, removeSessionStorageItem, getToken } from '@/utils/cookie'
import { Message } from 'element-ui'
import Router from '../router/index'
import Store from '../store/index'
import url from './user/url'
const instance = axios.create({
    // eslint-disable-next-line no-undef
    baseURL: _requestApiUrl,
    // baseURL: 'http://api.wuhaicj.com'
    // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : '',

    timeout: 6 * 1000, //请求超时时间（5秒后还未接收到数据，就需要再次发送请求）
    retry: 3, //设置全局重试请求次数（最多重试几次请求）
    retryDelay: 1000, //设置全局请求间隔

})

const errorHandle = (error) => {// 自动重连机制
    // 超时处理 error.config是一个对象，包含上方create中设置的三个参数
    const config = error.config
    if (!config || !config.retry) return Promise.reject(error)

    // 如果有响应内容，就直接返回错误信息，不再发送请求
    if (error.response && error.response.data) {
        return Promise.reject({ type: 'error', msg: error.response.data })
    }

    // __retryCount用来记录当前是第几次发送请求
    config.__retryCount = config.__retryCount || 0

    // 如果当前发送的请求大于等于设置好的请求次数时，不再发送请求，返回最终的错误信息
    if (config.__retryCount >= config.retry) {
        if (error.message === 'Network Error') {
            // message为"Network Error"代表断网了
            return Promise.reject({ type: 'warning', msg: '网络连接已断开，请检查网络' })
        } else if (error.message === 'timeout of 30ms exceeded') {
            // 网太慢了，6秒内没有接收到数据，这里的6000ms对应上方timeout设置的值
            // console.log(config.requestTimeoutType, 'config', Store.state.commonData.requestFlag)
            const flags = Store.state.commonData.requestFlag
            flags[config.requestTimeoutType] = true
            Store.commit('commonData/SET', { requestFlag: { ...flags }})
            const needRefresh = Object.keys(flags).every(x => x)// 都为true需要重新加载
            Store.commit('commonData/SET', { needRefresh })
            return Promise.reject({ type: 'warning', msg: '请求超时，请检查网络' })
        } else {
            // 除以上两种以外的所有错误，包括接口报错 400 500 之类的
            return Promise.reject({ type: 'error', msg: '出现错误，请稍后再试' })
        }
    }

    // 记录请求次数+1
    config.__retryCount += 1

    // 设置请求间隔 在发送下一次请求之前停留一段时间，时间为上方设置好的请求间隔时间
    const backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve()
        }, config.retryDelay || 1)
    })

    // 再次发送请求
    return backoff.then(function () {
        return instance(config)
    })
}

instance.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // 请求拦截器
    return config
}, errorHandle)

let isAuthorization = true
instance.interceptors.response.use(response => {
    // 响应拦截器
    const requestUrl = response.config.url
    const whiteList = [
        url.login,
        url.register
    ]
    if (response && response.data.code === statusCode.success && !whiteList.includes(requestUrl)) {
        return response.data
    }    // 407 只是token失效了，408才是重新登录
    if (response && response.data.code === statusCode.isExpired) {
        // 408 需要去更新 token
        Store.dispatch('user/updateToken')
    }
    // 408 重新登录
    if (response.data.code === statusCode.refreshTokenFail) {
        // const token = getToken()
        if (isAuthorization) {
            isAuthorization = false
            Message.error(response.data.msg)
            // Store.dispatch('user/logoutAction')
            removeSessionStorageItem('userInfo')
            removeToken()
            Store.commit('user/SET', { token: null, userName: null, age: null, nickname: null, is_anchor: 1, avatar: null })
            // this.$router.push('/')
            Store.commit('commonData/SET', { isExpired: true })
            // Router.push('/')
            setTimeout(() => {
                isAuthorization = true
                Store.commit('commonData/SET', { isExpired: false })
            }, 5000)
        }
        return response.data
    } else {
        return response.data
    }
}, errorHandle)

export default instance

