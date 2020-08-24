import axios from 'axios'
import { getToken, isContains } from './index'
import qs from 'qs'

const findIgnoreUrl = url => {
  const ignoreUrl = [
    '/api/actcenter/noauth/activity/member/my/gains',
    '/api/vod/noauth/video/getVideoDetail',
    '/api/ttai/mget',
    '/api/ttai/get',
    '/api/live/noauth/hty/getAppointLive',
  ]
  return isContains(ignoreUrl, url, true)
}

const BUILD_ARGVS = process.env.BUILD_ARGVS || 'dev'
const baseURL = BUILD_ARGVS === 'prod' ? 'https://lego-api.sznobug.com' : `https://api-${BUILD_ARGVS}.lifeyouyu.com`


const apix = axios.create({
  timeout: 10000,
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  responseType: 'json',
  withCredentials: true,
})

apix.interceptors.request.use(
  config => {
    // config.headers.token = ''
    // if (!getToken() && !findIgnoreUrl(config.url)) {
    //   toLogin('未登录，请登录.', '/#/login', 1)
    //   return
    // }
    if (config.method === 'post') {
      config.data = config.data || {}
    } else if (config.method === 'get') {
      // TODO
    }
    if (!findIgnoreUrl(config.url)) {
      config.headers.token = getToken()
    }
    return config
  },
  error => Promise.reject(error),
)

apix.interceptors.response.use(
  response => {
    const { data = {} } = response
    const { errorCode, code, message, errorMsg } = data
    const msg = errorMsg || message || ''
    const status = typeof errorCode !== 'undefined' ? errorCode : code

    // if (!getToken() && !findIgnoreUrl(response.config.url)) {
    //   // console.log(`1、响应、需要登录${!getToken()}${!findIgnoreUrl(response.config.url)}`)
    //   toLogin('未登录，请登录.', '/#/login', 2)
    //   return Promise.reject('未登录，请登录')
    // }
    // if (+status === 1) {
    //   // console.log(`2、响应状态${status}需要登录${!getToken()}${!findIgnoreUrl(response.config.url)}`)
    //   toLogin('会话超时，请重新登录.', '/#/login', 2)
    //   return Promise.reject('未登录，请登录')
    // } else if (+status === 30 || +status === 0) {
    //   // success
    // } else if (msg) {
    //   // if (typeof window !== 'undefined' && window.ISPRE) {
    //   //   return Promise.reject(msg)
    //   // } else {
    //   //   Toast(msg)
    //   // }
    //   if (
    //     response.config.url.indexOf(
    //       '/api/actcenter/market/coupon/deliver/ttai',
    //     ) > -1
    //   ) {
    //     let errorMsg = ''
    //     if (+status === 1099) {
    //       if (msg.indexOf('您已经领取过该优惠券了') > -1) {
    //         errorMsg = '您已领券，请到我的优惠券里查看'
    //       } else if (msg.indexOf('优惠券已经被领完了') > -1) {
    //         errorMsg = '感谢参与，今日券已领完'
    //       } else if (msg.indexOf('优惠券还没有到领取时间') > -1) {
    //         errorMsg = '活动时间还未到'
    //       } else {
    //         errorMsg = '您暂不符合该优惠券领取条件'
    //       }
    //     } else if ([6000, 6001, 6002].indexOf(+status) > -1) {
    //       errorMsg = '小主们太热情啦，稍后再试'
    //     } else {
    //       errorMsg = '系统开小差啦，稍后再试'
    //     }
    //     return Promise.reject(errorMsg)
    //   } else {
    //     return Promise.reject(msg.replace('。', ''))
    //   }
    // }

    return data
  },
  error => {
    return Promise.reject('系统开小差啦，稍后再试')
  },
)

export default apix

export const apix2Post = (url, params = {}) => {
  return apix
    .post(url, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(res => res)
    .catch(msg => {
      console.log(msg)
      // Toast('网络请求失败，请稍后重试')
      throw msg
    })
}

export const apix2Get = (url, params = {}) => {
  return apix.get(url, { params }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
    .then(res => res)
    .catch(msg => {
      console.log(msg)
      // Toast('网络请求失败，请稍后重试')
      throw msg
    })
}
