export default {
  icon: {
    title: 'icon图标',
    type: String,
    default: ''
  },
  iconSize: {
    title: 'icon图标大小',
    type: Number,
    default: 10,
    inputNumber: { min: 0 }
  },
  fontSize: {
    title: '文案字号',
    type: Number,
    default: 16,
    inputNumber: { min: 0 }
  },
  color: {
    title: '文案颜色',
    type: String,
    default: '#000'
  },
  activeColor: {
    title: '选中颜色',
    type: String,
    default: '#CD362D'
  },
  activeBold: {
    title: '选中字体加粗',
    type: Boolean,
    checkBox: true,
    default: true
  },
  backgroundColor: {
    title: '导航条背景色',
    type: String,
    default: '#fff'
  },
  outColor: {
    title: '轮廓背景',
    type: String,
    default: ''
  },
  marginV: {
    title: '垂直向边距',
    type: Number,
    inputNumber: { min: 0 },
    default: 32
  },
  marginH: {
    title: '水平向边距',
    type: Number,
    inputNumber: { min: 0 },
    default: 10
  },
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    }
  }
}
