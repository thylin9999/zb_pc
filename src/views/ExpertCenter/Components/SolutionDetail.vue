<template>
<div class="w-100 h-100 overflow-y-auto">
  <div class="detail">
    <div class="title ">
      <span class="text-333 m-b-5 font-14 font-500">{{ row.title }}</span>
      <div class="text-999 m-t-5 font-14 font-300">
        <span class="border-right p-r-5">{{ planStatus }}</span>
        <span class="border-right p-r-5 p-l-5">{{ row.type_text }}</span>
        <span class="border-right p-r-5 p-l-5">{{ row.play_text }}</span>
        <span class="border-right p-r-5 p-l-5">{{ match.league }}</span>
        <span class=" p-r-5 p-l-5">{{ row.create_date }}</span>
      </div>
      <div class="chart m-t-10 flex flex-column justify-center w-100 bg-size-cover bg-no-repeat bg-center">
          <div class="row font-16 font-400 text-white flex align-center justify-center">
              <div class="team flex-1 flex flex-end align-center">
                <div class="home m-r-10">
                  <span>[主]</span>
                  <span>{{ match.home }}</span>
                </div>
                <img class="team-icon" :src="match.home_logo" alt="">
              </div>
              <div class="score m-l-15 m-r-15 flex align-center justify-center font-30 font-600">
                <span>{{ row.home_score || 0}}</span>
                <span class="m-l-10 m-r-10">:</span>
                <span>{{ row.away_score || 0}}</span>
              </div>
              <div class="team flex-1 flex align-center">
                <img class="team-icon" :src="match.away_logo" alt="">
                <div class="away m-l-10">
                  <span>{{ match.away }}</span>
                  <span>[客]</span>
                </div>
              </div>
          </div>
          <div class="rate m-t-25 w-100 text-center font-14 font-400 flex align-center justify-center">
            <span class="item pointer"
                  v-for="(item, index) in match.odds_record_array"
                  :key="index"
                  :class="{
                      'is-active': item.select === 1
                  }"
            >{{ item.value }}</span>
          </div>
      </div>
    </div>
    <div class="reason m-t-25 table-bottom-border">
      <div class="w-100 header table-bottom-border p-b-10">
        <span class="font-14 text-333 font-500">推荐理由</span>
      </div>
      <div class="content  p-t-10 font-14 text-333 font-400">
        {{ row.recommend }}
      </div>
    </div>
    <div class="price p-t-10 font-14 text-333 font-500">
      <span>方案售价：</span>
      <span>{{ price }}</span>
    </div>
  </div>
</div>
</template>

<script>
import { getMaterialDetail } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import { planStatus } from '@/utils/utils'

export default {
    name: 'SolutionDetail',
    data () {
        return {
            mpId: null,
            info: {}
        }
    },
    computed: {
        row () {
            return this.info.row || {}
        },
        match () {
            return this.info.match || {}
        },
        planStatus () {
            return this.info.row ? planStatus[this.info.row.status] : ''
        },
        price () {
            const unit = this.row.sales_type === 1 ? '球币' : '球票'
            return this.row.coin > 0 ? `${this.row.coin}${unit}` : '免费'
        }
    },
    created () {
        const { isDetail } = this.$route.query
        this.mpId = isDetail
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { code, data } = await getMaterialDetail(this.mpId)
                if (code === statusCode.success) {
                    this.info = data || {}
                }
            } catch (e) {
                console.log('出错了', e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.detail {
  line-height: 20px;
  .border-right{
    border-right: 1px solid #999;
  }
  .chart {
    height: 170px;
    border-radius: 10px;
    background-image: url('../../../assets/images/expert/detail-bg.png');
    .row {
      .score {
        width: 100px;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .rate {
      line-height: 40px;
      span {
        color: #fff;
        width: 160px;
        height: 40px;
        background: #000000;
        border-radius: 10px;
        margin-right: 45px;
        &:last-child {
          margin-right: 0;
        }
        &.is-active {
          font-weight: 500;
          background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
        }
      }
    }
  }

  .reason {
    .content {
      line-height: 25px;
      min-height: 245px;
    }
  }
  .price {
    line-height: 20px;
    padding-bottom: 50px;
  }
}
</style>
