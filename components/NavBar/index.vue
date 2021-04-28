<template>
  <div class="headers">
    <div class="header_menu">
      <div class="logo">
        <img :src="logo">
      </div>
      <ul>
        <nuxt-link v-slot="{ navigate, isExactActive }" custom to="/">
          <li
            :class="[isExactActive && 'nuxt-link-exact-active']"
            @click="navigate"
          >
            首页
          </li>
        </nuxt-link>
        <nuxt-link
          v-slot="{ navigate, isActive }"
          to="/technology"
          custom
        >
          <li
            :class="[isActive && 'nuxt-link-exact-active']"
            @click="navigate"
          >
            优秀笔记
          </li>
        </nuxt-link>
        <nuxt-link v-slot="{ navigate, isActive }" to="/doc" custom>
          <li
            :class="[isActive && 'nuxt-link-exact-active']"
            @click="navigate"
          >
            优秀文档
          </li>
        </nuxt-link>
        <nuxt-link v-slot="{ navigate, isActive }" to="/link" custom>
          <li
            :class="[isActive && 'nuxt-link-exact-active']"
            @click="navigate"
          >
            优秀友链
          </li>
        </nuxt-link>
        <nuxt-link v-slot="{ navigate, isActive }" to="/about" custom>
          <li
            :class="[isActive && 'nuxt-link-exact-active']"
            @click="navigate"
          >
            关于博主
          </li>
        </nuxt-link>
        <li v-if="!token" @click="changeLogin">
          登录/注册
        </li>
        <el-dropdown v-else trigger="click">
          <div class="avator">
            <el-avatar
              :size="40"
              :src="info.avatar ? info.avatar : circleUrl"
            />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link
                v-slot="{ navigate }"
                to="/editor"
                custom
              >
                <span @click="navigate">新建普通文章</span>
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <nuxt-link
                v-slot="{ navigate }"
                to="/markdown"
                custom
              >
                <span @click="navigate">新建Markdown</span>
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <nuxt-link
                v-slot="{ navigate }"
                to="/mine/personal"
                custom
              >
                <span @click="navigate">个人主页</span>
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navbar',
  data () {
    return {
      circleUrl: 'https://file.youxiubiji.com/nuxt/head-bd.png',
      logo: 'https://file.youxiubiji.com/nuxt/logo.png'
    }
  },

  computed: {
    token () {
      return this.$store.state.token || ''
    },
    info () {
      return this.$store.state.info || {}
    }
  },
  mounted () {
    document.querySelector('.headers').onselectstart = () => {
      return false
    }
  },
  methods: {
    changeLogin () {
      this.$store.dispatch('changeSetting', {
        key: 'showLogin',
        value: true
      })
    },
    async logout () {
      await this.$store.dispatch('resetToken')
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
.headers {
    background: #fff;
    height: 60px;
    z-index: 100;
    position: sticky;
    width: 100%;
    top: 0;
    box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
    .header_menu {
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo {
            width: 60px;
            height: 60px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        ul {
            height: 100%;
            display: flex;
            list-style-type: none;
            .el-dropdown {
                display: flex;
                align-items: center;
                justify-content: center;
                .avator {
                    margin: 0 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
            }

            li {
                display: inline-block;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                width: 80px;
                height: 100%;
                margin: 0 20px;
                position: relative;
                cursor: pointer;
                font-weight: bold;
                font-size: 15px;
            }
            .nuxt-link-exact-active {
                color: #00a8ff;
            }
            .nuxt-link-exact-active:after {
                display: block;
                content: "";
                width: 50px;
                height: 3px;
                background: #00a8ff;
                position: absolute;
                bottom: 0px;
                left: 50%;
                transform: translateX(-50%);
                color: #00a8ff;
            }
        }
    }
}
</style>
