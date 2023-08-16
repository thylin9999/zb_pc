<template>
    <div class="card pointer flex flex-column  justify-center"
        :class="{
            'is-active': isSelect,
            'small-card': smallCard
        }"
        @click="choseCard"
    >
        <div class="">
            <span class="coins">{{  showCoin  }}</span>
            <span class="font-14 m-l-10 text-333 font-500">球币</span>
        </div>
        <div class="font-14 m-t-10 text-333 text-left font-500">
            <template v-if="!isInput">
                <span>￥</span>
                <span>{{  value  }}</span>
            </template>
            <template v-else>
                <el-input-number
                    class="input-number text-left"
                    @change="validateValue"
                    @input.native="inputEvent"
                    @blur="blurInput"
                    type="number" v-model="input"
                    :min="0"
                    :max="coin.max"
                />
                <span class="m-l-5 font-16 text-333 font-500">元</span>
            </template>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'WalletCard',
    props: {
        isInput: {
            type: Boolean,
            default: false
        },
        isSelect: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Number, String],
            default: 100
        },
        radio: {
            type: [Number, String],
            default: 10
        },
        coin: {
            type: Object,
            default: () => ({})
        },
        smallCard: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            input: 0
        }
    },
    computed: {
        coins () {
            return this.value * this.radio
        },
        showCoin () {
            return this.isInput ? (this.input > 0 ? this.input * this.radio : 0) : this.coins
        }
    },
    created () {
        this.input = this.coin.min
    },
    methods: {
        inputEvent (e) {
            if (e && !isNaN(e.target.value)) {
                this.input = e.target.value
                this.validateValue()
            }
        },
        validateValue () {
            if (this.input < 0) {
                this.input = 0
            }

            if (this.input > this.coin.max) {
                this.input = this.coin.max
            }
            this.$emit('update:value', this.input)
        },
        blurInput () {
            if (this.input < this.coin.min) {
                Message.info(`最小金额为${this.coin.min}`)
            }
        },
        choseCard () {
            if (this.isInput) {
                this.$emit('update:value', this.input)
            }
            this.$emit('updateCard')
        }
    }
}

</script>

<style lang="scss" scoped>
.card {
    width: 300px;
    height: 120px;
    padding-left: 35px;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
    border-radius: 10px;
    border: 1px solid transparent;
    &.small-card {
      width: 205px;
      height: 105px;
      .input-number {
        width: 100px;
      }
    }
    &.is-active, &:hover {
        border: 1px solid #409eff;
        background-image: url('../../../assets/images/wallet/selected.png');
        background-position: right bottom;
        background-repeat: no-repeat;
        background-size: 61px 56px;
    }
    .coins{
        font-size: 35px;
        font-weight: bold;
        color: #409eff;
        line-height: 40px;
    }
    .input-number{
        display: inline-block;
        width: 170px;
        height: 28px;
        border-radius: 5px;
    }
}

::v-deep {
    .input-number{
        .el-input__inner {
            height: 28px;
            line-height: 28px;
            padding: 0;
            text-align: left;
            text-indent: 10px;
        }
        .el-input-number__increase, .el-input-number__decrease {
            display: none;
        }
    }
}
</style>
