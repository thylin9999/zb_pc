<template>
<div class="box p-l-10 flex align-center justify-center">
<!--    <svg-icon class="voice-button" :icon-class="voiceType" @click="mute"></svg-icon>-->
    <IconPng class="m-r-10" :icon="`icons/${voiceType}`" :width="17" :height="18" @click.native="mute"/>
    <el-dropdown @command="command" placement="bottom">
      <span class="el-dropdown-link flex align-center">
        <span class="font-16 font-400">
            {{ currentVoice.title }}
        </span>
        <i class="el-icon-caret-bottom font-12"></i>
      </span>
        <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item
              v-for="item in showVoice"
              :key="item.id"
              :command="item"
            >{{ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>

</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import IconPng from '@/components/IconPng.vue'
export default {
    name: 'VoiceChose',
    components: {
        IconPng
    },
    props: {
        leagueType: {
            type: [Number, String],
            default: 1
        }
    },
    data () {
        return {
            voiceType: 'voice',
            voices: [
                {
                    id: 1,
                    title: '静音',
                    type: 'mute'
                },
                {
                    id: 2,
                    title: '默认',
                    type: 'default'
                },
                {
                    id: 3,
                    title: '哨子',
                    type: 'whistle'
                },
                {
                    id: 4,
                    title: '鼓声',
                    type: 'drumming'
                },
                {
                    id: 5,
                    title: '广播',
                    type: 'broadcast'
                },
                {
                    id: 6,
                    title: '号角',
                    type: 'corner'
                },
                {
                    id: 7,
                    title: '胜利',
                    type: 'success'
                }
            ],
            currentVoice: {
                id: 2,
                title: '默认',
                type: 'default'
            }
        }
    },
    computed: {
        ...mapState('voice', ['playStatus', 'voice']),
        showVoice () {
            return this.voices.filter(voice => {
                if (this.isBasketBall) {
                    return [1, 2].includes(voice.id)
                } else {
                    return voice
                }
            })
        },
        isBasketBall () {
            return this.leagueType === 2
        }
    },
    methods: {
        ...mapMutations('voice', ['SET']),
        mute () {
            this.voiceType = this.voice === 'voice' ? 'no-voice' : 'voice'
            this.SET({ voice: this.voiceType })
            this.currentVoice = this.voice !== 'voice' ? {
                id: 1,
                title: '静音',
                url: ''
            } : {
                id: 2,
                title: '默认',
                url: ''
            }
        },
        command (item) {
            this.currentVoice = { ...item }
            if (item.id === 1) {
                this.voiceType = 'no-voice'
            } else {
                this.voiceType = 'voice'
            }
            const audio = new Audio(`/voices/${this.currentVoice.type}.mp3`)
            audio.play()
            this.SET({ voice: this.currentVoice.type })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 90px;
    height: 26px;
    border-radius: 3px;
    .voice-button{
        fill: #ccc;
    }
}
.el-dropdown,.el-dropdown-menu__item:not(.is-disabled){
    color: #CCCCCC;
}
.el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #F3F3F3;
}
</style>
