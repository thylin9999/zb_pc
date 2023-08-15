<template>
    <div class="wrapper-box  w-100">
        <template >
            <el-popover
                :popper-class="popoverClass"
                placement="right"
                width="350"
                :disabled="!showPopover"
                v-model="show"
                trigger="click">
                <div class="anchor-list" :class="{
                    'dark': isDark
                }" >
                    <p class="text-center text-white  font-12 p-t-10 p-b-10 font-400 font-regular">{{ match.anchor_number }}名主播正在播本场比赛</p>
                    <div class="ul-box p-b-15 p-l-20 p-r-20 flex flex-column overflow-y-auto">
                        <template
                            v-for="anchor in match.anchor_list"
                        >
                            <AnchorInfo
                                class="m-t-15 p-t-5 p-b-5 anchor-row"
                                :anchor="anchor"
                                :dark="isDark"
                                @closePopover="closePopover"
                                :key="anchor.room_id"/>
                        </template>
                    </div>
                    <div v-if="!isDark" class="animation-live w-100 flex align-center justify-center" >
                        <div
                            class="button flex pointer align-center justify-center"
                            @click="goToVirtual"
                        >
                        <IconPng
                            :width="22"
                            :height="15"
                            class="pointer"
                            icon="score/animation-live"

                        />
                        <span class="font-12 m-l-5 font-500">观看动画直播</span>
                        </div>

                    </div>
                </div>
                <template v-if="showButton">
                    <div  slot="reference" class="living-buttons flex align-center   bg-no-repeat bg-size-auto">
<!--                      <span v-if="showVirtualButton" class="virtual-live d-inl bg-no-repeat bg-center bg-size-100"></span>-->
                      <template v-if="showAnchor">
                        <div class="flex align-center" @click="goToLive">
                          <slot />
                        </div>
                      </template>
                      <template v-else>
                        <IconPng
                            v-if="showVirtualButton"
                            :width="27"
                            :height="20"
                            class=" pointer"
                            icon="score/live"
                            @click.native="goToLive"
                        />
                        <span
                            v-else
                            class="button pointer w-100   d-inline-block font-12 text-center font-300 font-regular text-white"
                            @click="goToLive"
                        >直播中</span>
                      </template>

                    </div>
                </template>
                <div
                    v-else
                    slot="reference"
                    class="hosts font-12 text-14 pointer bg-no-repeat"
                    :class="{
                    'visibility-hidden': match.anchor_number <= 0,
                    'is-in-home': isHome ,
                    'is-text-living p-l-10': textLiving,
                    'p-l-20': !textLiving
                }"
                >
                    <template v-if="isHome">
                        <span
                            v-if="match.anchor_number === 1"
                            @click.stop.prevent="goToLive"
                            class="is-living d-inline-block font-12 text-gradient"
                        >
                           直播中
                        </span>
                        <span
                                v-else
                                class="is-living d-inline-block font-12 text-gradient"
                        >
                           直播中
                        </span>
                    </template>

                    <template v-else>
                        <template v-if="textLiving">
                        <span
                                v-if="match.anchor_number === 1"
                                @click.stop.prevent="goToLive"
                                class="text-living d-inline-block font-14 font-400 "
                        >
                           直播中
                        </span>
                            <span
                                    v-else
                                    class="text-living d-inline-block font-14 font-400 "
                            >
                           直播中
                        </span>
                        </template>
                        <template v-else>
                            <template v-if="match.anchor_number === 1">
                              <span @click.stop.prevent="goToLive">
                                {{ match.anchor_number }} 位主播
                            </span>
                              </template>
                              <span class="multi-host d-inline-block " v-else>
                            {{ match.anchor_number }} 位主播
                        </span>
                        </template>
                    </template>

                </div>
            </el-popover>
        </template>
    </div>
</template>

<script>
import AnchorInfo from '@/views/Competition/Components/AnchorInfo'
import IconPng from '@/components/IconPng'
import { setLocal } from '@/utils/cookie'
export default {
    name: 'PopoverHost',

    props: {
        textLiving: {
            type: Boolean,
            default: false
        },
        isDark: {
            type: Boolean,
            default: false
        },
        isHome: {
            type: Boolean,
            default: false
        },
        match: {
            type: Object,
            default: () => ({})
        },
        showButton: {
            type: Boolean,
            default: false
        },
        showAnchor: {
            type: Boolean,
            default: false
        },
        showVirtualButton: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number,
            default: 2
        }
    },
    data () {
        return {
            show: false
        }
    },
    computed: {
        showPopover () {
            if (this.showButton) {
                return this.match.anchor_list.length >= this.maxSize
            } else {
                return true
            }
        },
        popoverClass () {
            const res = 'anchor-popper'
            const flag = this.isDark ? ' dark-mode' : ''
            return res + flag
        }
    },
    components: {
        AnchorInfo,
        IconPng
    },
    methods: {
        goToLive () {
            if (this.match.anchor_list.length > 1) {
                return
            }
            this.show = false
            const anchor = this.match.anchor_list[0]
            const { href } = this.$router.resolve({
                path: '/liveRoom',
                query: { room_id: anchor.room_id }
            })
            window.open(href, '_blank')
        },
        goToVirtual () {
            setLocal('matchInfo', JSON.stringify({ ...this.match }))
            this.$nextTick(() => {
                const { href } = this.$router.resolve({
                    name: 'VirtualLive',
                    query: {
                        matchId: this.match.matchId,
                        leagueType: this.match.leagueType
                    }
                })
                window.open(href, '_blank')
            })
        },
        closePopover () {
            this.show = false
        }
    }
}
</script>

<style lang="scss" scoped>
.anchor-list.dark {
  background-color: rgba(45, 39, 89, 0.9);
  p {
    background: #161047;
    border-color: transparent;
  }
  .ul-box {
    .anchor-row {
      border-color: #A4DCFF;
    }
  }
}
.anchor-list {
    width: 350px;
    height: 300px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    color: #fff;
    p {
        border-bottom: 1px solid #DEE4FF;
        background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
    }
    .ul-box {
        height: calc(100% - 110px);
        .anchor-row{
            border-bottom: 1px solid #CCCCCC;
        }
    }
}
.hosts{
    background-image: url('../assets/images/common/live.gif');
    background-position: left center;
    background-size: 12px 16px;

    &.is-in-home {
        background-image: none;
        border-radius: 3px;
        font-size: 12px;
        line-height: 22px;
        font-weight: 400;
        color: #F5DEB3;
        width: 100%;
        margin: 0 auto;
        padding: 0!important;
    }
    &.is-text-living{

    }
  .multi-host{
    background-color: #32393C;
    width: 75px;
    border-radius: 10px;
  }
    .is-living {
      width: 118px;
      height: 20px;
      line-height: 18px;
      border-radius: 10px;
      border: 1px solid #F7E0CB;
      position: relative;
      background-color: transparent;
      &:before {
        top: 2px;
        left: 25px;
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        background-image: url('../assets/images/live-room/home-living.gif');
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  .text-living {
    color: #F7464E;

  }
}

.living-buttons{

    .button {
        //width: 65px;
        background-image: url('../assets/images/common/live-white.gif');
        background-position: 4px center;
        background-repeat: no-repeat;
        padding-left: 15px;
        background-size: 15px 20px;
        height: 30px;
        line-height: 30px;
        background-color: #F7464E;
        border-radius: 5px;
    }
}
.virtual-live {
  background-image: url('../assets/images/score/live.png');
}

.animation-live{
    padding: 15px 0;
    .button {
        width: 190px;
        background: #A05A77;
        border-radius: 5px;
        line-height: 30px;
    }
}
</style>
