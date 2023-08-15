<template>
    <div class="h-100 p-t-30">
        <carousel-3d
        :controls-visible="options.showControls"
        :width="options.width"
        :height="options.height"
        :perspective="options.noPerspective ? 0 : 35"
        :inverse-scaling="options.inverseScaling"
        autoplay
        :space="options.space">
            <slide v-for="(slide, i) in slides" :index="i" :key="i">
                <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
                   <div class="w-100 h-100">
                       <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="slide.src">
                   </div>
                </template>
            </slide>
        </carousel-3d>
    </div>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'
export default {
    name: 'Carousle3d',
    props: {
        slides: {
            type: Array,
            default: () => []
        },
        options: {
            type: Object,
            default: () => ({
                width: 300,
                height: 200,
                space: 350,
                inverseScaling: 300,
                visible: 3
            })
        }
    },
    components: {
        Carousel3d,
        Slide
    }
}

</script>

<style lang="scss" scoped>
::v-deep {
    .carousel-3d-slide {
        background-color: transparent;
        border: none;

    }

    .carousel-3d-controls {
         a {
            width: 60px!important;
            height: 60px!important;
            text-align: center;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            span {
                display: none;
            }
            &.next {
                background-image: url('../assets/images/guide/next.png');
            }
            &.prev {
                background-image: url('../assets/images/guide/next.png');
                transform: rotate(180deg);
            }
         }
    }
}
</style>
