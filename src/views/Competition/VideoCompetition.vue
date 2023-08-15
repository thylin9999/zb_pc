<template>
<div class="wrap-1450">
    <title-row
        icon="prize"
        title="视频赛事"
    >
        <more-button />
    </title-row>
    <div class="m-t-25 m-b-20">
        <ul class="flex justify-between align-center">
            <li
                v-for="competition in competitions"
                :key="competition.id"
            >
                <competition-card
                    :competition="competition"
                />
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import MoreButton from '@/components/MoreButton'
import CompetitionCard from './CompetitionCard'
import { getVideoCompetitions } from '@/api/competition/competition'

export default {
    name: 'VideoCompetition',
    components: {
        TitleRow,
        MoreButton,
        CompetitionCard
    },
    data () {
        return {
            competitions: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data } = await getVideoCompetitions()
                this.competitions = data
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style scoped>

</style>
