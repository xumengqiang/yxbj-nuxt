<template>
  <div ref="comment" class="comment-menu">
    <!-- 顶部评论表单 -->
    <comment-form
      :type="1"
      :upload-img="uploadImg"
      @form-submit="formSubmit"
    >
      <img
        class="avatar"
        :src="user.avatar || circleUrl"
        @error="(e) => e.target.classList.add('error')"
      >
    </comment-form>

    <!-- 底部评论列表 -->
    <comment-list v-if="cacheData.length > 0" ref="comment-list">
      <!-- 单条评论 -->
      <comment-item
        v-for="(comment, i) in cacheData"
        :id="`comment-${i}`"
        :key="`comment-${i}`"
        :ref="`comment-${i}`"
        :user="user"
        :comment="comment"
        @comment-reply="hasForm"
        @comment-like="handleCommentLike"
        @comment-delete="handleCommentDelete"
      >
        <!-- 回复表单 -->
        <template #default="{ id }">
          <comment-form
            v-if="forms.includes(id)"
            :id="id"
            :type="2"
            :comments-id="comment.id"
            :account="comment.account"
            :beaccount-id="comment.accountId"
            :placeholder="`回复${
              comment.account.nickname || '笔芯'
            }...`"
            :upload-img="uploadImg"
            @form-submit="formSubmit"
            @form-delete="deleteForm"
          />
        </template>

        <!-- 单条评论下的回复列表 -->
        <template #subList="{ parentId }">
          <comment-list sub>
            <!-- 单条回复 -->
            <comment-item
              v-for="(child, j) in comment.replies"
              :id="`${parentId}-${j}`"
              :key="`${parentId}-${j}`"
              :ref="`${parentId}-${j}`"
              :comment="child"
              :user="user"
              @comment-reply="hasForm"
              @comment-like="handleCommentLike"
              @comment-delete="handleCommentDelete"
            >
              <!-- 单条回复的回复表单 -->
              <comment-form
                v-if="forms.includes(`${parentId}-${j}`)"
                :id="`${parentId}-${j}`"
                :comment="child"
                :type="3"
                :comments-id="comment.id"
                :account="child.account"
                :beaccount-id="child.accountId"
                :placeholder="`回复${
                  (child.account && child.account.nickname) ||
                  '笔芯'
                }...`"
                :upload-img="uploadImg"
                @form-delete="deleteForm"
                @form-submit="formSubmit"
              />
            </comment-item>
          </comment-list>
        </template>
      </comment-item>
    </comment-list>
  </div>
</template>

<script>
import util from 'utils/util'
import CommentForm from './components/CommentForm'
import CommentList from './components/CommentList'
import CommentItem from './components/CommentItem'
export default {
  name: 'JueJinComment',
  components: { CommentList, CommentItem, CommentForm },
  inheritAttrs: false,
  model: {
    prop: 'commentData',
    event: 'input'
  },
  props: {
    /* 数据 */
    commentData: {
      type: Array,
      default: () => [],
      required: true
    },
    /* 当前用户 */
    user: {
      type: Object,
      default: () => {},
      required: true
    },
    /* 配置属性 */
    props: {
      type: Object,
      default: () => {}
    },
    /* 提交表单前事件 */
    beforeSubmit: {
      type: Function,
      default: null
    },
    /* 执行点赞前事件 */
    beforeLike: {
      type: Function,
      default: null
    },
    /* 执行删除前事件 */
    beforeDelete: {
      type: Function,
      default: null
    },
    /* 上传图片 */
    uploadImg: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      forms: [], // 显示在视图上的表单id数组
      cacheData: [], // 评论数组
      circleUrl: require('@/assets/head-bd.png') // 默认头像
    }
  },
  watch: {
    commentData () {
      this.cacheData = this.commentData
    }
  },
  methods: {
    // * 点击回复按钮，判断是否已存在该id的表单，存在删除该表单，不存在则新增该表单，并触发其他表单blur事件
    hasForm (id) {
      this.forms.includes(id) ? this.deleteForm(id) : this.addForm(id)
      this.broadcastBlur(this.$refs['comment-list'].$children, id)
    },
    // * 增加新表单
    addForm (id) {
      this.forms.push(id)
    },
    // * 删除表单
    deleteForm (id) {
      const index = this.forms.indexOf(id)
      index > -1 && this.forms.splice(index, 1)
    },
    // * 评论或回复
    async formSubmit ({ id, callback, ...params }) {
      try {
        const res = await this.beforeSubmit(params)
        // 插入评论或回复
        this.addComment(id, params, res)
      } catch (e) {
      }
      callback()
    },
    // * 点赞
    async handleCommentLike ({ id, comment }) {
      try {
        await this.beforeLike(comment)
        this.storeLikes(id)
      } catch (e) {
        console.log(e)
      }
    },
    // * 删除评论或回复
    async handleCommentDelete ({ id, comment }) {
      try {
        await this.beforeDelete(comment)
        this.deleteComment(id)
      } catch (e) {
        console.log(e)
      }
    },
    // * 保存点赞
    storeLikes (id) {
      const { commentIndex, replyIndex } = this.getIndex(id)

      let comment = this.cacheData[commentIndex]

      if (!isNaN(replyIndex)) {
        comment = comment.replies[replyIndex]
      }

      comment._liked = !comment._liked

      if (comment.like) {
        comment._liked ? comment.like++ : comment.like--
      } else {
        comment.like = 1
      }
      this.$emit('input', this.cacheData)
    },
    // * 存储新评论或回复
    addComment (id, rawData, res) {
      const { commentIndex } = this.getIndex(id)
      // 更新视图
      if (commentIndex === 'root') {
        const obj = {
          createdAt: util.FmtTime(
            new Date(),
            'yyyy-MM-dd hh:mm:ss'
          ),
          updatedAt: util.FmtTime(
            new Date(),
            'yyyy-MM-dd hh:mm:ss'
          ),
          id: res.id,
          articleId: this.$route.params.id,
          accountId: this.user.id,
          content: rawData.content,
          like: 0,
          state: 1,
          deletedAt: null,
          account: {
            avatar: this.user.avatar,
            nickname: this.user.nickname,
            blog: this.user.blog
          },
          replies: []
        }
        this.cacheData.unshift(obj)
      } else {
        const comment = this.cacheData[commentIndex]
        const obj = {
          createdAt: util.FmtTime(
            new Date(),
            'yyyy-MM-dd hh:mm:ss'
          ),
          updatedAt: util.FmtTime(
            new Date(),
            'yyyy-MM-dd hh:mm:ss'
          ),
          id: res.id,
          beaccountId: rawData.beaccountId,
          commentsId: rawData.commentsId,
          accountId: this.user.id,
          content: rawData.content,
          nickname: rawData.account.nickname || '',
          blog: rawData.account.blog || '',
          type: rawData.type === 2 ? 0 : 1,
          like: 0,
          state: 1,
          deletedAt: null,
          account: {
            avatar: this.user.avatar,
            nickname: this.user.nickname,
            blog: this.user.blog
          }
        }
        comment.replies.push(obj)
      }
      this.$emit('input', this.cacheData)
    },
    // * 删除评论或回复
    deleteComment (id) {
      const { commentIndex, replyIndex } = this.getIndex(id)
      this.cacheData = this.cacheData.filter((c, i) => {
        if (isNaN(replyIndex)) {
          return i !== commentIndex
        } else {
          c.replies = c.replies.filter(
            (r, j) => j !== replyIndex || i !== commentIndex
          )
          return c
        }
      })
      this.$emit('input', this.cacheData)
    },
    // * 向下递归触发表单blur事件
    broadcastBlur (target, id) {
      if (id && target.id === id) { return }

      if (Array.isArray(target)) {
        target.map(c => this.broadcastBlur(c, id))
      } else {
        const children = target.$children
        children && this.broadcastBlur(children, id)

        const richInput = target.$refs['rich-input']
        richInput && richInput.blur()
      }
    },
    // * 从id中提取出序号
    getIndex (id) {
      const [, c, r] = id.split('-')
      return { commentIndex: c === 'root' ? c : +c, replyIndex: +r }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-menu {
    padding: 20px;
    & > .comment-list {
        margin: 20px 0 0 70px;
    }

    ::v-deep {
        img {
            user-select: none;
            -webkit-user-drag: none;
            &.avatar {
                width: 2.1336rem;
                height: 2.1336rem;
                border-radius: 50%;
                cursor: pointer;
            }
            &.error {
                display: inline-block;
                transform: scale(0.5);
                content: "";
                color: transparent;
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 1px solid #e7e7e7;
                    box-sizing: border-box;
                    transform: scale(2);
                    background: #f5f5f5
                        url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z' fill='%23e6e6e6'/%3E%3Cpath d='M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z' fill='%23e6e6e6'/%3E%3C/svg%3E")
                        no-repeat center / 50% 50%;
                }
            }
        }
    }
}
</style>
