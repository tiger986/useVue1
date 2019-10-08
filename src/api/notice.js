import request from '@/utils/request'

export function fetchList(data) {
  return request({
      url: '/admin/notice/getNoticeList',
      method: 'post',
      data
  })
}

export function deleteNotice(data) {
    return request({
        url: '/admin/notice/deleteNotice',
        method: 'post',
        data
    })
}

export function fetchCheckOtions(data) {
    return request({
        url: '/admin/notice/getSearchNoticeList',
        method: 'post',
        data
    })
}

export function addNotice(data) {
    return request({
        url: '/admin/notice/createNotice',
        method: 'post',
        data
    })
}