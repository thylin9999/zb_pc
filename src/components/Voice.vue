<template>
<div class="voice">
  <audio ref="audioRef" :key="updateKey"  :src="voicePath"></audio>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Voice',
    computed: {
        ...mapState('voice', ['voice', 'playStatus']),
        voicePath () {
            return `/voices/${this.voice}.mp3`
        }
    },
    data () {
        return {
            updateKey: +new Date().getTime()
        }
    },
    watch: {
        playStatus: {
            handler () {
                console.log(this.$refs.audioRef.duration, 'saf')
                setTimeout(() => {
                    // 重置
                    this.updateKey = +new Date().getTime()
                }, this.$refs.audioRef.duration * 1000)
                this.$refs.audioRef.play()
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.voice {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: -1;
}
</style>
