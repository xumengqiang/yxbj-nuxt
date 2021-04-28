<template>
    <div class="base">
        <NavBar />
        <div class="main">
            <Nuxt />
        </div>
        <Login v-if="showLogin" @close="changeClose" />
    </div>
</template>

<script>
export default {
    name: "Document",
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
        height: calc(100vh - 60px);
        width: 100%;
        background-color: #fff;
    }
}
</style>
