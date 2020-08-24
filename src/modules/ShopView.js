export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
    default: null
  },
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    }
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    }
  },
  isCard: {
    title: '卡片风格',
    hiddenInEdit: true,
    checkBox: true,
    type: Boolean,
    default: false
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: ''
  },
  benefitFontSize: {
    title: '利益点字体大小',
    type: [String, Number],
    default: '12',
    inputNumber: { min: 0 }
  },
  benefitColor: {
    title: '利益点颜色',
    type: String,
    default: '#ff3d2f'
  },
  paddingBottom: {
    title: '下边距',
    type: [String, Number],
    default: 10,
    inputNumber: { min: 0 }
  },
  paddingTop: {
    title: '上边距',
    type: [String, Number],
    default: 10,
    inputNumber: { min: 0 }
  }
}
