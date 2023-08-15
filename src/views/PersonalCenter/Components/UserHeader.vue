<template>
<div class="user-header p-t-25 p-b-25 flex  align-center p-l-25 p-r-20">
    <div class="icon m-r-10 bg-no-repeat bg-center bg-size-cover"
         v-lazy-container="{ selector: 'img' }"
    >
        <img class="w-100 h-100" :data-src="bgImg" :data-error="errorUserLogo" alt="">
    </div>
    <div class="info">
        <span class="font-18 font-500 text-333">
            <custom-span :content="nickname" />
        </span>
        <div class="id m-t-15 flex align-center font-14 font-500 justify-between">
            <div>
                ID: <span>{{ member_id }}</span>
            </div>
            <span class="pointer font-12" @click="copy">复制</span>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import CustomSpan from '@/components/CustomSpan'
import { Copy } from '@/utils/validator'

export default {
    name: 'UserHeader',
    components: {
        CustomSpan
    },
    computed: {
        ...mapState('user', ['nickname', 'member_id', 'avatar']),
        bgImg () {
            return this.avatar ? this.avatar : this.emptyLogo
        }
    },
    methods: {
        copy () {
            Copy(this.member_id)
        }
    }
}
</script>

<style lang="scss" scoped>
.user-header {
    border-bottom: 1px solid #F1F2F5;
}
.info {
    width: calc(100% - 60px);
    .id {
        color: #7F7F7F;
    }
}
.icon {
    width: 50px;
    height: 50px;
    border-right: 3px;
}
</style>
