<template>
  <div class="base">
    <Headers />
    <div class="main">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Headers from '@/components/NavBar/index'
import Footer from '@/components/Footer/index'

export default {
  name: 'Default',
  components: {
    Headers,
    Footer
  }
}
</script>
<style lang="less" scoped>
.base {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  .main {
    min-height: calc(100vh - 110px);
    width: 1200px;
    padding: 10px 0;
    box-sizing: border-box;
  }
}
</style>
