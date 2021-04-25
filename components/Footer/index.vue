<template>
  <div class="footer">
    Copyright © 2020-2021 YXBJ All Rights Reserved V.1.0.3 备案号: <a
      target="_blank"
      href="https://beian.miit.gov.cn/"
    >豫ICP备2020033746号</a>
  </div>
</template>
<script>
export default {
  name: 'Footer'
}
</script>
<style lang="scss" scoped>
.footer {
    background: #fff;
    height: 50px;
    width: 100%;
    color: #666;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
        text-decoration: none;
        color: #666;
    }
}
</style>
