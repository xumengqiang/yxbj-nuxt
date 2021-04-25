import { $axios } from 'plugins/axios'

//登录
export function login(data) {
  return $axios({
    url: "/account/login",
    method: "post",
    data,
  });
}
//注册
export function register(data) {
  return $axios({
    url: "/account/register",
    method: "post",
    data,
  });
}
//发送验证码
export function sendmail(data) {
  return $axios({
    url: "/account/sendmail",
    method: "post",
    data,
  });
}
//获取用户信息
export function getInfo() {
  return $axios({
    url: "/account/info",
    method: "get",
  });
}
//修改头像
export function upd_avatar(data) {
  return $axios({
    url: "/account/upd_avatar",
    method: "put",
    data,
  });
}
//修改昵称
export function upd_nickname(data) {
  return $axios({
    url: "/account/upd_nickname",
    method: "put",
    data,
  });
}
//修改个人主页
export function upd_blog(data) {
  return $axios({
    url: "/account/upd_blog",
    method: "put",
    data,
  });
}
//修改密码
export function upd_password(data) {
  return $axios({
    url: "/account/upd_password",
    method: "put",
    data,
  });
}
//忘记密码
export function fog_password(data) {
  return $axios({
    url: "/account/fog_password",
    method: "put",
    data,
  });
}
//获取二维码信息
export function wxcodeUrl(query) {
  return $axios({
    url: "/account/wxcodeUrl",
    method: "get",
    params: query,
  });
}
//；获取全部用户
export function account_list(query) {
  return $axios({
    url: "/account/account_list",
    method: "get",
    params: query,
  });
}