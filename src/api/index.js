import service from './fetch'
import * as api from './uri'


export function getAnalysis () {
  return service.get(api.info)
}

export function getSysTree (params) {
  return service.get(api.tree, { params })
}

export function getRemoteList () {
  return service.get(api.rcloneList)
}

export function getFolderList (params) {
  return service.get(api.folder, { params })
}

export function createFolder (data) {
  return service.post(api.folder, data)
}

export function deleteFolder (id) {
  return service.delete(api.folder + id)
}

export function getTaskList (params) {
  return service.get(api.task, { params })
}
export function deleteTask (id) {
  return service.delete(api.task + id)
}

export function updateTask (id, data) {
  return service.put(api.task + id, data)
}

export function originList () {
  return service.get(api.originList)
}

export function refreshOrigins () {
  return service.get(api.refreshOrigins)
}
