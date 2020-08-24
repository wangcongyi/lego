import GenSuperImage from './super/Image'

export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
    default: null,
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
  subtitleColor: {
    title: '利益点颜色',
    type: String,
    default: '#8c8c8c',
    hiddenInEdit: true,
  },
  userInfo: {
    title: '用户信息',
    type: Object,
    default: () => ({}),
    hiddenInEdit: true,
  },
  styleOptions: GenSuperImage(
    '高级配置',
    {
      paddingLeft: 10,
      paddingRight: 10,
      background: '#3a3a3a',
      moduleBackground: 'rgba(255, 255, 255, 0.2)',
      buttonBackground: '#ffc11c',
    },
    {
      onlySuper: true,
    },
  ),
}
