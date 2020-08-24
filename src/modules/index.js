import cloneDeep from 'lodash/cloneDeep'
import upperFirst from 'lodash/upperFirst'
import lowerFirst from 'lodash/lowerFirst'
import camelCase from 'lodash/camelCase'
import { guid } from '@/utils'

export const modules = {}
const initComponent = (requireComponent, fixedList) => {
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(
      camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
    )
    const moduleContext = componentConfig.default || componentConfig
    const moduleProps = moduleContext.props
    const moduleName = moduleContext.module
    const modulePoster = moduleContext.poster
    if (moduleName) {
      modules[lowerFirst(componentName.replace(/View/, ''))] = {
        name: moduleName,
        id: componentName,
        poster: modulePoster,
        show: true,
        model: _getProps(moduleProps) || {},
        config: moduleProps || {},
        fixed: fixedList.some(name => name === componentName),
      }
    }
  })
}

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
const requireComponent = isProd
  ? require.context('@/modules', true, /^((?!Acps).)*\.vue$/)
  : require.context('@/modules', true, /\.vue$/)
const fixedList = ['FloatingNavView', 'BottomNavView']
initComponent(requireComponent, fixedList)

function _getProps(config) {
  const props = {}
  for (const key in config) {
    const c = typeof config[key] === 'function' ? config[key]() : config[key]
    const d = c.default
    props[key] = typeof d === 'function' ? d() : d
  }
  return props
}

export const getModule = str => {
  let tpl
  const map = modules
  if (str in map) {
    tpl = cloneDeep(map[str])
    tpl.mid = guid()
  }
  return tpl
}
