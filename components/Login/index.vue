<template>
  <div class="auth-modal-box" @mousemove="stop">
    <div class="auth-form">
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <div class="panfish">
          <img v-if="isGifType === 1" src="../../assets/open.png">
          <img
            v-else-if="isGifType === 2"
            src="../../assets/sec.png"
          >
          <img v-else src="../../assets/def.png">
        </div>
        <div class="auth-nav">
          <div class="title">
            {{ title }}
          </div>
          <img
            class="close"
            src="../../assets/close.png"
            @click="close"
          >
        </div>
        <div v-if="isEmaliCode == 1" class="input-group">
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              type="email"
              maxlength="20"
              clearable
              tabindex="1"
              autocomplete="on"
              placeholder="请输入邮箱"
              @focus="changeGif(1)"
              @blur="changeGif(0)"
            />
          </el-form-item>
        </div>
        <div v-if="isEmaliCode == 1" class="input-group">
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              maxlength="20"
              tabindex="2"
              show-password
              autocomplete="on"
              placeholder="请输入密码"
              @focus="changeGif(2)"
              @blur="changeGif(0)"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </div>
        <el-button
          v-if="isEmaliCode == 1"
          class="btn"
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
        <div
          v-if="isEmaliCode == 2"
          v-loading="codeLoading"
          class="image-group"
        >
          <el-image class="code-img" :src="wxCodeSrc" />
        </div>
        <div v-if="isFailure || isLoadingScan" class="image-slot">
          <span
            v-if="isFailure"
            class="fail"
          >二维码已失效，请刷新</span>
          <span
            v-if="isLoadingScan"
            class="success"
          >请在微信中点击确认登录</span>
        </div>
        <div v-if="isEmaliCode == 1" class="bot">
          <div class="bot-lf" @click="emailChange">
            {{ desc }}
          </div>
        </div>
        <div v-if="isEmaliCode == 2" class="code-bot">
          {{ desccontent }}
          <span v-if="isFailure" @click="referCode">刷新二维码</span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { validEmail } from '@/utils/validate'
