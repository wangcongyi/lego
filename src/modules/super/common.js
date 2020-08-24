/**
 * 超级配置
 * @param {String} title 编辑参数显示标题
 * @param {Object} style 样式
 * @param {Object} options 配置项
 * @return {Object} Props配置
 */
export default (title = '', style = {}, options = {}) => {
  const defaultStyles = {
    ...style
  }
  const defaultOptions = {
    onlySuper: false,
    ...options
  }
  const config = {
    title,
    super: true,
    ...defaultOptions,
    type: Object,
    default: _ => ({
      value: '',
      ...defaultOptions,
      style: {
        ...defaultStyles
      }
    })
  }
  return config
}
