
<template>
  <div id="he-plugin-standard" />
</template>
<script>
export default {
  mounted () {
    // 天气插件配置
    window.WIDGET = {
      CONFIG: {
        layout: '2',
        width: 300,
        height: 350,
        background: '1',
        dataColor: 'FFFFFF',
        borderRadius: '4',
        key: '1c0ced2874e3464db7d9a5d47770537e'
      }
    }
    // 引入天气插件
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src =
            'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0'
    document.body.appendChild(s)
  }
}
</script>
<style lang="less" scoped>
</style>
