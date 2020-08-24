import vue from 'vue'

import toastComponent from '@/templates/components/base/Toast'

import { MessageBox } from 'element-ui'

const ToastConstructor = vue.extend(toastComponent)
let toastStack = []
// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function showToast() {
  hideToast()
  const arg = Array.prototype.slice.call(arguments, 0)
  // TODO CUSTOM ALERT
  if (typeof window !== 'undefined' && window.ISPRE) {
    MessageBox.alert(arg[0])
    return
  }
  const data = {
    text: arg[0] || '',
    duration: arg[1] || 2000,
    mask: arg[2] || false,
    showWrap: true,
    showContent: true
  }
  arg.forEach(item => {
    if (typeof item === 'object') Object.assign(data, item)
  })

  // 实例化一个 toast.vue
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        ...data
      }
    }
  })

  // 把 实例化的 toast.vue 添加到 body 里
  document.body.appendChild(toastDom.$el)
  toastStack.push(toastDom)
  // 提前 250ms 执行淡出动画(因为我们再css里面设置的隐藏动画持续是250ms)
  setTimeout(() => {
    toastDom.showContent = false
  }, data.duration - 250)
  // 过了 duration 时间后隐藏整个组件
  setTimeout(() => {
    toastDom.showWrap = false
  }, data.duration)
}

export const hideToast = ()  => {
  toastStack.forEach(item => {
    item.showWrap = false
    item.showContent = false
  })
  toastStack = []
}

// 注册为全局组件的函数
vue.prototype.$toast = showToast
vue.prototype.$hide = hideToast

export default showToast
