export default {
  highCommission: {
    title: '高佣商品',
    type: Boolean,
    default: false,
    checkBox: true
  },
  userInfo: {
    title: '用户信息',
    type: Object,
    default: () => ({}),
    hiddenInEdit: true
  },
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String]
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: '#c0c0c0',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  avatar: {
    title: '商品图',
    type: String,
    default:
      'http://wiki.weilaijishi.cn/uploads/images/gallery/2019-09/image-1568704343559.png',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  title: {
    title: '标题',
    type: String,
    default: '我是商品标题我是商品我是商品标题我是商品',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  subtitle: {
    title: '副标题',
    type: String,
    default: '这里最多八个字符',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  discountIcon: {
    title: '优惠信息标',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  originPrice: {
    title: '原价',
    type: String,
    default: '6889.8',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  salePricePrefix: {
    title: '销售价前缀',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  salePrice: {
    title: '大促价',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  price: {
    title: '价格',
    type: String,
    default: '5888.8',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  commission: {
    title: '佣金',
    type: [Number, String],
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  btnText: {
    title: '按钮文案',
    type: String,
    default: '加入集市袋',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  btnColor: {
    title: '按钮背景色',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  // https://resource-dev.homay.com/024cf730-8b4a-11e9-9576-2731cfcd68b9
  productUrl: {
    title: '商品链接',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  videoUrl: {
    title: '视频链接',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  videoCover: {
    title: '视频封面',
    type: String,
    default: 'http://iph.href.lu/150x200',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
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
    default: 0,
    inputNumber: { min: 0 }
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    }
  }
}
