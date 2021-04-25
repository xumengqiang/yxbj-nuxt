import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: "", // url = base url + request url
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000, // request timeout
});

// request interceptor
service.interceptors.request.use(
    (config) => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers["authorization"] = `Bearer ${getToken()}`;
        }
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    (response) => {
        //  //获取更新的token
        //  const { authorization } = response.headers;
        //  //如果token存在则存在localStorage
        //  authorization && localStorage.setItem('tokenName', authorization);

        const res = response.data;

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            if (res.code === 400) {
                Message({
                    message: res.msg || "Error",
                    type: "error",
                    duration: 5 * 1000,
                });
            } else if (res.code === 401) {
                MessageBox.confirm(
                    "您的登录信息已失效，您可以取消留在此页面，或重新登录",
                    "确定退出",
                    {
                        confirmButtonText: "重新登录",
                        cancelButtonText: "取消",
                        type: "warning",
                        showClose: false,
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    }
                ).then(async () => {
                    await store.dispatch("user/resetToken");
                    await store.dispatch('settings/changeSetting', {
                        key: 'showLogin',
                        value: true
                    })
                }).catch(() => {
                    store.dispatch("user/resetToken");
                });
            } else if (res.code === 404) {
                router.replace("/404")

            } else if (res.code === 405) {
                store.dispatch('settings/changeSetting', {
                    key: 'showLogin',
                    value: true
                })
            }
            return Promise.reject(res);
        } else {
            return res;
        }
    },
    (error) => {
        console.log("err" + error); // for debug
        Message({
            message: error.msg,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
