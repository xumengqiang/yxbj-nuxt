<template>
    <div class="app-container">
        <h2 class="title">我的友链:{{ list.length }}个</h2>
        <div class="filter-container" v-if="list.length === 0">
            <el-button type="primary" @click="CreateSwiper">添加</el-button>
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column prop="linkName" label="标题" align="center">
            </el-table-column>
            <el-table-column label="图标" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-avatar :size="40" :src="row.linklogo"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="linkurl" label="链接" align="center">
            </el-table-column>
            <el-table-column
                prop="class.className"
                label="所属分类"
                align="center"
            >
            </el-table-column>
            <el-table-column prop="linkwords" label="关键词" align="center">
            </el-table-column>
            <el-table-column prop="linkdesc" label="描述" align="center">
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.linkmsg"
                        placement="top"
                    >
                        <el-link
                            v-if="scope.row.state == 1"
                            type="primary"
                            class="link"
                            :underline="false"
                            @click="
                                handleEdit(
                                    scope.row.id,
                                    scope.row.classId,
                                    scope.row.linkName,
                                    scope.row.linklogo,
                                    scope.row.linkurl,
                                    scope.row.linkwords,
                                    scope.row.linkdesc
                                )
                            "
                            >编辑</el-link
                        >
                        <el-link
                            v-else-if="scope.row.state == 2"
                            type="success"
                            class="link"
                            :underline="false"
                            >已发布</el-link
                        >
                        <el-link
                            type="danger"
                            v-else
                            class="link"
                            :underline="false"
                            >已禁用</el-link
                        >
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="isEdit ? '编辑' : '新增'"
            :visible.sync="dialogVisible"
            width="40%"
            :close-on-click-modal="false"
        >
            <el-form :model="postForm" :rules="rules" ref="ruleForm">
                <el-form-item
                    label="名称"
                    :label-width="formLabelWidth"
                    prop="linkName"
                >
                    <el-input
                        placeholder="请输入友链名称"
                        v-model="postForm.linkName"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="logo"
                    :label-width="formLabelWidth"
                    prop="linklogo"
                >
                    <AvatarUpload v-model="postForm.linklogo" />
                </el-form-item>
                <el-form-item
                    label="链接"
                    :label-width="formLabelWidth"
                    prop="linkurl"
                >
                    <el-input
                        placeholder="请输入友链链接"
                        v-model="postForm.linkurl"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="友链分类"
                    :label-width="formLabelWidth"
                    prop="classId"
                >
                    <el-select
                        v-model="postForm.classId"
                        filterable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in classList"
                            :key="item.id"
                            :label="item.className"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="关键词"
                    :label-width="formLabelWidth"
                    prop="linkwords"
                >
                    <el-input
                        placeholder="请输入友链关键词"
                        v-model="postForm.linkwords"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="描述"
                    :label-width="formLabelWidth"
                    prop="linkdesc"
                >
                    <el-input
                        placeholder="请输入友链描述"
                        v-model="postForm.linkdesc"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="success" v-if="isEdit" @click="UpdateSwiper"
                    >更 新</el-button
                >
                <el-button type="primary" v-else @click="publishSwiper"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { linkAdd, linkUserList, linkUserEdit } from "api/link";
import { classAll } from "api/class";
export default {
    name: "Link-Index",
    layout: "main",
    data() {
        return {
            list: [],
            listLoading: true,
            dialogVisible: false,
            formLabelWidth: "80px",
            isEdit: false,
            classList: [],
            postForm: {
                id: "",
                classId: "",
                linkName: "",
                linklogo: "",
                linkurl: "",
                linkwords: "",
                linkdesc: "",
            },
            rules: {
                linkName: [
                    {
                        required: true,
                        message: "友链名称不能为空",
                        trigger: "change",
                    },
                ],
                linklogo: [
                    {
                        required: true,
                        message: "友链logo不能为空",
                        trigger: "change",
                    },
                ],
                linkurl: [
                    {
                        required: true,
                        message: "友链链接不能为空",
                        trigger: "change",
                    },
                ],
                classId: [
                    {
                        required: true,
                        message: "友链分类不能为空",
                        trigger: "change",
                    },
                ],
                linkwords: [
                    {
                        required: true,
                        message: "友链关键词不能为空",
                        trigger: "change",
                    },
                ],
                linkdesc: [
                    {
                        required: true,
                        message: "友链描述不能为空",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /**
         * 获取全部友链分类
         */
        getClassAll() {
            classAll()
                .then((res) => {
                    this.classList = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        /**
         * 分类列表
         */
        getList() {
            this.listLoading = true;
            linkUserList()
                .then((response) => {
                    this.list = response.data;
                    this.listLoading = false;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },

        /**
         * 新增分类
         */
        CreateSwiper() {
            this.getClassAll();
            this.dialogVisible = true;
            this.isEdit = false;
            this.postForm.id = "";
            this.postForm.classId = "";
            this.postForm.linkName = "";
            this.postForm.linklogo = "";
            this.postForm.linkurl = "";
            this.postForm.linkwords = "";
            this.postForm.linkdesc = "";
        },
        /**
         * 编辑分类
         */
        handleEdit(
            id,
            classId,
            linkName,
            linklogo,
            linkurl,
            linkwords,
            linkdesc
        ) {
            this.getClassAll();
            this.dialogVisible = true;
            this.isEdit = true;
            this.postForm.id = id;
            this.postForm.classId = classId;
            this.postForm.linkName = linkName;
            this.postForm.linklogo = linklogo;
            this.postForm.linkurl = linkurl;
            this.postForm.linkwords = linkwords;
            this.postForm.linkdesc = linkdesc;
        },
        /**
         * 确定
         */
        publishSwiper() {
            if (!this.postForm.linkName) {
                this.$message({
                    message: "友链名称不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linklogo) {
                this.$message({
                    message: "友链logo不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkurl) {
                this.$message({
                    message: "链接不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.classId) {
                this.$message({
                    message: "友链分类不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkwords) {
                this.$message({
                    message: "友链关键词不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkdesc) {
                this.$message({
                    message: "友链描述不能为空",
                    type: "warning",
                });
                return;
            }
            linkAdd(this.postForm)
                .then(() => {
                    this.getList();
                    this.dialogVisible = false;
                    this.$message({
                        message: "新增成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        /**
         * 编辑
         */
        UpdateSwiper() {
            if (!this.postForm.linkName) {
                this.$message({
                    message: "友链名称不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linklogo) {
                this.$message({
                    message: "友链logo不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkurl) {
                this.$message({
                    message: "链接不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.classId) {
                this.$message({
                    message: "友链分类不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkwords) {
                this.$message({
                    message: "友链关键词不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.linkdesc) {
                this.$message({
                    message: "友链描述不能为空",
                    type: "warning",
                });
                return;
            }
            linkUserEdit(this.postForm)
                .then(() => {
                    this.getList();
                    this.dialogVisible = false;
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="less" scoped>
.title {
    color: #333;
    font-size: 18px;
}
</style>