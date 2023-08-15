/* eslint-disable */
import Vue from 'vue'
// import enLang from 'element-ui/lib/locale/lang/en'
// import zhLang from 'element-ui/lib/locale/lang/zh-CN'
// import ElementLocale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import { getLang } from "../cookie";

Vue.use(VueI18n)
const zhLocalLang = {}
const enLocalLang = {}

function getFileName(path) {
    const fileName = path.slice(2,)
    return fileName.slice(0, -3)
}

const zhFiles = require.context('./zh', false, /\.js$/)
zhFiles.keys().forEach(path => {
    const key = getFileName(path)
    const module = require(`@/utils/lang/zh/${key}.js`)
    zhLocalLang[key] = module.default
})

const enFiles = require.context('./en', false, /\.js$/)
enFiles.keys().forEach(path => {
    const key = getFileName(path)
    const module = require(`@/utils/lang/en/${key}.js`)
    enLocalLang[key] = module.default
})


const messages = {
    en: {
        // ...enLang, // element-ui英文包
        ...enLocalLang
    },
    zh: {
        // ...zhLang, // element-ui中文包
        ...zhLocalLang
    }
}
export const i18n = new VueI18n({
    locale: getLang(), // 初始默认值
    messages
})

// ElementLocale.i18n((key, value) => i18n.t(key, value))
