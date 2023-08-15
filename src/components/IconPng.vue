<template>
<span class="icon d-inline-block bg-center bg-no-repeat bg-size-100"
    :style="style"
></span>
</template>

<script>
export default {
    name: 'IconPng',
    props: {
        icon: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 16
        },
        height: {
            type: Number,
            default: 16
        }
    },
    computed: {
        bgUrl () {
            if (this.icon) {
                return require(`../assets/images/${this.icon}.png`)
            } else {
                return ''
            }
        },
        style () {
            return {
                backgroundImage: `url(${this.bgUrl})`,
                width: this.width + 'px',
                height: this.height + 'px'
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
