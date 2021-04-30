import { login, getInfo } from 'api/user'
import { setToken, removeToken } from 'utils/auth'
import { asyncRoutes } from 'utils/router'
const cookieparser = require('cookieparser')


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            res.push(tmp)
        }
    })

    return res
}


export const state = () => ({
    info: null,
    token: '',
    roles: [],
    showLogin: false,
    routes: []
})

export const mutations = {
    SET_USERINFO: (state, payload) => {
        state.info = Object.assign({}, state.info, payload)
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },
    SET_ROUTES: (state, routes) => {
        state.routes = routes
    }
}

export const actions = {
    // user login
    login({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            login(userInfo).then((response) => {
                const { data } = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch((error) => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo({ commit }) {
        return new Promise((resolve, reject) => {
            getInfo().then((response) => {
                const { data } = response
                commit('SET_ROLES', data.roles || [])
                commit('SET_USERINFO', data)
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    // user logout
    resetToken({ commit }) {
        return new Promise((resolve) => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },
    // 刷新获取token
    async nuxtServerInit({ commit }, { req, store }) {
        if (req.headers.cookie) {
            const token = cookieparser.parse(req.headers.cookie)['YXBJ-token'] // 格式化setCookies

            if (token) {
                commit('SET_TOKEN', token)
                setToken(token)
                await store.dispatch('getInfo')
            }
        }
    },
    // 设置
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    },
    //获取菜单
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            let accessedRoutes
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}
