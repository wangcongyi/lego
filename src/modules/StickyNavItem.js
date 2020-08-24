export default {
  showIcon: {
    title: '是否显示图标',
    type: Boolean,
    default: false,
    hiddenInEdit: true
  },
  activeBold: {
    title: '选中字体加粗',
    type: Boolean,
    checkBox: true,
    default: true,
    hiddenInEdit: true
  },
  active: {
    title: '选中状态',
    type: Boolean,
    checkBox: true,
    default: true,
    hiddenInEdit: true
  },
  title: {
    title: '标题',
    type: String,
    default: ''
  },
  fontSize: {
    title: '文案字号',
    type: Number,
    default: 16,
    inputNumber: { min: 0 },
    hiddenInEdit: true
  },
  iconSize: {
    title: '图标大小',
    type: Number,
    default: null,
    inputNumber: { min: 0 },
    hiddenInEdit: true
  },
  icon: {
    title: 'icon图标',
    type: String,
    default: ''
  },
  anchor: {
    title: '锚点标识',
    type: String,
    default: ''
  }
}
