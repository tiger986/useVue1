import request from '@/utils/request'

export function fetchList(data) {
  return request({
      url: '/admin/news/newsList',
      method: 'post',
      data
  })
}

export function fetchArticle(data) {
  return request({
    url: '/admin/news/readtEditNews',
    method: 'post',
    data
  })
}

export function addNews(data) {
  return request({
      url: '/admin/news/addNews',
      method: 'post',
      data
  })
}

export function delNews(data) {
  return request({
      url: '/admin/news/delNews',
      method: 'post',
      data
  })
}

export function changeStatus(data) {
  return request({
      url: '/admin/news/changeStatus',
      method: 'post',
      data
  })
}

export function editNews(data) {
  return request({
      url: '/admin/news/editNews',
      method: 'post',
      data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function upImg(data) {
  return request({
    url: '/admin/news/uploadImg',
    method: 'post',
    data
  })
}
