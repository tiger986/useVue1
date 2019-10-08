/*
 * @Author: YangHQ
 * @Date: 2018-10-25 10:59:44
 * @LastEditors: YangHQ
 * @LastEditTime: 2018-10-25 11:01:46
 * @Description: 用户反馈管理
 */
import request from '@/utils/request'
/**
 * @name: YangHQ
 * @msg: 列表
 * @param {type} 
 * @return: 
 */
export function getComplaintList(data) {
    return request({
        url: '/admin/complaint/getComplaintList',
        method: 'post',
        data
    })
}
/**
 * @name: YangHQ
 * @msg: 更改状态
 * @param {string} 
 * @return: 
 */
export function changeComplaintStatus(data) {
    return request({
        url: '/admin/complaint/changeComplaintStatus',
        method: 'post',
        data
    })
}
/**
 * @name: YangHQ
 * @msg: 删除列表
 * @param {Array} 
 * @return: 
 */
export function deleteComplaint(data) {
    return request({
        url: '/admin/complaint/deleteComplaint',
        method: 'post',
        data
    })
}
/**
 * @name: YangHQ
 * @msg: 详情
 * @param {Array} 
 * @return: 
 */
export function getComplaintInfo(data) {
    return request({
        url: '/admin/complaint/getComplaintInfo',
        method: 'post',
        data
    })
}
/**
 * @name: YangHQ
 * @msg: 控制台未处理数量
 * @param {Array} 
 * @return: 
 */
export function untreated(data) {
    return request({
        url: '/admin/complaint/untreated',
        method: 'post',
        data
    })
}