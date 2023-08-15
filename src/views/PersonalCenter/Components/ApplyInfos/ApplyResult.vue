<template>
    <div class="w-100 h-100 page">
        <div class="m-b-30 flex align-center flex-column">
            <div class="result-btn">
                <div class="content "
                    :class="{
                        'circle-repeat': isGoing
                    }"
                >
                    <img :src="logo" alt="">
                </div>
            </div>
            <span class="text-333 m-t-20 font-20 font-500">{{  label  }}</span>
        </div>
        <div class="m-auto flex flex-column align-center">
          <template v-if="isSuccess">
            <span class="m-t-5">{{ successLabel }}</span>
            <span
                class="btn pointer m-t-20 d-inline-block text-center"
                @click="deliverySolution"
            >{{ isAnchor ? '立即开播' : '发布方案'}}</span>
          </template>
          <template v-if="isFail">
            <div class="font-14 text-333 font-400">
              <span>未通过原因：</span>
              <span>{{ applyInfo.reason }}</span>
            </div>
            <span
                class="btn pointer is-fail m-t-20 d-inline-block text-center"
                @click="applyAgain"
            >重新申请</span>
          </template>
        </div>
        <slot />
    </div>
</template>

<script>

export default {
    name: 'ApplyResult',
    props: {
        applyInfo: {
            type: Object,
            default: () => ({})
        },
        isAnchor: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            status: 3
        }
    },
    watch: {
        applyInfo: {
            handler () {
                this.changeStatus()
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        isGoingLogo () {
            return require('../../../../assets/images/personal/abroving.png')
        },
        isSuccessLogo () {
            return require('../../../../assets/images/personal/isSuccess.png')
        },
        isFailLogo () {
            return require('../../../../assets/images/personal/isFail.png')
        },
        logo () {
            return this.isGoing
                ? this.isGoingLogo
                : (this.isSuccess
                    ? this.isSuccessLogo
                    : this.isFailLogo
                )
        },
        label () {
            return this.isGoing
                ? '请耐心等待，正在审核中'
                : (this.isSuccess
                    ? '审核通过'
                    : '审核未通过'
                )
        },
        isGoing () {
            return this.status === 3
        },
        isFail () {
            return this.status === 2
        },
        isSuccess () {
            return this.status === 1
        },
        successLabel () {
            return this.isAnchor ? '恭喜您成为播球一名主播；请开启你的直播之旅吧' : '恭喜您成为播球专家，快去展示你的风采吧！'
        }
    },
    methods: {
        changeStatus () {
            console.log(this.applyInfo, 'asdf')
            this.status = this.applyInfo.status
        },
        applyAgain () {
            this.$emit('applyAgain')
        },
        deliverySolution () { // 发布方案
            this.$router.push({
                name: this.isAnchor ? 'PersonalCenter' : 'ExpertCenter',
                params: {
                    tabId: this.isAnchor ? 6 : 2
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.page{
    padding-top: 130px;
}
.content {
    transform-origin: center;
}
img {
    width: 135px;
    height: 135px;
}

.btn {
  border-radius: 5px;
  width: 170px;
  height: 40px;
  line-height: 40px;
  background-color: #A05A77;
  color: #fff;
  &.is-fail {
    background-color: #D8D8D8;
  }
}
</style>
