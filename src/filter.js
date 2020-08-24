import Vue from 'vue'
import { parseTime, thumbnail } from './utils'

const utils = { parseTime, thumbnail }

Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})

Vue.filter('toDate', function (value) {
  var date = new Date(value)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes()
  m = (m >= 10 ? m : `0${m}`)
  return Y + M + D + h + m
})