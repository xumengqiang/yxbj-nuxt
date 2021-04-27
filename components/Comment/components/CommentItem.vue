<template>
    <div class="comment-item" :class="{ 'sub-comment-item': isSubComment }">
        <div class="comment">
            <!-- 评论或回复人头像 -->
            <img
                class="avatar"
                :src="comment.account.avatar || circleUrl"
                @error="(e) => e.target.classList.add('error')"
            />
            <div class="content-box">
                <!-- 评论或回复人具体信息 -->
                <div class="meta-box">
                    <slot name="userMeta">
                        <div class="user-popover-box">
                            <span v-if="comment.account">{{
                                `${comment.account.nickname || "笔芯"}${
                                    comment.accountId === user.id
                                        ? "（作者）"
                                        : ""
                                }`
                            }}</span>
                        </div>
                    </slot>
                </div>

                <!-- 评论或回复内容 -->
                <div class="content">
                    <span v-if="comment.type == 1" class="reply"
                        >回复
                        <span class="reply-target">{{
                            comment.nickname || "笔芯" + "："
                        }}</span>
                    </span>
                    {{ comment.content }}
                    <!-- <div v-if="comment.imgSrc" class="img-box">
            <img
              :src="comment.imgSrc || ''"
              @error="(e) => e.target.classList.add('error')"
            >
          </div> -->
                </div>

                <!-- 评论或回复时间及操作 -->
                <div class="reply-stat">
                    <time :datetime="comment.createdAt">{{
                        comment.createdAt | formatTime
                    }}</time>
                    <div
                        v-if="user.id === comment.accountId && isSubComment"
                        class="delete"
                        @click.stop="$emit('comment-delete', { id, comment })"
                    >
                        <span>·</span>删除
                    </div>
                    <div class="action-box">
                        <div
                            class="like-action action"
                            :class="{ active: comment._liked }"
                            @click.stop="$emit('comment-like', { id, comment })"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                class="icon like-icon"
                            >
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z" />
                                    <path
                                        :stroke="
                                            comment._liked
                                                ? '#37C700'
                                                : '#8A93A0'
                                        "
                                        stroke-linejoin="round"
                                        :fill="
                                            comment._liked ? '#37c700' : 'none'
                                        "
                                        d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                                    />
                                </g>
                            </svg>
                            <span v-show="comment.like" class="action-title">{{
                                comment.like
                            }}</span>
                        </div>
                        <div
                            class="comment-action action"
                            @mousedown.prevent="$emit('comment-reply', id)"
                            @click.prevent
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                class="icon comment-icon"
                            >
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M0 0h20v20H0z" />
                                    <path
                                        stroke="#8A93A0"
                                        stroke-linejoin="round"
                                        d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                                    />
                                </g>
                            </svg>
                            <span class="action-title">回复</span>
                        </div>
                    </div>
                </div>

                <!-- 评论表单组件 -->
                <slot :id="id" />

                <!-- 回复列表 -->
                <slot name="subList" :parentId="id" />
            </div>
        </div>
    </div>
</template>

<script>
import util from "utils/util";
export default {
    name: "CommentItem",
    props: {
        comment: {
            type: Object,
            default: () => {},
            required: true,
        },
        id: {
            type: [String, Number],
            required: true,
        },
        user: {
            type: Object,
            default: () => {},
        },
    },
    filters: {
        formatTime(time) {
            return util.formatTime(time);
        },
    },
    data() {
        return {
            circleUrl: require("@/assets/head-bd.png"),
        };
    },
    computed: {
        isSubComment() {
            return this.id.split("-").length === 3;
        },
    },
};
</script>
<style lang="less" scoped>
.comment-item {
    margin-bottom: 20px;
    &:not(:last-child) {
        .content-box {
            border-bottom: 1px solid #f1f1f1;
        }
    }
    .comment {
        display: flex;
        .content-box {
            margin-left: 15px;
            flex: 1 1 auto;
            &.focus {
                padding-bottom: 10px;
            }
            .meta-box {
                display: flex;
                align-items: center;
                font-size: 15px;
                line-height: 1.25;
                white-space: nowrap;
                .user-popover-box {
                    color: #333;
                    cursor: pointer;
                }
            }
            .content {
                margin-top: 10px;
                font-size: 16px;
                line-height: 28px;
                // white-space: pre-line;
                word-break: break-all;
                color: #333;
                overflow: hidden;
                .img-box {
                    margin-top: 10px;
                    img {
                        max-width: 100%;
                        max-height: 100px;
                        object-fit: cover;
                    }
                }
                .reply {
                    vertical-align: top;
                }
                .reply-target {
                    cursor: pointer;
                    color: #406599;
                }
            }
        }
        .reply-stat {
            display: flex;
            margin-top: 10px;
            font-weight: 400;
            time,
            .delete {
                font-size: 14px;
                color: #8a9aa9;
            }
            .delete {
                visibility: hidden;
                cursor: pointer;
                span {
                    margin: 0 6px;
                }
            }
            .action-box {
                flex: 0 0 auto;
                display: flex;
                justify-content: space-between;
                margin-left: auto;
                color: #8a93a0;
                user-select: none;
                .action {
                    display: flex;
                    align-items: center;
                    margin-left: 30px;
                    cursor: pointer;
                    &:hover {
                        opacity: 0.8;
                    }
                    &.active {
                        color: #37c700;
                    }
                    .icon {
                        width: 16px;
                        height: 16px;
                    }
                    .action-title {
                        margin-left: 8px;
                        // padding-top: 4px;
                        font-size: 13px;
                    }
                }
            }
            &:hover .delete {
                visibility: visible;
            }
        }
    }
}

.sub-comment-list {
    margin: 12px 0;
    padding: 0 12px;
    background-color: #fafbfc;
    border-radius: 4px;
    .comment-item {
        margin-bottom: 0;
        &:last-child .content-box {
            border-bottom: none;
        }
        .comment {
            position: relative;
            padding: 10px 0 0;

            .content-box {
                padding-bottom: 10px;
            }
        }
    }
}
</style>
