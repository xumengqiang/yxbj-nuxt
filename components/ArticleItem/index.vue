<template>
    <div class="content-item">
        <div class="item_info">
            <div class="item_type">
                <div class="item_type-cate">#</div>
                <div v-if="item.cate" class="item_type-title">
                    {{ item.cate.cateName }}
                </div>
            </div>
            <nuxt-link :to="`/article/${item.id}`" target="_blank" tag="a">
                <h4 class="home-h4">
                    {{ item.title }}
                </h4>
            </nuxt-link>
            <p class="info_intr">
                {{ item.describe }}
            </p>
            <div class="info_msg">
                <span>{{ item.createdAt | formatTime }}</span>
                浏览 {{ item.views }}
            </div>
        </div>
        <div class="item_img" v-if="item.cover">
            <img :src="item.cover" />
        </div>
    </div>
</template>
<script>
import util from "utils/util";
export default {
    name: "ArticleItem",
    props: {
        item: {},
    },
    filters: {
        formatTime(time) {
            return util.formatTime(time);
        },
    },
};
</script>
<style lang="scss" scoped>
.content-item {
    height: 160px;
    border-bottom: 1px solid #eee;
    margin: 10px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .item_info {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        .item_type {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            .item_type-cate {
                background: #00a8ff;
                margin-right: 5px;
                width: 22px;
                height: 22px;
                color: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            p {
                color: #333;
            }
        }
        a {
            text-decoration: none;
            .home-h4 {
                margin-top: 0;
                color: #333;
                margin-bottom: 0;
                -webkit-transition: all 0.2s;
                transition: all 0.2s;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                cursor: pointer;
            }
        }
        .info_intr {
            color: #999;
            font-size: 14px;
            height: 40px;
            line-height: 20px;
            margin-bottom: 10px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .info_msg {
            font-size: 14px;
            color: #999;
            span {
                margin-right: 10px;
            }
        }
    }
    .item_img {
        width: 180px;
        box-sizing: border-box;
        padding: 20px;
        img {
            border-radius: 4px;
            height: 90%;
            width: 100%;
        }
    }
    &:hover a .home-h4 {
        color: #00a8ff;
    }
    &:hover .item_type-title {
        color: #00a8ff;
    }
    &:last-child {
        border: none;
    }
}
</style>
