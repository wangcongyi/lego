import { Axios } from '@/utils/request'

export const requestActivityList = (params) => Axios.post('', '/api/activities', params)
export const createActivity = (params) => Axios.post('保存', '/api/createActivity', params)
export const updateActivity = (params) => Axios.post('保存', '/api/updateActivity', params)
export const removeActivity = (params) => Axios.post('删除', '/api/removeActivity', params)
