import { $axios } from 'plugins/axios'

//新增文章
export function add(data) {
  return $axios({
    url: "/article/add",
    method: "post",
    data,
  });
}
//编辑文章
export function update(data) {
  return $axios({
    url: "/article/update",
    method: "put",
    data,
  });
}
//禁用文章
export function disableArticle(data) {
  return $axios({
    url: "/article/disable",
    method: "put",
    data,
  });
}
//删除文章
export function deleteArticle(data) {
  return $axios({
    url: "/article/delete",
    method: "delete",
    data,
  });
}
//获取编辑文章详情
export function articleEditInfo(query) {
  return $axios({
    url: '/article/info',
    method: "get",
    params: query,
  });
}
//我的文章列表
export function mineArticlelist(query) {
  return $axios({
    url: "/article/list",
    method: "get",
    params: query,
  });
}

// 最新文章
export function newArticleLimit(data) {
  return $axios({
    url: `/home/article/newlist/${data.limit}`,
    method: "get",
  });
}
//获取文章详情
export function articleInfo(data) {
  return $axios({
    url: `/home/article/info/${data.id}`,
    method: "get",
  });
}

//获取分类文章
export function cateArticle(query) {
  return $axios({
    url: "/home/cate/article/list",
    method: "get",
    params: query,
  });
}

//热门文章
export function ViewsArticleLimit(data) {
  return $axios({
    url: `/home/article/viewslist/${data.limit}`,
    method: "get",
  });
}
//文章点赞
export function article_like_Add(data) {
  return $axios({
    url: '/article_like/add',
    method: "post",
    data,
  });
}
//获取文章点赞
export function article_like_Aarray(query) {
  return $axios({
    url: '/article_like/array',
    method: "get",
    params: query,
  });
}
//文章收藏
export function article_collection_Add(data) {
  return $axios({
    url: '/article_collection/add',
    method: "post",
    data,
  });
}
//获取文章收藏表
export function article_collection_Aarray(query) {
  return $axios({
    url: '/article_collection/array',
    method: "get",
    params: query,
  });
}