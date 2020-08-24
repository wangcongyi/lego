import Vue from 'vue'
import { _debounce } from '@/utils/limit'

Vue.directive('render', {
  bind(el, binding) {
    el.innerHTML = binding.value.replace(/\\n/g, '<br>')
  },
  update(el, binding) {
    el.innerHTML = binding.value.replace(/\\n/g, '<br>')
  }
})

Vue.directive('debounce', {
  bind(el, binding) {
    let executeFunction
    if (binding.value instanceof Array) {
      const [func, wait = 1000, immediate] = binding.value
      executeFunction = _debounce(func, wait, immediate)
    } else {
      executeFunction = _debounce(binding.value, 1000)
    }
    el.addEventListener('click', executeFunction)
  }
})
