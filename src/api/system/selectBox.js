import request from '@/utils/request'

// 查询用户权限
export function selectBoxPermission() {
    return request({
        url: '/system/selectBox/permission',
        method: 'get',
    })
}

// 查询用户部门
export function selectBoxDept() {
    return request({
        url: '/system/selectBox/dept',
        method: 'get',
    })
}
