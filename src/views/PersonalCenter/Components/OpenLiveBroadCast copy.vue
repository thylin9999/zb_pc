<template>
<div class="live-cast p-b-30">
    <div class="content info font-16 font-regular text-333">
        <select-with-error
            class="m-b-20 m-t-25"
            showLabel
            :label="form.category.label"
            :error-info="errorInfo.category"
            :row-info.sync="form.category"
            @validate="changeCategory"
            :key="form.category.updateKey"
            :options="categoryOptions"
        />
        <div class="row-outer league-type-row flex align-center p-l-30 m-t-20 m-b-20" v-if="![3,4].includes(this.form.category.value)">
            <span class="label">
                联赛
            </span>
            <div class="content">
                <el-radio-group v-model="liveType" @change="changeLeagueType" :disabled="!canEdit">
                    <el-radio
                        v-for="type in leagueTypeOptions"
                        :key="type.id"
                        :label="type.id">{{ type.label}}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="row-outer flex align-center p-l-30 m-t-20 m-b-20">
                <span class="label">
                    比赛时间
                </span>
            <div class="content flex-1">
                <el-date-picker
                    :disabled="!canEdit"
                    class="time-picker w-100"
                    v-model="showTime"
                    type="date"
                    @change="selectTime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
        </div>
        <div class="flex align-center m-b-20 m-t-25 ">
            <SelectWithError
                :disabled="!canEdit"
                v-if="needValidateMatch"
                class="flex-1"
                showLabel
                :label="form.match.label"
                :error-info="errorInfo.match"
                :row-info.sync="form.match"
                @validate="validateRow"
                :key="form.match.updateKey"
                :options="competitionOptions"
            />
            <competition-select
                :category.sync="form.category.value"
            />
        </div>
        <input-with-error
            :disabled="!canEdit"
            class="m-b-20 m-t-25"
            showLabel
            :label="form.title.label"
            :error-info="errorInfo.title"
            :row-info.sync="form.title"
            @validate="validateRow"
            :key="form.title.updateKey"
        />
        <input-with-error
            :maxLength="2000"
            :disabled="!canEdit"
            class="m-b-20 m-t-25"
            showLabel
            :label="form.videoUrl.label"
            :error-info="errorInfo.videoUrl"
            :row-info.sync="form.videoUrl"
            @validate="validateRow"
            :key="form.videoUrl.updateKey"
        />

        <textarea-with-error
            class="m-b-20 m-t-25"
            :disabled="!canEdit"
            showLabel
            :label="form.announcement.label"
            :error-info="errorInfo.announcement"
            :row-info.sync="form.announcement"
            @validate="validateRow"
            :key="form.announcement.updateKey"
        />
        <upload-with-error
            :disabled="!canEdit"
            class="m-b-30 m-t-25"
            :max-size="300"
            file-type="cover"
            showLabel
            :label="form.liveCover.label"
            :row-info.sync="form.liveCover"
            @changeFile="changeFile"
            :show-error="coverError"
        />
        <div class="row-outer flex align-center p-l-30 m-b-20" v-if="!obs">
            <span class="label">

            </span>
            <div class="save-button font-medium font-16" >
                <span
                    class="font-16 p-t-5 p-b-5 p-l-10 p-r-10 pointer"
                    @click="getAddress"
                >获取推流地址</span>

            </div>
        </div>
        <div v-else class="font-medium font-16 obs m-l-30 p-b-25">
            <div class="flex align-center">
                <div class="m-r-15">
                    OBS推流地址：{{obs.url }}
                </div>
                <el-tooltip content="复制">
                    <i class="el-icon-copy-document pointer" @click="copyObs(obs.url)"></i>
                </el-tooltip>
            </div>
            <div class="flex align-center">
                <div class="m-r-15">
                    OBS串流秘钥：{{obs.key}}
                </div>
                <el-tooltip content="复制">
                    <i class="el-icon-copy-document pointer" @click="copyObs(obs.key)"></i>
                </el-tooltip>
            </div>
        </div>
        <div class="row-outer flex flex-end p-l-30 m-b-20">
            <div class="save-button font-medium font-16">
                <ConfirmButton class="w-100 h-100 font-16 pointer" @click.native="beforeSubmit" :title="buttonString"/>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import TextareaWithError from '@/components/Form/TextareaWithError'
