<template>
  <div class="base">
    <NavBar />
    <div class="main">
      <Nuxt />
    </div>
    <Footer />
    <Login
      v-if="showLogin"
      @close="changeClose"
    />
  </div>
</template>

<script>
export default {
  name: 'Default',
  computed: {
    showLogin () {
      return this.$store.state.settings.showLogin
    }
  },
  methods: {
    changeClose () {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showLogin',
        value: false
      })
    }
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
