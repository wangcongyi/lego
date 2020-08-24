import app from './app'
import Vue from 'vue'

// 客户端特定引导逻辑……
if (window.__INITIAL_STATE__) {
  Vue.prototype.tData=window.__INITIAL_STATE__
}
if (typeof window !== "undefined") {
  const Fastclick = require('fastclick')
  Fastclick.attach(document.body)
}
app.$mount('#app')