import { wxcodeUrl } from '@/api/user'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data () {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      codeLoading: true, // 二维码扫描loading
      wxCodeSrc: '', // 二维码链接
      websock: null, // websocket
      isEmaliCode: 1, // 1账号密码登录   2微信登录
      title: '账密登录', // 登录标题
      desc: '微信登录', // 底部文案
      isGifType: 0, // 0默认  1输入账号 2输入密码
      loading: false, // 登录按钮loading
      desccontent: '请使用微信扫一扫',
      isFailure: false, // 链接断开
      isLoadingScan: false, // 扫码中
      loginForm: {
        email: 'xumengqiang@qq.com', // 邮箱
        password: '123456' // 密码
      },
      rules: {
        email: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEmail
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      }
    }
  },
  destroyed () {
    // 离开路由之后断开websocket连接
    if (this.websock) {
      this.websock.close()
    }
  },
  methods: {
    /**
         * 切换微信登录方式
         */
    emailChange () {
      this.initWebSocket()
      this.isEmaliCode = 2
      this.title = '微信登录'
    },
    /**
         * 图标动画
         */
    changeGif (i) {
      this.isGifType = i
    },
    // 禁止滚动
    stop () {
      const mo = function (e) {
        e.preventDefault()
      }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false) // 禁止页面滑动
    },
    /** *取消滑动限制***/
    move () {
      const mo = function (e) {
        e.preventDefault()
      }
      document.body.style.overflow = '' // 出现滚动条
      document.removeEventListener('touchmove', mo, false)
    },
    /**
         * 关闭登录框
         */
    close () {
      this.move()
      this.$emit('close')
    },
    /**
         * 登录
         */
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              location.reload()
              this.$notify({
                title: '成功',
                message: '登录成功~',
                type: 'success'
              })
              this.loading = false
              this.move()
              this.$emit('close')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    /**
         * 刷新二维码
         */
    referCode () {
      this.initWebSocket()
    },
    // 初始化weosocket
    initWebSocket () {
      if (this.websock) {
        this.websock.close()
      }
      // websocket 消息处理
      const messageHandler = {
        // 获得 codeId 接下来我们要生成二维码
        CODE_ID: async (res) => {
          const $res = await wxcodeUrl({ scene: res.data.uuid })
          // this.wxCodeSrc = "http://localhost:3000/" + $res.data.url;
          this.wxCodeSrc =
                        'https://api.youxiubiji.com/public/' + $res.data.url
          this.codeLoading = false
          this.isFailure = false
          this.desccontent = '请使用微信扫一扫'
        },
        // 二维码被扫描，等待客户端确认
        SCANNED: () => {
          // this.codeLoading = true;
          this.isLoadingScan = true
          this.desccontent = '请在微信中点击确认登录'
        },
        // 登录成功，保存获得的 token
        SUCCESS: (res) => {
          this.$store.commit('user/SET_TOKEN', res.data.token)
          setToken(res.data.token)
          location.reload()
          this.$notify({
            title: '成功',
            message: '登录成功~',
            type: 'success'
          })
          this.codeLoading = false
          this.move()
          this.$emit('close')
          this.websock.close()
        }
      }
      // 初始化weosocket
      // this.websock = new WebSocket("ws://localhost:3000/webSocket");
      this.websock = new WebSocket('wss://youxiubiji.com/webSocket')
      this.websock.onmessage = (e) => {
        const res = JSON.parse(e.data)
        const handlerFn = messageHandler[res.data.type]
        // 匹配到相应的函数，执行之
        if (typeof handlerFn === 'function') {
          handlerFn(res)
        }
      }
      // 连接建立成功
      this.websock.onopen = () => {
        // 发送消息，请求随机 id
        this.websock.send('GET_CODE')
      }
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    // 连接建立失败重连
    websocketonerror () {
      this.initWebSocket()
    },
    // 关闭
    websocketclose () {
      this.isFailure = true
      this.isLoadingScan = false
      this.desccontent = ''
    }
  }
}
</script>
<style lang="less" scoped>
.auth-modal-box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
    .auth-form {
        position: relative;
        padding: 24px;
        width: 380px;
        background-color: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        animation: myfirst 0.5s;
        .panfish {
            position: absolute;
            left: 50%;
            right: 0;
            top: -73px;
            width: 120px;
            height: 96px;
            transform: translateX(-50%);
            z-index: 2;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .auth-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            .title {
                color: #333;
                font-size: 18px;
                font-weight: bold;
            }
            .close {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
        }
        .input-group {
            margin-bottom: 30px;
            position: relative;
            .input-fix {
                position: absolute;
                right: 0;
                bottom: 0;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #007fff;
                padding: 0 15px;
                font-size: 14px;
                cursor: pointer;
            }
            .input-fix-active {
                color: #909090;
                cursor: wait;
            }
            .input {
                padding: 10px;
                height: 45px;
                width: 100%;
                border: 1px solid #e9e9e9;
                border-radius: 2px;
                outline: none;
                box-sizing: border-box;
                color: #000;
                line-height: 45px;
                font-size: 15px;
                &::placeholder {
                    color: #999;
                    font-size: 14px;
                }
                &:focus {
                    border-color: #007fff;
                }
            }
        }
        .btn {
            margin: 20px 0;
            width: 100%;
            height: 40px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #007fff;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
        .bot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .bot-lf {
                color: #007fff;
                cursor: pointer;
                font-size: 14px;
            }
        }
        .image-group {
            margin: 0 auto;
            width: 240px;
            height: 240px;
            .code-img {
                width: 100%;
                height: 100%;
            }
        }
        .image-slot {
            position: absolute;
            top: 68px;
            left: 70px;
            width: 240px;
            height: 240px;
            background-color: rgb(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            .fail {
                color: #f56c6c;
                font-size: 18px;
                font-weight: bold;
            }
            .success {
                color: #409eff;
                font-size: 18px;
                font-weight: bold;
            }
        }
        .code-bot {
            padding-top: 10px;
            font-size: 15px;
            color: #999999;
            text-align: center;
            span {
                color: #38adff;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
}
@keyframes myfirst {
    0% {
        transform: scale(0, 0);
    }
    100% {
        transform: scale(1, 1);
    }
}
</style>
