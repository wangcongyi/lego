export default {
  brandPic: {
    title: '品牌封面',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  brandLogo: {
    title: '品牌Logo',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  name: {
    title: '品牌名',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  jumpLink: {
    title: '品牌链接',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  benefit: {
    title: '品牌利益点',
    type: String,
    default: '',
    hiddenInEdit: true,
  },
  benefitFontSize: {
    title: '利益点字体大小',
    type: [String, Number],
    default: '12',
    inputNumber: { min: 0 },
    hiddenInEdit: true,
  },
  benefitColor: {
    title: '利益点颜色',
    type: String,
    default: '#202020',
    hiddenInEdit: true,
  },
  shopId: {
    title: '品牌ID',
    type: [String, Number],
    default: null,
    hiddenInEdit: true,
  },
}
