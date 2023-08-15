<template>
<div class="wrap-1200">
    <title-row
        icon="gift"
        title="主播排行"
        class="m-b-15 "
    >
    <!--<more-button class="m-r-15"/>-->
    </title-row>
    <div v-if="hosts.length" class="host-section flex justify-between align-center p-t-20 p-b-20 m-b-25 bg-white w-100">
        <template >
            <div class="first-three">
                <ul class="prizes flex align-center justify-between">
                    <li
                        v-for="(host, index) in firstRank"
                        :key="host.id"
                        class="rank-item flex flex-column m-l-20 m-r-20 justify-center align-center"
                    >
                        <div class="icon p-relative bg-center flex justify-center align-center bg-no-repeat bg-size-cover" :class="`rank-${index}`">
                            <div
                                class="avatar border-radius-50  bg-center bg-no-repeat "
                                :class="{ 'bg-size-cover': !host.hasNoBg, 'bg-auto': host.hasNoBg}"
                                :style="{
                                backgroundImage: `url(${host.bgImg})`,
                            }"
                            ></div>
                            <span class="p-absolute bg-center bg-no-repeat bg-size-cover name font-14 d-inline-block w-100 text-center" >{{ host.anchor_name }}</span>
                        </div>
                        <custom-span
                            class="font-14 text-888 text-center w-100 m-t-25 m-b-10"
                            :content="host.sign"
                        />
                        <span
                            class="subscribe-button text-center font-16 pointer"
                            :class="{'is-subscribed': host.isSubscribe }"
                            v-throttle="[()=>followOrUnFollowHost(host),3000]"
                        >{{ host.isSubscribe ? '已订阅' : '订阅'}}</span>
                    </li>
                </ul>
            </div>
            <div class="left-host">
                <ul class="w-100">
                    <li
                        v-for="host in leftRank"
                        :key="host.id"
                        class="flex  host-item align-center"
                    >
                        <div class="left-section flex align-center">
                            <div
                                class="icon border-radius-50 m-r-10 bg-no-repeat bg-center bg-size-cover"
                                :style="{
                                backgroundImage: `url(${host.bgImg})`
                            }"
                            ></div>
                            <div class="flex host-info flex-column ">
                                <span class="font-16 host-name font-regular">{{ host.anchor_name }}</span>
                                <custom-span
                                    class="font-12 m-t-10 text-888 w-100"
                                    :content="host.sign"
                                />
                            </div>
                        </div>
                        <span
                            class="subscribe-button text-center font-16 pointer"
                            :class="{'is-subscribed': host.isSubscribe }"
                            v-throttle="[()=>followOrUnFollowHost(host),3000]"
                        >{{ host.isSubscribe ? '已订阅' : '订阅'}}</span>
                    </li>
                </ul>
            </div>
        </template>

    </div>
    <el-empty
        v-else
        :image-size="108"
        description="暂无数据" />
</div>
</template>

<script>
import TitleRow from '@/components/TitleRow'
import CustomSpan from '@/components/CustomSpan'
import { getHostRank, followHost } from '@/api/Host/Host'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
export default {
    name: 'HostRank',
    components: {
        TitleRow,
        CustomSpan
    },
    data () {
        return {
            hosts: []
        }
    },
    computed: {
        ...mapState('user', ['token']),
        firstRank () {
            return this.hosts.slice(0, 3)
        },
        leftRank () {
            return this.hosts.slice(3)
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data } = await getHostRank()
                console.log(data, 'data')
                this.hosts = data ? data.reduce((all, item) => {
                    all.push({
                        ...item,
                        isSubscribe: item.is_follow === 1,
                        sign: item.sign ? item.sign : '暂无介绍',
                        hasNoBg: !item.logo,
                        bgImg: item.logo ? item.logo : require('../assets/images/common/host-empty.png')
                    })
                    return all
                }, []) : []
            } catch (e) {
                console.log('出错了')
            }
        },
        async followOrUnFollowHost (host) {
            if (!this.token) {
                Message.error('请先登录，无法预约！')
                this.openLoginDialogMixin()
                return
            }
            try {
                const { msg } = await followHost(host.member_id)
                Message.success(msg)
                this.fetchData()
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.host-section {
    height: 220px;

    .first-three {
        width: 714px;
        border-right: 1px solid #B9B9B9;
        .rank-item {
            width: 192px;
        }
        .rank-0 {
            background-image: url('../assets/images/host/gold.png');
            .name {
                background-image: url('../assets/images/host/gold-name.png');
                color: #907A10;
            }
        }
        .rank-1 {
            background-image: url('../assets/images/host/silver.png');
            .name {
                background-image: url('../assets/images/host/silver-name.png');
                color: #7B7B7B;
            }
        }
        .rank-2 {
            background-image: url('../assets/images/host/bronze.png');
            .name {
                background-image: url('../assets/images/host/bronze-name.png');
                color: #A76830;
            }
        }
        .avatar {
            width: 90px;
            height: 90px;
            &.bg-auto{
                background-size: 40px 55px;
            }
        }
        .icon {
            width: 101px;
            height: 106px;
        }
        .name {
            bottom: -10px;
            width: 104px;
            height: 30px;
            line-height: 30px;
        }
    }
    .left-host {
        width: calc(100% - 715px);
        padding: 0 20px 0 30px;
        .host-item {
            margin: 12.5px 0;

        }
        .left-section {
            width: calc(100%  - 120px);
            .host-info {
                width: calc(100% - 65px);
            }
            .host-name{
                line-height: 16px;
                color: #444343;
            }
            .icon {
                width: 49.5px;
                height: 47.5px;
            }
        }
    }
    .subscribe-button {
        color: #05195A;
        font-weight: 400;
        line-height: 30px;
        width: 120px;
        height: 30px;
        border-radius: 16px;
        border: 1px solid #05195A;
        &.is-subscribed {
            color: #6B6B6B;
            border: 1px solid #6B6B6B;
        }
        &:hover {
            background-color: #05195A;
            color: #fff;
        }
    }
}
</style>
