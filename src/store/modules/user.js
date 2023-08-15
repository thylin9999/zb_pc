/*eslint-disable*/
import { getUserInfo, login, logout, updateToken } from '../../api/user'
import { setToken, removeToken, setItem,getItem, removeSessionStorageItem } from '@/utils/cookie'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import Router from '@/router'
const state = {
    age: null,
    nickname: null,
    is_anchor: 1, // 1 非主播 2 主播
    anchor_status: null, // 1, 正常 ，2，禁播
    super_manage: 1, // 1 非超管 2 超管
    token: null, // token
    memberId: null,
    member_id: null,
    isAnchor: false,
    avatar: null, // 头像
    roomId: null,
    superManage: 1, // 是否是超管 1不是 2是
    signature: '', // 直播间登录失效使用
    ball_coin: 0, // 球币
    ball_coin_wd: 0, // 可提现球币余额
    ball_ticket: 0, // 球票
    giftList: [], // 待展示的礼物列表
}
const actions = {
    async getUserInfo ({ state, dispatch, commit, getters }) {
        try {
            const { data, code, msg } = await getUserInfo()
            if (code === statusCode.success && msg === 'success') {
                const _userInfo = getItem('userInfo')
                const refreshToken = JSON.parse(_userInfo) ? JSON.parse(_userInfo).refreshToken  : null
                const userInfo = {
                    ...data,
                    isAnchor: data.is_anchor,
                    memberId: data.member_id,
                    roomId: data.room_id,
                    superManage: data.super_manage,
                    refreshToken
                }
                commit('SET', userInfo)
                setItem('userInfo', JSON.stringify(userInfo))
                return true
            } else {
                Message.error(msg)
                return false
            }
        } catch (error) {
            console.log(error, 'error')
            return false
        }
    },
    async login ({ state, dispatch, commit }, payload) {
        try {
            const { data, code, token, msg, refresh_token } = await login(payload)
            if (code === statusCode.success) {
                setToken(token)
                const params = {
                    ...data, token,
                    memberId: data.memberId,
                    refreshToken: refresh_token
                }
                setItem('userInfo', JSON.stringify(params))
                commit('SET', params)
                return {
                    code
                }
            } else {
                return {
                    code, msg, data
                }
            }
        } catch (error) {
            console.error(error, 'error')
        }
    },
    async logoutAction ({ state, dispatch, commit }) {
        // 菜单等 路由信息也应该删除。。。
        // 去除token
        try {
            await logout()
        } catch (e) {
            console.log('出错了')
        } finally {
            removeToken()
            removeSessionStorageItem('userInfo')
            // 删除用户信息
            commit('SET', { token: null, userName: null,memberId: null, match_id: null, age: null, nickname: null, is_anchor: 1, avatar: null,super_manage: null, signature: null })
            if(['PersonalCenter', 'ExpertCenter'].includes(Router.currentRoute.name) ) {
                Router.push({
                    name: 'Home'
                })
            } else {
                window.location.reload()
            }
        }
    },
    async updateToken ({ state, commit, dispatch }) {
        const userInfo = JSON.parse(getItem('userInfo'))
        if(!userInfo) {
            dispatch('logoutAction')
            return
        }
        const { code, data } = await updateToken(userInfo.member_id, userInfo.refreshToken)
        if (code === statusCode.success) {
            const { token, refresh_token } = data
            setToken(token)
            const params = {
                ...state,
                token,
                refreshToken: refresh_token
            }
            setItem('userInfo', JSON.stringify(params))
            commit('SET', params)
        }
    }
}

const mutations = {
    SET (state, payload) {
        Object.entries(payload).forEach(item => {
            const key = item[0]
            const value = item[1]
            state[key] = value
        })
    }
}

const getters = {
    isHostAnchor (state) {
        return state.is_anchor === 2 && state.anchor_status === 1
    },
    isLoginMode() {
        return !!state.token
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
