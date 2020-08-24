import { isContains } from '@/utils'

const externals = ['recommendId', 'dynamicChildList', 'childlist']
// 禁用依赖recommendId相关编辑
export const packDisabledRecommend = config => {
  Object.keys(config).forEach(key => {
    if (!isContains(externals, key)) {
      config[key].disableCondition = [
        { path: 'editModel.recommendId', value: true }
      ]
    }
  })
  return config
}

// 处理配置项
export const handleModelProps = (config, resource) => {
  Object.keys(resource).forEach(key => {
    if (typeof config[key] === 'object' && 'value' in config[key]) {
      config[key].value = resource[key]
    } else {
      config[key] = resource[key]
    }
  })
  return config
}
