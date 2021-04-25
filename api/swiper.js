import { $axios } from 'plugins/axios'

//增加轮播图
export function swiperAdd(data) {
  return $axios({
    url: "/swiper/add",
    method: "post",
    data,
  });
}
//获取全部轮播图
export function swiperList(query) {
  return $axios({
    url: "/swiper/list",
    method: "get",
    params: query,
  });
}
//编辑轮播图
export function swiperEdit(data) {
  return $axios({
    url: "/swiper/edit",
    method: "put",
    data,
  });
}

//禁用轮播图
export function swiperDisable(data) {
  return $axios({
    url: "/swiper/disable",
    method: "put",
    data,
  });
}
//首页轮播图展示
export function HomeSwiper() {
  return $axios({
    url: "/home/swiper/list",
    method: "get",
  });
}

//关于博主页面
export function SwiperAbout(query) {
  return $axios({
    url: "/home/swiper/about",
    method: "get",
    params: query,
  });
}