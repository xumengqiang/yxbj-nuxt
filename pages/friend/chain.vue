<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input
                v-model="listQuery.linkName"
                placeholder="请输入友链名称"
                style="width: 200px"
                clearable
                class="filter-item"
                @keyup.enter.native="handleFilter"
            />
            <el-button type="primary" @click="CreateSwiper">新增</el-button>
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
            />
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
            <el-table-column prop="sort" label="排序" align="center">
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                    <el-link
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
                                scope.row.linkdesc,
                                scope.row.linkmsg,
                                scope.row.state,
                                scope.row.sort
                            )
                        "
                        >编辑</el-link
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <Pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.pageIndex"
                :limit.sync="listQuery.pageSize"
                @pagination="getList"
            />
        </div>
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
                    <Upload v-model="postForm.linklogo" />
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
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input-number
                        v-model="postForm.sort"
                        controls-position="right"
                        :min="0"
                        :max="100"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="友链状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="postForm.state">
                        <el-radio :label="1">可修改</el-radio>
                        <el-radio :label="2">不可修改</el-radio>
                        <el-radio :label="0">已禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="原因" :label-width="formLabelWidth">
                    <el-input
                        placeholder="请输入状态原因"
                        v-model="postForm.linkmsg"
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
import { linkAdd, linkAdminList, linkAdminEdit } from "api/link";
import { classAll } from "api/class";
export default {
    name: "Link-Index",
    layout:'main',
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                linkName: "",
            },
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
                linkmsg: "",
                state: 1,
                sort: 0,
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
    watch: {
        "listQuery.linkName"() {
            this.getList();
        },
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
            linkAdminList(this.listQuery)
                .then((response) => {
                    this.list = response.data.rows;
                    this.total = response.data.count;
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
            this.postForm.linkmsg = "";
            this.postForm.state = 1;
            this.postForm.sort = 0;
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
            linkdesc,
            linkmsg,
            state,
            sort
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
            this.postForm.linkmsg = linkmsg;
            this.postForm.state = state;
            this.postForm.sort = sort;
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
            linkAdminEdit(this.postForm)
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
        /**
         * 搜索
         */
        handleFilter() {
            this.listQuery.pageIndex = 1;
            this.getList();
        },
    },
};
</script>