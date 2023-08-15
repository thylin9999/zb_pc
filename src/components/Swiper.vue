<template>
  <div class="seamless-warp w-100 h-100" >
      <swiper
          v-if="list && list.length >= 1"
          ref="mySwiper"
          class="my-swiper"
          :options="swiperOption"
      >
          <swiper-slide
              v-for="(item,index) in list"
              :key="index"
              class="swiperslide"
          >
              <div class="swiper-img h-100 p-relative" @click.prevent.stop="clickBanner(item)">
                  <img class="w-100 h-100" :src="item.cover" alt="">
                  <CustomSpan  class="p-absolute title font-22 font-500 text-white p-l-30" :content="item.title"></CustomSpan>
              </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import CustomSpan from './CustomSpan'
export default {
    name: 'SwiperBanner',
    components: {
        swiper,
        swiperSlide,
        CustomSpan
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        isNews: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            swiperOption: {
                loop: true,
                autoplay: {
                    delay: 50000,
                    disableOnInteraction: false // 手动滑动后继续自动播放
                },
                pagination: {
                    el: '.swiper-pagination'
                }
            }
        }
    },
    methods: {
        clickBanner (item) {
            if (this.isNews) {
                this.$router.push({
                    name: 'NewsDetail',
                    query: {
                        id: item.id
                    }
                })
            } else {
                if (item.jump_type === 1) {
                    // 内部跳转
                    this.$router.push({
                        path: item.jump_url
                    })
                } else if (item.jump_type === 2) { // 外跳
                    window.open(item.jump_url, '_blank')
                }
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.my-swiper {
  max-width: 1200px;
  max-height: 375px;
}
.seamless-warp{
  border-radius: 10px;
  overflow: hidden;
}

.swiper-img {
  width: 1200px;
  height: 375px;
}
.title {
  left: 0;
  bottom: 25px;
}

.swiper-pagination {
  text-align: right;
  padding-right: 50px;
}
::v-deep {
  .swiper-pagination-bullet {
      width: 11px;
      height: 11px;
      display: inline-block;
      background-color: #999999;
      border-radius: 50%;
      margin-left: 10px;
  }
  .swiper-pagination-bullet-active {
      width: 50px;
      border-radius: 11px;
      background-color: #fff;
  }
}
</style>
