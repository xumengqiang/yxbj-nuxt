<template>
    <div class="doc">
        <div class="doc-lf">
            <ul class="doc-ul">
                <li
                    v-for="(item, index) in screenList"
                    class="doc-li"
                    :class="{ 'doc-li-active': pid == item.id }"
                    :key="index"
                    @click="changeDoc(item.id)"
                >
                    {{ item.title }}
                </li>
            </ul>
        </div>
        <div class="doc-rg" v-loading="loading">
            <div class="body-lf">
                <div class="content-menu article-content">
                    <article
                        v-viewer="{ movable: false }"
                        class="markdown-html"
                        v-html="content"
                        ref="content"
                    ></article>
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
                    <div class="comment-more" v-if="commentData.length">
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
                    <div class="ant-none" v-if="toc.length == 0">
                        该笔记暂无目录
                    </div>
                    <div class="ant-anchor-wrapper" v-else>
                        <div class="ant-anchor">
                            <div class="ant-anchor-ink">
                                <span
                                    class="ant-anchor-ink-ball"
                                    :class="{
                                        visible: highlightIndex >= 0,
                                    }"
                                    :style="{
                                        top: 10.5 + 30 * highlightIndex + 'px',
                                    }"
                                ></span>
                            </div>
                            <div
                                class="ant-anchor-link"
                                :class="{
                                    'ant-anchor-link-active':
                                        highlightIndex == index,
                                }"
                                v-for="(item, index) in toc"
                                :key="index"
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
            </div>
        </div>
    </div>
</template>
<script>
import { screenNote, notesInfo } from "api/note";
import {
    comments_Add,
    comments_Disable,
    reply_add,
    reply_Disable,
    comments_list,
    commentslike_Disable,
    replylike_Disable,
} from "api/comments";
import markdown from "utils/markdown";
import getCatalog from "utils/getCatalog";
import throttle from "utils/throttle";
export default {
    name: "Document",
    layout: "document",
    async asyncData({ route }) {
        const res = await screenNote({ screenId: route.params.id });
        const result = await notesInfo({ id: res.data[0].id });
        let content = "";
        let artMarked;
        if (result.data.type === 1) {
            content = res.data.contentText;
        } else {
            //处理markdown数据，data为markdown文件读出的字符串
            artMarked = await markdown.marked(result.data.contentMd);
        }
        return {
            screenList: res.data,
            pid: res.data[0].id,
            article: result.data,
            content: content || artMarked.content,
            toc: artMarked.toc,
        };
    },
    data() {
        return {
            highlightIndex: "", //文章目标下标
            loading: false, //加载loading
            commentData: [], //评论数组
            props: {
                content: "content",
                imgSrc: "imgSrc",
                children: "childrenComments",
                likes: "likes",
                reply: "reply",
                createAt: "createAt",
                user: "visitor",
            },
            commentsTotal: 0, //评论总数
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                discuss: 2,
                articleId: 0,
            },
            busy: false,
        };
    },
    created() {
        this.getComments();
    },
    computed: {
        currentUser() {
            return this.$store.state.info;
        },
    },
    mounted() {
        this.$nextTick(function () {
            window.addEventListener("scroll", this.onScroll, true);
            if (this.article.type === 1) {
                const { noLevels } = getCatalog(this.$refs.content);
                this.toc = noLevels;
            }
        });
    },
    destroyed() {
        window.removeEventListener("scroll", this.onScroll, true);
    },
    methods: {
        changeDoc(id) {
            if (this.pid == id) return;
            this.loading = true;
            this.pid = id;
            this.listQuery.pageIndex == 1;
            this.busy = false;
            this.getNoteInfo();
            document.querySelector(".doc-rg").scrollTop = 0;
        },
        getNoteInfo() {
            notesInfo({ id: this.pid })
                .then((res) => {
                    document.title = res.data.title;
                    this.article = res.data;
                    if (res.data.type === 1) {
                        this.content = res.data.contentText;
                        this.$nextTick(() => {
                            let { noLevels } = getCatalog(this.$refs.content);
                            this.toc = noLevels;
                            this.loading = false;
                        });
                    } else {
                        //处理markdown数据，data为markdown文件读出的字符串
                        const article = markdown.marked(res.data.contentMd);
                        article.then((response) => {
                            this.content = response.content;
                            this.toc = response.toc;
                            this.loading = false;
                        });
                    }
                    this.getComments();
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        /**
         * 滚动监听加标题
         */
        onScroll: throttle(function () {
            let currentId = 0;
            if (this.article.type === 1) {
                let cur = null;
                let i = this.toc.length - 1;
                for (; i > 0; i--) {
                    cur = this.toc[i].anchor;
                    let top = cur.getBoundingClientRect().top;
                    if (top < 100) {
                        currentId = i;
                        break;
                    }
                }
            } else {
                let top =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    document.querySelector(".doc-rg").scrollTop;
                let items = document.getElementsByClassName("anchor-fix");
                for (let i = 0; i < items.length; i++) {
                    let _item = items[i];
                    let _itemTop = _item.offsetTop;
                    if (top > _itemTop - 75) {
                        currentId = i;
                    } else if (top == 0) {
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
            let jump = document.querySelectorAll(".anchor-fix");
            jump[index].scrollIntoView({ behavior: "smooth" });
        },
        showTitleHandler(index) {
            this.toc[index].anchor.scrollIntoView({
                behavior: "smooth",
            });
        },
        //评论
        async submit(res) {
            return await new Promise((resolve, reject) => {
                if (res.type === 1) {
                    comments_Add({
                        articleId: this.pid,
                        content: res.content,
                        discuss: 2,
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
        //点赞
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
        //上传图片
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
        //删除
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
        //获取文章全部评论
        getComments() {
            this.listQuery.articleId = this.pid;
            this.busy = true;
            comments_list(this.listQuery)
                .then((res) => {
                    let listdate = res.data.rows;
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
                                    (v) => v.accountId === this.currentUser.id
                                );
                            });
                    });
                    this.commentData =
                        this.listQuery.pageIndex == 1
                            ? [...listdate]
                            : [...this.commentData, ...listdate];
                    this.commentsTotal = res.data.count;
                    this.busy = false;
                })
                .catch(() => {});
        },
        /**
         * 加载更多
         */
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
.doc {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .doc-lf {
        width: 320px;
        height: 100%;
        box-sizing: border-box;
        overflow-y: scroll;
        border-right: 1px solid #eaecef;
        .doc-ul {
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 10px 0;
            box-sizing: border-box;
            .doc-li {
                display: block;
                padding-left: 20px;
                height: 35px;
                color: #444;
                line-height: 35px;
                font-size: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                transition: 0.15s ease-out;
                cursor: pointer;
                font-weight: 400;
                box-sizing: border-box;
                border-left: 4px solid #fff;
                &:hover {
                    color: #409eff;
                    border-left: 4px solid #409eff;
                }
            }
            .doc-li-active {
                border-left: 4px solid #409eff;
                color: #409eff;
            }
        }
    }
    .doc-rg {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        overflow-y: scroll;
        .body-lf {
            width: 880px;
            .content-menu {
                padding: 0 15px;
                border-bottom: 1px solid #eaecef;
            }
            .comment-wrap {
                margin-top: 15px;
                padding-bottom: 100px;
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
        .body-rg {
            margin-left: 20px;
            width: 300px;
            height: 80%;
            position: sticky;
            top: 60px;
            .linkfriends-container {
                border-radius: 4px;
                padding: 10px 15px;
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
        }
    }
}
</style>