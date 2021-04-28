<template>
    <div class="doc">
        <ul class="doc-ul">
            <nuxt-link
                v-for="(item, index) in screenList"
                :key="index"
                v-slot="{ href, navigate }"
                :to="`/document/${item.id}`"
                target="_blank"
                custom
                class="doc-item miniprogram"
                :style="{
                    backgroundImage: 'url(' + item.cover + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'contain',
                }"
            >
                <a :href="href" @click="navigate">
                    <h3 class="doc__title">
                        <i
                            class="doc__icon"
                            :style="{
                                backgroundImage: 'url(' + item.icon + ')',
                            }"
                        />
                        <span class="doc__text">{{ item.screenName }}</span>
                    </h3>
                </a>
            </nuxt-link>
        </ul>
    </div>
</template>
<script>
import { homeScreenAll } from "api/screen";
export default {
    name: "Doc",
    head() {
        return {
            title: '优秀笔记-优秀文档',
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
        const result = await homeScreenAll();
        return { screenList: result.data };
    },
};
</script>
<style lang="less" scoped>
.doc {
    padding-top: 30px;
    .doc-ul {
        display: flex;
        list-style: none;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        .doc-item {
            width: 333.3px;
            height: 206px;
            margin: 0 100px 50px 0;
            color: #000;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.03);
            position: relative;
            cursor: pointer;
            transition: transform 0.3s;
            &:hover {
                transform: scale(1.1);
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background-size: 100% auto;
                background-position: 100% 0;
                background-repeat: no-repeat;
            }
            .doc__title {
                font-weight: 400;
                font-size: 18px;
                position: absolute;
                bottom: 15px;
                left: 30px;
                .doc__icon {
                    display: inline-block;
                    width: 36px;
                    height: 36px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                .doc__text {
                    vertical-align: middle;
                }
            }
        }
        &::after {
            content: "";
            flex: auto;
        }
    }
}
</style>
