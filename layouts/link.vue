<template>
    <div class="base">
        <el-backtop :bottom="100"></el-backtop>
        <NavBar />
        <div class="main">
            <Nuxt />
        </div>
        <Footer />
        <Login v-if="showLogin" @close="changeClose" />
    </div>
</template>

<script>
export default {
    name: "Link",
    computed: {
        showLogin() {
            return this.$store.state.showLogin;
        },
    },
    methods: {
        changeClose() {
            this.$store.dispatch("changeSetting", {
                key: "showLogin",
                value: false,
            });
        },
    },
};
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
        width: 100%;
        background-color: #fff;
    }
}
</style>
