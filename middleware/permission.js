/**
* 路由鉴定
* 一些页面游客无权限访问，需要重新登陆
*/
export default ({ redirect, route, store }) => {
    const whiteList = [
        '/',
        '/technology',
        '/article/',
        '/404',
        '/doc',
        '/link',
        '/about',
        '/document/'
    ] // 不重定向白名单
    // 用户登录的时候
    if (store.state.token) {
        // 请求申请个人信息接口 => 当有Token的时候
        store.dispatch('getInfo')
    } else {
        if (
            whiteList.indexOf(route.path) === -1 &&
            route.path.indexOf("article") === -1 &&
            route.path.indexOf("document") === -1
        ) {
            redirect('/')
        }
    }
}
