<template>
<div class="page h-100 w-100 bg-white">
  <div class="title p-l-25">
    <span class="text-333 font-16 font-500">我的战绩</span>
  </div>
  <div class="content p-t-20">
    <template
      v-for="(row, key) in  showData"
    >
      <div class="row m-b-20" :key="key">
        <span class="font-14 text-333 font-500 p-l-25">{{ row.title }}</span>
        <ul class="list w-100 flex  m-t-15 p-l-25 p-r-25">
          <li
              class="item flex m-r-10 align-center flex-column justify-center"
            v-for="item in row.list"
            :key="`item-${item.recent}`"
          >
            <span class="font-30 value text-333 fnot-600">{{ item.percent }}</span>
            <span class="font-14 recent text-999 font-400">{{ item.recent }}</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import { getExpertCenter } from '@/api/user'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'Reward',
    data () {
        return {
            // showData: {
            //     shot: {
            //         title: '命中率',
            //         list: [
            //             {
            //                 percent: '20%',
            //                 recent: '近20场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近15场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近10场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近7场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近5场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近3场'
            //             }
            //
            //         ]
            //     },
            //     reBack: {
            //         title: '回报率',
            //         list: [
            //             {
            //                 percent: '20%',
            //                 recent: '近20场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近15场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近10场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近7场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近5场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近3场'
            //             }
            //
            //         ]
            //     },
            //     maxShot: {
            //         title: '最高连红',
            //         list: [
            //             {
            //                 percent: '20%',
            //                 recent: '近20场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近15场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近10场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近7场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近5场'
            //             },
            //             {
            //                 percent: '20%',
            //                 recent: '近3场'
            //             }
            //
            //         ]
            //     }
            // },
            maxShot: {
                title: '最高连红',
                list: []
            },
            reBack: {
                title: '回报率',
                list: []
            },
            shot: {
                title: '命中率',
                list: []
            }
        }
    },
    computed: {
        showData () {
            return {
                reBack: this.reBack,
                shot: this.shot,
                maxShot: this.maxShot
            }
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { code, data } = await getExpertCenter()
                if (code === statusCode.success) {
                    this.info = data
                    this.maxShot.list = [
                        {
                            percent: data.near_continuous_red,
                            recent: '近期连红'
                        },
                        {
                            percent: data.highest_continuous_red,
                            recent: '最高连红'
                        }
                    ]
                    this.reBack.list = [
                        {
                            percent: data.return_rate + '%',
                            recent: `近${data.return_sum}场`
                        }
                    ]
                    this.shot.list = [
                        {
                            percent: data.hit_rate + '%',
                            recent: `近${data.return_sum}场`
                        }
                    ]
                }
            } catch (e) {
                console.log('出错了', e)
            }
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
.item {
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  width: 145px;
  height: 80px;
  .value {
    line-height: 35px;
  }
  .recent {
    line-height: 20px;
  }
}
</style>
