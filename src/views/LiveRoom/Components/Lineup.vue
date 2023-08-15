<template>
<div class="lineup-box p-b-15 p-relative">
    <div class="plat-lineup  bg-no-repeat p-absolute bg-size-cover bg-center">
        <template>
            <template v-for="members in  homeMembers">
                <member
                    :key="member.id"
                    v-for="member in members"
                    is-home
                    :member="member"
                />
            </template>
        </template>
        <template>
            <template v-for="members in  awayMembers">
                <member
                    :key="member.id"
                    v-for="member in members"
                    :is-home="false"
                    :member="member"
                />
            </template>
        </template>
    </div>
    <div class="battle-info m-t-20 w-100 flex justify-between" v-if="competitionData">
        <div class="left">
            <div class="home flex  align-center">
                <div
                    class="icon border-radius-50 m-r-10"
                ></div>
                <span>{{ competitionData.homeNameChs }}</span>
            </div>
            <div class="m-t-10 m-b-15 font-16 font-regular font-400">
                阵型: {{ homeLineup  }}
            </div>
            <div class="backup p-l-10 text-left font-18 font-medium text-333">
                替补名单
            </div>
        </div>
        <div class="right">
            <div class="away flex  align-center">
                <span>{{ competitionData.awayNameChs }}</span>
                <div class="icon border-radius-50 m-l-10"></div>
            </div>
            <div class="m-t-10 m-b-15 font-16 font-regular font-400">
                阵型: {{ awayLineup }}
            </div>
            <div class="backup p-r-10 text-right font-18 font-medium text-333">
                替补名单
            </div>
        </div>
    </div>
    <div class="battle-backup m-t-10">
        <template
            v-for="n in backupMaxCount"
        >
            <div class="row p-10 flex justify-between align-center" :key="`row-${n}`">
                <template>
                    <div class="left-member flex align-center" v-if="homeBackups[n-1]">
                        <span class="number">{{ homeBackups[n-1].number }}</span>
                        <div class="icon m-l-10 m-r-10 bg-center bg-no-repeat bg-size-cover"
                             :style="{
                            backgroundImage: `url(${homeBackups[n-1].photo})`
                        }"
                        ></div>
                        <div class="member-info flex flex-column ">
                            <span class="font-14 name font-regular text-333 font-400">{{ homeBackups[n-1].nameChs}}</span>
                            <span class="font-12 font-regular font-400 text-999">{{ homeBackups[n-1].positionChs }}</span>
                        </div>
                    </div>
                    <div v-else class="left-member flex align-center visibility-hidden"></div>
                </template>
                <template>
                    <div class="right-member flex align-center" v-if="awayBackups[n-1]">
                        <div class="member-info flex flex-column text-right">
                            <span class="font-14 name font-regular text-333 font-400">{{ awayBackups[n-1].nameChs}}</span>
                            <span class="font-12 font-regular font-400 text-999">{{ awayBackups[n-1].positionChs }}</span>
                        </div>
                        <div class="icon m-l-10 m-r-10 bg-center bg-no-repeat bg-size-cover"
                             :style="{
                            backgroundImage: `url(${awayBackups[n-1].photo})`
                        }"
                        ></div>
                        <span class="number">{{ awayBackups[n-1].number }}</span>
                    </div>
                    <div v-else class="left-member flex align-center visibility-hidden"></div>
                </template>
            </div>
        </template>
    </div>
</div>
</template>

