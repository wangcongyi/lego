import axios from 'axios'
import { PLATFORM, VERSION, BASE_URL } from '../config'
import { Message } from 'element-ui'

export const xhr = axios.create({
  timeout: 8000,
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  responseType: 'json',
  withCredentials: true
})
xhr.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = config.data || {}
      config.data.version = VERSION
      config.data.platform = PLATFORM
    } else if (config.method === 'get') {
      // todo
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
xhr.interceptors.response.use(
  response => {
    if (response.data && response.data.code === 200) {
      return response.data
    } else if (response.data && response.data.code === 401) {
      return Promise.reject(response.data)
      // todo
    } else {
      return Promise.reject(response.data)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

const query = (type, tips = '', ...props) => {
  return axios[type](...props)
    .then(res => {
      if(res.code === 200) {
        tips && Message.success(`${tips}成功`)
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    }) 
    .catch(msg => {
      tips &&
        Message.error(
          `${tips}失败${msg ? `，${msg}` : ''}`
        )
      console.error(`${tips}失败`, msg)
      return Promise.reject(msg)
    })
}
export const Axios = {
  post: (tips, ...props) => query('post', tips, ...props),
  get: (tips, ...props) => query('get', tips, ...props)
}
