import { Axios } from '@/utils/request'

export const login = params => Axios.post('登录', '/login', params)
export const getInfo = params => Axios.get('', '/api/getInfo', params)
export const logout = params => Axios.post('', '/api/logout', params)
export const changeInfo = params => Axios.post('', '/api/user/update', params)
