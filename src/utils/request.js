import axios from 'axios'
import {
    Message
} from 'element-ui'
import store from '@/store'
import {
    getToken
} from '@/utils/auth'
const service = axios.create({
    // baseURL: process.env.BASE_API, // api 的 base_url
    // baseURL: process.env.DEV_API, // api 的 base_url
    timeout: 5000 // request timeout
})
service.interceptors.request.use(
    config => {
        config.headers['X-CSRF-TOKEN'] = document.getElementsByTagName('meta')[4].content;
        let token = localStorage.getItem("tokenCon")
        let userId = localStorage.getItem("userId")

        let headers = {
            "kj-system-version": "web",
            "kj-system-info": "web",
            "kj-app-version": "v1.0"
        }
        let headers_token = {
            "kj-system-version": "web",
            "kj-system-info": "web",
            "kj-app-version": "v1.0",
            "kj-token": token,
            "kj-user-id": userId
        }
        if (token && userId) {
            config.headers = headers_token
        } else {
            config.headers = headers
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(data => {
    if (data.data.errorCode === 10009) {
        Message({
            message: '已失效，请重新登录',
            type: 'error',
            duration: 2 * 1000
        })
        localStorage.clear()
        location.reload() // 
        return Promise.reject('error')
    } else {
        return data
    }
}, error => {
    return Promise.reject(error)
})

export default service