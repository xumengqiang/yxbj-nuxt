<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button type="primary" @click="CreateSwiper">新增</el-button>
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
            />
            <el-table-column prop="screenName" label="标题" align="center">
            </el-table-column>
            <el-table-column label="封面" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-image
                        style="width: 75px; height: 40px"
                        :src="row.cover"
                        fit="contain"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column label="图标" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-avatar :size="40" :src="row.icon"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="{ row }">
                    <el-switch
                        :value="row.state === 1"
                        @change="SwitchState(row.state, row.id)"
                    >
                    </el-switch>
                </template>
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
                                scope.row.screenName,
                                scope.row.cover,
                                scope.row.icon,
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
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="postForm" :rules="rules" ref="ruleForm">
                <el-form-item
                    label="名称"
                    :label-width="formLabelWidth"
                    prop="screenName"
                >
                    <el-input
                        placeholder="请输入大屏分类名称"
                        v-model="postForm.screenName"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="封面"
                    :label-width="formLabelWidth"
                    prop="cover"
                >
                    <AvatarUpload v-model="postForm.cover" />
                </el-form-item>
                <el-form-item
                    label="图标"
                    :label-width="formLabelWidth"
                    prop="icon"
                >
                    <AvatarUpload v-model="postForm.icon" />
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input-number
                        v-model="postForm.sort"
                        controls-position="right"
                        :min="0"
                        :max="100"
                    ></el-input-number>
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
import { screenAdd, screenList, screenEdit, screenDisable } from "api/screen";
export default {
    name: "Class",
    layout: "main",
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
            },
            dialogVisible: false,
            formLabelWidth: "80px",
            isEdit: false,
            postForm: {
                id: "",
                screenName: "",
                cover: "",
                icon: "",
                sort: 0,
            },
            rules: {
                screenName: [
                    {
                        required: true,
                        message: "分类名称不能为空",
                        trigger: "change",
                    },
                ],
                cover: [
                    {
                        required: true,
                        message: "封面不能为空",
                        trigger: "change",
                    },
                ],
                icon: [
                    {
                        required: true,
                        message: "图标不能为空",
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
         * 分类列表
         */
        getList() {
            this.listLoading = true;
            screenList(this.listQuery)
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
         * 分类状态
         */
        SwitchState(state, id) {
            let $index = this.list.findIndex((ele) => {
                return ele.id == id;
            });
            this.list[$index].state = state ? 0 : 1;
            screenDisable({ id, state: state ? 0 : 1 })
                .then(() => {
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                })
                .catch(() => {
                    this.list[$index].state = state ? 1 : 0;
                });
        },
        /**
         * 新增分类
         */
        CreateSwiper() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.postForm.id = "";
            this.postForm.screenName = "";
            this.postForm.cover = "";
            this.postForm.icon = "";
            this.postForm.sort = 0;
        },
        /**
         * 编辑分类
         */
        handleEdit(id, screenName, cover, icon, sort) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.postForm.id = id;
            this.postForm.screenName = screenName;
            this.postForm.cover = cover;
            this.postForm.icon = icon;
            this.postForm.sort = sort;
        },
        /**
         * 确定
         */
        publishSwiper() {
            if (!this.postForm.screenName) {
                this.$message({
                    message: "分类名称不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.cover) {
                this.$message({
                    message: "封面不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.icon) {
                this.$message({
                    message: "图标不能为空",
                    type: "warning",
                });
                return;
            }
            screenAdd(this.postForm)
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
            if (!this.postForm.screenName) {
                this.$message({
                    message: "分类名称不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.cover) {
                this.$message({
                    message: "封面不能为空",
                    type: "warning",
                });
                return;
            }
            if (!this.postForm.icon) {
                this.$message({
                    message: "图标不能为空",
                    type: "warning",
                });
                return;
            }
            screenEdit(this.postForm)
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