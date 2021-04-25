import { $axios } from 'plugins/axios'

//我的文章点赞
export function article_like_list(query) {
    return $axios({
        url: "/article_like/list",
        method: "get",
        params: query,
    });
}
//我的文章收藏
export function article_collection_list(query) {
    return $axios({
        url: "/article_collection/list",
        method: "get",
        params: query,
    });
}