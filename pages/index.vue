<template>
    <div class="body">
        <div class="body-lf">
            <div class="nav-swiper">
                <el-carousel
                    :interval="5000"
                    trigger="click"
                    height="330px"
                    :loop="true"
                >
                    <el-carousel-item
                        v-for="(item, index) in swiperList"
                        :key="index"
                    >
                        <img
                            class="swiper-img"
                            :src="item.url"
                            @click="ChangeLink(item.link)"
                        />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="content">
                <h3 class="content-title">#最近更新</h3>
                <ArticleItem v-for="item in list" :key="item.id" :item="item" />
            </div>
        </div>
        <div class="body-rg">
            <div class="clock">
                <Clock />
            </div>
            <div class="pig">
                <Pig />
            </div>
            <div class="whater">
                <Weather />
            </div>
            <div class="wechat">
                <Wechat :status="1" />
            </div>
        </div>
    </div>
</template>
<script>
import { newArticleLimit } from "api/article";
import { HomeSwiper } from "api/swiper";
export default {
    name: "Home",
    head() {
        return {
            title: '优秀笔记-个人博客',
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: "优秀笔记,专注大前端热门技术,原创文章,分享经验心得",
                },
                { hid: "keywords", name: "keywords", content: "优秀笔记,优秀,笔记,个人博客,技术博客,博客网站,个人网站" },
            ],
        };
    },
    async asyncData() {
        const result = await Promise.all([
            HomeSwiper(),
            newArticleLimit({ limit: 10 }),
        ]);
        return { swiperList: result[0].data || [], list: result[1].data || [] };
    },
    methods: {
        // 跳转链接
        ChangeLink(link) {
            if (link.includes("http")) {
                window.open(link, "_blank");
            }
        },
    },
};
</script>
<style lang="less" scoped>
.body {
    display: flex;
    .body-lf {
        margin-right: 15px;
        width: 885px;
        .nav-swiper {
            background-color: #fff;
            border-radius: 4px;
            cursor: pointer;
            .el-carousel__item {
                border-radius: 4px;
                .swiper-img {
                    width: 100%;
                    border-radius: 4px;
                }
            }
        }
        .content {
            margin-top: 15px;
            display: flex;
            border-radius: 4px;
            flex-direction: column;
            background-color: #fff;
            .content-title {
                padding: 10px;
                color: rgb(51, 51, 51);
            }
        }
    }
    .body-rg {
        width: 300px;
        .clock {
            height: 300px;
            margin-bottom: 15px;
        }
        .pig {
            margin-bottom: 15px;
        }
        .whater {
            position: sticky;
            top: 70px;
            height: 350px;
            margin-bottom: 15px;
        }
        .wechat {
            position: sticky;
            top: 435px;
            height: 141px;
        }
    }
}
</style>
