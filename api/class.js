import { $axios } from 'plugins/axios'
//增加友链分类
export function classAdd(data) {
  return $axios({
    url: "/class/add",
    method: "post",
    data,
  });
}
//获取全部友链分类
export function classList(query) {
  return $axios({
    url: "/class/list",
    method: "get",
    params: query,
  });
}
//编辑友链分类
export function classEdit(data) {
  return $axios({
    url: "/class/edit",
    method: "put",
    data,
  });
}

//禁用友链分类
export function classDisable(data) {
  return $axios({
    url: "/class/disable",
    method: "put",
    data,
  });
}
//获取编辑友链全部友链分类
export function classAll() {
  return $axios({
    url: "/class/all",
    method: "get",
  });
}

/**
 * pc全部友链分类
 */
export function homeClassAll() {
  return $axios({
    url: "/home/class/list",
    method: "get",
  });
}
