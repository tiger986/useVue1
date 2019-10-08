import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/admin/work/workList',
        method: 'post',
        data
    })
}
export function addWork(data) {
    return request({
        url: '/admin/work/addWork',
        method: 'post',
        data
    })
}
export function delWork(data) {
    return request({
        url: '/admin/work/delWork',
        method: 'post',
        data
    })
}