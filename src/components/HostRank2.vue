<template>
<div class="rank-list w-100">
    <tab-title title="主播排行" />
    <div class="list w-100 overflow-y-auto m-t-15 p-b-5 flex flex-column">
        <ul class="w-100">
            <li
                v-for="(host, index) in hosts"
                :key="host.id"
                class="flex align-center p-t-25 p-b-25"
            >
                <span
                    class="rank-num d-inline-block bg-center bg-no-repeat text-center font-16 font-regular"
                    :class="{'show-flag': index <= 2 }">{{ index + 1}}</span>
                <host-icon
                    class="m-l-10 m-r-5"
                    :img="host.img"
                />
                <div class="host flex flex-column font-16 font-regular m-r-15">
                    <span class="text-333 line-height-22">{{ host.name }}</span>
                    <div class="flex align-center">
                        <span class="star d-inline-block bg-no-repeat bg-center"></span>
                        <span class="font-12 m-l-5 text-gray line-height-17">{{ host.subscribe }}</span>
                    </div>
                </div>
                <subscribe-button
                    :is-subscribe="host.isSubscribe"
                />
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import TabTitle from '@/components/TabTitle'
import SubscribeButton from '@/components/SubscribeButton'
import HostIcon from '@/components/HostIcon'
import { getHosts } from '@/api/Host/Host'

export default {
    name: 'HostRank',
    components: {
        TabTitle,
        SubscribeButton,
        HostIcon
    },
    data () {
        return {
            defaultImg: 'https://cdn.podapi.com/image/avatar/default_thumb.jpg',
            hosts: []
        }
    },
    created () {
        this.getHost()
    },
    methods: {
        async getHost () {
            const { data } = await getHosts()
            this.hosts = data
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.list {
    background-color: $text-white;
    max-height: 400px;
    .rank-num {
        color: $text-333;
        width: 22px;
        line-height: 23px;
        &.show-flag {
            background-image: url('../assets/images/common/flag.png');
            background-size: contain;
            color: $text-white;
        }
    }
    .host {
        .star {
            width: 10px;
            height: 10px;
            background-image: url('../assets/images/common/empty-start.png');
            background-size: contain;
        }
    }
}
::v-deep {
    .list {
        .subscribe {
            line-height: 26px;
        }
    }
}
</style>
