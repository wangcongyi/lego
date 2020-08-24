export default {
  shopPic: {
    title: '店铺封面',
    type: String,
    default: '',
    hiddenInEdit: true
  },
  name: {
    title: '店铺名',
    type: String,
    default: '',
    hiddenInEdit: true
  },
  jumpLink: {
    title: '店铺链接',
    type: String,
    default: '',
    hiddenInEdit: true
  },
  benefit: {
    title: '店铺利益点',
    type: String,
    default: '',
    hiddenInEdit: true
  },
  benefitFontSize: {
    title: '利益点字体大小',
    type: [String, Number],
    default: '12',
    inputNumber: { min: 0 },
    hiddenInEdit: true
  },
  benefitColor: {
    title: '利益点颜色',
    type: String,
    default: '#202020',
    hiddenInEdit: true
  },
  shopId: {
    title: '店铺ID',
    type: [String, Number],
    default: null,
    hiddenInEdit: true
  }
}
