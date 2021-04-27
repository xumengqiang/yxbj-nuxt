<template>
    <div class="body">
        <div class="body-nav">
            <div class="body-top">
                <h4>友情链接</h4>
                <p>欢迎大家登录系统提交自己的友链</p>
            </div>
        </div>
        <ul class="body-class">
            <li
                v-for="(item, index) in classList"
                :key="index"
                class="class-item"
                :class="{ 'is-active': index == navCurrent }"
                @click="ChangeClass(index)"
            >
                {{ item.className }}
            </li>
        </ul>
        <div class="body-bot">
            <div class="card">
                <div v-for="(e, index) in list" :key="index" class="card-item">
                    <a :href="e.linkurl" target="_blank">
                        <div class="item_info">
                            <div class="info_img">
                                <img :src="e.linklogo" />
                            </div>
                            <div class="info_tit">
                                <h4>{{ e.linkName }}</h4>
                                <p>{{ e.linkwords }}</p>
                            </div>
                        </div>
                        <div class="item_intr">
                            {{ e.linkdesc }}
                        </div>
                    </a>
                </div>
            </div>
            <div class="page">
                <Pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.pageIndex"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getCateArticle"
                />
            </div>
        </div>
        <div class="comment-wrap">
            <Comment
                v-model="commentData"
                :user="currentUser || {}"
                :article="article"
                :before-submit="submit"
                :before-like="like"
                :before-delete="deleteComment"
                :upload-img="uploadImg"
                :props="props"
            />
            <div v-if="commentData.length" class="comment-more">
                <div
                    :class="[
                        'comment-more-top',
                        commentsTotal > commentData.length
                            ? 'comment-more-top__active'
                            : '',
                    ]"
                    @click="loadMore"
                >
                    {{
                        commentsTotal > commentData.length
                            ? "查看更多评论"
                            : "没有更多啦"
                    }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { homeClassAll } from "api/class";
import { homelinkAll } from "api/link";
import {
    // eslint-disable-next-line camelcase
    comments_Add,
    // eslint-disable-next-line camelcase
    comments_Disable,
    // eslint-disable-next-line camelcase
    reply_add,
    // eslint-disable-next-line camelcase
    reply_Disable,
    // eslint-disable-next-line camelcase
    comments_list,
    // eslint-disable-next-line camelcase
    commentslike_Disable,
    // eslint-disable-next-line camelcase
    replylike_Disable,
} from "api/comments";
export default {
    name: "Link",
    layout: "link",
    async asyncData({ store }) {
        const currentUser = store.state.info || {};
        const result = await Promise.all([
            homeClassAll(),
            homelinkAll({
                pageIndex: 1,
                pageSize: 12,
                classId: "",
            }),
            comments_list({
                pageIndex: 1,
                pageSize: 10,
                discuss: 1,
                articleId: "f98ea410-2222-1111-3333-45d0794e84e8",
            }),
        ]);

        const listdate = result[2].data.rows;
        listdate.forEach((item) => {
            item.like = item.comm_likes.length;
            item._liked = item.comm_likes.some(
                (v) => v.accountId === currentUser.id
            );
            item.replies
                .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))
                .forEach((ele) => {
                    ele.like = ele.reply_likes.length;
                    ele._liked = ele.reply_likes.some(
                        (v) => v.accountId === currentUser.id
                    );
                });
        });

        return {
            classList: [{ className: "全部", id: "" }, ...result[0].data] || [],
            list: result[1].data.rows || [],
            total: result[1].data.count || 0,
            commentData: listdate,
            commentsTotal: result[2].data.count,
            busy: result[2].data.rows.length > 0 ? false : true,
        };
    },
    data() {
        return {
            navCurrent: 0, // 分类当前下标
            listQuery: {
                pageIndex: 1,
                pageSize: 12,
                classId: "",
            }, // 查询参数
            props: {
                content: "content",
                imgSrc: "imgSrc",
                children: "childrenComments",
                likes: "likes",
                reply: "reply",
                createAt: "createAt",
                user: "visitor",
            }, // 评论数组
            article: {
                accountId: "3c512700-5af9-11eb-a0f3-9120cd4a2877",
                cateId: "4f08fb60-5b1d-11eb-a0f3-9120cd4a2877",
                collection: 0,
                comments: 0,
                contentMd: "",
                contentText: "",
                cover: "",
                createdAt: "2021-02-14 17:49:15",
                deletedAt: null,
                describe: "",
                id: "f98ea410-2222-1111-3333-45d0794e84e8",
                like: 0,
                state: 1,
                title: "友情链接",
                type: 2,
                updatedAt: "2021-02-14 17:42:50",
                views: 1,
            }, // 文章详情
            contentQuery: {
                pageIndex: 1,
                pageSize: 10,
                discuss: 1,
                articleId: "f98ea410-2222-1111-3333-45d0794e84e8",
            }, // 评论初始数据
        };
    },
    computed: {
        currentUser() {
            return this.$store.state.info || {};
        },
    },
    methods: {
        // 获取分类友链
        getCateArticle() {
            homelinkAll(this.listQuery)
                .then((res) => {
                    this.list = res.data.rows;
                    this.total = res.data.count;
                })
                .catch(() => {});
        },
        // 分类切换
        ChangeClass(i) {
            this.navCurrent = i;
            this.listQuery.classId = this.classList[i].id;
            this.getCateArticle();
        },
        // 评论
        async submit(res) {
            return await new Promise((resolve, reject) => {
                if (res.type === 1) {
                    comments_Add({
                        articleId: this.article.id,
                        content: res.content,
                        discuss: 1,
                    })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: "评论成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reply_add({
                        commentsId: res.commentsId,
                        beaccountId: res.beaccountId,
                        content: res.content,
                        nickname: res.account.nickname || "",
                        blog: res.account.blog || "",
                        type: res.type === 2 ? 0 : 1,
                    })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: "回复成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },
        // 点赞
        async like(res) {
            return await new Promise((resolve, reject) => {
                if (res.articleId) {
                    commentslike_Disable({
                        commentsId: res.id,
                        state: res._liked ? 0 : 1,
                    })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: res._liked ? "点赞已取消" : "点赞成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    replylike_Disable({
                        replyId: res.id,
                        state: res._liked ? 0 : 1,
                    })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: res._liked ? "点赞已取消" : "点赞成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },
        // 上传图片
        async uploadImg({ file, callback }) {
            const res = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
            });

            callback(res);
        },
        // 删除
        async deleteComment(res) {
            return await new Promise((resolve, reject) => {
                if (res.articleId) {
                    comments_Disable({ id: res.id })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: "评论删除成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reply_Disable({ id: res.id })
                        .then((response) => {
                            resolve(response.data);
                            this.$notify({
                                title: "成功",
                                message: "回复删除成功",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },
        // 获取文章全部评论
        getComments() {
            this.busy = true;
            comments_list(this.contentQuery)
                .then((res) => {
                    if (res.data.rows.length > 0) {
                        const listdate = res.data.rows;
                        listdate.forEach((item) => {
                            item.like = item.comm_likes.length;
                            item._liked = item.comm_likes.some(
                                (v) => v.accountId === this.currentUser.id
                            );
                            item.replies
                                .sort((a, b) =>
                                    b.createdAt < a.createdAt ? 1 : -1
                                )
                                .forEach((ele) => {
                                    ele.like = ele.reply_likes.length;
                                    ele._liked = ele.reply_likes.some(
                                        (v) =>
                                            v.accountId === this.currentUser.id
                                    );
                                });
                        });
                        this.commentData =
                            this.contentQuery.pageIndex === 1
                                ? [...listdate]
                                : [...this.commentData, ...listdate];
                        this.commentsTotal = res.data.count;
                        this.busy = false;
                    } else {
                        this.busy = true;
                    }
                })
                .catch(() => {});
        },
        // 加载更多
        loadMore() {
            if (!this.busy && this.commentsTotal > this.commentData.length) {
                this.contentQuery.pageIndex++;
                this.getComments();
            }
        },
    },
};
</script>
<style lang="less" scoped>
.body {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    .body-nav {
        width: 100%;
        height: 90px;
        display: flex;
        justify-content: center;
        margin-top: 10px;
        background-image: url("../../assets/background/5.jpg");
        .body-top {
            width: 1200px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #fff;
            h4 {
                margin: 0 0 10px;
                font-size: 17px;
            }
            p {
                margin: 0;
            }
        }
    }
    .body-class {
        width: 100%;
        height: 50px;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border-bottom: solid 1px #eee;
        .class-item {
            display: flex;
            list-style: none;
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            padding: 0 20px;
            cursor: pointer;
        }
        .is-active {
            font-size: 15px;
            color: #00a8ff;
        }
    }
    .body-bot {
        width: 1200px;
        .card {
            display: flex;
            flex-wrap: wrap;
            .card-item {
                width: 380px;
                height: 180px;
                background: #fff;
                border: 1px solid #eee;
                border-radius: 4px;
                transition: all 0.3s;
                margin: 9px;
                .item_info {
                    display: flex;
                    align-items: center;
                    height: 110px;
                    box-sizing: border-box;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    .info_img {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin: 0 10px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .info_tit {
                        display: flex;
                        flex-direction: column;
                        h4 {
                            margin: 0;
                            font-size: 17px;
                            height: 25px;
                            color: #333;
                            -webkit-transition: all 0.3s;
                            transition: all 0.3s;
                        }
                        p {
                            margin: 0;
                            font-size: 14px;
                            color: #666;
                        }
                    }
                }
                .item_intr {
                    height: 40px;
                    margin: 15px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #666;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box; //作为弹性伸缩盒子模型显示。
                    -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
                    -webkit-line-clamp: 2; //显示的行
                }
                &:hover {
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                        0 0 6px rgba(0, 0, 0, 0.04);
                }
            }
        }
        .page {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
    }
    .comment-wrap {
        width: 1200px;
        border-radius: 4px;
        margin-top: 15px;
        // background: red;
        .comment-more {
            padding-bottom: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            .comment-more-top {
                width: 770px;
                height: 42px;
                font-size: 14px;
                text-align: center;
                line-height: 42px;
                color: #626675;
                border-radius: 6px;
                &__active {
                    background: #f5f5f6;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
