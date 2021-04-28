import { login, getInfo } from 'api/user'
import { setToken, removeToken } from 'utils/auth'
const cookieparser = require('cookieparser')

export const state = () => ({
    info: null,
    token: '',
    roles: [],
    showLogin: false
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
    }
}
