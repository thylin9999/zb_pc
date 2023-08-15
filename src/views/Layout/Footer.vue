<template>
    <div id="footer" class="footer text-white bg-center bg-no-repeat bg-size-cover">
        <div class="wrap-1200 p-l-25 p-r-25 h-100 flex justify-between align-center">
            <div class="left-info">
                <div class="section1 w-100 flex">
                    <div class="host-help flex align-center font-14 font-500 font-regular">
                        <span class="button d-inline-block font-14 p-l-15 p-r-15">直播帮助</span>
                        <ul class="flex m-l-15 align-center">
                            <li class="pointer" :class="{'protocols': active === 1}" @click="goToLiveProtocol(1)">
                                <span>直播协议</span>
                                <span class="m-l-5 m-r-5">/</span>
                            </li>
                            <li class="pointer" :class="{'protocols': active === 2}" @click="goToLiveProtocol(2)">
                                <span>直播规范</span>
                                <span class="m-l-5 m-r-5">/</span>
                            </li>
                            <li class="pointer" :class="{'protocols': active === 3}" @click="goToLiveProtocol(3)">
                                <span>
                                    直播教程
                                </span>
                                <span class="m-l-5 m-r-5">/</span>
                            </li>
                            <li class="pointer" :class="{'protocols': active === 4}"  @click="goToLiveProtocol(4)">直播工具</li>
                        </ul>
                    </div>
                    <div class="contact flex align-center font-14 font-500 font-regular">
                        <span class="button d-inline-block font-14 p-l-15 p-r-15">联系我们</span>
                        <ul class="flex m-l-15 align-center ">
                            <li class="pointer">
                                <!--                                <span>官方qq: 123</span>-->
                                <!--                                <span class="m-l-5 m-r-5">/</span>-->
                            </li>
                            <li>
                                <span>官方邮箱：<copy-span content="boqiuzhibo@163.com"/> </span>
                                <span class="m-l-5 m-r-5">/</span>
                            </li>
                            <li>
                                <span>
<!--                                    微信公众号：播球体育live-->
                                    联系电话：<copy-span content="0771-5628872"/>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="section2 flex align-center justify-center font-14 font-500 font-regular m-t-30">
                    <div class="pointer">
                        <span @click="aboutUs">播球App</span>
<!--                        <span class="m-l-10 m-r-10">|</span>-->
                    </div>
<!--                    <div class="pointer" @click="userProtocol">-->
<!--                        <span>用户协议</span>-->
<!--                        <span class="m-l-10 m-r-10">|</span>-->
<!--                    </div>-->
<!--                    <div class="pointer" @click="userPolicy">-->
<!--                        <span>隐私政策</span>-->
<!--                        <span class="m-l-10 m-r-10">|</span>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010802000552" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">-->
<!--                            <img :src="require('@/assets/images/footer/gh.png')" style="float:left;"/>-->
<!--                            <p  class="pointer"   style="float:left;height:20px;line-height:25px;margin: 0px 0px 0px 5px;">桂公网安备 45010802000552号</p>-->
<!--                        </a>-->
<!--                    </div>-->
                </div>
                <div class="section3 font-14 font-500 font-regular">
                    <span class="d-inline-block w-100 text-center">
                        © 南宁市播球体育科技有限公司 ｜
                      <span class="d-inline-block">
                        <span class="gh flex align-center">
                          <IconPng  icon="footer/gh" :width="13" :height="13"/>
                        </span>
                      </span>
                      <span class="beiAn pointer" @click="goBeiAn">{{ record }}</span>
                      ｜ 桂网文（2023）0693-201号
                    </span>
<!--                  <div style="width:300px;margin:0 auto; padding:20px 0;">-->
<!--                    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010802000641" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">桂公网安备 45010802000641号</p></a>-->
<!--                  </div>-->
                    <span class="d-inline-block w-100 text-center">
                        <a class="pointer"  target="_blank" href="https://www.piyao.org.cn/">全国文化和旅游市场网上举报投诉处理系统</a> |
                        <a class="pointer" target="_blank"  href="https://www.12377.cn/">网上有害信息举报专区</a> |
                        <a class="pointer" target="_blank"  href="https://www.piyao.org.cn/">中国互联网联合辟谣平台</a> |
                        <a class="pointer" target="_blank"  href="https://www.piyao.org.cn/">中国扫黄打非-网上举报</a> |
                        <a class="pointer" target="_blank"  href="https://www.12377.cn/jbxzxq/zpljbxzxq.html?spm=zm1033-001.0.0.1.SOXBdI">电信诈骗举报专区</a> |
                        <a class="pointer" target="_blank"  href="https://www.12377.cn/jbxzxq/64d38691937611ebb858c9da04cf59d3_web.html?spm=zm1033-001.0.0.1.SOXBdI&smallHarmType=64d38691937611ebb858c9da04cf59d3">涉历史虚无主义有害信息举报专区</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import Qrcode from '@/components/Qrcode'
import IconPng from '@/components/IconPng'
import { recordString } from '@/utils/utils'
import CopySpan from '@/components/CopySpan.vue'
export default {
    name: 'Footer',
    components: {
        // Qrcode,
        CopySpan,
        IconPng
    },
    data () {
        return {
            record: recordString(),
            active: null
        }
    },
    computed: {
        ...mapState('commonData', ['descriptions', 'urls']),
        IOSUrl () {
            return this._appDownloadUlrIOS
        },
        androidUrl () {
            return this._appDownloadUlr
        }
    },
    methods: {
        goToDescription (item) {
            if (item.type) {
                this.$router.push({
                    name: item.type,
                    params: {
                        id: item.id
                    }
                })
            }
        },
        goBeiAn () {
            // window.open('https://beian.miit.gov.cn/')
            window.open('http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010802000641')
        },
        goToLiveProtocol (buttonId) {
            this.active = buttonId
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId: 2,
                    buttonId
                }
            })
        },
        userProtocol () {
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId: 3
                }
            })
        },
        aboutUs () {
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId: 5
                }
            })
        },
        userPolicy () {
            this.$router.push({
                name: 'HelpCenter',
                params: {
                    tabId: 4
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.footer {
    height: 185px;
    background-image: url('../../assets/images/footer/footer-bg.png');
    .left-info {
        width: 100%;
    }
}
.left-info {
    .section1 {
        .host-help , .contact{
            width: 50%;
        }
        //.protocols {
        //  color: #FBA187;
        //}
        .button {
            height: 30px;
            background: #261C5B;
            border-radius: 15px;
            line-height: 30px;
        }
    }
    .section3 {
        line-height: 20px;
        a {
            text-decoration: none;
        }

        .beiAn:hover{
            position: relative;
            cursor: pointer;
        }
    }
}
.pointer{
    color: #fff;
}
.pointer:hover{
    color: #FBA187;
}
.gh {
  height: 20px;
  line-height: 20px;
}

</style>
