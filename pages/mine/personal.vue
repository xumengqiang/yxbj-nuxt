<template>
    <div class="home">
        <h2 class="title">我的数据</h2>
        <div class="menu">
            <div class="item item-1">
                <div class="item-lf">
                    <span class="label">文章</span>
                    <div class="count">{{ count }}</div>
                </div>
                <div class="item-rg">
                    <i class="el-icon-document"></i>
                </div>
            </div>
            <div class="item item-2">
                <div class="item-lf">
                    <span class="label">友链</span>
                    <div class="count">{{ link }}</div>
                </div>
                <div class="item-rg">
                    <i class="el-icon-paperclip"></i>
                </div>
            </div>
            <div class="item item-3">
                <div class="item-lf">
                    <span class="label">点赞</span>
                    <div class="count">{{ like }}</div>
                </div>
                <div class="item-rg">
                    <i class="el-icon-thumb"></i>
                </div>
            </div>
            <div class="item item-4">
                <div class="item-lf">
                    <span class="label">收藏</span>
                    <div class="count">{{ collection }}</div>
                </div>
                <div class="item-rg">
                    <i class="el-icon-star-off"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mineArticlelist } from "api/article";
import { linkUserList } from "api/link";
import { article_like_list, article_collection_list } from "api/article_like";
export default {
    name: "Personal",
    layout: "main",
    data() {
        return {
            count: 0,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                title: "",
            },
            link: 0,
            like: 0,
            collection: 0,
        };
    },
    created() {
        mineArticlelist(this.listQuery).then((response) => {
            this.count = response.data.count;
        });
        linkUserList().then((response) => {
            this.link = response.data.length || 0;
        });
        article_like_list(this.listQuery).then((response) => {
            this.like = response.data.count;
        });
        article_collection_list(this.listQuery).then((response) => {
            this.collection = response.data.count;
        });
    },
};
</script>
<style lang="less" scoped>
.home {
    display: flex;
    flex-direction: column;
    .title {
        color: #333;
        font-size: 18px;
    }
    .menu {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 250px;
            height: 90px;
            margin-bottom: 40px;
            margin-right: 65px;
            padding: 10px 20px;
            border-radius: 4px;
            box-sizing: border-box;

            .item-lf {
                display: flex;
                flex-direction: column;
                .label {
                    color: #fff;
                    font-size: 15px;
                    padding-bottom: 10px;
                }
                .count {
                    color: #fff;
                    font-size: 50px;
                    line-height: 50px;
                    font-weight: bold;
                }
            }
            .item-rg {
                color: #fff;
                font-size: 50px;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
        .item-1 {
            background-image: linear-gradient(90deg, #79daff, #489aff);
        }
        .item-2 {
            background-image: linear-gradient(90deg, #f390f8, #a268ff);
        }
        .item-3 {
            background-image: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        }
        .item-4 {
            background-image: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
        }
    }
}
</style>