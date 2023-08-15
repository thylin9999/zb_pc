<template>
<div class=" w-100">
    <ul class="tabs flex align-center justify-center p-t-10 p-b-10">
      <li
        v-for="tab in ranks"
        :key="tab.id"
        class="tab text-center font-12 pointer font-500"
        :class="{
            'is-active':tab.id === currentType
        }"
        @click="changeTab(tab)"
      >
          <span>{{ tab.label }}</span>
      </li>
    </ul>
    <div class="w-100 p-relative vip-box">
        <div class="tops p-t-15 p-relative">
            <div class="top p-absolute flex flex-column align-center"
                 :class="`top${i}`"
                 v-for="i in  3"
                 :key="i"
            >
                <IconPng :icon="`gift/top${i}`" :width="i === 1 ? 90 : 75" :height="i === 1 ? 90 : 75"/>
                <span class="avatar overflow-hidden d-inline-block p-absolute ">
                    <span v-if="tops[i-1] " class="w-100 h-100 d-inline-block bg-center bg-no-repeat bg-size-cover"
                      :style="{
                        backgroundImage: `url(${tops[i-1].avatar})`
                      }"
                    ></span>
                </span>
                <span class="count p-absolute ">
                    <span class="scale-7 text-center value text-white">{{ tops[i-1] ? tops[i-1].total : ''}}</span>
                </span>
                <span class="font-12 text-center d-inline-block text-ellipsis font-500" :class="{
                    'nickname': tops[i-1]
                }">
                  <custom-span class="w-100" :content="tops[i-1] ? tops[i-1].nickname : '虚位以待'"/>
                </span>
                      <span class="label d-inline-block"
                            :class="`label${[tops[i-1].label]}`"
                            v-if="tops[i-1] && tops[i-1].label">
                </span>
            </div>
        </div>
        <div class="left-vips w-100 p-absolute transition-3">
            <div class="row p-l-15 m-b-15 p-r-20 flex align-center justify-between"
                 v-for="i in 7"
                 :key="i + 3"
            >
                <span class="rank d-inline-block font-12 text-999">{{ i + 3}}</span>
                <div class="flex flex-1 m-l-10 align-center justify-between">
                    <div class="flex align-center">
                      <div class="label m-r-5"
                           :class="`label${tops[i+2] ? tops[i+2].label : '0'}`"
                      ></div>
                      <div class="name font-12 font-400 text-333">
                        <span v-if="tops[i+2] && tops[i+2].label" :class="`vip-label vip-label-${tops[i+2].label}`" class="label"></span>
                        <span class="nickname">{{ tops[i+2] ? tops[i+2].nickname : '虚位以待' }}</span>
                      </div>
                    </div>

                    <div class="level">
                        <template v-if="tops[i+2]">
                            <div class="font-12 font-400 level-text" :class="{
                            'up': tops[i+2].up_down === 1,
                            'down': tops[i+2].up_down === 2
                        }">
                                <span class="label">{{ tops[i+2].total }}</span>
                                <i v-if="tops[i+2].up_down === 1" class="el-icon-arrow-up font-12"></i>
                                <i v-else class="el-icon-arrow-down font-12"></i>
                            </div>
                        </template>
                        <span v-else class="change"
                        >-</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
</template>
<script>
/* eslint-disable */
import { getGiftRanking } from '@/api/Host/Host'
import { statusCode } from '@/utils/statusCode'
import IconPng from '@/components/IconPng.vue'
import CustomSpan from '@/components/CustomSpan'
import { LoopTool } from '@/utils/loop'

export default {
    name: 'GiftRanking',
    components: {
        IconPng,
        CustomSpan
    },
    props: {
        anchorId: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            currentType: 1, // 日榜
            ranks: [
                {
                    id: 1,
                    label: '贡献日榜'
                },
                {
                    id: 2,
                    label: '贡献周榜'
                }
            ],
            list: [],
            loop: null
        }
    },
    computed: {
        tops () {
            return this.list
        }
    },
    created () {
        this.fetchData()
        this.loop = new LoopTool(this.fetchData, 60 * 1000, true)
    },
    methods: {
        async fetchData () {
            try {
                const { code, data } = await getGiftRanking(this.anchorId, this.currentType)
                if (code === statusCode.success) {
                    this.list = data || []
                }
            } catch (e) {
                console.log('出错了', e)
            }
        },
        changeTab (tab) {
            this.currentType = tab.id
            this.fetchData()
        }
    },
    beforeDestroy () {
      this.loop.stop()
    }
}
</script>
<style scoped lang="scss">
.tabs {
  border-bottom: 1px solid #FFE7D5;
  .tab {
    width: 85px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    color: #333;

    &.is-active {
      color: #fff;
      background: linear-gradient(180deg, #FFF5E8 0%, #E1A579 100%);
    }
  }
}
.tops {
  height: 155px;
  color: #999;
  .top2, .top3 {
    top: 25px;
  }
  .top1 {
    left: 125px;
    top: 15px;
    .count {
      top: 71px;
    }
    .avatar {
      width: 39px;
      height: 39px;
      top: 26px;
      left: 26px;
    }
  }
  .top2 {
    left: 30px
  }
  .top3 {
    left: 230px;
  }
  .nickname {
      width: 75px;
      color: #FBA187;
  }
  .label {
    width: 46px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    &.label1 {
      background-image: url('../../../assets/images/gift/member.png');
    }
    &.label11 {
      background-image: url('../../../assets/images/gift/host.png');
    }
    &.label12 {
      background-image: url('../../../assets/images/gift/expert.png');
    }
  }
  .count {
    top: 60px;
    .value {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.7);
      transform-origin: center;
    }
  }
  .avatar {
    width: 32px;
    height: 32px;
    top: 22px;
    left: 21px;
    border-radius: 50%;
  }
}
.left-vips {
    height: 0;
    left: 0;
    top: 155px;
    z-index: 5;
    overflow: hidden;
    background-color: #fff;
    .rank {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background-color: #D8D8D8;
  }
    .level {
        .level-text {
            color: #999999;
            &.up {
                color: #FBA187;
            }
            &.down {
                color: #43B365;
            }
        }
    }
  .label {
    width: 46px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    &.label1 {
      background-image: url('../../../assets/images/gift/member.png');
    }
    &.label11 {
      background-image: url('../../../assets/images/gift/host.png');
    }
    &.label12 {
      background-image: url('../../../assets/images/gift/expert.png');
    }
  }
}
.vip-box {
    &:hover {
        .left-vips {
           height: 245px;
        }
    }
}
</style>
