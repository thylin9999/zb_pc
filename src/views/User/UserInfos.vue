<template>
<div class="user font-12 font-medium flex align-center" :class="{'light-background': isLightHeader && !showDark }">
  <div class="m-r-10">
      <search-page v-if="!isSearchPage" />
  </div>
  <div  @click="openLiveCast" class="flex open-cast text-center flex-column align-center justify-between " >
    <icon-png :icon="isLightHeader && !showDark ? 'header/live_h' : 'header/live'" :width="22" :height="22"></icon-png>
    <span class=" pointer text-color "
          :class="{'text-white': isLightHeader && !showDark, 'text-333': !isLightHeader || showDark}"
    >开播</span>
  </div>
    <mission class="open-cast m-r-10 text-center" :is-light-header="isLightHeader" :show-dark="showDark" />
    <div v-if="!token"
         class="login-or-register  bg-center bg-no-repeat bg-size-cover"
         @click="openLogin"
    >
    </div>
    <div v-else class="flex align-center username" :class="{'text-white': isLightHeader && !showDark, 'text-333': !isLightHeader || showDark}">
        <el-dropdown class="w-100" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link flex align-center">
            <span class="flex align-center w-100">
                <div
                    class="user-logo overflow-hidden bg-size-cover bg-center bg-no-repeat"

                    v-lazy-container="{ selector: 'img' }"
                >
                    <img class="w-100 h-100" :data-src="avatarLogo" :data-error="errorUserLogo" alt="">
                </div>
                <custom-span
                    class="m-l-10 name-span"
                    :content="nickname"
                    :class="{'text-white': isLightHeader && !showDark, 'text-333': !isLightHeader || showDark}"
                />
<!--                <span class="m-l-10 " :class="{'text-white': isLightHeader && !showDark, 'text-333': !isLightHeader || showDark}">{{nickname}}</span>-->
            </span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</div>
</template>

<script>
import Mission from '@/components/Mission.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { Message } from 'element-ui'
import IconPng from '@/components/IconPng'
import CustomSpan from '@/components/CustomSpan'
import SearchPage from '@/views/components/SearchPage.vue'
export default {
    name: 'UserInfos',
    components: {
        SearchPage,
        IconPng,
        Mission,
        CustomSpan
    },
    props: {
        isLightHeader: {
            type: Boolean,
            default: false
        },
        showDark: {
            type: Boolean,
            default: false
        }
    },
    inject: ['reload'],
    data () {
        return {
            isHome: false,
            currentId: 1 // 默认时首页
        }
    },
    computed: {
        ...mapState('user', ['token', 'nickname', 'avatar', 'is_anchor']),
        ...mapGetters('user', ['isHostAnchor']),
        avatarLogo () {
            return this.avatar ? this.avatar : this.emptyLogo
        },
        isAnchor () {
            return this.is_anchor === 2 // 1 非主播， 2，主播
        },
        isSearchPage () {
            return this.currentId === 13
        }
    },
    watch: {
        '$route': {
            handler () {
                this.currentId = this.$route.meta.subId
                this.isHome = this.$route.meta.subId === 1
            }
        },
        deep: true,
        immediate: true
    },
    methods: {
        ...mapActions('user', ['logoutAction']),
        openLogin () {
            this.openLoginDialogMixin()
        },
        openRegister () {
            this.openLoginDialogMixin()
        },
        goToUserCenter () {
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 1
                }
            })
        },
        handleCommand (command) {
            if (command === 'userCenter') {
                this.goToUserCenter()
            } else {
                this.logoutAction()
                // if (this.$route.name === 'Home') {
                //     // this.reload()
                // } else {
                //     this.$router.push('/')
                // }
            }
        },
        openLiveCast () {
            if (!this.token) {
                this.openLoginDialogMixin()
                return
            }
            if (!this.isHostAnchor) {
                Message.info('您目前还不是主播，请先申请主播，再开播！')
                this.queryHost()
                return
            }
            this.$router.push({
                name: 'PersonalCenter',
                params: {
                    tabId: 6
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.user-buttons {
    border-radius: 20px;
}
.open-cast{
  width: 45px;
}
.login-or-register{
  width: 40px;
  height: 40px;
  background-image: url('../../assets/images/login/login.gif');
  &:hover {
    background-image: url('../../assets/images/login/login_h.png');
  }
}
.username {
  width: 150px;
  .name-span {
    width: 95px;
  }
}
.user-logo {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border-radius: 50%;
}
.light-background {
    color: #333;
    .user-buttons {
        border-color: #fff;
    }
}
</style>
