<template>
    <div class="base">
        <NavBar></NavBar>
        <div class="main">
            <Nuxt />
        </div>
        <Footer></Footer>
    </div>
</template>

<script>

export default {
    name: "Link",
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
