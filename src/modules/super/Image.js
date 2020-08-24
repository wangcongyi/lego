/**
 * 超级背景配置
 * @param {String} title 编辑参数显示标题
 * @param {Object} style 样式
 * @param {Object} options 配置项
 * @return {Object} Props配置
 */
import common from './common.js'
export default (title = '', style = {}, options = {}) => {
  const defaultStyles = {
    background: '',
    paddingLeft: '',
    paddingRight: '',
    paddingTop: '',
    paddingBottom: '',
    ...style
  }
  const defaultOptions = {
    imageAutoHeight: true,
    isBg: false,
    ...options
  }
  return common(title, defaultStyles, defaultOptions)
}
