<template>
<div class="detail-box font-regular h-100">
    <div class="flex flex-end ">
        <div class="back-btn">
            <ConfirmButton @click.native="backToList" class="p-t-5 p-b-5 border-radius-3 back"  title="返回"/>
        </div>
    </div>

    <div class="box">
        <div class="title m-b-5 font-500 font-20 font-regular">{{detail.title }}</div>
        <span class="time  font-300">发布于 {{ time }}</span>
        <div class="content overflow-y-auto m-t-30 font-14 font-300">
            {{ detail.content }}

        </div>
    </div>
</div>
</template>

<script>
import ConfirmButton from '@/components/ConfirmButton'
import dayjs from 'dayjs'
export default {
    name: 'AnnouncementDetail',
    components: {
        ConfirmButton
    },
    props: {
        detail: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        time () {
            return this.detail.update_time ? dayjs(this.detail.update_time).format('YYYY-MM-DD') : null
        }
    },
    methods: {
        backToList () {
            this.$emit('backToList')
        }

    }
}
</script>

<style lang="scss" scoped>
.detail-box{
    padding: 30px 30px 30px 35px;
}
.back{

}
.title {
    line-height: 20px;
}
.time {
    color: #848484;
}
.box {
    height: calc(100% - 25px);
}
.back-btn{
    max-width: 150px;
}
.content {
    color: #848484;
    line-height: 20px;
    height: calc(100% - 85px);
    white-space: break-spaces;
}

</style>
