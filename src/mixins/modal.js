import { mapActions, mapMutations } from 'vuex'

export const modalMixin = {
    data () {
        return {
            modalUpdateKey: +new Date().getTime()
        }
    },
    methods: {
        ...mapActions('modal', ['openLoginDialog', 'closeLoginDialog', 'changePopup']),
        ...mapMutations('modal', ['SET']),
        openLoginDialogMixin () { // 打开登录框
            this.openLoginDialog()
        },
        closeLoginDialogMixin () { // 关闭登录框`
            this.modalUpdateKey = +new Date().getTime()
            this.closeLoginDialog()
        },
        setLoginPopup (value = false) { // 提示登录弹框
            this.changePopup({ showLoginPopup: value })
        },
        setDownloadPopup (value = false) { // 提示下载框
            this.changePopup({ showDownloadPopup: value })
        },
        // 赠送礼物时的坦克
        setGiftLogin (value, unit) {
            this.changePopup({
                showGiftLogin: value,
                giftUnit: unit
            })
        }
    }
}
