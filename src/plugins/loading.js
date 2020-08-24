import vue from 'vue'

import loadingComponent from '@/templates/components/base/Loading'

const LoadingConstructor = vue.extend(loadingComponent)

const stacks = []

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
export const showLoading = (text, duration = 250, mask = true) => {
  if (typeof window !== 'undefined' && window.ISPRE) {
    return
  }
  // 实例化一个 loading.vue
  const loadingDom = new LoadingConstructor({
    el: document.createElement('div'),
    data () {
      return {
        text,
        mask,
        showWrap: true,
        showContent: true
      }
    }
  })

  // 把 实例化的 loading.vue 添加到 body 里
  document.body.appendChild(loadingDom.$el)

  // 把实例化的 loading.vue 塞进 堆栈
  stacks.push(loadingDom)

  // 返回一个对象 包含loading关闭动作
  return {
    hideLoading () {
      loadingDom.showWrap = false
    }
  }
}

// 销毁最后一个loading
export const popLoading = () => {
  const target = stacks.pop()
  target.showContent = false
  setTimeout(() => {
    target.showWrap = false
  }, 250)
}

// 全局销毁loading事件
export const hideLoading = () => {
  stacks.forEach(item => { item.showWrap = false })
  stacks.splice(0, stacks.length)
}

// 注册为全局组件的函数
vue.prototype.$showLoading = showLoading

// 注册全局函数 销毁最后一个loading
vue.prototype.$popLoading = popLoading

// 注册全局销毁loading事件
vue.prototype.$hideLoading = hideLoading