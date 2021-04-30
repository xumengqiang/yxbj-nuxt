export const asyncRoutes = [
    {
        path: "/editor",
        name: "Editor",
        meta: { title: "创建普通文章", roles: ['admin', 'editor'] },
        hidden: true
    },
    {
        path: "/markdown",
        name: "Markdown",
        meta: { title: "创建Markdown文章", roles: ['admin', 'editor'] },
        hidden: true
    },
    {
        path: "/marknote",
        name: "MarkNote",
        meta: { title: "创建Markdown笔记", roles: ['admin'] },
        hidden: true
    },
    {
        path: "/mine/personal",
        meta: { title: "个人主页", icon: "el-icon-user", roles: ['admin', 'editor'] }
    },
    {
        path: "/mine/myarticle",
        meta: { title: "我的文章", icon: "el-icon-star-off", roles: ['admin', 'editor'] }
    },
    {
        path: "/cate",
        meta: { title: "文章分类", icon: "el-icon-folder", roles: ['admin'] }
    },
    {
        path: "/class",
        meta: { title: "友链分类", icon: "el-icon-connection", roles: ['admin'] }
    },
    {
        path: "/screen",
        meta: { title: "大屏分类", icon: "el-icon-shopping-bag-2", roles: ['admin'] }
    },
    {
        path: "/note",
        meta: { title: "我的笔记", icon: "el-icon-postcard", roles: ['admin'] }
    },
    {
        path: "/mine/like",
        meta: { title: "我的点赞", icon: "el-icon-thumb", roles: ['admin', 'editor'] }
    },
    {
        path: "/mine/collection",
        meta: { title: "我的收藏", icon: "el-icon-star-off", roles: ['admin', 'editor'] }
    },
    {
        path: "/friend/link",
        meta: { title: "我的友链", icon: "el-icon-link", roles: ['editor'] }
    },
    {
        path: "/friend/chain",
        meta: { title: "全部友链", icon: "el-icon-paperclip", roles: ['admin'] }
    },
    {
        path: "/user/list",
        meta: { title: "全部用户", icon: "el-icon-user", roles: ['admin'] }
    },
    {
        path: "/swiper/index",
        meta: { title: "轮播图", icon: "el-icon-picture-outline", roles: ["admin"] }
    },
    {
        path: "/mine/settings",
        meta: { title: "个人设置", icon: "el-icon-setting", roles: ['admin', 'editor'] },
    },
]
