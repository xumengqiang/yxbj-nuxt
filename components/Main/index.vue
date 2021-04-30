<template>
    <div class="index">
        <div class="user-photo">
            <img class="photo" :src="info.avatar ? info.avatar : circleUrl" />
        </div>
        <h3 class="user-name">{{ info.nickname ? info.nickname : "笔芯" }}</h3>
        <div class="other-info">笔记年龄:{{ info.createdAt | Age }}</div>
    </div>
</template>
<script>
import util from "utils/util";
export default {
    name: "Navbar",
    filters: {
        Age(time) {
            return util.Age(time);
        },
    },
    data() {
        return {
            circleUrl: "https://file.youxiubiji.com/nuxt/head-bd.png",
        };
    },
    computed: {
        info() {
            return this.$store.state.info;
        },
    },
};
</script>
<style lang="less" scoped>
.index {
    width: 100%;
    background-color: #fff;
    padding: 40px 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    .user-photo {
        width: 100px;
        height: 100px;
        .photo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .user-name {
        margin: 0;
        padding-top: 10px;
        font-size: 16px;
        color: #262626;
    }
    .other-info {
        padding-top: 30px;
        color: #666;
        font-size: 13px;
    }
}
</style>
