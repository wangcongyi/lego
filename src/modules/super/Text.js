/**
 * 超级文本配置
 * @param {String} title 编辑参数显示标题
 * @param {Object} style 样式
 * @param {Object} options 配置项
 * @return {Object} Props配置
 */
import common from './common.js'
export default (title = '', style = {}, options = {}) => {
  const defaultStyles = {
    fontSize: '',
    color: '',
    fontWeight: 400,
    paddingLeft: '',
    paddingRight: '',
    paddingTop: '',
    paddingBottom: '',
    ...style
  }
  const defaultOptions = {
    ...options
  }
  return common(title, defaultStyles, defaultOptions)
}
