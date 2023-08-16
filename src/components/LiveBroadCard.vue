<template>
<div class="card">
    <div
        v-if="showTopImg"
        class="top-image bg-center p-relative bg-no-repeat bg-size-cover"
        :style="{
            backgroundImage: `url(${topImg})`
        }"
    >
      <span class="font-600 p-absolute top-text" :class="`top${index+1}`">TOP{{ index + 1}}</span>
    </div>
    <div class="w-100 overflow-hidden">
      <div class="live-cover p-relative pointer  bg-center bg-no-repeat transition-3"
           :class="{
              'bg-size-cover': hasCover,
              'bg-size-auto': !hasCover
           }"
           v-lazy-container="{ selector: 'img' }"
      >
          <img class="w-100 h-100" :data-src="cover" :data-error="cardEmptyLogo" alt="">
          <div class="mask w-100 h-100 pointer p-absolute" :style="maskBg" @click="goLiveRoom">

          </div>
      </div>
    </div>
    <div
        class="host flex flex-column  align-center p-t-5 p-b-5  p-l-10 p-r-15"
        :class="{
            'bg-white': !bgGray,
            'bg-gray2': bgGray
        }"
    >
        <custom-span
            class="font-14 w-100 font-500 text-5e"
            :content="info.room_title"
        />

        <div class="title w-100 m-t-5 flex align-center justify-between font-medium m-l-5">
           <div class="user-info flex align-center">
             <span
                 class="avatar d-inline-block overflow-hidden border-radius-50  "
                 v-lazy-container="{ selector: 'img' }"
             >
               <img class="w-100 h-100" :data-src="info" :data-error="errorUserLogo" alt="">

             </span>

             <span class="name scale-9 d-inline-block m-l-5">
               <custom-span class="w-100 font-12" :content="info.nick || info.anchor_name" />
             </span>
           </div>
          <div class="views flex align-center flex-end">
              <span class="iconfont icon default font-14" style="color: red">&#xe788;</span>
            <span class="m-l-5 font-12">{{10000 }}</span>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import CustomSpan from '@/components/CustomSpan'
// import { giveHeatNumber } from '@/utils/utils'

export default {
    name: 'LiveBroadCard',
    components: {
        CustomSpan
    },
    props: {
        info: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 1
        },
        showTopImg: {
            type: Boolean,
            default: false
        },
        bgGray: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hasCover () {
            return !!this.info.live_cover
        },
        cover () {
            return this.hasCover ? this.info.live_cover : this.cardEmptyLogo
        },
        topImg () {
            const num = this.index > 4 ? 4 : this.index
            return require(`../assets/images/matches/top${num + 1}.png`)
        },
        maskBg () {
            return {
                backgroundImage: `url(${process.env.VUE_APP_START_BUTTON})`
            }
        },
        hostImg () {
            return require('../assets/images/common/host-avatar.png')
        },
        heatNum () {
            const value = this.info.heat_num || this.info.heat
            return value
            // return giveHeatNumber(value)
        }
    },
    methods: {
        goLiveRoom () {
            const roomId = this.info.room_id || this.info.member_id
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: roomId }
            })
            window.open(href, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    border-radius: 10px;
    overflow: hidden;
    width: 232px;
    .live-cover {
        height: 120px;
        background-color: #f2f2f2;
        .mask {
            background-color: rgba(0,0,0,.7);
            display: none;
            background-size: auto;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 3;
            left: 0;
            top: 0;
        }
      &:hover {
        transform: scale(1.2);
        .mask {
            display: block;
        }
      }
    }
    .host {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
        .avatar{
            width: 20px;
            height: 20px;
        }
        div.title {
          color: #A0A0A0;
        }
        .user-info {
          width: calc(100% - 70px);
          .name {
            width: calc(100% - 25px);
          }
        }
        .views {
            width: 70px;
            .icon {
                color: #FF6A6A;
            }
        }
    }
}
.top-image {
  margin-bottom: 5px;
  width: 145px;
  height: 42px;
}
.top-text {
  font-size: 24px;
  line-height: 36px;
  left: 47px;
  top: 0;
}
.top1 {
  color: #FA8300;
}
.top2 {
  color: #598888;
}
.top3 {
  color: #B55D4A;
}
.top4 {
  color: #398BAC;
}
.top5 {
  color: #398BAC;
}

</style>
