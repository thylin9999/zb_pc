<template>
  <div  id="app" :class="{'overflow-hidden ': showDialog }">
      <router-view :key="updateKey"/>
      <ModalLogin :key="modalUpdateKey"/>
      <LoginPopup />
      <NetErrorPopup />
      <DownloadPopup />
      <ChargeDialog />
      <div id="captchaContainer"></div>
  </div>
</template>
<script >
import { mapState, mapActions, mapMutations } from 'vuex'
import ModalLogin from '@/views/User/ModalLogin'
import LoginPopup from '@/components/LoginPopup'
import ChargeDialog from '@/components/ChargeDialog'
import NetErrorPopup from '@/components/NetErrorPopup'
import DownloadPopup from '@/components/DownloadPopup'
import { getLeagues } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { Message } from 'element-ui'
import { getDownloadUrls } from '@/api/Common'

export default {
    name: 'App',
    components: {
        ModalLogin,
        LoginPopup,
        DownloadPopup,
        NetErrorPopup,
        ChargeDialog
    },
    data () {
        return {
            updateKey: +new Date().getTime() + 'router-view',
            leagueTypes: {}// 所有的联赛，按足球篮球分类
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    computed: {
        ...mapState('modal', ['showDialog']),
        ...mapState('user', ['token'])
    },
    watch: {
        token: {
            handler () {
                if (this.token) {
                    this.init()
                    this.getBoxes()
                }
            },
            immediate: true
        }
    },
    created () {
        // 只获取了足球的联赛信息
        // this.updateLeagueTypes()
        this.getUrls()
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        ...mapActions('commonData', ['getBoxes']),
        ...mapMutations('commonData', ['SET']),
        reload () {
            this.updateKey = +new Date().getTime() + 'router-view'
        },
        async getLeagues (type) {
            try {
                const { data, code, msg } = await getLeagues(type)
                if (code === statusCode.success) {
                    data.unshift({
                        leagueId: `全部-${type}`,
                        nameChsShort: '全部'
                    })
                    this.leagueTypes[type] = [...data]
                    this.SET({
                        leagueTypes: this.leagueTypes
                    })
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错饿了')
            }
        },
        async init () {
            try {
                await this.getUserInfo()
            } catch (e) {
                console.log('出错了')
            }
        },
        async getUrls () {
            try {
                const { data, code } = await getDownloadUrls()
                if (code === statusCode.success) {
                    this.$store.commit('commonData/SET', {
                        urls: { ...data }
                    })
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.captchaContainer {
  position: fixed;
}
</style>
