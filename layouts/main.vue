<template>
    <div class="base">
        <NavBar></NavBar>
        <div class="main">
            <div class="main_lf">
                <Main></Main>
                <Sidebar></Sidebar>
            </div>
            <div class="main_rg">
                <transition name="fade-transform" mode="out-in">
                    <Nuxt />
                </transition>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
export default {
    name: "Fullscreen",
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
        height: calc(100vh - 110px);
        overflow: hidden;
        width: 1200px;
        padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .main_lf {
            width: 230px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .main_rg {
            width: 960px;
            height: 100%;
            padding: 40px;
            box-sizing: border-box;
            border-radius: 4px;
            background-color: #fff;
        }
    }
}
</style>