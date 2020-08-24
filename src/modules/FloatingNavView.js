export default {
  bgColor: {
    title: '会场背景色',
    type: String,
    default: '#fff',
  },
  arrowIconColor: {
    title: '会场箭头Icon颜色',
    type: String,
    default: '#fff',
  },
  outBgColor: {
    title: '导航背景色',
    type: String,
    default: '#dadada',
  },
  bgImg: {
    title: '导航按钮图标',
    type: String,
    default: 'http://iph.href.lu/300x300?text=会场导航',
  },
  arrowDownIconColor: {
    title: '收起箭头图标颜色',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  color: {
    title: '文字颜色',
    type: String,
    default: '#000',
  },
  defaultLogo: {
    title: '默认会场logo',
    type: String,
    default: 'http://iph.href.lu/200x200?text=logo',
  },
  bottomBgColor: {
    title: '底部按钮背景',
    type: String,
    default: '#fff',
  },
  bottomText: {
    title: '底部按钮文案',
    type: String,
    default: '返回主会场',
  },
  bottomTextColor: {
    title: '底部按钮文案颜色',
    type: String,
    default: '#fff',
  },
  bottomTarget: {
    title: '底部按钮链接',
    type: String,
    default: '',
  },
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
}
