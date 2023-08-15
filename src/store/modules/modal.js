const state = {
    showDialog: false,
    showLoginDialog: false,
    showLoginPopup: false,
    showDownloadPopup: false,
    showGiftLogin: false, // 送礼登录提示
    giftUnit: '球币',
    showChargeDialog: false // 球币充值弹框
}

const actions = {
    openLoginDialog ({ commit }) {
        commit('SET', { showLoginDialog: true })
    },
    closeLoginDialog ({ commit }) {
        commit('SET', { showLoginDialog: false })
    },
    changePopup ({ commit }, payload) { // 修改状态
        commit('SET', payload)
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

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
