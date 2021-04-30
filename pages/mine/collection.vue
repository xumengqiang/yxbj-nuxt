<template>
    <div class="app-container">
        <h2 class="title">我的收藏:{{ total }}篇</h2>
        <el-table :data="list" :show-header="false" stripe style="width: 100%">
            <el-table-column prop="article.title" label="标题">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="{ row }">
                    <el-link type="primary" class="link" :underline="false">
                        <nuxt-link
                            target="_blank"
                            :to="'/article/' + row.articleId"
                            class="link-type"
                        >
                            <span>查看</span>
                        </nuxt-link></el-link
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
import { article_collection_list } from "api/article_like";
export default {
    name: "collection",
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
         * 文章列表
         */
        getList() {
            this.listLoading = true;
            article_collection_list(this.listQuery).then((response) => {
                this.list = response.data.rows;
                this.total = response.data.count;
                this.listLoading = false;
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
.link {
    padding: 0 10px;
}
</style>