import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import commonData from './modules/commonData'
import modal from './modules/modal'
import competition from '@/store/modules/competition'
import voice from '@/store/modules/voice'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        commonData,
        modal,
        competition,
        voice
    }
})
