<template>
<div class="">
    <MatchStatics />
</div>
</template>

<script>
import MatchStatics from '@/views/VirtualLiveRoom/Components/MatchStatics'
export default {
    name: 'FootballDetail',
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        MatchStatics
    }
}
</script>

<style scoped>

</style>