import SelectWithError from '@/components/Form/SelectWithError'
import UploadWithError from '@/components/Form/UploadWithError'
import CompetitionSelect from './CompetitionSelect.vue'
import { isRequire, Copy } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { startLive, getOBSAddress, closeLive } from '@/api/Host/Host'
import { getLeagues, getMatchesByDay } from '@/api/competition/competition'
import { Message } from 'element-ui'
import { statusCode } from '@/utils/statusCode'
import { mapState, mapActions, mapGetters } from 'vuex'
import dayjs from 'dayjs'
import ConfirmButton from '@/components/ConfirmButton'
export default {
    name: 'OpenLiveBroadCast',
    inject: ['reload'],
    components: {
        TextareaWithError,
        InputWithError,
        SelectWithError,
        UploadWithError,
        ConfirmButton,
        CompetitionSelect
    },
    data () {
        return {
            form: {
                title: {
                    label: '直播标题',
                    value: '',
                    key: 'title',
                    validators: [isRequire('直播标题')],
                    validateLabel: ['isRequire'],
                    updateKey: 'title-false'
                },
                category: {
                    label: '直播分类',
                    value: 1,
                    key: 'category',
                    validators: [isRequire('直播分类')],
                    validateLabel: ['isRequire'],
                    updateKey: 'category-false'
                },
                videoUrl: {
                    label: '视频地址',
                    value: '',
                    key: 'videoUrl',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'videoUrl-false'
                },
                match: {
                    label: '直播比赛',
                    value: null,
                    key: 'match',
                    validators: [],
                    validateLabel: ['isRequire'],
                    updateKey: 'match-false'
                },
                announcement: {
                    label: '直播公告',
                    value: null,
                    key: 'announcement',
                    validators: [],
                    validateLabel: [],
                    updateKey: 'announcement-false'
                },
                liveCover: {
                    label: '直播封面',
                    value: '',
                    key: 'liveCover',
                    validators: [],
                    validateLabel: ['isRequire'],
                    updateKey: 'liveCover-false'
                }
            },
            liveType: 'all',
            leagueTypeOptions: [
                {
                    id: 'all',
                    label: '全部',
                    value: 'all'
                }
            ],
            errorInfo: {
                category: {},
                title: {},
                match: {}
            },
            coverError: false,
            competitionOptions: [],
            obs: null,
            openBroadcastSuccess: false, // 是否开播成功
            showTime: dayjs().format('YYYY-MM-DD')
        }
    },
    computed: {
        ...mapState('commonData', ['broadcastTypes']),
        ...mapGetters('user', ['isHostAnchor']),
        isLiving () { // 正在直播
            return this.obs && this.obs.live_status === 2
        },
        canEdit () {
            return !this.isLiving
        },
        needValidateMatch () {
            return [1, 2].includes(this.form.category.value)
        },
        buttonString () {
            return this.openBroadcastSuccess ? '结束直播' : '立即开播'
        },
        categoryOptions () {
            // return this.broadcastTypes.filter(x => {
            //     return !(x.id === 5) // 过滤掉 正在热播
            // })
            return this.broadcastTypes.reduce((all, item) => {
                if (item.id !== 5) {
                    all.push({
                        ...item,
                        value: item.id,
                        label: item.title.slice(0, 2)
                    })
                }
                return all
            }, [])
        },
        pickerOptions () {
            return {
                disabledDate: date => {
                    return dayjs(date).isBefore(dayjs(), 'day')
                }
            }
        }
    },
    watch: {
        isHostAnchor: {
            handler () {
                if (!this.isHostAnchor) {
                    this.$router.push({
                        name: 'PersonalCenter',
                        params: {
                            tabId: 1
                        }
                    })
                }
            },
            immediate: true,
            deep: true
        }
    },
    created () {
        this.getAddress()
        // this.fetchData(true)
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        handleCategory () {
            this.form.title.value = ''
            this.form.match.value = ''
            this.errorInfo.match = {}
            this.getLeagues()
        },
        beforeSubmit () {
            if (this.openBroadcastSuccess) {
                // 结束直播
                this.closeLive()
            } else {
                this.submit()
            }
        },
        async closeLive () {
            try {
                const { code, msg } = await closeLive()
                if (code === statusCode.success) {
                    Message.success(msg)
                    this.reload()
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        selectTime () {
            this.getLeagues()
            this.fetchData()
        },
        async fetchData (isFirst) {
            const loadingBox = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            try {
                this.competitionOptions = []
                const { data, code, msg } = await getMatchesByDay({
                    leagueType: this.form.category.value,
                    leagueId: this.liveType === 'all' ? null : this.liveType,
                    // pageSize: 2000,
                    // pageNumber: 1,
                    // day: dayjs().format('YYYY-MM-DD')
                    day: this.showTime
                })
                if (code === statusCode.success) {
                    this.competitionOptions = data && data.reduce((all, item) => {
                        const showLabel = `${item.leagueChsShort} ${item.homeChs} ${item.matchId ? 'VS' : ''} ${item.awayChs}`
                        all.push({
                            ...item,
                            id: item.matchId,
                            value: item.matchId,
                            label: showLabel
                        })
                        return all
                    }, [])
                    if (isFirst) {
                        this.getAddress(isFirst)
                    }
                } else {
                    Message.error(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                loadingBox.close()
            }
        },
        async getAddress () {
            const { data, code, msg } = await getOBSAddress()
            if (code === statusCode.success) {
                this.obs = data
                if (data.live_status === 2) {
                    this.openBroadcastSuccess = true
                    this.showTime = data.match_time
                        ? dayjs(data.match_time).format('YYYY-MM-DD')
                        : dayjs().format('YYYY-MM-DD')
                    this.form.title.value = data.room_title
                    this.form.liveCover.value = data.live_cover
                    this.form.match.value = data.match_id
                    this.form.announcement.value = data.placard
                    this.liveType = data.league_id || 'all'
                    this.form.category.value = data.type
                }
            } else {
                Message.error(msg)
            }
            this.handleCategory()
            this.fetchData()
        },
        async submit () {
            const isValidate = this.validate()
            this.changeFile()
            const isCoverValidate = !!this.form.liveCover.value
            if (!isValidate || !isCoverValidate) return
            if (!this.obs) {
                Message.error('请先获取推流地址，再点击开播！')
                return
            }
            const params = {
                liveType: this.liveType,
                title: this.form.title.value,
                liveCover: this.form.liveCover.value,
                category: this.form.category.value,
                placard: this.form.announcement.value,
                videoUrl: this.form.videoUrl.value
            }
            if (this.needValidateMatch) {
                params.matchId = this.form.match.value
            }
            const { code, msg } = await startLive(params)
            if (code === statusCode.success) {
                Message.success('开播成功')
                this.openBroadcastSuccess = true
                this.$router.push({
                    name: 'PersonalCenter',
                    params: {
                        tabId: 8
                    }
                })
            } else {
                Message.error(msg)
                if (code === statusCode.notHost) {
                    // 禁播了，是否还是主播，有待商榷
                    // 重新获取detail
                    try {
                        await this.getUserInfo()
                    } catch (e) {
                        console.log('出错了')
                    }
                }
            }
        },
        changeFile () {
            this.coverError = !this.form.liveCover.value
        },
        validate () {
            const res = []
            Object.keys(this.form).forEach(key => {
                res.push(this.validateRow(key))
            })
            return res.every(x => x)
        },
        validateRow (key) {
            this.form[key].validators.forEach(validator => {
                const { message, type } = validator(this.form[key].value)
                if (message) {
                    this.errorInfo[key][type] = message
                } else {
                    this.errorInfo[key] = omit(this.errorInfo[key], type, message)
                }
            })
            this.changeKey(key)
            return isEmpty(this.errorInfo[key])
        },
        changeKey (key) {
            const flag = JSON.parse(this.form[key].updateKey.split('-')[1])
            this.form[key].updateKey = `${key}-${!flag}`
        },
        changeCategory () {
            this.liveType = 'all'
            if (this.needValidateMatch) {
                this.fetchData()
            } else {
                this.competitionOptions = []
            }
            this.handleCategory()
        },
        changeLeagueType () {
            this.form.match.value = ''
            this.fetchData()
        },
        async getLeagues () {
            try {
                this.leagueTypeOptions = [
                    {
                        id: 'all',
                        label: '全部',
                        value: 'all'
                    }
                ]
                const time = dayjs(this.showTime).format('YYYY-MM-DD')
                const { data, code } = await getLeagues(this.form.category.value, time, 4000)
                if (code === statusCode.success) {
                    data && data.forEach(item => {
                        this.leagueTypeOptions.push({
                            ...item,
                            id: item.leagueId,
                            value: item.leagueId,
                            label: item.nameChsShort
                        })
                    })
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        copyObs (value) {
            Copy(value)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.row-outer {
    width: 570px;
    .label {
        width: 80px;
        margin-right: 45px;
    }
    .content {
        line-height: 40px;
        //height: 40px;
    }
}
.league-type-row {
    width: 100% !important;
    .content {
        width: calc(100% - 150px);
    }
}
.obs {
    line-height: 25px;
}
.save-button {
    width: 138px;
    height: 47px;
    .confirm {
        background: linear-gradient(90deg, #3B5FFF, #A2B3FF);
        line-height: 47px;
        border-radius: 3px;
    }
}
::v-deep {
    .row-outer {
        .el-input__inner {
            line-height: 40px;
            //height: 40px;
        }
        .save-button {
            width: 145px;
            font-size: 16px;
            font-family: PingFang-SC-Medium;
        }
        .el-radio {
            line-height: 40px;
            width: 70px;
            display: inline-block;
        }
    }
    .info {
        .row-inner {
            max-width: 570px;
            padding-left: 30px!important;
            .label {
                width: 80px;
                line-height: 40px;
                margin-right: 45px;

            }
            .input-section {
                background-color: transparent!important;
                border: 1px solid #E2E1E1;
                border-radius: 2px;
            }
            .el-input__icon {
                line-height: 30px;
            }
            .error{
                left: 157px;
            }
        }
    }
    .time-picker{
        width: 100% !important;
        .el-input__inner {
            line-height: 45px;
            height: 45px;
        }
    }
}
</style>
