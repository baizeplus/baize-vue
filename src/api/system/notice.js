import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
    return request({
        url: '/system/notice/list',
        method: 'get',
        params: query
    })
}

// 查询公告详细
export function getNotice(noticeId) {
    return request({
        url: '/system/notice/' + noticeId,
        method: 'get'
    })
}

// 新增公告
export function addNotice(data) {
    return request({
        url: '/system/notice',
        method: 'post',
        data: data
    })
}

// 新消息数量
export function newMessage() {
    return request({
        url: '/system/consumption/newMessage',
        method: 'get',
    })
}

// 消息列表
export function userNoticeGetInfo(id) {
    return request({
        url: '/system/consumption/' + id,
        method: 'get',
    })
}

// 消息列表
export function userNoticeList(query) {
    return request({
        url: '/system/consumption/userNoticeList',
        method: 'get',
        params: query
    })
}

// 改为已读
export function noticeRead(noticeId) {
    return request({
        url: '/system/consumption/noticeRead/' + noticeId,
        method: 'put'
    })
}

// 全部已读
export function noticeReadAll() {
    return request({
        url: '/system/consumption/noticeReadAll',
        method: 'put'
    })
}

// 删除消息
export function noticeDelete(noticeIds) {
    return request({
        url: '/system/consumption/noticeDelete/' + noticeIds,
        method: 'delete'
    })
}
