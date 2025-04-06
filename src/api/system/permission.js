import request from '@/utils/request'

// 查询菜单列表
export function listPermission(query) {
  return request({
    url: '/system/permission/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getPermission(menuId) {
  return request({
    url: '/system/permission/' + menuId,
    method: 'get'
  })
}




// 新增菜单
export function addPermission(data) {
  return request({
    url: '/system/permission',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updatePermission(data) {
  return request({
    url: '/system/permission',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delPermission(permissionId) {
  return request({
    url: '/system/permission/' + permissionId,
    method: 'delete'
  })
}
