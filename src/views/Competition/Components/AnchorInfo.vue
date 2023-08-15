<template>
<div class="anchor-info flex justify-between align-center"
    :class="{
        'dark': dark
    }"
>
    <div class="user-info flex align-center"
      :class="{
        'has-middle': showMiddle
      }"
    >
        <span
            class="user-icon d-inline-block border-radius-50 bg-no-repeat bg-size-cover bg-center"
            :style="{
                backgroundImage: `url(${anchor.img})`
            }"
        ></span>
        <div class="flex flex-column m-l-5 text-box">
            <CustomSpan class=" font-12"
                        :class="{
                            'text-white': dark,
                            'text-14': !dark
                        }"
                        :content="anchor.anchor_name || anchor.nick" />
            <CustomSpan class=" scale-9"
                        :class="{
                            'text-gray2': !dark,
                            'text-ccc': dark
                        }"
                        :content="anchor.room_title" />
        </div>
    </div>
    <div v-if="showMiddle" class="">
          <span class="middle-icon d-inline-block pointer p-l-20 p-r-10 ">
            <span class=" font-12">直播中</span>
        </span>
    </div>
    <div class="operation flex align-center">
        <span class="icon d-inline-block bg-center bg-no-repeat bg-size-cover"></span>
        <span class="enter-room font-12 p-l-5 p-r-5 text-center pointer " @click="goToLiveRoom">
            进入直播间
        </span>
    </div>
</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
export default {
    name: 'AnchorInfo',
    components: { CustomSpan },
    props: {
        dark: {
            type: Boolean,
            default: false
        },
        anchor: {
            type: Object,
            default: () => ({})
        },
        showMiddle: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goToLiveRoom () {
            this.$emit('closePopover')
            this.$nextTick(() => {
                const { href } = this.$router.resolve({
                    path: '/liveRoom',
                    query: { room_id: this.anchor.room_id }
                })
                window.open(href, '_blank')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dark {
    .user-info {
        .user-icon {
            background-color: #D8D8D8;
        }
    }
    .text-box {
        color: #fff;
    }
    .operation {
        .icon {
            background-image: url('../../../assets/images/common/dark-living.gif');
        }
        .enter-room {
            background: #00E2FE;
            color: #161047;
        }
    }
}
.user-info {
    width: calc(100% - 90px);
    &.has-middle {
      width: calc(100% - 200px);
    }
    .user-icon {
        background-color: #C9CFED;
        width: 30px;
        height: 30px;
    }
    .text-box{
        width: calc(100% - 35px);
    }
}
.middle-icon {
  background-image: url('../../../assets/images/common/live-white.gif');
  background-size: 15px 20px;
  background-position: 5px center;
  background-repeat: no-repeat;
  font-size: 12px;
  color: #FB7674;
}
.operation {
    .icon {
      width: 15px;
      height: 25px;
      background-image: url('../../../assets/images/common/is-living.gif');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 3px;
    }
    .enter-room{
        //width: 80px;
        min-width: 65px;
        height: 25px;
        background: #FBA187;
        border-radius: 5px;
        line-height: 25px;
        color: #fff;
    }
}
</style>
