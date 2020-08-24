import GenSuperText from './super/Text'
import GenSuperImage from './super/Image'

export default {
  bg: GenSuperImage('背景', {
    height: 50,
  }),
  title: GenSuperText('标题', {
    fontSize: 16,
  }),
  prefixIcon: GenSuperImage('左图标', {
    width: 36,
  }),
  suffixIcon: GenSuperImage('右图标', {
    width: 36,
  }),
}
