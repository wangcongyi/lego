import { H5_MAIN_URL, LIVE_MAIN_URL, FIND_MAIN_URL, LINK_CONFIG } from '../config'
import Toast from '../plugins/toast'
import { showLoading, hideLoading } from '../plugins/loading'
import apix from './apix'
import Qs from 'qs'
import { getDuration } from '@/utils/storage'
import { trackActivityPage, trackActivityClick } from '@/utils/tracker'
import eventBus from './eventBus'

export const defaultProductImage = ''
export const APP_ADDR = ''
export const getUrlQuery = value => {
  var search = value || location.search.substring(1)
  return search
    ? JSON.parse(
      '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
    )
    : {}
}

export const getParam = param => {
  const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export const guid = (function () {
  var _s4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return function () {
    return _s4() + _s4() + _s4() + _s4() + _s4() + _s4() + _s4() + _s4()
  }
})()

export function getScrollTop() {
  var scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

export const formatPrice = value => {
  if (!value) {
    return value
  }
  let str = String(value)
  let array = str.split('.')

  // 没有小数点
  if (array.length <= 1) {
    return value.toFixed(1)
  }

  let numberStr = array[1]
  if (numberStr.length > 2) {
    return formatPrice(value.toFixed(2))
  }
  if (numberStr.length === 2) {
    if (numberStr[1] === '0') {
      return value.toFixed(1)
    }
    return value.toFixed(2)
  } else {
    return value.toFixed(1)
  }
}

export function getClientHeight() {
  var clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}

export function getScrollHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  )
}

export function scrollAtBottom() {
  if (getScrollTop() + getClientHeight() >= getScrollHeight() - 20) {
    return true
  } else {
    return false
  }
}

export function copy(str, cb) {
  if (str) {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', str)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      typeof cb === 'function' && cb()
    }
    document.body.removeChild(input)
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return '--'
  }
  if (time === null) {
    return '--'
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a')
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  if (time_str === '0-0-0 0:0:0') {
    return '--'
  }
  return time_str
}

export const getCookie = cName => {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(`${cName}=`)
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

export const setCookie = (c_name, value, expiredays, domain) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  let date = expiredays ? ';expires=' + exdate.toGMTString() : ''
  let dm = domain ? ';domain=' + domain : ''
  document.cookie = c_name + '=' + value + date + dm + ';path=/'
}

export const getAppFlag = () => window.navigator.userAgent.includes('Lifeyouyu') || window.APP_FLAG

export const connectWebViewJavascriptBridge = callback => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  document.addEventListener(
    'WebViewJavascriptBridgeReady',
    () => callback(window.WebViewJavascriptBridge),
    false,
  )
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  const WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
  return 0
}

