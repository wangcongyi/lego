export default {
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
    title: '头图',
    type: String,
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  corner: {
    title: 'Logo',
    type: String,
    default:
      'http://wiki.weilaijishi.cn/uploads/images/gallery/2019-09/image-1568794026837.png',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  title: {
    title: '标题',
    type: String,
    default: '我是标题',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  subtitle: {
    title: '副标题',
    type: String,
    default: '我是副标题',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  btnText: {
    title: '按钮文案',
    type: String,
    default: '立即加购',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  btnColor: {
    title: '按钮背景色',
    type: String,
    default: '#4e4e4e',
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
    default: 'http://iph.href.lu/355x170',
    disableCondition: [{ path: 'editModel.recommendId', value: true }]
  },
  // videoId: {
  //   title: '视频Id',
  //   type: String,
  //   default: ''
  // }
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
