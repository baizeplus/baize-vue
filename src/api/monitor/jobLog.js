import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: '/monitor/job/log/list',
    method: 'get',
    params: query
  })
}

// // 删除调度日志
// export function delJobLog(jobLogId) {
//   return request({
//     url: '/monitor/job/log/' + jobLogId,
//     method: 'delete'
//   })
// }

// 清空调度日志
export function jobIdAndName() {
  return request({
    url: '/monitor/job/jobIdAndName',
    method: 'get'
  })
}
