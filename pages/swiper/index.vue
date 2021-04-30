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
            <el-table-column label="封面" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-image
                        style="width: 75px; height: 40px"
                        :src="row.url"
                        fit="contain"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="描述" align="center">
            </el-table-column>
            <el-table-column prop="link" label="跳转链接" align="center">
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center">
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
                <template slot-scope="{ row }">
                    <span v-if="row.type == 1">首页</span>
                    <span v-if="row.type == 2">个人中心</span>
                </template>
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
                                scope.row.title,
                                scope.row.link,
                                scope.row.url,
                                scope.row.sort,
                                scope.row.type
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
                    label="封面"
                    :label-width="formLabelWidth"
                    prop="url"
                >
                    <ArticleUpload v-model="postForm.url" />
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input
                        placeholder="请输入轮播图描述"
                        v-model="postForm.title"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" :label-width="formLabelWidth">
                    <el-input
                        placeholder="请输入跳转链接"
                        v-model="postForm.link"
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
                <el-form-item label="展示类型" :label-width="formLabelWidth">
                    <el-input-number
                        v-model="postForm.type"
                        controls-position="right"
                        :min="1"
                        :max="2"
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
import { swiperAdd, swiperList, swiperEdit, swiperDisable } from "api/swiper";
export default {
    name: "Swiper",
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
            formLabelWidth: "100px",
            isEdit: false,
            postForm: {
                id: "",
                title: "",
                link: "",
                url: "",
                sort: 0,
                type: 1,
            },
            rules: {
                url: [
                    {
                        required: true,
                        message: "请上传图片",
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
         * 轮播图列表
         */
        getList() {
            this.listLoading = true;
            swiperList(this.listQuery)
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
         * 轮播图状态
         */
        SwitchState(state, id) {
            let $index = this.list.findIndex((ele) => {
                return ele.id == id;
            });
            this.list[$index].state = state ? 0 : 1;
            swiperDisable({ id, state: state ? 0 : 1 })
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
         * 新增轮播图
         */
        CreateSwiper() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.postForm.id = "";
            this.postForm.title = "";
            this.postForm.link = "";
            this.postForm.url = "";
            this.postForm.sort = 0;
            this.postForm.type = 1;
        },
        /**
         * 编辑按钮
         */
        handleEdit(id, title, link, url, sort, type) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.postForm.id = id;
            this.postForm.title = title;
            this.postForm.link = link;
            this.postForm.url = url;
            this.postForm.sort = sort;
            this.postForm.type = type;
        },
        /**
         * 确定
         */
        publishSwiper() {
            if (!this.postForm.url) {
                this.$message({
                    message: "轮播图不能为空",
                    type: "warning",
                });
                return;
            }
            swiperAdd(this.postForm)
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
            if (!this.postForm.url) {
                this.$message({
                    message: "轮播图不能为空",
                    type: "warning",
                });
                return;
            }
            swiperEdit(this.postForm)
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