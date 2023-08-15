<template>
<div class="battle w-100 flex flex-wrap justify-center align-center">

    <template
        v-for="(group, groupKey) in  groupTeams"
    >
        <div
            class="PredictionBall2_list"
            :class="{
                'left-side': leftSides.includes(groupKey)
            }"
            :key="groupKey">
            <div class="PredictionBall5_listtitle">请选择本届世界杯冠军</div>
            <div class="PredictionBall5_listtopvs"></div>
            <div class="PredictionBall2_listvs">VS</div>
            <div class="PredictionBall2_item  bg-center bg-size-100 bg-no-repeat"
                 v-for="(item, itemIndex) in group"
                 :key="item.id"
                 @click="choseTeam(item, groupKey, itemIndex)"
                 :class="{
                 'is-selected': item.isSelected,
             }"
            >
                <div class="PredictionBall_icon">
                    <img :alt="item.name" :src="item.img">
                </div>
                <span>{{ item.name }}</span>
            </div>
        </div>
    </template>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/cookie'
import { groupChars } from '@/utils/utils'

export default {
    name: 'Battle1Vs1',
    data () {
        return {
            leftSides: [
                'A',
                'C',
                'E',
                'G'
            ],
            groupList: ['A/B'],
            groupTeams: {},
            stage5Res: {}
        }
    },
    created () {
        const stage5Res = getItem('stage5Res')
        this.stage5Res = stage5Res ? JSON.parse(stage5Res) : {}
        this.SET({ stage5Res: this.stage5Res })
        const isFull = Object.keys(this.stage5Res).length === 2
        this.$emit('update:canNextStep', isFull)
        this.initGroups()
    },
    computed: {
        ...mapState('commonData', ['stage4Res'])
    },
    methods: {
        initGroups () {
            // A /B , C/D  E/F G/H
            const selectIds = Object.keys(this.stage5Res).reduce((all, key) => {
                const item = this.stage5Res[key]
                all.push(item.id)
                return all
            }, [])
            this.groupTeams = this.groupList.reduce((all, item, index) => {
                const keys = item.split('/')
                const key1 = keys[0]
                const key2 = keys[1]
                const group1 = this.stage4Res[key1]
                const group2 = this.stage4Res[key2]
                const key = groupChars[index]
                all[key] = [
                    {
                        ...group1,
                        isSelected: selectIds.includes(group1.id)
                    },
                    {
                        ...group2,
                        isSelected: selectIds.includes(group2.id)
                    }
                ]
                return all
            }, {})
        },
        choseTeam (team, groupKey, itemIndex) {
            if (!team.isSelected) {
                // 之前的取消
                const optIndex = itemIndex === 0 ? 1 : 0
                this.groupTeams[groupKey][optIndex].isSelected = false
                team.isSelected = true
                this.stage5Res[groupKey] = team
            }
            setItem('stage5Res', JSON.stringify(this.stage5Res))
            this.SET({ stage5Res: this.stage5Res })
            const isFull = Object.keys(this.stage5Res).length === 2
            this.$emit('update:canNextStep', isFull)
        }
    }
}
</script>

<style lang="scss" scoped>
.PredictionBall5_listtitle {
    position: absolute;
    top: 100px;
    width: 100%;
    height: 134px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    color: #b70c3f;
}
.PredictionBall5_listtopvs {
    position: absolute;
    left: 46%;
    top: 200px;
    background-image: url('../../assets/images/worldCup/img-jiangb-h.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 49px;
    height: 134px;
}
.PredictionBall2_list {
    width: 906px;
    height: 466px;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: -65px 12px 0;
    &.left-side{
        margin-right: 12px;
    }
    .PredictionBall2_listvs {
        font-size: 30px;
        font-weight: 700;
        text-align: right;
        color: #b70c3f;
        position: absolute;
        left: 47%;
        top: 362px;
    }
    .PredictionBall2_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 220px;
        height: 220px;
        font-size: 24px;
        text-align: center;
        color: #333;
        white-space: nowrap;
        margin-top: 150px;
        border: 3px solid #e2e2e2;
        background-color: #fff;
        border-radius: 16px;
        cursor: pointer;
        &.is-selected {
            border: 2px solid #b70c3f!important;
            color: #b70c3f!important;
            background-color: #ffeff4!important;
        }
        .PredictionBall_icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 0.6px solid #eee;
        }
    }
}
</style>
