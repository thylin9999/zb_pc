<template>
<div class="box">
    <FootballMatchStatics
        v-if="isFootball"
        :match-id="matchId"
    />
</div>
</template>

<script>
import FootballMatchStatics from '@/views/LiveRoom/Components/FootballMatchStatics'
export default {
    name: 'MatchStatics',
    components: {
        FootballMatchStatics
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        isFootball () {
            return this.matchInfo && this.matchInfo.leagueType === 1
        }
    }
}
</script>

<style scoped>

</style>
