import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/admin/logout',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

