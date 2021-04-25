import { $axios } from 'plugins/axios'

//评论
export function comments_Add (data) {
    return $axios({
        url: "/comments/add",
        method: "post",
        data,
    });
}
//删除评论
export function comments_Disable (data) {
    return $axios({
        url: "/comments/disable",
        method: "put",
        data,
    });
}
//回复
export function reply_add (data) {
    return $axios({
        url: "/reply/add",
        method: "post",
        data,
    });
}

//删除回复
export function reply_Disable (data) {
    return $axios({
        url: "/reply/disable",
        method: "put",
        data,
    });
}

//全部评论
export function comments_list (query) {
    return $axios({
        url: '/comments/list',
        method: "get",
        params: query,
    });
}
//评论点赞取消
export function commentslike_Disable (data) {
    return $axios({
        url: "/commentslike/disable",
        method: "put",
        data,
    });
}
//回复点赞取消
export function replylike_Disable (data) {
    return $axios({
        url: "/replylike/disable",
        method: "put",
        data,
    });
}
