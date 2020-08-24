/**
 * 处在pre状态下干的事
 */
const pre = {
  pre: window.ISPRE,
  is(todo) {
    if(window.ISPRE) {
      typeof todo === 'function' && todo()
    }
  },
  non(todo) {
    if(!window.ISPRE) {
      typeof todo === 'function' && todo()
    }
  }
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$pre' , {
      value: pre
    })
  }
}