import Vue from 'vue'
import app from './app.js'

export default context => {
  context.state = Vue.prototype.tData = {
    needLogin: context.needLogin,
    title: context.title,
    tpl: context.tpl,
    tModel: context.tModel,
    share: context.share
  }
  return new Promise((resolve, reject) => {
    resolve(app)
  })
}
