import { $axios } from 'plugins/axios'
//增加友链
export function linkAdd(data) {
  return $axios({
    url: "/link/add",
    method: "post",
    data,
  });
}
//用户获取全部友链
export function linkUserList(query) {
  return $axios({
    url: "/link/user/list",
    method: "get",
    params: query,
  });
}
//管理员获取全部友链
export function linkAdminList(query) {
  return $axios({
    url: "/link/admin/list",
    method: "get",
    params: query,
  });
}
//用户更新友链
export function linkUserEdit(data) {
  return $axios({
    url: "/link/user/update",
    method: "put",
    data,
  });
}
//管理员更新友链
export function linkAdminEdit(data) {
  return $axios({
    url: "/link/admin/update",
    method: "put",
    data,
  });
}

//删除友链
export function linkDel(data) {
  return $axios({
    url: "/link/delete",
    method: "delete",
    data,
  });
}

/**
 * pc全部友链
 */
export function homelinkAll(query) {
  return $axios({
    url: "/home/link/list",
    method: "get",
    params: query,
  });
}
