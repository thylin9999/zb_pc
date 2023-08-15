<template>
  <div class="down-section-box">
    <div class="down-section bg-white m-t-10">
      <div class="buttons w-100 flex p-t-15 p-b-20 align-center justify-center">
          <template v-for="button in tabs">
              <span
                v-if="showTab(button)"
                  :Key="button.id"
                  class="pointer button m-r-5 m-l-5 font-18 text-center font-500 font-medium"
                  :class="{
                      'is-active': button.id === tabId
                  }"
                  @click="changeTab(button)">{{ button.title }}</span>
          </template>
      </div>
        <template v-if="isFootball">
            <component
                    class="w-100"
                    :key="tabId"
                    :is="comName"
                    :match-id="matchId"
                    :match-info="matchInfo"
                    :anchor-id="anchorId"
                    is-live-room
            ></component>
        </template>
        <template v-else>
            <HostCompetition
                    v-if="tabId === 1"
                    class="w-100"
                    :key="tabId"
                    :match-id="matchId"
                    :match-info="matchInfo"
                    :anchor-id="anchorId"
            />
            <AboutSelfCompetition
                    v-if="tabId === 2"
                    class="w-100"
                    :key="tabId"
                    :match-id="matchId"
                    :match-info="matchInfo"
                    :anchor-id="anchorId"
                    is-live-room
            />
            <template v-if="isBasketBall">
                <BasketballMatchStatics
                    v-if="tabId === 3"
                    :match-id="matchId"
                    :match-info="matchInfo"
                />
                <BasketballLineup
                        class="m-t-20"
                       v-if="tabId === 4"
                      :match-id="matchId"
                       is-live-room
                />
            </template>
        </template>
    </div>
  </div>
</template>

<script>
import HostCompetition from '@/views/LiveRoom/Components/HostCompetition'
import AboutSelfCompetition from '@/views/LiveRoom/Components/AboutSelfCompetition'
import MatchStatics from '@/views/LiveRoom/Components/MatchStatics'
import Lineup from '@/views/LiveRoom/Components/Lineup'
import BasketballLineup from '@/views/VirtualLiveRoom/Components/BasketballLineup'
import BasketballMatchStatics from '@/views/LiveRoom/Components/BasketballMatchStatics.vue'
export default {
    name: 'Downsection',
    components: {
        HostCompetition,
        AboutSelfCompetition,
        Lineup,
        MatchStatics,
        BasketballMatchStatics,
        BasketballLineup
    },
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        },
        matchId: {
            type: [Number, String],
            default: 2337250
        },
        anchorId: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            tabId: 1,
            tabs: [
                {
                    id: 1,
                    title: '主播',
                    com: 'HostCompetition'
                },
                {
                    id: 2,
                    title: '推荐',
                    com: 'AboutSelfCompetition'
                },
                {
                    id: 3,
                    title: '赛况',
                    com: 'MatchStatics'
                },
                {
                    id: 4,
                    title: '阵容',
                    com: 'Lineup'
                }
            ]
        }
    },
    computed: {
        comName () {
            return this.tabs.find(x => x.id === this.tabId).com
        },
        isFootball () {
            return this.matchInfo && this.matchInfo.leagueType === 1
        },
        isBasketBall () {
            return this.matchInfo && this.matchInfo.leagueType === 2
        }
    },
    methods: {
        showTab (tab) {
            return this.isFootball || this.isBasketBall || (!this.isFootball && !this.isBasketBall && ![3, 4].includes(tab.id))
        },
        changeTab (tab) {
            this.tabId = tab.id
        }
    }
}
</script>

<style lang="scss" scoped>
.down-section-box {
  width: 100%;
  max-width: 1650px;
  margin: auto;
  background-color: #f3f5f9;
}

.down-section {
  width: 100%;

  .buttons {
    border-bottom: 1px solid #FBA187;
    .button {
        width: 116px;
        height: 33px;
        color: #333;
        line-height: 33px;
        position: relative;
        &.is-active {
            color: #FBA187;
          &:after {
            position: absolute;
            width: 0;
            height: 0;
            left: calc(50% - 3px);
            top: calc(100% + 6px);
            content: "";
            border-right: 6px solid transparent;
            border-top: 6px solid transparent;
            border-left: 6px solid transparent;
            border-bottom: 6px solid #FBA187;
          }
        }
    }
}
}
</style>