export const getVideoDetail = videoId => {
  return new Promise((resolve, reject) => {
    showLoading()
    apix
      .get('/api/vod/noauth/video/getVideoDetail', {
        params: {
          videoId,
        },
      })
      .then(res => {
        hideLoading()
        if (res.errorCode === 0) {
          resolve(res.result)
        } else {
          Toast(res.errorMsg, 2000)
          reject(res.errorMsg)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

const isProduct = path => path === '/good/product_detail'
const isShop = path => path === '/goods/seller'
const isVideo = path => path === '/wljs/play_list'

export const jump = async ({ id, method = 'commonJumpPage', appPath = '', h5Path = '', wxPath = '', params = {}, name = '' } = {}) => {
  // const idKey = (_ => {
  //   let idKey = 'id'
  //   Object.keys(params).forEach(key => {
  //     if (key.toLowerCase().includes('id')) idKey = key
  //   })
  //   return idKey
  // })()
  // trackActivityPage({ duration: getDuration() })

  const shareMemberId = getParam('shareMemberId')
  const referrerId = getParam('referrerId')
  shareMemberId && (params.shareMemberId = shareMemberId)
  referrerId && (params.referrerId = referrerId)
  let qs = Qs.stringify(params)
  if (getAppFlag()) {
    // if (isVideo(appPath)) {
    //   let videoId = params.videoId
    //   let videoList = await getVideoDetail(videoId)
    //   let stringifyVL = null
    //   try {
    //     stringifyVL = JSON.stringify([...videoList])
    //   } catch (error) {
    //     stringifyVL = JSON.stringify([videoList])
    //   }
    //   params = { index: 0, videoId, videoList: stringifyVL }
    // }
    // TODO 做容错，运营的H5商品链接商品ID的key为id，APP需要key为 productId
    // if (isProduct(appPath)) {
    //   let prdParams = {
    //     productId: params.id || params.productId,
    //   }
    //   params.actType && (prdParams.activityType = params.actType)
    //   params.actId && (prdParams.activityId = params.actId)
    //   params = { ...params, ...prdParams }
    // }
    // TODO 做容错，运营的H5店铺链接店铺ID的key为id，APP需要key为 sellerId
    // if (isShop(appPath)) {
    //   let newParams = {
    //     sellerId: params.id || params.sellerId,
    //     id: params.id || params.sellerId,
    //   }
    //
    //   params = { ...newParams }
    // }
    //
    // // TODO 做容错，兼容旧代码
    // if (id === 'live') {
    //   params.live_id = params.liveId
    // }
    connectWebViewJavascriptBridge(bridge => {
      bridge.callHandler(method, {
        router: appPath + '?' + qs,
      })
    })
  } else if (getParam('miniFlag')) {
    qs = qs.replace('productId', 'id')
    wx.miniProgram.navigateTo({ url: `${wxPath}?${decodeURIComponent(qs)}` })
  } else {
    qs = qs.replace('productId', 'id')
    qs = qs.replace('sellerId', 'id')
    const MAIN_URL =
      id === 'live'
        ? LIVE_MAIN_URL
        : isContains(['articleDetail', 'articleList', 'topic'], id)
        ? FIND_MAIN_URL
        : H5_MAIN_URL
    if (typeof window !== 'undefined' && window.ISPRE) {
      // window.open(`${MAIN_URL}${h5Path}?${decodeURIComponent(qs)}`)
      window.open(`${MAIN_URL}${wxPath}?${decodeURIComponent(qs)}`)
      return
    }
    // window.location.href = `${MAIN_URL}${h5Path}?${decodeURIComponent(qs)}`
    window.location.href = `${MAIN_URL}${wxPath}?${decodeURIComponent(qs)}`
  }
}

/**
 * 跳转
 * @param {String} targetId
 * @param {String|Object} originParams
 */
export const jumpById = (targetId, originParams) => {
  if (!targetId) return
  const target = LINK_CONFIG.find(({ id }) => id === targetId)
  const params = (_ => {
    const search = typeof originParams === 'string' ? link.split('?') : ''
    if (search.length > 1) {
      return qs.parse(search[search.length - 1])
    }
    return originParams
  })()
  jump({
    id: targetId,
    method: 'commonJumpPage',
    appPath: target.appLink,
    h5Path: target.h5Link,
    wxPath: target.wxLink,
    params,
  })
}

// 跳转登录
let isLogging = false
export const toLogin = (info = '未登录，请登录', url, time = 2) => {
  if (isLogging) {
    return
  }
  isLogging = true
  Toast(info)
  if (getAppFlag()) {
    setTimeout(() => {
      connectWebViewJavascriptBridge(bridge => {
        bridge.callHandler('toLogin')
      })
    }, time * 1000)
  } else if (getParam('miniFlag')) {
    wx.miniProgram.navigateTo({ url: '/pages/login/index/index' })
  } else {
    setTimeout(() => {
      window.location.href = `${H5_MAIN_URL}/#/login?redirectUrl=${encodeURIComponent(
        window.location.href,
      )}&needToken=1`
    }, time * 1000)
  }
  setTimeout(() => {
    isLogging = false
  }, 2000)
}

// 获取token
export const getToken = () => {
  let TOKEN = getCookie('BASE_TOKEN')

  if (!TOKEN) {
    const token = localStorage.getItem('BASE_TOKEN')

    if (token && token !== 'null') {
      TOKEN = token
    }
  }
  return TOKEN
}

// APP获取token
export const fetchToken = (needLogin = false) => {
  return new Promise((resolve, reject) => {
    connectWebViewJavascriptBridge(bridge => {
      bridge.callHandler('fetchToken', {}, res => {
        const data = JSON.parse(res)
        const token = data.token
        if (token) {
          // console.log(`1.1、方法内拿到token${token}`)
          localStorage.setItem('BASE_TOKEN', token)
          resolve(token)
        } else {
          if (needLogin) {
            // console.log(`1.2、没有token，方法内跳登录`)
            toLogin()
          }
          reject()
        }
      })
    })
  })
}

// 处理token情况
export const handleToken = async _ => {
  return new Promise((resolve, reject) => {
    if (getAppFlag()) {
      fetchToken()
        .then(token => {
          // console.log(`1、拿到token了${token}`)
          resolve(true)
        })
        .catch(_ => {
          // console.log(`3、走catch`)
          listenSetLocalStorage('BASE_TOKEN', _ => {
            resolve(true)
          })
        })
    } else if (!getToken()) {
      // console.log(`4、没走APP`)
      toLogin()
      resolve(false)
    } else {
      // console.log(`5、有token`)
      resolve(true)
    }
  })
}

/**
 * @param {*} time 要等待的ms
 * @returns
 * @example awaitToken()(()=> {  })
 */
export const awaitToken = (time = 3000) => {
  let count = 0
  const handle = (fn, end) => {
    if (count * 200 >= time) {
      if (end) {
        end()
      }
      toLogin('未登录，请登录.', '/#/login', 1)
      return
    }
    count++

    if (getToken()) {
      fn()
    } else {
      setTimeout(() => {
        handle(fn, end)
      }, 200)
    }
  }
  return (fn, end) => {
    handle(fn, end)
  }
}

/**
 * @param {*} key 要监听写入的key
 * @param {*} fn 写入后执行的操作
 */
export const listenSetLocalStorage = (key, fn) => {
  const oldSetItem = localStorage.setItem
  const setItemEvent = new Event('setItemEvent')
  window.addEventListener('setItemEvent', () => {
    fn()
  })
  localStorage.setItem = (lKey, newValue) => {
    if (lKey === key) {
      setItemEvent.newValue = newValue
      oldSetItem.apply(localStorage, [lKey, newValue])
      if (!(newValue === null || newValue === 'null')) {
        window.dispatchEvent(setItemEvent)
      }
    } else {
      oldSetItem.apply(localStorage, [lKey, newValue])
    }
  }
}

// 获取用户信息
export const getUserInfo = () => {
  return apix.get('/api/member/current').then(res => {
    const USER_INFO = res.data
    setCookie('USER_INFO', JSON.stringify(USER_INFO))
    localStorage.setItem('USER_INFO', JSON.stringify(USER_INFO))
    eventBus.$emit('userInfo', USER_INFO)
    return USER_INFO
  })
}

// 分享调用
export const share = (params = {}) => {
  connectWebViewJavascriptBridge(bridge => {
    bridge.callHandler('share', params)
  })
}

const needLoginCondition = (id, model) => {
  return [
    id === 'ProductView' && model.highCommission,
    id === 'VideoLarge' && model.highCommission,
  ]
}
export const isNeedLogin = tModel => {
  return tModel.some(item => {
    const { model, id } = item
    const needList = needLoginCondition(id, model)
    return item.show && needList.find(f => f)
  })
}

/**
 * px转换成vw
 * @param {String} value 原始值，px
 * @param {Number} viewWidth 设计稿宽度
 * @param {Boolean} isConver 是否进行转换
 * @param {Boolean} zeroReturns 为0是否返回
 * @returns {String} 转换值，vw
 */
export const px2vw = (
  value,
  viewWidth = 375,
  isConver = false,
  zeroReturns = true,
) => {
  const cut = viewWidth / 100
  isConver =
    isConver ||
    (typeof window !== 'undefined' ? (!window.ISPRE) : true)
  const conver = value => {
    value =
      typeof value === 'string'
        ? value.substr(-2) === 'px'
        ? parseFloat(value)
        : value.substr(-2) === 'vw'
          ? parseFloat(value) * cut
          : parseFloat(value)
        : parseFloat(value)
    return value || zeroReturns
      ? isConver
        ? `${value / cut}vw`
        : `${value}px`
      : ''
  }
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return value.map(item => conver(item))
  }
  return conver(value)
}

export const handleActivityStatus = (array, time) => {
  let [
    preStartTime = 0,
    preEndTime = 0,
    formalStartTime = 0,
    formalEndTime = 0,
    isDeleted = 0,
  ] = array
  var status
  time = time || +new Date()
  preEndTime = +preEndTime
  formalStartTime = +formalStartTime
  formalEndTime = +formalEndTime
  if (isDeleted) {
    status = 0
  } else if (time > formalEndTime) {
    status = 0
  } else if (preEndTime < formalStartTime) {
    if (time > preEndTime && time < formalStartTime) {
      status = 0
    } else {
      status = 1
    }
  } else {
    status = 1
  }
  return {
    array,
    status,
  }
}

export const checkX = _ => {
  var isIPhoneX =
    /iphone/gi.test(window.navigator.userAgent) &&
    window.devicePixelRatio &&
    window.devicePixelRatio === 3 &&
    window.screen.width === 375 &&
    window.screen.height === 812
  var isIPhoneXSMax =
    /iphone/gi.test(window.navigator.userAgent) &&
    window.devicePixelRatio &&
    window.devicePixelRatio === 3 &&
    window.screen.width === 414 &&
    window.screen.height === 896
  var isIPhoneXR =
    /iphone/gi.test(window.navigator.userAgent) &&
    window.devicePixelRatio &&
    window.devicePixelRatio === 2 &&
    window.screen.width === 414 &&
    window.screen.height === 896
  return isIPhoneX || isIPhoneXSMax || isIPhoneXR
}

export const thumbnail = (url, w, h) => {
  const ignoreUrl = ['x-oss-process=image/resize', 'iph.href.lu']
  if (isContains(ignoreUrl, url, true)) return url
  const cornerFlag = ['/watermark']
  if (isContains(cornerFlag, url, true)) {
    return `${url}/resize,w_${w}${h ? `,h_${h}` : ``},limit_1`
  }
  return `${url}?x-oss-process=image/resize,w_${w}${h ? `,h_${h}` : ``},limit_1`
}

/**
 * 是否包含
 * @param {*} list 列表
 * @param {*} str 查询值
 * @param {*} fuzzy 包含关系
 */
export const isContains = (list = [], str = '', fuzzy = false) => {
  try {
    let flag = false
    flag = list.some(item =>
      fuzzy ? str && str.indexOf(item) !== -1 : str === item,
    )
    return flag
  } catch (error) {
    throw error
  }
}

/**
 * This is a multi-condition chain calling tool.
 * @param {Array} functions
 * @returns {*} Return chain last condition result
 */
export const pipe = functions => data => {
  return functions.reduce((value, func) => func(value), data)
}

/**
 * 监听页面隐藏
 * @param {Function} listener
 */
export const listenerHidden = listener => {
  let hidden, visibilityChange
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden'
    visibilityChange = 'mozvisibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }
  document.addEventListener(
    visibilityChange,
    _ => {
      typeof listener === 'function' && listener(document[hidden])
    },
    false,
  )
}

// 获取字符串长度
export const getStringLength = str => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length // 先把中文替换成两个字节的英文，在计算长度
}
