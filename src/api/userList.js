import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/admin/back/adminList',
        method: 'post',
        data
    })
}

export function editUser(data) {
    return request({
        url: '/admin/back/editUser',
        method: 'post',
        data
    })
}

export function resetPwd(data) {
    return request({
        url: '/admin/back/resetPwd',
        method: 'post',
        data
    })
}

export function addUser(data) {
    return request({
        url: '/admin/back/addUser',
        method: 'post',
        data
    })
}

export function delUser(data) {
    return request({
        url: '/admin/back/delUser',
        method: 'post',
        data
    })
}