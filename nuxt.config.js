import config from './config'
// eslint-disable-next-line nuxt/no-cjs-in-config
const path = require('path')
export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: '优秀笔记-个人博客',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'baidu-site-verification', content: 'code-W8o4whg3vG' },
            { hid: "keywords", name: "keywords", content: '优秀笔记,优秀,笔记,个人博客,技术博客,博客网站,个人网站' },
            { hid: 'description', name: 'description', content: '优秀笔记,专注大前端热门技术,原创文章,分享经验心得' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [
            {
                src: '//file.youxiubiji.com/js/qrcode.min.js',
                src: '//file.youxiubiji.com/CDN/js/tinymce/tinymce.min.js'
            }
        ]
    },
    router: {
        middleware: 'permission'
    },
    loading: {
        color: '#00a8ff',
        height: '3px'
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '~/assets/css/index.less',
        'viewerjs/dist/viewer.css',
        '~/assets/css/article.less'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/v-viewer',
        '@/plugins/axios'
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        // '@nuxtjs/eslint-module'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios'
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: config.host + config.prefix,
        browserBaseURL: config.prefix,
        proxy: config.proxy
    },
    proxy: [config.host + config.prefix],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: [/^element-ui/],
        /*
            ** You can extend webpack config here
            */
        extend(config, ctx) {
            config.resolve.alias.api = path.resolve(__dirname, 'api')
            config.resolve.alias.utils = path.resolve(__dirname, 'utils')
            config.resolve.alias.plugins = path.resolve(__dirname, 'plugins')
        }
    }
}
