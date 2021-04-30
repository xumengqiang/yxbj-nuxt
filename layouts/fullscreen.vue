<template>
    <div class="base">
        <el-backtop :bottom="100"></el-backtop>
        <Nuxt />
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