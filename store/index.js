import { login, getInfo, register } from 'api/user'
import { getToken, setToken, removeToken } from 'utils/auth'
let cookieparser = require('cookieparser')

export const state = () => ({
    info: null,
    token: getToken() || '',
    roles: []
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
    // register
    register({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            register(userInfo).then((response) => {
                commit('SET_TOKEN', response.data.token)
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
                console.log(response)
                const { data } = response
                // commit('SET_ROLES', data.roles || [])
                commit('SET_USERINFO', data)
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    // user logout
    logout({ commit }) {
        return new Promise((resolve) => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },
    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },
    async nuxtServerInit({ commit }, { req, store }) {

        if (req.headers['cookie']) {

            let token = cookieparser.parse(req.headers['cookie'])['YXBJ-token']; //格式化setCookies

            if (token) {
                await store.dispatch('getInfo')
                commit('SET_TOKEN', token);
                setToken(token)
            }
        }
    }
}
