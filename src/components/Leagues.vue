<template>
<div class="list w-100 m-t-15" v-if="currentTypes.length">
    <ul class="w-100 flex flex-wrap">
        <li
            v-for="type in showTypes"
            :key="type.leagueId"
            class="type-item text-center m-l-5 m-t-5"
            :class="{
                'is-active': leagueId === type.leagueId && showHighLight,
                'is-live-room': isLiveRoom
            }"
            @click="changeLeague(type)"
        >
            <custom-span class="w-100 font-12" :content="type.nameChsShort" />
        </li>
        <li
            v-if="showExpand"
            class="text-center w-100 m-l-5 m-t-10 expand font-300 font-12  text-center"
            :class="{
                'is-live-room': isLiveRoom
            }"
            @click="showAll = !showAll"
        >
            <span>{{ showAll ? '收起' : '展开'}}</span>
            <i :class="showAll ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </li>
    </ul>
</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
import { mapState } from 'vuex'
export default {
    name: 'Leagues',
    components: {
        CustomSpan
    },
    props: {
        isLiveRoom: {
            type: Boolean,
            default: false
        },
        type: {
            type: [Number, String],
            default: 1
        },
        leagueId: {
            type: [Number, String],
            default: null
        },
        showHighLight: {
            type: Boolean,
            default: false
        },
        hasThird: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            types: [],
            showAll: false
        }
    },
    computed: {
        ...mapState('commonData', ['leagueTypes']),
        currentTypes () {
            return this.leagueTypes[this.type] || []
        },
        showTypes () {
            const types = this.leagueTypes[this.type] || []
            const hasOthers = types.some(x => x.isOther)
            if (this.hasThird && !hasOthers) {
                types.push({
                    nameChsShort: '其他',
                    leagueId: `other-${this.type}`,
                    isOther: true
                })
            }
            // 先展示6排 6 * 2
            return this.showAll ? types : types.slice(0, 12)
        },
        showExpand () {
            return this.currentTypes.length > 12
        }
    },
    methods: {
        changeLeague (type) {
            this.$emit('update:leagueId', type.leagueId)
            this.$emit('changeLeagueId')
        }
    }
}
</script>

<style lang="scss" scoped>
.type-item{
    color: #ccc;
    width: 85px;
    height: 30px;
    line-height: 30px;
    background-color: #F1F2F5;
    border-radius: 5px;
    &.is-active, &:hover {
        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
        background-color: transparent;
        color: #fff;
    }
    &.is-live-room {
        background-color: rgba(0,0,0,0.2);
    }
}
.expand {
    background-color: #F1F2F5;
    line-height: 30px;
    color: #ccc;
    //width: calc(100% - 5px);
    margin: 10px auto 0;
    border-radius: 5px;
    &.is-live-room {
        font-size: 12px;
        background-color: rgba(0,0,0,0.2);
    }
}
</style>
