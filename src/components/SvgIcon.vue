<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import iconMap from '../utils/enums'
export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true,
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconName () {
            return `#icon-${this.iconClass}`
        },
        svgClass () {
            if (this.className) {
                return 'svg-icon ' + this.className
            } else {
                return 'svg-icon'
            }
        },
        tooltipTitle () { // 悬浮提示语
            return iconMap[this.iconClass] || ''
        }
    }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
