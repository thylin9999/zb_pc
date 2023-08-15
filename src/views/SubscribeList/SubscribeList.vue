<template>
<div class="subscribe-page p-t-20">
    <online-broadcast />
    <not-subscribe-broadcast class="m-t-20 w-100" />
    <recommend-and-rank class="w-100"/>
</div>
</template>

<script>
import OnlineBroadcast from '@/views/SubscribeList/OnlineBroadcast'
import NotSubscribeBroadcast from '@/views/SubscribeList/NotSubscribeBroadcast'
import RecommendAndRank from '@/components/RecommendAndRank'
export default {
    name: 'SubscribeList',
    components: {
        OnlineBroadcast,
        NotSubscribeBroadcast,
        RecommendAndRank
    }
}
</script>

<style lang="scss" scoped>
.subscribe-page {
    padding-left: 55px;
    padding-right: 30px;
}
@media screen and (max-width: 1350px) {
    .subscribe-page {
        padding: 0 10px!important;
    }
}
@media screen and (max-width: 1225px) {
    .subscribe-page {
        padding: 0 !important;
    }
}
</style>
