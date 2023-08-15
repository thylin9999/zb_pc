import dayjs from 'dayjs'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { getLeagues, getLeaguesLiving } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'

export const globalMixin = {
    data () {
        return {
            globalTypes: {}
        }
    },
    computed: {
        ...mapState('commonData', ['serviceSite', 'urls']),
        ...mapState('user', ['token']),
        ...mapGetters('user', ['isHostAnchor']),
        emptyLogo () {
            return require('../assets/images/live-room/logo.png')
        },
        errorUserLogo () {
            return require('../assets/images/common/user-icon.png')
        },
        errorTeamLogo () {
            return require('../assets/images/common/team-icon.png')
        },
        cardEmptyLogo () {
            return require('../assets/images/common/card-empty.jpg')
        },
        // emptyTeamLogo () {
        //     return require('../assets/images/common/team-icon.png')
        // },
        _appDownloadUlrIOS () {
            return this.urls.ios_link
        },
        _appDownloadUlr () {
            return this.urls.android_link
        }
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        formatterDate (row, column, cellValue, index) {
            return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : ''
        },
        queryCustom () {
            window.open(this.serviceSite, '_blank')
        },
        queryHost () {
            if (this.token) {
                this.$router.push({
                    name: 'PersonalCenter',
                    params: {
                        tabId: 10
                    }
                })
            } else {
                this.openLoginDialogMixin()
            }
        },
        async updateLeagueTypes (day) {
            try {
                const request1 = () => getLeagues(1, day)
                const request2 = () => getLeagues(2, day)
                const res = await Promise.all([request1(), request2()])
                const footballTypes = res[0].code === statusCode.success ? res[0].data : []
                const basketballTypes = res[1].code === statusCode.success ? res[1].data : []
                footballTypes.unshift({
                    leagueId: '全部-1',
                    nameChsShort: '全部'
                })
                basketballTypes.unshift({
                    leagueId: '全部-2',
                    nameChsShort: '全部'
                })
                const types = {
                    1: footballTypes,
                    2: basketballTypes
                }
                this.$store.commit('commonData/SET', {
                    leagueTypes: types
                })
            } catch (e) {
                console.log('出错了')
            }
        },
        async updateLeagueTypesInLive () {
            try {
                const request1 = () => getLeaguesLiving(1)
                const request2 = () => getLeaguesLiving(2)
                const res = await Promise.all([request1(), request2()])
                // console.log(res, 'res')
                const footballTypes = res[0].code === statusCode.success ? res[0].data : []
                const basketballTypes = res[1].code === statusCode.success ? res[1].data : []
                footballTypes.unshift({
                    leagueId: '全部-1',
                    nameChsShort: '全部'
                })
                basketballTypes.unshift({
                    leagueId: '全部-2',
                    nameChsShort: '全部'
                })
                const types = {
                    1: footballTypes,
                    2: basketballTypes
                }
                this.SET({
                    leagueTypes: types
                })
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
