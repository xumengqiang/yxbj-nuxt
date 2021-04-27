import qs from 'qs'
import { Message } from 'element-ui'

// eslint-disable-next-line import/no-mutable-exports
let axios = null

export default ({ $axios, redirect, store }) => {
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
        console.log(response)
        const res = (response && response.data) || {}
        if (res.code === 200) {
            return res
        } else {
            if (res.code === 405 || res.code === 401) {
                store.dispatch('resetToken')
                store.dispatch('changeSetting', {
                    key: 'showLogin',
                    value: true
                })
            } else if (res.code === 404) {
                redirect('/404')
            }
            // return Promise.reject(res)
        }
    })

    $axios.onError((error) => {
        Message({
            message: error.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
        })
    })
}

export { axios as $axios }
