<template>
    <div class="live-cast p-b-30">
        <div class="content info font-16 font-regular text-333">

            <select-with-error
                class="m-b-20 m-t-25"
                showLabel
                :label="form.category.label"
                :error-info="errorInfo.category"
                :row-info.sync="form.category"
                :key="form.category.updateKey"
                :options="categoryOptions"
            />
            <div v-if="needValidateMatch" class="flex align-center m-b-20 m-t-25 ">
                <input-with-error
                    disabled
                    class="flex-1"
                    showLabel
                    :label="form.match.label"
                    :error-info="errorInfo.match"
                    :row-info.sync="form.match"
                    @validate="validateRow"
                    :key="form.match.updateKey"
                />
                <competition-select
                    class="m-l-10"
                    :category.sync="form.category.value"
                    :live-type.sync="liveType"
                    :time.sync="showTime"
                    :id.sync="matchId"
                    :idStr.sync="form.match.value"
                    is-book
                />
            </div>

            <input-with-error
                class="m-b-20 m-t-25"
                showLabel
                :label="form.title.label"
                :error-info="errorInfo.title"
                :row-info.sync="form.title"
                @validate="validateRow"
                :key="form.title.updateKey"
            />

            <UploadWithError
                class="m-b-30 m-t-25"
                showLabel
                :max-size="300"
                file-type="cover"
                :label="form.liveCover.label"
                :row-info.sync="form.liveCover"
                @changeFile="changeFile"
                :show-error="coverError"
            />
            <div class="row-outer flex align-center p-l-30 m-b-20">
            <span class="label"></span>
                <div class="save-button font-medium font-16">
                <span
                    class="font-16 d-inline-block p-t-10 p-b-10 p-l-20 p-r-20 pointer"
                    @click="submit"
                >直播预约</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputWithError from '@/components/Form/InputWithError'
import SelectWithError from '@/components/Form/SelectWithError'
import UploadWithError from '@/components/Form/UploadWithError'
import CompetitionSelect from './CompetitionSelect.vue'
import { isRequire } from '@/utils/validator'
import { isEmpty, omit } from '@/utils/lodashUtil'
import { bookMatches } from '@/api/Host/Host'
import { matchTypeMap } from '@/utils/utils'
import { Message } from 'element-ui'
import { statusCode } from '@/utils/statusCode'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
    name: 'BookLiveBroadCast',
    components: {
        InputWithError,
        SelectWithError,
        UploadWithError,
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
                match: {
                    label: '赛事选择',
                    value: '',
                    key: 'match',
                    validators: [],
                    validateLabel: ['isRequire'],
                    updateKey: 'match-false'
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
            matchId: null,
            coverError: false,
            competitionOptions: [],
            showTime: dayjs().format('YYYY-MM-DD')
        }
    },
    computed: {
        ...mapState('commonData', ['broadcastTypes']),
        needValidateMatch () {
            return [1, 2].includes(this.form.category.value)
        },
        leagueId () {
            return matchTypeMap[this.form.category.value]
        },
        categoryOptions () {
            return this.broadcastTypes.reduce((all, item) => {
                if (item.id < 3) {
                    all.push({
                        ...item,
                        value: item.id,
                        label: item.title.slice(0, 2)
                    })
                }
                return all
            }, [])
        }
    },
    methods: {
        async submit () {
            const isValidate = this.validate()
            this.changeFile()
            const isCoverValidate = !!this.form.liveCover.value
            if (!isValidate || !isCoverValidate) return
            const params = {
                title: this.form.title.value,
                cover: this.form.liveCover.value,
                leagueType: this.form.category.value
            }
            if (this.needValidateMatch) {
                params.matchId = this.matchId
            }
            const { code, msg } = await bookMatches(params)
            if (code === statusCode.success) {
                Message.success(msg)
                this.$router.push({
                    name: 'PersonalCenter',
                    params: {
                        tabId: 8
                    }
                })
            } else {
                Message.error(msg)
            }
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
        changeFile () {
            this.coverError = !this.form.liveCover.value
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
    margin-left: 155px;
    line-height: 25px;
}
.save-button {
    span {
        background-color: #A05A77;
        color: $text-white;
        border-radius: 4px;
        &:hover {
            opacity: 0.7;
        }
    }
}
::v-deep {
    .row-outer {
        .el-input__inner {
            line-height: 40px;
            height: 40px;
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
    .el-input__icon{
        line-height: 45px!important;
    }
}
</style>
