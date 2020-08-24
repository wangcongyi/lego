import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import '@/styles/reset.scss'
import '@/styles/base.scss'
import '@/plugins'
import '@/filter'
import '@/global'
import '@/directives'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://new-app-front.oss-cn-shenzhen.aliyuncs.com/h5mall/common/default/d.png',
  loading: 'https://new-app-front.oss-cn-shenzhen.aliyuncs.com/h5mall/common/default/d.png',
  attempt: 2
})

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
// export function createApp() {
//   //创建 router 和 store 实例
//   const router = createRouter()
//   const store = createStore()
//
//   // 同步路由状态(route state)到 store
//   sync(store, router)
//
//   // 创建应用程序实例，将 router 和 store 注入
//   const app = new Vue({
//     router,
//     store,
//     render: h => h(App)
//   })
//   return { app, router , store}
// }
export default new Vue({
  render: h => h(App)
})
