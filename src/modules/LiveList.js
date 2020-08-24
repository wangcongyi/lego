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
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
  userInfo: {
    title: '用户信息',
    type: Object,
    default: () => ({}),
    hiddenInEdit: true,
  },
  imgUrl: {
    title: '头图',
    type: String,
    default: 'http://iph.href.lu/375x200?text=直播组件',
  },

  bgColor: {
    title: '背景色',
    type: String,
    default: '#eee',
  },
  subBgColor: {
    title: '直播组件背景色',
    type: String,
    default: '#c0c0c0',
  },
  subBtnTextColor: {
    title: '按钮背景色',
    type: String,
    default: '#ffc11c',
  },
  subtitleColor: {
    title: '利益点颜色',
    type: String,
    default: '#8c8c8c',
  },
  itemBottom: {
    title: '模块间距',
    type: [String, Number],
    default: 10,
    inputNumber: { min: 0 },
  },

  paddingBottom: {
    title: '下边距',
    type: [String, Number],
    default: 0,
    inputNumber: { min: 0 },
  },
  paddingTop: {
    title: '上边距',
    type: [String, Number],
    default: 0,
    inputNumber: { min: 0 },
  },
}
