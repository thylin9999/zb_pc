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
    name: 'Battle1Vs2',
    data () {
        return {
            leftSides: [
                'A',
                'C',
                'E',
                'G'
            ],
            groupList: ['A/B', 'C/D'],
            groupTeams: {},
            stage4Res: {}
        }
    },
    created () {
        const stage4Res = getItem('stage4Res')
        this.stage4Res = stage4Res ? JSON.parse(stage4Res) : {}
        this.SET({ stage4Res: this.stage4Res })
        const isFull = Object.keys(this.stage4Res).length === 2
        this.$emit('update:canNextStep', isFull)
        this.initGroups()
    },
    computed: {
        ...mapState('commonData', ['stage3Res'])
    },
    methods: {
        initGroups () {
            // A /B , C/D  E/F G/H
            const selectIds = Object.keys(this.stage4Res).reduce((all, key) => {
                const item = this.stage4Res[key]
                all.push(item.id)
                return all
            }, [])
            this.groupTeams = this.groupList.reduce((all, item, index) => {
                const keys = item.split('/')
                const key1 = keys[0]
                const key2 = keys[1]
                const group1 = this.stage3Res[key1]
                const group2 = this.stage3Res[key2]
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
                this.stage4Res[groupKey] = team
            }
            setItem('stage4Res', JSON.stringify(this.stage4Res))
            this.SET({ stage4Res: this.stage4Res })
            const isFull = Object.keys(this.stage4Res).length === 2
            this.$emit('update:canNextStep', isFull)
        }
    }
}
</script>

<style lang="scss" scoped>
.PredictionBall2_list {
    width: 946px;
    height: 212px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 12px;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 8px;
    &.left-side{
        margin-right: 12px;
    }
    .PredictionBall2_listvs {
        font-size: 30px;
        font-weight: 600;
        text-align: right;
        color: #b70c3f;
        position: absolute;
        left: 47%;
        top: 47%;
    }
    .PredictionBall2_item {
        font-weight: 700;
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 140px;
        height: 140px;
        border-radius: 16px;
        border: 2px solid #e2e2e2;
        background-color: #fff;
        cursor: pointer;
        &.is-selected {
            border: 2px solid #b70c3f!important;
            color: #b70c3f!important;
            background-color: #ffeff4!important;
        }
        .PredictionBall_icon {
            width: 50px;
            height: 50px;
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
