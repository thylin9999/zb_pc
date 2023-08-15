<template>
    <div class="w-100 h-100 flex align-center justify-center"
        @mouseenter="mouseIn"
        @mouseleave="mouseOut"
    >
        <span
            class="d-inline-block"
            :style="style"
        ></span>
    </div>
</template>

<script>
export default {
    name: 'HoverIcon',
    props: {
        icon: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 20
        },
        height: {
            type: Number,
            default: 20
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isHover: false
        }
    },
    watch: {
        isActive: {
            handler () {
                this.$nextTick(() => {
                    this.isHover = this.isActive
                })
            },
            immediate: true
        }
    },
    computed: {
        iconUrl () {
            return this.isHover ? require(`../assets/images/${this.icon}_h.png`) : require(`../assets/images/${this.icon}.png`)
        },
        style () {
            return {
                width: this.width + 'px',
                height: this.height + 'px',
                backgroundImage: `url(${this.iconUrl})`
            }
        }
    },
    methods: {
        mouseIn () {
            this.isHover = true
        },
        mouseOut () {
            this.isHover = this.isActive || false
        }
    }
}

</script>

<style lang="scss" scoped>
span {
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>
