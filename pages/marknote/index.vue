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
                    label="大屏分类"
                    :label-width="formLabelWidth"
                    prop="screenId"
                >
                    <el-select
                        v-model="postForm.screenId"
                        filterable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in screenList"
                            :key="item.id"
                            :label="item.screenName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="publishArticle"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { screenAll } from "api/screen";
import { add, update, notesEditInfo } from "api/note";
export default {
    name: "MarkNote",
    data() {
        return {
            postForm: {
                id: "",
                title: "",
                screenId: "",
                contentMd: "",
                type: 2,
            },
            rules: {
                screenId: [
                    {
                        required: true,
                        message: "请选择大屏分类",
                        trigger: "change",
                    },
                ],
            },
            screenList: [],
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
            window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push("/");
        },
        /**
         * 获取全部分类
         */
        getCateAll() {
            screenAll()
                .then((res) => {
                    this.screenList = res.data;
                })
                .catch(() => {});
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
                                    message: "笔记更新成功~",
                                    type: "success",
                                });
                                window.history.length > 1
                                    ? this.$router.go(-1)
                                    : this.$router.push("/");
                            })
                            .catch(() => {});
                    } else {
                        add(this.postForm)
                            .then(() => {
                                this.$notify({
                                    title: "成功",
                                    message: "笔记发布成功~",
                                    type: "success",
                                });
                                window.history.length > 1
                                    ? this.$router.go(-1)
                                    : this.$router.push("/");
                            })
                            .catch(() => {});
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
            notesEditInfo({ id: this.$route.query.id })
                .then((res) => {
                    if (res.data.type === 2) {
                        const { id, title, screenId, contentMd } = res.data;
                        this.postForm = {
                            id,
                            title,
                            screenId,
                            contentMd,
                        };
                        document.title = title;
                    }
                })
                .catch(() => {});
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