<template>
<div class="box">
    <FootballMatchStatics
        :match-id="matchId"
    />
</div>
</template>

<script>
import FootballMatchStatics from '@/views/VirtualLiveRoom/Components/FootballMatchStatics'
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
    }
}
</script>

<style scoped>

</style>
