import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/admin/identity/identityList',
        method: 'post',
        data
    })
}
export function addIdentity(data) {
    return request({
        url: '/admin/identity/addIdentity',
        method: 'post',
        data
    })
}
export function delIdentity(data) {
    return request({
        url: '/admin/identity/delIdentity',
        method: 'post',
        data
    })
}