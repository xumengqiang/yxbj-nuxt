import qs from 'qs'
import { Message } from 'element-ui'

// eslint-disable-next-line import/no-mutable-exports
let axios = null

export default ({ $axios, redirect, store }) => {
    const IS_ClIENT = process.client;
    axios = $axios
    $axios.onRequest((config) => {
        if (config.method !== 'get') { config.data = qs.stringify(config.data) }

        if (store.state.token) {
            config.headers.authorization = `Bearer ${store.state.token}`
        }

        console.log('Making request to ' + config.url)
        return config
    })

    $axios.onResponse((response) => {
        const res = (response && response.data) || {}
        if (res.code === 200) {
            return res
        } else {
            if (IS_ClIENT) {
                return Promise.reject(res)
            }
            store.dispatch('resetToken')
            return false
        }
    })

    $axios.onError((error) => {
        if (error.code === 405 || error.code === 401) {
            store.dispatch('resetToken')
            store.dispatch('changeSetting', {
                key: 'showLogin',
                value: true
            })
        } else if (error.code === 404) {
            redirect('/404')
        } else {
            Message({
                message: error.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
        }
    })
}

export { axios as $axios }
