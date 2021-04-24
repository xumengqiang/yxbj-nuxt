// import qs from 'qs'

// eslint-disable-next-line import/no-mutable-exports
let axios = null

export default ({ $axios, redirect }) => {
  axios = $axios
  $axios.onRequest((config) => {
    // if (config.method === 'post') { config.data = qs.stringify(config.data) }
    // eslint-disable-next-line no-console
    console.log('Making request to ' + config.url)
    return config
  })

  $axios.onResponse((response) => {
    const resData = (response && response.data) || {}
    return resData
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    // eslint-disable-next-line no-console
    console.log(code, 89898989)
    if (code === 400) {
      redirect('/400')
    }
  })
}

export { axios as $axios }
