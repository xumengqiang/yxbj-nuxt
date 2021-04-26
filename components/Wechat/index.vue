<template>
  <img
    class="wechat"
    :src="status == 1 ? wechatImg : wechatff"
    alt="微信公众号"
  >
</template>
<script>
export default {
  name: 'Wechat',
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      wechatImg: require('../../assets/wechat.png'),
      wechatff: require('../../assets/wechat_ff.png')
    }
  }
}
</script>
<style lang="less" scoped>
.wechat {
    width: 100%;
    height: 100%;
    border-radius: 4px;
}
</style>
