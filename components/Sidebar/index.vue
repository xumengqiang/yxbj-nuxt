<template>
    <div class="index">
        <template v-for="(item, index) in routes">
            <nuxt-link
                class="nav-item"
                :key="index"
                :to="item.path"
                v-if="!item.hidden"
                custom
            >
                <div>
                    <i :class="item.meta.icon"></i>
                    <span>{{ item.meta.title }}</span>
                </div>
            </nuxt-link>
        </template>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: "Navbar",
    computed: {
        ...mapState(["routes"]),
    },
};
</script>
<style lang="less" scoped>
.index {
    margin-top: 20px;
    width: 100%;
    flex: 1;
    background-color: #fff;
    padding: 8px;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .nav-item {
        width: 100%;
        height: 44px;
        color: #333;
        font-size: 14px;
        padding-left: 40px;
        border-radius: 2px;
        box-sizing: border-box;
        line-height: 44px;
        text-align: left;
        cursor: pointer;
        i {
            font-size: 16px;
        }
        span {
            margin-left: 8px;
        }
        &:not(:first-child) {
            margin-top: 8px;
        }
    }
    .nuxt-link-active {
        background-color: #00a8ff;
        color: #fff;
    }
}
</style>
