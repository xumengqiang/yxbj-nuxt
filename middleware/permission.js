/**
* 路由鉴定
* 一些页面游客无权限访问，需要重新登陆
*/
export default async ({ redirect, route, store }) => {
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
        const hasRoles = store.state.roles && store.state.roles.length > 0
        if (!hasRoles) {
            try {
                const { roles } = await store.dispatch('getInfo')
                const accessRoutes = await store.dispatch('generateRoutes', roles)
                if (!accessRoutes.some(item => item.path === route.path) && (
                    whiteList.indexOf(route.path) === -1 &&
                    route.path.indexOf("article") === -1 &&
                    route.path.indexOf("document") === -1
                )) {
                    redirect('/404')
                }
            } catch (error) {

            }
        } else {
            try {
                const accessRoutes = await store.dispatch('generateRoutes', store.state.roles)
                if (!accessRoutes.some(item => item.path === route.path) && (
                    whiteList.indexOf(route.path) === -1 &&
                    route.path.indexOf("article") === -1 &&
                    route.path.indexOf("document") === -1
                )) {
                    redirect('/404')
                }
            } catch (error) {

            }
        }
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
