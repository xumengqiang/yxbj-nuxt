import { $axios } from 'plugins/axios'

// 首页轮播图展示
export function HomeSwiper () {
  return $axios({
    url: '/home/swiper/list',
    method: 'get'
  })
}
