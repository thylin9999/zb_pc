<template>
<div class="card">
    <div
        class="competition-mask w-100 bg-center bg-no-repeat p-relative"
        :class="{
            'bg-size-auto': !competitionInfo.live_cover,
            'bg-size-cover': competitionInfo.live_cover
        }"
        :style="{
            backgroundImage: `url(${bgImg})`
        }"
    >
        <span class="live-icon d-inline-block bg-center bg-no-repeat p-absolute"></span>
        <div class="mask w-100 h-100 pointer p-relative" :style="maskBg" @click="goLiveRoom">

        </div>
    </div>
    <div class="competition-info p-l-10 p-r-10 font-regular">
        <div class="battle-info p-t-10 font-16 text-333 flex justify-between align-center font-regular">
            <span>{{ competitionInfo.room_title }}</span>
        </div>
        <div class="host-info flex m-t-5 m-b-10 justify-between align-center font-regular text-gray font-14">
            <span>{{ competitionInfo.nick }}</span>
            <span>
            <svg-icon class="icon-10" icon-class="fire"></svg-icon>
            <span>{{ competitionInfo.heat_num }}</span>
        </span>
        </div>
    </div>

</div>
</template>

<script>
export default {
    name: 'CompetitionCard',
    props: {
        competitionInfo: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        bgImg () {
            return this.competitionInfo.live_cover
                ? 'https://file.wanmeiyx.com/images/liveScreenShot/live_cover_sd-1-3680754.jpg'
                : require('../assets/images/common/host-blank.png')
        },
        maskBg () {
            return {
                backgroundImage: `url(${process.env.VUE_APP_START_BUTTON})`
            }
        }
    },
    methods: {
        goLiveRoom () {
            // this.$router.push("/liveRoom")
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: this.competitionInfo.room_id }
            })
            window.open(href, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.card {
    width: 220px;
    .competition-info {
        border: 1px solid $border-color1;
        border-top: none;
        .battle-info {
            line-height: 24px;
        }
        .host-info {
            line-height: 20px;
        }
    }
    .competition-mask {
        height: 120px;
        background-color: #f2f2f2;
        .live-icon {
            right: 5px;
            top: 5px;
            width: 17px;
            height: 11px;
            background-image: url('../assets/images/common/live.png');
            background-size: 100% 100%;
            z-index: 2;
        }
        .mask {
            background-color: rgba(0,0,0,.7);
            display: none;
            background-size: auto;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 3;
        }
    }
    &:hover {
        .competition-mask .mask {
            display: block;
        }
    }
}
</style>
