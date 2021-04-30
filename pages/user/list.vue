<template>
    <div class="app-container">
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
            />
            <el-table-column prop="nickname" label="昵称" align="center">
            </el-table-column>
            <el-table-column label="头像" width="100" align="center">
                <template slot-scope="{ row }">
                    <el-avatar :size="40" :src="row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="性别" width="100" align="center">
                <template slot-scope="{ row }">
                    <span v-if="row.gender == 1">男</span>
                    <span v-else-if="row.gender == 2">女</span>
                </template>
            </el-table-column>
            <el-table-column prop="country" label="国家" align="center">
            </el-table-column>
            <el-table-column prop="province" label="省份" align="center">
            </el-table-column>
            <el-table-column prop="city" label="城市" align="center">
            </el-table-column>
            <el-table-column prop="role" label="角色" align="center">
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" align="center">
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
import { account_list } from "api/user";
export default {
    name: "User",
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
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /**
         * 用户列表
         */
        getList() {
            this.listLoading = true;
            account_list(this.listQuery)
                .then((response) => {
                    this.list = response.data.rows;
                    this.total = response.data.count;
                    this.listLoading = false;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
    },
};
</script>