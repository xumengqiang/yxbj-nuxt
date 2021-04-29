<template>
  <div class="editor">
    <Header
      v-model="postForm.title"
      :isEdit="isEdit"
      @create="create"
      @close="close"
    ></Header>
    <div class="editor-body">
      <MarkdownEditor ref="markdown" v-model="postForm.contentMd" />
    </div>
    <el-dialog
      title="确认发布"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="postForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="技术分类"
          :label-width="formLabelWidth"
          prop="cateId"
        >
          <el-select v-model="postForm.cateId" filterable placeholder="请选择">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.cateName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            placeholder="请输入描述"
            :autosize="{ minRows: 3, maxRows: 5 }"
            maxlength="50"
            show-word-limit
            v-model="postForm.describe"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章封面" :label-width="formLabelWidth">
          <ArticleUpload v-model="postForm.cover" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publishArticle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { cateAll } from "api/cate";
import { add, update, articleEditInfo } from "api/article";
export default {
  name: "Markdown",
  layout: "fullscreen",
  data() {
    return {
      postForm: {
        id: "",
        title: "",
        cateId: "",
        cover: "",
        describe: "",
        contentText: "",
        contentMd: "",
        type: 2,
      },
      rules: {
        cateId: [
          { required: true, message: "请选择技术分类", trigger: "change" },
        ],
      },
      cateList: [],
      dialogVisible: false,
      formLabelWidth: "120px",
      isEdit: false,
    };
  },
  created() {
    if (this.$route.query.id) {
      this.isEdit = true;
      this.getArticleInfo();
    }
  },
  methods: {
    /**
     * 新增文章
     */
    create() {
      if (!this.postForm.title) {
        this.$message({
          message: "标题不能为空",
          type: "warning",
        });
        return;
      }
      if (!this.postForm.contentMd) {
        this.$message({
          message: "内容不能为空",
          type: "warning",
        });
        return;
      }
      this.dialogVisible = true;
      this.getCateAll();
    },
    /**
     * 关闭
     */
    close() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    /**
     * 获取全部分类
     */
    getCateAll() {
      cateAll()
        .then((res) => {
          this.cateList = res.data;
        })
        .catch((err) => console.log(err));
    },
    /**
     * 发布文章
     */
    publishArticle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            update(this.postForm)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "文章更新成功~",
                  type: "success",
                });
                window.history.length > 1
                  ? this.$router.go(-1)
                  : this.$router.push("/");
              })
              .catch((err) => console.log(err));
          } else {
            add(this.postForm)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "文章发布成功~",
                  type: "success",
                });
                window.history.length > 1
                  ? this.$router.go(-1)
                  : this.$router.push("/");
              })
              .catch((err) => console.log(err));
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 获取文章详情
     */
    getArticleInfo() {
      articleEditInfo({ id: this.$route.query.id })
        .then((res) => {
          if (res.data.type === 2) {
            const { id, title, cateId, cover, describe, contentMd } = res.data;
            this.postForm = {
              id,
              title,
              cateId,
              cover,
              describe,
              contentMd,
            };
            document.title = title;
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style lang="less" scoped>
.editor {
  width: 100%;
  height: 100%;
  .editor-body {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>