<template>
    <el-popover
        width="400"
        placement="bottom"
        popper-class="league-popper"
        v-model="show"
        :visible-arrow="false"
        trigger="click">
        <div class="select-league">
            <div class="header w-100 flex justify-around align-center">
                <span class="font-14 text-white font-400">热门赛事</span>
                <!-- <span class="font-regular is-active tab pointer font-14 font-400">按赛事</span>
                <span class="font-regular not-allowed  font-14 font-400">国家/地区</span> -->
            </div>
            <div class="body p-l-15 p-r-15">
              <template v-if="showList">
                <el-checkbox-group v-model="choseLeagues">
                  <template v-for="(arr, key) in showList">
                    <div
                        v-if="arr.length"
                        :key="key"
                        class="row p-b-10 p-t-10 flex  justify-between "
                    >
                      <span class="font-14 label-key p-t-5  d-inline-block m-r-10 font-regular text-333">{{ key }}</span>
                      <div class="flex-1 label-box flex flex-wrap ">
                        <el-checkbox
                            class="font-12 label-item p-t-5 p-b-5 m-r-0 font-regular  text-999"
                            v-for="league in arr"
                            :label="league.leagueId"
                            :key="league.leagueId">{{ league.nameChsShort }}[{{ league.matchAmount}}]</el-checkbox>
                      </div>
                    </div>
                  </template>
                </el-checkbox-group>
              </template>
            </div>
            <div class="footer flex w-100 p-r-20 align-center p-l-20">
              <div class="show-labels font-14 font-regular text-999">
                选中
                <span>{{ choseLeagues.length }}</span>/
                <span>{{ list.length}}</span>
              </div>
                <div class="flex flex-end w-100 align-center">
                    <el-button class="button p-0 font-regular font-16" @click="checkAll">全选</el-button>
                    <el-button class="button p-0 font-regular font-16" @click="checkReverse">反选</el-button>
                    <el-button class="button p-0 font-regular font-16" @click="confirmChose">确定</el-button>
                </div>
            </div>
        </div>
        <el-button class="button button-opt p-0 p-l-5 p-r-5 font-regular font-16" slot="reference" >
            赛事
            <i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
    </el-popover>
</template>

<script>
import { getLeagues, getOddsLeagues } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import { pinyin } from 'pinyin-pro'
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
export default {
    name: 'LeagueSelect',
    props: {
        leagueType: {
            type: [Number, String],
            default: 1
        },
        leagues: {
            type: Array,
            default: () => []
        },
        day: {
            type: String,
            default: null
        },
        isOdds: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            show: false,
            labels: [],
            list: [],
            choseLeagues: [],
            showList: {},
            thirdList: []
        }
    },
    computed: {
        allIds () {
            return this.list.reduce((all, item) => {
                all.push(item.leagueId)
                return all
            }, [])
        },
        fetchParams () {
            return {
                leagueType: this.leagueType,
                day: this.day
            }
        },
        firstLevelLeague () { // 一级联赛
            return this.list.reduce((all, item) => {
                if (item.hierarchy === 1) {
                    all.push(item.leagueId)
                }
                return all
            }, [])
        },
        secondLevelLeague () { // 2级联赛
            return this.list.reduce((all, item) => {
                if (item.hierarchy === 2) {
                    all.push(item.leagueId)
                }
                return all
            }, [])
        }
    },
    watch: {
        fetchParams: {
            handler () {
                this.init()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        ...mapMutations('competition', ['SET']),
        refreshLeagues () {
            this.choseLeagues = this.allIds
            this.$emit('update:leagues', this.choseLeagues)
        },
        confirmChose () {
            this.$emit('update:leagues', this.choseLeagues)
            // 发布方案时用到了
            this.$emit('updateLeagues')
            this.show = false
        },
        async init () {
            try {
                this.SET({
                    gettingLeagues: true
                })
                const day = this.day ? this.day : dayjs().format('YYYY-MM-DD')
                const request = this.isOdds ? getOddsLeagues : getLeagues
                const { data, code } = await request(this.leagueType * 1, day, null, '1,2,3')
                if (code === statusCode.success) {
                    this.list = data
                    this.handleData()
                    this.SET({
                        gettingLeagues: false
                    })
                    this.handleDefault()
                }
            } catch (e) {
                console.log('出差了')
            }
        },
        handleDefault () {
            // this.choseLeagues =
            //     (this.firstLevelLeague.length && this.firstLevelLeague) ||
            //     (this.secondLevelLeague.length && this.secondLevelLeague) || []
            this.choseLeagues = this.allIds
            this.confirmChose()
        },
        handleData () {
            const label = 'abcdefghijklmnopqrstuvwxyz'
            this.labels = label.split('')
            const list = this.labels.reduce((all, key) => {
                const tempKey = key.toUpperCase()
                all[tempKey] = []
                return all
            }, {})
            this.showList = this.list.reduce((all, item) => {
                // const key = pinyin(item.nameChsShort, { style: 'FIRST_LETTER' })[0][0].charAt(0).toUpperCase()
                const key = pinyin(item.nameChsShort,
                    { pattern: 'first', type: 'array', toneType: 'none' }
                )[0].toUpperCase()
                if (item.hierarchy === 3) {
                    this.thirdList.push(item.leagueId)
                }
                all[key].push(item)
                return all
            }, { ...list })
            this.SET({ thirdLeagueList: this.thirdList })
        },
        checkAll () {
            this.choseLeagues = this.allIds
        },
        checkReverse () {
            const tempList = this.allIds.filter(x => {
                return !this.choseLeagues.includes(x)
            })
            this.choseLeagues = tempList
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    width: 70px;
    height: 26px;
    color: #ccc;
    line-height: 22px;
    border-radius: 3px;
    border: none;
    font-weight: 400;
}
.button-opt{
  background-color: transparent!important;
}
.select-league {
    width: 360px;
    border-radius: 10px;
    .header {
        height: 38px;

        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
      .tab {
        &.is-active {
          color: #fff;
        }
      }
    }
    .footer {
        height: 63px;
        background: #FEF2E4 ;
        .button {
            width: 57px;
            color: #ccc;
            line-height: 22px;
            background-color: #FFFFFF;
            box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
            border-radius: 3px;
            border: none;
        }
    }
}
.body{
  height: 205px;
  overflow-y: auto;
  .row {
    border-bottom: 1px solid #A4DCFF;
    &:last-child {
      border:none;
    }
  }
}
.label-key{
  width: 15px;
  line-height: 20px;
}
.label-box{
  width: calc(100% - 30px);
  .label-item{
    width: 33%;
    margin-right: 0!important;
  }
}
.footer {
  .show-labels{
    width: 120px;
  }
  .button {
    width: 58px;
    height: 32px;
    color: #ccc;
    line-height: 22px;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
    border-radius: 3px;
    border: none;
    &.is-active, &:hover {
      color: #fff;
      background-color: #A05A77;
    }
  }
}
::v-deep {
  .el-checkbox__label{
    font-size: 13px;
    padding-left: 5px!important;
  }
  .el-icon--right{
    margin-left: 0;
  }
}
</style>
