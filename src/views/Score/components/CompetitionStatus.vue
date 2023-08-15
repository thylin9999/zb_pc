<template>
<div class="box flex align-center p-relative">
    <template
        v-for="menu in menus"
    >
        <el-button
            @click.native="changeStatus(menu)"
            :key="menu.id"
            class="button p-0 font-regular m-l-5 m-r-5 font-16"
            :class="{
                'is-active': menu.id === competitionStatus
            }">
            {{ menu.title }}
        </el-button>
    </template>
</div>
</template>

<script>
export default {
    name: 'CompetitionStatus',
    props: {
        competitionStatus: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            menus: [
                {
                    id: 1,
                    title: '即时'
                },
                {
                    id: 3,
                    title: '赛果'
                },
                {
                    id: 2,
                    title: '赛程'
                }
                // {
                //     id: 4,
                //     title: '收藏'
                // }
            ]
        }
    },
    methods: {
        changeStatus (menu) {
            this.$emit('update:competitionStatus', menu.id)
            this.$emit('updateDay')
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 198px;
    height: 32px;
    background: #FFFFFF;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);
    border-radius: 3px;
    &:before, &:after {
        position: absolute;
        content: '';
        height: 22px;
        width: 1px;
        top: 5px;
        background-color: #CCCCCC;
    }
    &:before {
        left: 66px;
    }
    &:after {
        right: 66px;
    }
}
.button {
    width: 58px;
    height: 26px;
    color: #ccc;
    line-height: 26px;
    border-radius: 3px;
    border: none;
    &.is-active, &:hover {
        color: #fff;
        background-color: #A05A77;
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.13);

    }
}
::v-deep {
    .el-button+.el-button {
        margin-left: 0;
    }
}
</style>
