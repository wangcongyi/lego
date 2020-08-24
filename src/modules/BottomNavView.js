export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
    default: null,
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: '#fff',
  },
  color: {
    title: '文字颜色',
    type: String,
    default: '#000',
  },
  selectColor: {
    title: '选中文字颜色',
    type: String,
    default: '#000',
  },
  childList: {
    hiddenInEdit: true,
    type: Array,
    default() {
      return []
    },
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
}