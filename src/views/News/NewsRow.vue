<template>
    <div class="w-100 news-card" @click="goDetail">
        <img class="news-cover flex-shrank-0" :src="info.cover" alt="">
        <div class="m-l-10 flex-1 h-100 flex-shrank-0 overflow-hidden">
            <div class="w-100 overflow-hidden">
                <CustomSpan class="font-14  title font-600 w-100 " :content="info.title"></CustomSpan>
            </div>
            <span class="font-12 content d-inline-block font-400 w-100 text-2-ellipsis m-t-5 " v-html="contentStr"></span>
        </div>
    </div>
</template>

<script>
import CustomSpan from '../../components/CustomSpan'
import { getZhCharactor } from '@/utils/utils'
export default {
    name: 'NewsRow',
    components: {
        CustomSpan
    },
    props: {
        info: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        contentStr () {
            return getZhCharactor(this.info.content) || this.info.title
        }
    },
    methods: {
        goDetail () {
            this.$router.push({
                name: 'NewsDetail',
                query: {
                    id: this.info.id
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
  .news-card {
    height: 66px;
      &:hover {
          .title, .content {
              color: #FBA187;
          }
      }
  }
    .title {
        line-height: 20px;
        color: #333;
    }
    .news-cover {
        width: 130px;
        height: 65px;
        overflow: hidden;
        border-radius: 10px;
    }
    .content {
        max-height: 45px;
        line-height: 17px;
        color: #999;
    }
::v-deep {
    .content {
        img {
            display: none!important;
        }
    }
}
</style>
