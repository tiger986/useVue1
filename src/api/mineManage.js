import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/admin/miningAreaManager/miningAreaLists',
        method: 'post',
        data
    })
}
export function miningAreaAdd(data) {
    return request({
        url: '/admin/miningAreaManager/miningAreaAdd',
        method: 'post',
        data
    })
}
export function miningAreaDel(data) {
    return request({
        url: '/admin/miningAreaManager/miningAreaDel',
        method: 'post',
        data
    })
}
export function miningAreaMod(data) {
    return request({
        url: '/admin/miningAreaManager/miningAreaMod',
        method: 'post',
        data
    })
}
export function statusChange(data) {
    return request({
        url: '/admin/miningAreaManager/statusChange',
        method: 'post',
        data
    })
}