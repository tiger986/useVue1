import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/admin/user/userLists',
        method: 'post',
        data
    })
}
export function userAdd(data) {
    return request({
        url: '/admin/user/userAdd',
        method: 'post',
        data
    })
}
export function userMod(data) {
    return request({
        url: '/admin/user/userMod',
        method: 'post',
        data
    })
}
export function userDel(data) {
    return request({
        url: '/admin/user/userDel',
        method: 'post',
        data
    })
}

export function userResetPwd(data) {
    return request({
        url: '/admin/user/userResetPwd',
        method: 'post',
        data
    })
}