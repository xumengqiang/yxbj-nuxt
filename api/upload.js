import { $axios } from 'plugins/axios'

//登录
export function upload(data) {
  return $axios({
    url: '/upload',
    method: 'post',
    data
  })
}