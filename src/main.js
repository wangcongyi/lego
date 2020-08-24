import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from '@/store'
import VueLazyload from 'vue-lazyload'
import './styles/index.scss'
import './plugins'
import './filter'
import './components'
import './global'
import './permission'
import './icons'
import './directives'
Vue.use(ElementUI)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://new-app-front.oss-cn-shenzhen.aliyuncs.com/h5mall/common/default/d.png',
  loading: 'https://new-app-front.oss-cn-shenzhen.aliyuncs.com/h5mall/common/default/d.png',
  attempt: 2
})

window.ISPRE = true
window.GLOBAL_VM = {}
Vue.prototype.$pre = window.ISPRE

const app = new Vue({
  el: '#page',
  router,
  store,
  render: h => h(App)
})

export default app
