<template>
<div class="card">
    <div class="cover bg-center bg-no-repeat bg-size-cover"
        :style="{
            backgroundImage: `url(${competition.cover})`
        }"
    ></div>
    <div class="info flex flex-column bg-white p-l-15 p-t-20 p-b-20">
        <span class="title font-20 m-b-5 font-regular font-500 text-5e">【赛事前瞻】</span>
        <span class="time font-16 text-5e font-regular font-500">背景时间6月18日 {{ competition.time }}</span>
        <span class="info font-16 text-5e font-regular font-500">{{ competition.title }}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'CompetitionCard',
    props: {
        competition: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    border-radius: 10px;
    overflow: hidden;
}
.cover {
    width: 340px;
    height: 255px;
}
.info {
    line-height: 20px;
}
</style>
