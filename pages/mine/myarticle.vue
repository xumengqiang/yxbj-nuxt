<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input
                v-model="listQuery.title"
                placeholder="请输入文章标题"
                style="width: 200px"
                class="filter-item"
                clearable
                @keyup.enter.native="handleFilter"
            />
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
            />
            <el-table-column label="文章封面" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-image
                        style="width: 75px; height: 40px"
                        :src="row.cover"
                        fit="contain"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="cate.cateName"
                label="文章分类"
                align="center"
                width="100"
            >
            </el-table-column>
            <el-table-column min-width="200px" label="标题" align="center">
                <template slot-scope="{ row }">
                    <nuxt-link
                        target="_blank"
                        :to="'/article/' + row.id"
                        class="link-type"
                    >
                        <span>{{ row.title }}</span>
                    </nuxt-link>
                </template>
            </el-table-column>
            <el-table-column label="文章状态" align="center">
                <template slot-scope="{ row }">
                    <el-switch
                        :value="row.state === 1"
                        @change="SwitchState(row.state, row.id)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        class="link"
                        @click="handleEdit(scope.row.type, scope.row.id)"
                        :underline="false"
                        >编辑</el-link
                    >
                    <el-link
                        type="danger"
                        class="link"
                        :underline="false"
                        @click="handleDelete(scope.row.id)"
                        >删除</el-link
                    >
                    <el-link
                        v-if="info.role == 'admin'"
                        type="success"
                        class="link"
                        :disabled="scope.row.state === 2"
                        :underline="false"
                        @click="handleChange(scope.row.id)"
                        >设置内部</el-link
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
    </div>
</template>
<script>
import { mineArticlelist, disableArticle, deleteArticle } from "api/article";
export default {
    name: "Myarticle",
    layout: "main",
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                title: "",
            },
        };
    },
    watch: {
        "listQuery.title"() {
            this.getList();
        },
    },
    created() {
        this.getList();
    },
    computed: {
        info() {
            return this.$store.state.info;
        },
    },
    methods: {
        /**
         * 文章列表
         */
        getList() {
            this.listLoading = true;
            mineArticlelist(this.listQuery).then((response) => {
                this.list = response.data.rows;
                this.total = response.data.count;
                this.listLoading = false;
            });
        },
        /**
         * 搜索
         */
        handleFilter() {
            this.listQuery.pageIndex = 1;
            this.getList();
        },
        /**
         * 编辑文章
         */
        handleEdit(type, id) {
            if (type === 1) {
                this.$router.push(`/editor?id=${id}`);
            } else {
                this.$router.push(`/markdown?id=${id}`);
            }
        },
        /**
         * 删除文章
         */
        handleDelete(id) {
            this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let $index = this.list.findIndex((ele) => {
                        return ele.id == id;
                    });
                    deleteArticle({ id })
                        .then(() => {
                            this.list.splice($index, 1);
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        /**
         * 文章状态
         */
        SwitchState(state, id) {
            let $index = this.list.findIndex((ele) => {
                return ele.id == id;
            });
            this.list[$index].state = state ? 0 : 1;
            disableArticle({ id, state: state ? 0 : 1 })
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
         * 设置内部文章
         */
        handleChange(id) {
            disableArticle({ id, state: 2 })
                .then(() => {
                    this.$message({
                        message: "设置成功",
                        type: "success",
                    });
                    this.getList();
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="less" scoped>
.link {
    padding: 0 10px;
}
</style>