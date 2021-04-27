<template>
    <div class="body">
        <div class="body-lf">
            <div class="content-menu article-content">
                <div v-if="article.cover" class="content-img">
                    <img
                        class="cover-img"
                        :src="article.cover"
                        :alt="article.title"
                    />
                </div>
                <article
                    ref="content"
                    v-viewer="{ movable: false }"
                    class="markdown-html"
                    v-html="content"
                />
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
        <div class="body-rg">
            <div class="linkfriends-container">
                <div class="titlebar">目录</div>
                <div v-if="toc.length == 0" class="ant-none">
                    该文章暂无目录
                </div>
                <div v-else class="ant-anchor-wrapper">
                    <div class="ant-anchor">
                        <div class="ant-anchor-ink">
                            <span
                                class="ant-anchor-ink-ball"
                                :class="{ visible: highlightIndex >= 0 }"
                                :style="{
                                    top: 10.5 + 30 * highlightIndex + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-for="(item, index) in toc"
                            :key="index"
                            class="ant-anchor-link"
                            :class="{
                                'ant-anchor-link-active':
                                    highlightIndex == index,
                            }"
                        >
                            <a
                                v-if="article.type === 1"
                                class="ant-anchor-link-title"
                                :title="item.text"
                                @click="showTitleHandler(index)"
                            >
                                {{ item.text }}
                            </a>
                            <a
                                v-else
                                class="ant-anchor-link-title"
                                :title="item.text"
                                @click="handleHighlight(item, index)"
                            >
                                {{ item.text }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wechat">
                <Wechat :status="2" />
            </div>
        </div>
    </div>
</template>
<script>
import { articleInfo } from "api/article";
import throttle from "utils/throttle";
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
import markdown from "utils/markdown";
export default {
    name: "About",
    async asyncData({ store }) {
        const currentUser = store.state.info || {};
        const result = await Promise.all([
            articleInfo({
                id: "265c67b0-9b6e-11eb-aff3-094ffeceb988",
            }),
            comments_list({
                pageIndex: 1,
                pageSize: 10,
                discuss: 1,
                articleId: "265c67b0-9b6e-11eb-aff3-094ffeceb988",
            }),
        ]);
        // 处理markdown数据，data为markdown文件读出的字符串
        const artMarked = await markdown.marked(result[0].data.contentMd);

        const listdate = result[1].data.rows;
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
            article: result[0].data || {},
            content: artMarked.content,
            toc: artMarked.toc,
            commentData: listdate,
            commentsTotal: result[1].data.count,
            busy: result[1].data.rows.length > 0 ? false : true,
        };
    },
    data() {
        return {
            highlightIndex: "", // 文章目标下标

            // commentData: [], // 评论数组
            props: {
                content: "content",
                imgSrc: "imgSrc",
                children: "childrenComments",
                likes: "likes",
                reply: "reply",
                createAt: "createAt",
                user: "visitor",
            },
            // commentsTotal: 0, // 评论总数
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                discuss: 1,
                articleId: "265c67b0-9b6e-11eb-aff3-094ffeceb988",
            },
            // busy: false,
            articleId: "265c67b0-9b6e-11eb-aff3-094ffeceb988",
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.info;
        },
    },
    // created() {
    //     this.getComments();
    // },
    mounted() {
        this.$nextTick(function () {
            window.addEventListener("scroll", this.onScroll);
        });
    },
    destroyed() {
        window.removeEventListener("scroll", this.onScroll);
    },
    methods: {
        // 滚动监听加标题
        onScroll: throttle(function () {
            let currentId = 0;
            if (this.article.type === 1) {
                let cur = null;
                let i = this.toc.length - 1;
                for (; i > 0; i--) {
                    cur = this.toc[i].anchor;
                    const top = cur.getBoundingClientRect().top;
                    if (top < 100) {
                        currentId = i;
                        break;
                    }
                }
            } else {
                const top = document.documentElement
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop;
                const items = document.getElementsByClassName("anchor-fix");
                for (let i = 0; i < items.length; i++) {
                    const _item = items[i];
                    const _itemTop = _item.offsetTop;
                    if (top > _itemTop - 75) {
                        currentId = i;
                    } else if (top === 0) {
                        currentId = 0;
                    } else {
                        break;
                    }
                }
            }
            if (currentId >= 0) {
                //  这里的currentOId是字符串，必须转换成数字，否则高亮项的全等无法匹配
                this.highlightIndex = parseInt(currentId);
            }
        }, 100),
        handleHighlight(item, index) {
            const jump = document.querySelectorAll(".anchor-fix");
            jump[index].scrollIntoView({ behavior: "smooth" });
        },
        showTitleHandler(index) {
            this.toc[index].anchor.scrollIntoView({
                behavior: "smooth",
            });
        },
        // 评论
        async submit(res) {
            return await new Promise((resolve, reject) => {
                if (res.type === 1) {
                    comments_Add({
                        articleId: this.articleId,
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
                            console.log(err);
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
                            console.log(err);
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
            console.log("uploadImg： ", res);
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
                            console.log(err);
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
                            console.log(err);
                        });
                }
            });
        },
        // 获取文章全部评论
        getComments() {
            this.busy = true;
            comments_list(this.listQuery)
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
                            this.listQuery.pageIndex === 1
                                ? [...listdate]
                                : [...this.commentData, ...listdate];
                        this.commentsTotal = res.data.count;
                        this.busy = false;
                    } else {
                        this.busy = true;
                    }
                })
                .catch((err) => console.log(err));
        },
        // 加载更多
        loadMore() {
            if (!this.busy && this.commentsTotal > this.commentData.length) {
                this.listQuery.pageIndex++;
                this.getComments();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.body {
    display: flex;
    .body-lf {
        width: 880px;
        .content-menu {
            background: #fff;
            padding: 15px;
            border-radius: 4px;
            .cotent-head {
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid #f1f1f1;
                .content-title {
                    font-weight: 600;
                    color: #333;
                    font-size: 28px;
                    line-height: 150%;
                    text-align: center;
                }
                .cotent-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 0;
                    i {
                        color: rgba(153, 153, 153, 0.8);
                    }
                    .icon-text {
                        font-size: 13px;
                        color: #999;
                        padding: 0 20px 0 5px;
                    }
                }
            }
            .content-img {
                padding-top: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                .cover-img {
                    width: 100%;
                }
            }
        }
        .comment-wrap {
            border-radius: 4px;
            margin-top: 15px;
            background: #fff;
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
        .article-suspended-panel {
            position: fixed;
            top: 250px;
            margin-left: -90px;
            .panel-btn {
                position: relative;
                margin-bottom: 20px;
                width: 40px;
                height: 40px;
                background-color: #fff;
                background-position: 50%;
                background-repeat: no-repeat;
                border-radius: 50%;
                box-shadow: 0 2px 4px 0 rgb(0 0 0 / 4%);
                cursor: pointer;
            }
            .like-adjust {
                background-position: 53% 46%;
            }
            .like-btn {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
            }
            .like-btn:hover {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
            }
            .like-active {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE1Ij4KICAgIDxwYXRoIGZpbGw9IiM2Q0JENDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIuODc0IDYuMDQ0VjE1aC0xLjczQy41MTMgMTUgMCAxNC4zODIgMCAxMy42MjRWNy41MjljMC0uNzkuNTM1LTEuNDg1IDEuMTQzLTEuNDg1aDEuNzMxek03LjYwNyAxLjI1QzcuNzIuNTA3IDguMzQ0LS4wMTMgOS4wMyAwYy45OC4wMTkgMS41NjMuODMzIDEuNzY2IDEuMjM1LjM3LjczNS4zOCAxLjk0Ni4xMjYgMi43MjQtLjIzLjcwNC0uNzYxIDEuNjI5LS43NjEgMS42MjloMy45ODJjLjQyIDAgLjgxMS4yMDYgMS4wNzIuNTYzYTEuNSAxLjUgMCAwIDEgLjIzMiAxLjI3MmwtMS44MDEgNi41MTNjLS4xNjQuNjI3LS43MDcgMS4wNjQtMS4zMiAxLjA2NEg0LjVWNS44OThDNi4yOTkgNS41MSA3LjQwNCAyLjU5IDcuNjA3IDEuMjQ5eiIvPgo8L3N2Zz4K);
            }
            .with-badge:after {
                content: attr(badge);
                position: absolute;
                top: 0;
                left: 75%;
                padding: 2px 6px;
                font-size: 1rem;
                text-align: center;
                line-height: 1;
                white-space: nowrap;
                color: #fff;
                background-color: #b2bac2;
                border-radius: 0.7rem;
                transform-origin: left top;
                transform: scale(0.75);
            }
            .like-active:after {
                background-color: #74ca46;
            }
            .comment-btn {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDE0IDEzIj4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDB2OS4yM0g4LjgxNUwzLjM3IDEzVjkuMjNIMFYweiIvPgo8L3N2Zz4K);
            }
            .comment-btn:hover {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDE0IDEzIj4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDB2OS4yM0g4LjgxNUwzLjM3IDEzVjkuMjNIMFYweiIvPgo8L3N2Zz4K);
            }
            .comment-adjust {
                background-position: 50% 55%;
            }
            .collect-btn {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiNCMkJBQzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
            }
            .collect-btn:hover {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiM4QTkzQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
            }
            .collect-active {
                background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICAgIDxwYXRoIGZpbGw9IiNGRkMzNDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzMyIDE0Ljk2OGMtLjQ2LS4yNTUtMS4yMDUtLjI1NS0xLjY2NiAwTDQuMzUgMTYuNzk0Yy0uOTIxLjUwNi0xLjUyMy4wNDQtMS4zNDktMS4wMjdsLjYzNS0zLjg2N2MuMDg4LS41MzctLjE0Mi0xLjI4LS41MTYtMS42NkwuNDM2IDcuNWMtLjc0NS0uNzYtLjUxMS0xLjUwNC41MTYtMS42NmwzLjcwNy0uNTY0Yy41MTQtLjA4IDEuMTE5LS41MzggMS4zNDgtMS4wMjdMNy42NjUuNzMxYy40NjItLjk3NiAxLjIwOC0uOTczIDEuNjY3IDBsMS42NiAzLjUxOWMuMjMuNDg5LjgzMy45NSAxLjM0OSAxLjAyN2wzLjcwOC41NjRjMS4wMjkuMTU2IDEuMjU4LjkwMi41MTUgMS42NmwtMi42ODUgMi43MzljLS4zNzIuMzgtLjYwMyAxLjEyMy0uNTE1IDEuNjZsLjYzNCAzLjg2N2MuMTc2IDEuMDc0LS40MyAxLjUzMy0xLjM0OCAxLjAyN2wtMy4zMTgtMS44MjZ6Ii8+Cjwvc3ZnPgo=);
            }
            .share-title {
                margin: 20px 0;
                font-size: 14px;
                text-align: center;
                color: #c6c6c6;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .wechat-btn {
                background-image: url(//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/wechat.63e1ce0.svg);
            }
            .wechat-btn:hover {
                background-image: url(//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/wechat-hover.c8ce019.svg);
            }
            .qrcode {
                position: absolute;
                left: -70%;
                padding: 6px;
                background-color: #fff;
            }
        }
    }
    .body-rg {
        margin-left: 20px;
        width: 300px;
        height: 100%;
        position: sticky;
        top: 80px;
        .linkfriends-container {
            box-shadow: 0 1px 3px rgba(26, 26, 26, 0.05);
            border-radius: 4px;
            padding: 10px 15px;
            background-color: #fff;
            overflow: hidden;
            .titlebar {
                margin-bottom: 16px;
                height: 30px;
                font-size: 17px;
                line-height: 30px;
                font-weight: bold;
                color: #333;
                position: relative;
            }
            .titlebar:after {
                top: 36px;
                width: 100%;
                border-top: 1px #f0f0f0 solid;
                display: block;
                left: 0;
                content: "";
                position: absolute;
            }
            .ant-none {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                padding-bottom: 10px;
            }
        }
        .wechat {
            margin-top: 10px;
            height: 141px;
        }
    }
}
</style>
