import Vue from 'vue'
import { VERSION } from '../config'
import { isContains } from '@/utils'
const deepAssign = require('deep-assign')
const ID_MAP = {
  MeetingItemView: 'FloatingNavItem',
  ProductCell: 'ProductItem'
}
// 打补丁
const patch = (mudule, page = {}) => {
  // 1.0.7补丁，修复吸顶导航图标大小调整问题
  if (VERSION.startsWith('1.0.7')) {
    if (mudule.id === 'StickyNavItem') {
      mudule.model.iconSize = null
    }
  }
  // 1.0.8补丁
  // 1、商品模块去掉lg，md，xs最后一行的下边距，同时弥补模块下边距+10px
  // 2、商品模块去掉左上角logo
  if (VERSION.startsWith('1.0.8')) {
    // 2、修补的页面
    const pageNames = []
    if (mudule.id === 'ProductView') {
      const styleType = parseInt(mudule.model.styleType)
      const paddingBottom = parseInt(mudule.model.paddingBottom)
      // 1、商品模块去掉lg，md，xs最后一行的下边距，同时弥补模块下边距+10px
      if (styleType === 1 || styleType === 2 || styleType === 3) {
        if (paddingBottom === 0) {
          mudule.model.paddingBottom = paddingBottom + 10
        }
      }
      // 2、商品模块去掉左上角logo
      if (isContains(pageNames, page.name)) {
        mudule.model.corner = ''
      }
    }
    if (mudule.id === 'ProductItem') {
      // 2、商品模块去掉左上角logo
      if (isContains(pageNames, page.name)) {
        mudule.model.corner = ''
      }
    }
  }
}
// 更新config
const getLatestConfig = (modules, page) => {
  modules.map(mudule => {
    if (!mudule.id) {
      return mudule
    }
    let config = {}
    let model = {}
    try {
      try {
        config = require(`@/modules/${mudule.id}.js`).default
      } catch (error) {
        config = require(`@/modules/${ID_MAP[mudule.id]}.js`).default
        mudule.id = ID_MAP[mudule.id]
      }
    } catch (error) {
      console.log(`未找到${mudule.id}的Config`)
      console.log(error, mudule)
      return mudule
    }
    mudule.config = config
    // Object也是有顺序的，理清楚顺序 step1
    Object.keys(config).forEach(key => {
      // if (!(key in mudule.model)) {
      const c = typeof config[key] === 'function' ? config[key]() : config[key]
      const d = c.default
      model[key] =
        typeof d === 'function' ? d() : typeof d === 'boolean' ? d : d ? d : ''
      // }
    })
    // TODO 如果高级config不存在某个key，删除对应的mudule.model中的属性，暂未实现（需要深递归），只要线上旧模块（已添加）没有需要删除的高级config属性
    // Object也是有顺序的，理清楚顺序 step2
    mudule.model = deepAssign(model, mudule.model)
    // 打补丁的地方
    patch(mudule, page)
    console.log(`组件${mudule.id}更新完毕`)
    if (mudule.model.childList) {
      mudule.model.childList = getLatestConfig(mudule.model.childList, page)
    }
    return mudule
  })
  return modules
}
export default {
  setCurrentPage(state, data) {
    if (data.t_model) {
      let tModel = JSON.parse(data.t_model)
      data.t_model = JSON.stringify(getLatestConfig(tModel, data))
    }
    state.editPage = Object.assign({}, state.editPage, data)
  },
  resetCurrentPage(state) {
    state.editPage = {}
  },
  setCurrentActivity(state, data) {
    state.activity = Object.assign({}, state.activity, data)
  },
  resetCurrentActivity(state) {
    state.activity = {}
  },
  // 设置商品类目
  setAllCategoryList(state, payload) {
    let dataArr = payload.categories.map(item => {
      return {
        text: item.content.name,
        value: item.content.categoryId
      }
    })
    state.categoryList = dataArr
  },
  // 设置商品列表
  setAllProduct(state, payload) {
    state.allProducts = payload.list
  },
  // 设置产品列表
  setProductList(state, list) {
    state.productList.length = 0
    state.productList.push(...list)
  },
  // 设置当前选中产品下标
  setEditProduct(state, product) {
    state.editProduct = product
  },
  // 删除页面
  deletePage(state, pageModel) {
    state.pageList.splice(state.pageList.indexOf(pageModel), 1)
  },
  // 设置页面列表
  setPageList(state, list) {
    state.pageList.length = 0
    state.pageList.push(...list)
  },
  // 页面列表新增页面
  addNewPage(state, page) {
    state.pageList.push(page)
  },
  // 设置当前编辑页
  setEditPage(state, page) {
    Vue.set(state, 'editPage', page)
  },
  // 更新当前页
  updatePage(state, configs) {
    for (const key in configs) {
      if (configs.hasOwnProperty(key)) {
        Vue.set(state.editPage, key, configs[key])
      }
    }
  },
  // 列表中插入新页
  insertPage(state, payload) {
    var origin = payload.origin
    var cloned = payload.cloned
    var index = state.pageList.indexOf(origin) || state.pageList.length - 1
    state.pageList.splice(index + 1, 0, cloned)
  },
  settName(state, tName) {
    state.tName = tName
  },
  settModel(state, tModel) {
    state.tModel = tModel
  },
  setInfo(state, info) {
    state.info = info
  }
}
