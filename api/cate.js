import { $axios } from 'plugins/axios'
//增加分类
export function cateAdd(data) {
  return $axios({
    url: "/cate/add",
    method: "post",
    data,
  });
}
//获取全部分类
export function cateList(query) {
  return $axios({
    url: "/cate/list",
    method: "get",
    params: query,
  });
}
//编辑分类
export function cateEdit(data) {
  return $axios({
    url: "/cate/edit",
    method: "put",
    data,
  });
}

//禁用分类
export function cateDisable(data) {
  return $axios({
    url: "/cate/disable",
    method: "put",
    data,
  });
}
//获取编辑文章全部分类
export function cateAll() {
  return $axios({
    url: "/cate/all",
    method: "get",
  });
}

/**
 * 技术全部分类
 */
export function homeCateAll() {
  return $axios({
    url: "/home/cate/list",
    method: "get",
  });
}
