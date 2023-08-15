<template>
    <div class="match-recomment " >
        <div class="header w-100 p-relative">
            <title-row
                icon="prize"
                title="赛事推荐"
                class="m-b-15 m-t-5"
            />
            <match-types
                class="match-types p-absolute"
                :options="types"
                :active-id.sync="activeId"
            />
        </div>
       <div class="flex ">
           <div class="match-section ">
               <MatchWithStatus
                   class="m-b-10"
                   status="2000"
                   :leagueType="activeId"
                   :key="`going-${activeId}`"
                   title="进行中的比赛"
               />
               <MatchWithStatus
                   class="m-b-10"
                   status="1000"
                   :leagueType="activeId"
                   :key="`future-${activeId}`"
                   title="未开始的比赛"
               />
               <MatchWithStatus
                   status="3000"
                   :leagueType="activeId"
                   :key="`end-${activeId}`"
                   title="已结束的比赛"
               />
           </div>
           <div class="match-score-rank h-100 m-l-10">
               <ScoreRanks />
           </div>
       </div>
    </div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import MatchTypes from '@/views/components/MatchTypes'
import MatchWithStatus from '@/views/Competition/Components/MatchWithStatus'
import ScoreRanks from '@/views/Competition/Components/ScoreRanks'
export default {
    name: 'MatchRecomment',
    components: {
        TitleRow,
        MatchTypes,
        MatchWithStatus,
        ScoreRanks
    },
    data () {
        return {
            types: [
                {
                    id: 1,
                    title: '足球',
                    key: 'football'
                },
                {
                    id: 2,
                    title: '篮球',
                    key: 'basketball'
                }
            ],
            activeId: 1
        }
    }
}
</script>

<style lang="scss" scoped>
.match-types {
    left: 150px;
    top: 5px;
}
.match-score-rank{
    width: 340px;
    height: 737px;
    border-radius: 10px;
    overflow: hidden;
}
</style>
