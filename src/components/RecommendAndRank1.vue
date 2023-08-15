<template>
    <div class="wrap-1450 recommends flex-1 m-t-25 flex justify-between ">
        <div class="host-recommend m-b-20">
            <div class="flex align-center ">
                <tab-title title="直播推荐" />
                <competition-tab
                    class="m-l-30 p-l-10"
                    :cast-id.sync="castId"
                    @changeBroadcastType="changeBroadcastType"
                />
            </div>
            <div class="competition-list p-15 m-t-15">
                <ul class="w-100 flex flex-wrap" v-if="competitions.length">
                    <li
                        class="m-l-5 m-r-5 p-t-15 p-b-15"
                        v-for="competition in competitions"
                        :key="competition.id"
                    >
                        <competition-card
                            :competition-info="competition"
                        />
                    </li>
                </ul>
                <el-empty
                    v-else
                    :image-size="108"
                    description="暂无数据" />
            </div>
        </div>
        <div class="host-rank">
            <host-rank />
        </div>
    </div>
</template>

<script>
import TabTitle from '@/components/TabTitle'
import CompetitionTab from '@/components/CompetitionTab'
import CompetitionCard from '@/components/CompetitionCard'
import HostRank from '@/components/HostRank'
import { getCompetitions } from '@/api/competition/competition'
export default {
    name: 'RecommendAndRank',
    components: {
        HostRank,
        CompetitionTab,
        TabTitle,
        CompetitionCard
    },
    data () {
        return {
            competitions: [],
            castId: 1
        }
    },
    created () {
        this.getCompetitions()
    },
    methods: {
        changeBroadcastType () {
            this.getCompetitions()
        },
        async getCompetitions () {
            const { data } = await getCompetitions()
            this.competitions = data
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.recommends {
    .host-recommend {
        width: 950px;
        .competition-list {
            width: 950px;
            background-color: $text-white;
        }
    }
    .host-rank {
        width: 240px;
    }

}
</style>
