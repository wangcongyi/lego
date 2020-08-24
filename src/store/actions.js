import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
import instance from '@/main.js'
import { ROOTPATHURL } from '../../config/ossConfig'


const title = '流行日记'
const desc = '开店做主播，能省会赚，在家也能上班'
const imgUrl = ''
const link = ''

axios.interceptors.request.use(config => {
  const token = getToken()
  config.headers.common['Authorization'] = 'Bearer ' + token
  return config
})

axios.interceptors.response.use(response => {
  const data = response.data
  const { authorization } = response.headers
  authorization && setToken(authorization)

  if (data.code === 401) {
    removeToken()
    instance.$router.push({
      path: '/login',
      query: {
        referer: encodeURIComponent(instance.$route.fullPath),
      },
    })
    return {
      code: 401,
      msg: '会话超时，请重新登录',
    }
  }
  return data
})

export default {
  getActivityDetail({ commit }, { activityId }) {
    return axios
      .post('api/getActivityDetail', {
        activityId,
      })
      .then(res => {
        if (res.code === 200) {
          commit('setCurrentActivity', res.msg)
          return res
        }
        throw res.msg
      })
      .catch(e => {
        console.log(e)
        Message.error(e || '不存在该活动')
        throw e
      })
  },
  resetCurrentActivity({ commit }) {
    commit('resetCurrentActivity')
  },
  getPageDetail({ commit }, { pageId, pid }) {
    if (!pageId) {
      commit('setCurrentPage', {
        pid,
        share_desc: desc,
        share_img_url: imgUrl,
        share_link: link,
        share_title: title,
      })
      return Promise.resolve({ hasPower: true })
    } else {
      return axios
        .post('api/getPageDetail', {
          pageId,
        })
        .then(res => {
          if (res.code === 403) {
            commit('resetCurrentPage')
            commit('resetCurrentActivity')
          } else if (res.code === 200) {
            commit('setCurrentPage', res.msg)
            return { hasPower: true }
          }
          throw res.msg
        })
        .catch(e => {
          console.log(e)
          Message.error(e || '不存在该页面')
          return { hasPower: false }
        })
    }
  },
  resetPageDetail({ commit }) {
    commit('resetCurrentPage')
  },
  getProductList({ commit, state }, cb) {
    axios
      .get('api/products')
      .then(data => {
        // var data = data.data
        if (data.code === 200) {
          commit('setProductList', data.msg)
          cb && cb()
        } else {
          return Promise.reject(data.msg)
        }
      })
      .catch(error => {
        console.error('action::getProductList::error:', JSON.stringify(error))
      })
  },
  getProduct(context, obj) {
    context.dispatch('getProductList', () => {
      var product = context.state.productList.find(pd => {
        // 此处字符故意用 ==
        return pd.id == obj.id
      })
      context.commit('setEditProduct', product)
      obj.cb && obj.cb()
    })
  },
  getPageList({ commit, state }, { params, cb }) {
    axios
      .post('api/pages', {
        pid: params.pid,
      })
      .then(data => {
        // var data = data.data
        if (data.code === 200) {
          commit('setPageList', data.msg)
          cb && cb()
        } else {
          return Promise.reject(data.msg)
        }
      })
      .catch(error => {
        console.error('action::getPageList::error: ', JSON.stringify(error))
      })
  },
  getPage(context, obj) {
    context.dispatch('getPageList', {
      params: obj,
      cb: () => {
        var page = context.state.pageList.find(page => {
          // 此处字符故意用 ==
          return page.id == obj.id
        })
        context.commit('setEditPage', page)
        obj.cb()
      },
    })
  },
  deletePage({ commit, state }, pageModel) {
    axios
      .post('api/deletePage', {
        pageId: pageModel.id,
      })
      .then(data => {
        // var data = data.data
        if (data.code === 200) {
          commit('deletePage', pageModel)
        } else {
          return Promise.reject(data.msg)
        }
      })
      .catch(error => {
        console.error('action::deletePage::error: ', JSON.stringify(error))
      })
  },
  createPage({ commit, state }, { callback }) {
    axios
      .post('/api/createPage', {
        activity_id: state.editPage.activity_id,
        pid: state.editPage.pid,
        name: state.editPage.name,
        deploy_title: state.editPage.deploy_title,
        deploy_desc: state.editPage.deploy_desc,
        deploy_keywords: state.editPage.deploy_keywords,
        root_path: ROOTPATHURL,
      })
      .then(data => {
        // var data = data.data
        if (data.code === 200) {
          let page = {
            id: data.msg.id,
            name: state.editPage.name,
            pid: state.editPage.pid,
          }
          commit('setCurrentPage', page)
          callback()
        } else if (data.code === 0) {
          MessageBox.alert(data.msg)
        } else {
          return Promise.reject(data.msg)
        }
      })
      .catch(err => {
        Message.error(err || '保存失败，请查看控制台日志')
        console.error(err)
      })
  },
  restorePage({ commit, state }, data = {}) {
    return new Promise((resolve, reject) => {
      const t_model = data.tModel
      debugger
      commit('setCurrentPage', Object.assign({}, state.editPage, { t_model }))
      resolve()
    })
  },
  saveEdit({ commit, state }, data = {}) {
    const { tModel = '' } = data
    let tModelData = tModel || state.tModel
    tModelData = typeof tModelData === 'string' ? tModelData : JSON.stringify(tModelData)
    const pageId = state.editPage.id
    return axios.post('/api/save', {
      pageId,
      root_path: ROOTPATHURL,
      pid: state.editPage.pid,
      name: state.editPage.name,
      tName: state.tName,
      tModel: tModelData,
      sub_path: state.editPage.sub_path,
      activity_id: state.editPage.activity_id,
      deploy_title: state.editPage.deploy_title,
      deploy_desc: state.editPage.deploy_desc,
      deploy_keywords: state.editPage.deploy_keywords,
      share_title: state.editPage.share_title,
      share_desc: state.editPage.share_desc,
      share_img_url: state.editPage.share_img_url,
      share_link: state.editPage.share_link,
    })
      .then(data => {
        if (data.code === 401) {
          localStorage.setItem(`UNEXPECTED_EXIT${pageId}`, 1)
          localStorage.setItem(`UNEXPECTED_PAGE${pageId}`, tModelData)
        }
        if (data.code === 200) {
          commit('updatePage', data.data)
          localStorage.setItem(`UNEXPECTED_EXIT${pageId}`, 0)
          typeof cb === 'function' && cb()
          return Promise.resolve()
        } else {
          return Promise.reject(data.msg)
        }
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  getAllProducts({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/getProductList', {
          pageSize: payload.pageSize,
          pageNum: payload.pageNum,
          categoryId: payload.categoryId,
          keyword: payload.keyword,
          skuId: payload.skuId,
        })
        .then(data => {
          commit('setAllProduct', data.msg)
          resolve(data.msg)
        })
    })
  },
  getAllCategoryList({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post('/proxy', {
          url: '/category/tree',
        })
        .then(data => {
          commit('setAllCategoryList', data.msg)
          resolve(data.msg)
        })
    })
  },
}
