import qs from 'qs'

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
    const res = (response && response.data) || {}
    if (res.code === 200) {
      return res
    }
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log(code, 89898989)
    if (code === 400) {
      redirect('/400')
    }
  })
}

export { axios as $axios }