<script>
import { getLineup } from '@/api/competition/competition'
import { statusCode } from '@/utils/statusCode'
import Member from '@/views/LiveRoom/Components/Member'
export default {
    name: 'Lineup',
    components: {
        Member
    },
    props: {
        matchId: {
            type: [Number, String],
            default: ''
        }
    },
    data () {
        return {
            competitionData: null,
            playGroundSize: {
                w: 800,
                h: 360,
                offsetHorization: 40, // 水平的外间距
                offsetVertical: 15, // 竖向外间距
                sectionW: 310,
                sectionH: 330
            },
            memberSize: {
                w: 50,
                h: 50
            },
            homeMembers: {},
            awayMembers: {},
            backupMaxCount: 0

        }
    },
    computed: {
        homeBackups () {
            return this.competitionData && this.competitionData.homeBackup
        },
        awayBackups () {
            return this.competitionData && this.competitionData.awayBackup
        },
        homeLineup () {
            return this.competitionData.homeArray.split('').join('-')
        },
        awayLineup () {
            return this.competitionData.awayArray.split('').join('-')
        }
    },
    created () {
        this.getLineup()
    },
    methods: {
        async getLineup () {
            try {
                const { code, data } = await getLineup(this.matchId)
                if (code === statusCode.success) {
                    this.competitionData = data
                    // 处理 主队 阵容，及位置
                    this.homeMembers = this.handleLineup(data.homeLineup, true)
                    this.awayMembers = this.handleLineup(data.awayLineup, false)
                    // 处理 替补
                    this.backupMaxCount = Math.max(data.homeBackup.length, data.awayBackup.length)
                    console.log(this.backupMaxCount, 'this.backupMaxCount')
                }
            } catch (e) {
                console.log(e)
            }
        },
        handleLineup (list, isHome) {
            // 布局 宽800 * 360
            // 左右守门员 距离底部 40px ,自身30px
            // 人员宽高 30 * 50 （包含底部20px的人名）
            // 主队 isHome true
            let count = 0
            const info = list.reduce((all, item) => {
                const key = item.positionId
                if (!all[key]) {
                    all[key] = []
                    count++
                }
                all[key].push(item)
                return all
            }, {})
            // 需要知道有几列
            Object.keys(info).forEach(key => {
                const members = info[key]
                if (key === '0') {
                    // 守门员
                    const position = {
                        x: isHome ? this.playGroundSize.offsetHorization : this.playGroundSize.w - this.playGroundSize.offsetHorization - this.memberSize.w,
                        y: (this.playGroundSize.h - this.memberSize.h) / 2
                    }
                    members.forEach(member => {
                        member.position = { ...position }
                    })
                } else {
                    // 非守门员, 主队是这样
                    // 根据列数来计算位置
                    const horizationGap = Math.floor((this.playGroundSize.sectionW - this.memberSize.w * (count - 1)) / (count))
                    let memberX = 0
                    if (isHome) {
                        memberX = key * horizationGap + key * this.memberSize.w + this.playGroundSize.offsetHorization
                    } else {
                        // 客队
                        const x = key * horizationGap + key * this.memberSize.w + this.playGroundSize.offsetHorization
                        const gap = this.playGroundSize.w / 2 - x - this.memberSize.w
                        memberX = x + 2 * gap + this.memberSize.w
                    }
                    // 计算纵向坐标
                    const verticalCount = members.length * 1
                    const verticalGap = Math.floor((this.playGroundSize.sectionH - this.memberSize.w * verticalCount) / (verticalCount + 1))
                    members.forEach((item, index) => {
                        const y = verticalGap * (index * 1 + 1) + index * this.memberSize.h + this.playGroundSize.offsetVertical
                        item.position = {
                            x: memberX,
                            y
                        }
                    })
                }
            })
            return { ...info }
        }
    }
}
</script>

<style lang="scss" scoped>
.lineup-box {
    width: 1000px;
    margin: 0 auto;
    min-height: 800px;
    .battle-info{
        .icon {
            width: 35px;
            height: 35px;
            background-color: #C8CFED;
        }
        .backup{
            line-height: 20px;
            border-radius: 2px;
        }
        .left {
            .backup {
                border-left: 4px solid #4164FF;
            }
        }
        .right {
            .backup {
                border-right: 4px solid #4164FF;
            }
        }
    }
    .battle-backup{
        .row {
            border-bottom: 1px solid #E9E9E9;
        }
        .number {
            width: 30px;
            text-align: center;
        }
        .icon {
            width: 30px;
            height: 30px;
            background-color: #D8D8D8;
            border-radius: 50%;
        }
        .name-info {
            .name {
                width: 100px;
            }
        }
    }
}
.plat-lineup {
    width: 800px;
    height: 360px;
    left: 100px;
    top: 220px;
    transform-origin: center;
    transform: rotate(90deg);
    background-image: url('../../../assets/images/live-room/plate-bg.png');
}
</style>
