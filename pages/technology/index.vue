<template>
  <div class="body">
    <div class="body-lf">
      <div class="cate">
        <div class="tab">
          <ul class="tab-ul">
            <li
              v-for="(item, index) in cateList"
              :key="index"
              @click="ChangeCate(index)"
            >
              <a :class="{ active: index == navCurrent }">{{
                item.cateName
              }}</a>
            </li>
          </ul>
        </div>
        <ArticleItem
          v-for="item in list"
          :key="item.id"
          :item="item"
        />
        <div class="page">
          <Pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.pageIndex"
            :limit.sync="listQuery.pageSize"
            @pagination="getCateArticle"
          />
        </div>
      </div>
    </div>
    <div class="body-rg">
      <div class="sift">
        <h3 class="sift-title">
          #精选文章
        </h3>
        <AsideArticle
          v-for="(item, index) in asideList"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { homeCateAll } from 'api/cate'
import { cateArticle, ViewsArticleLimit } from 'api/article'
export default {
  name: 'Technology',
  async asyncData () {
    const result = await Promise.all([
      homeCateAll(),
      cateArticle({
        pageIndex: 1,
        pageSize: 10,
        cateId: ''
      }),
      ViewsArticleLimit({ limit: 5 })
    ])
    return {
      cateList: [{ cateName: '全部', id: '' }, ...result[0].data] || [],
      list: result[1].data.rows || [],
      total: result[1].data.count || 0,
      asideList: result[2].data || []
    }
  },
  data () {
    return {
      navCurrent: 0,
      // cateList: [],
      // list: [],
      // asideList: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        cateId: ''
      },
      total: 0
    }
  },
  created () {
    // this.getAllCate();
    // this.getCateArticle();
    // this.getNewArticleList();
  },
  methods: {
    // getAllCate() {
    //     homeCateAll().then((res) => {
    //         this.cateList = [{ cateName: "全部", id: "" }, ...res.data];
    //     });
    // },
    getCateArticle () {
      cateArticle(this.listQuery)
        .then((res) => {
          this.list = res.data.rows
          this.total = res.data.count
        })
        .catch(err => console.log(err))
    },
    ChangeCate (i) {
      this.navCurrent = i
      this.listQuery.cateId = this.cateList[i].id
      this.getCateArticle()
    }
    // 获取热门文章
    // getNewArticleList() {
    //     ViewsArticleLimit({ limit: 5 })
    //         .then((res) => {
    //             this.asideList = res.data;
    //         })
    //         .catch((err) => console.log(err));
    // },
  }
}
</script>
<style lang="less" scoped>
.body {
    display: flex;
    justify-content: space-between;
    .body-lf {
        width: 840px;
        .cate {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 4px;
            .tab {
                border-bottom: 1px solid #f0f2f7;
                margin-bottom: 15px;
                .tab-ul {
                    display: flex;
                    flex-wrap: wrap;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    li {
                        margin: 0 20px;
                        cursor: pointer;
                        a {
                            display: inline-block;
                            color: #1a1a1a;
                            line-height: 50px;
                            font-size: 16px;
                            border-bottom: 3px solid transparent;
                        }
                        .active {
                            font-weight: 700;
                            border-color: #00a8ff;
                        }
                    }
                }
            }
            .page {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
        }
    }
    .body-rg {
        width: 345px;
        .sift {
            position: sticky;
            top: 70px;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 4px;
            .sift-title {
                padding: 10px 10px 0px;
                color: rgb(51, 51, 51);
            }
        }
    }
}
</style>
