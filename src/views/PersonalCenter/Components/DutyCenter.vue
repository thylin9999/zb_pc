<template>
    <div class="page  w-100 h-100 bg-white overflow-y-auto">
        <div class="title p-l-25">
            <span class="text-333 font-16 font-600">{{ title }}</span>
        </div>
        <div class="content p-relative p-t-15 p-l-25 p-r-25">
          <div class="row p-l-25 p-r-25">
              <div class="flex p-t-20 align-center justify-between">
                  <div>
                      <span class="font-14 text-333 font-600">播球宝箱</span>
                      <span class="font-12 m-l-5 text-999 font-400">观看直播即可领取</span>
                  </div>
                  <span class="pointer"
                        @click="toHost"
                  >
                      <span class="font-14 text-333 ">去观看</span>
                      <i class="el-icon-arrow-right text-333 font-600 m-l-5 font-15"></i>
                  </span>
              </div>
              <div class="w-100 boxes m-t-15">
                  <timing-box size="big"/>
              </div>
          </div>
        </div>
    </div>
</template>
<script>
import TimingBox from '@/components/TimingBox.vue'
export default {
    name: 'DutyCenter',
    components: {
        TimingBox
    },
    data () {
        return {
            title: '任务中心',
            boxes: [
                {
                    id: 1,
                    title: '5:00',
                    isOpen: true,
                    label: '球票'
                },
                {
                    id: 2,
                    title: '10:00',
                    isOpen: false
                },
                {
                    id: 3,
                    title: '15:00',
                    isOpen: false
                },
                {
                    id: 4,
                    title: '30:00',
                    isOpen: false
                },
                {
                    id: 5,
                    title: '60:00',
                    isOpen: false
                }

            ]
        }
    },
    methods: {
        toHost () {
            this.$router.push({
                name: 'LiveBroad'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.title {
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #d8d8d8;
}
.content {
  height: calc(100% - 55px);
}
.row {

  height: 190px;
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  .label {
    width: 80px;
    height: 23px;
    background: #A05A77;
    border-radius: 12px;
  }
  .box {
    margin-right:45px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
