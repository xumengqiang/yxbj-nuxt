<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input
                v-model="listQuery.title"
                placeholder="请输入笔记标题"
                style="width: 200px"
                class="filter-item"
                clearable
                @keyup.enter.native="handleFilter"
            />
            <nuxt-link to="/marknote">
                <el-button type="primary">新增</el-button>
            </nuxt-link>
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
            />
            <el-table-column
                prop="screen.screenName"
                label="笔记分类"
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
            <el-table-column
                prop="createdAt"
                label="创建时间"
                align="center"
                width="100"
            >
            </el-table-column>
            <el-table-column label="笔记状态" align="center">
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
                        :href="'/marknote?id=' + scope.row.id"
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
import { mineNoteslist, disableNotes, deleteNotes } from "api/note";
export default {
    name: "Note",
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
    methods: {
        /**
         * 文章列表
         */
        getList() {
            this.listLoading = true;
            mineNoteslist(this.listQuery).then((response) => {
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
         * 删除笔记
         */
        handleDelete(id) {
            this.$confirm("此操作将永久删除该笔记, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let $index = this.list.findIndex((ele) => {
                        return ele.id == id;
                    });
                    deleteNotes({ id })
                        .then(() => {
                            this.list.splice($index, 1);
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        /**
         * 笔记状态
         */
        SwitchState(state, id) {
            let $index = this.list.findIndex((ele) => {
                return ele.id == id;
            });
            this.list[$index].state = state ? 0 : 1;
            disableNotes({ id, state: state ? 0 : 1 })
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
    },
};
</script>
<style lang="less" scoped>
.link {
    padding: 0 10px;
}
</style>