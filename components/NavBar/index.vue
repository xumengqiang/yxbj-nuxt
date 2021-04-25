<template>
  <div class="headers">
    <div class="header_menu">
      <div class="logo">
        <img :src="logo">
      </div>
      <ul>
        <nuxt-link
          to="/"
          tag="li"
        >
          首页
        </nuxt-link>
        <nuxt-link
          to="/technology"
          tag="li"
        >
          优秀笔记
        </nuxt-link>
        <nuxt-link
          to="/doc"
          tag="li"
        >
          优秀文档
        </nuxt-link>
        <nuxt-link
          to="/link"
          tag="li"
        >
          优秀友链
        </nuxt-link>
        <nuxt-link
          to="/about"
          tag="li"
        >
          关于博主
        </nuxt-link>
        <el-dropdown
          v-if="token"
          trigger="click"
        >
          <div class="avator">
            <el-avatar
              :size="40"
              :src="info.avatar ? info.avatar : circleUrl"
            />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link
                to="/editor"
                tag="li"
              >
                新建普通文章
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <nuxt-link
                to="/markdown"
                tag="li"
              >
                新建Markdown
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <nuxt-link
                to="/mine/personal"
                tag="li"
              >
                个人主页
              </nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item
              divided
              @click.native="logout"
            >
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <li
          v-else
          @click="changeLogin"
        >
          登录/注册
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navbar',
  data () {
    return {
      circleUrl: require('@/assets/head-bd.png'),
      logo: require('@/assets/logo.png'),
      token: false,
      info: {}
    }
  },
  computed: {
    // token () {
    //   return this.$store.getters.token
    // },
    // info () {
    //   return this.$store.getters.info
    // }
  },
  mounted () {
    document.querySelector('.headers').onselectstart = () => {
      return false
    }
  },
  methods: {
    changeLogin () {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showLogin',
        value: true
      })
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
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
