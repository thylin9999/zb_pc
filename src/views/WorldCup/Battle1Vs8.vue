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

export default {
    name: 'Battle1Vs8',
    data () {
        return {
            leftSides: [
                'A',
                'C',
                'E',
                'G'
            ],
            groupList: ['A/B', 'C/D', 'E/F', 'G/H'],
            groupTeams: {},
            stage2Res: {}
        }
    },
    created () {
        const stage2Res = getItem('stage2Res')
        this.stage2Res = stage2Res ? JSON.parse(stage2Res) : {}
        this.SET({ stage2Res: this.stage2Res })
        const isFull = Object.keys(this.stage2Res).length === 8
        this.$emit('update:canNextStep', isFull)
        this.initGroups()
    },
    computed: {
        ...mapState('commonData', ['stage1Res'])
    },
    methods: {
        initGroups () {
            // A /B , C/D  E/F G/H
            const selectIds = Object.keys(this.stage2Res).reduce((all, key) => {
                const item = this.stage2Res[key]
                all.push(item.id)
                return all
            }, [])
            this.groupTeams = this.groupList.reduce((all, item) => {
                const keys = item.split('/')
                const key1 = keys[0]
                const key2 = keys[1]
                const group1 = this.stage1Res[key1].sort((a, b) => a.label > b.label)
                const group2 = this.stage1Res[key2].sort((a, b) => a.label > b.label)
                all[key1] = [{
                    ...group1[0], // A组第一名
                    isSelected: selectIds.includes(group1[0].id)
                }, {
                    ...group2[1], // B组第2名
                    isSelected: selectIds.includes(group2[1].id)
                }]
                all[key2] = [{
                    ...group1[1], // A组第2名
                    isSelected: selectIds.includes(group1[1].id)
                }, {
                    ...group2[0], // B组第1名
                    isSelected: selectIds.includes(group2[0].id)
                }]
                return all
            }, {})
        },
        choseTeam (team, groupKey, itemIndex) {
            if (!team.isSelected) {
                // 之前的取消
                const optIndex = itemIndex === 0 ? 1 : 0
                this.groupTeams[groupKey][optIndex].isSelected = false
                team.isSelected = true
                this.stage2Res[groupKey] = team
            }
            setItem('stage2Res', JSON.stringify(this.stage2Res))
            this.SET({ stage2Res: this.stage2Res })
            const isFull = Object.keys(this.stage2Res).length === 8
            this.$emit('update:canNextStep', isFull)
        }
    }
}
</script>

<style lang="scss" scoped>
.PredictionBall2_list {
    width: 467px;
    height: 100px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 12px;
    position: relative;
    &.left-side{
        margin-right: 12px;
    }
    .PredictionBall2_listvs {
        font-size: 24px;
        font-weight: 600;
        color: #b70c3f;
        position: absolute;
        left: 45%;
        top: 47%;
    }
    .PredictionBall2_item {
        font-size: 14px;
        color: #333;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 8px;
        border: 2px solid #e7e7e7;
        cursor: pointer;
        &.is-selected {
            border: 2px solid #b70c3f!important;
            color: #b70c3f!important;
            background-color: #ffeff4;
        }
        .PredictionBall_icon {
            width: 32px;
            height: 32px;
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
