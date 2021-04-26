import { $axios } from 'plugins/axios'
// 增加大屏分类
export function screenAdd (data) {
  return $axios({
    url: '/screen/add',
    method: 'post',
    data
  })
}
// 获取全部分类
export function screenList (query) {
  return $axios({
    url: '/screen/list',
    method: 'get',
    params: query
  })
}
// 编辑大屏分类
export function screenEdit (data) {
  return $axios({
    url: '/screen/edit',
    method: 'put',
    data
  })
}

// 禁用大屏分类
export function screenDisable (data) {
  return $axios({
    url: '/screen/disable',
    method: 'put',
    data
  })
}
// 获取编辑大屏全部大屏分类
export function screenAll () {
  return $axios({
    url: '/screen/all',
    method: 'get'
  })
}

/**
 * pc全部大屏分类
 */
export function homeScreenAll () {
  return $axios({
    url: '/home/screen/list',
    method: 'get'
  })
}
