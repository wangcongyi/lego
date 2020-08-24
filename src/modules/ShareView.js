export default {
  url: {
    title: '图片地址',
    type: String,
    default: ''
  },
  isFixed: {
    title: '跟随滚动',
    type: Boolean,
    default: false,
    checkBox: true
  },
  top: {
    title: '距离顶部距离',
    type: Number,
    default: 15,
    inputNumber: { min: 0 }
  },
  size: {
    title: '图片大小',
    type: Number,
    default: 58,
    inputNumber: { min: 0 }
  },
  shareTitle: {
    title: '分享标题',
    type: String,
    default: ''
  },
  shareDesc: {
    title: '分享描述',
    type: String,
    default: ''
  },
  shareContent: {
    title: '分享内容',
    type: String,
    default: ''
  },
  shareImage: {
    title: '分享图片',
    type: String,
    default: ''
  },
  shareUrlRoutes: {
    title: '分享路由',
    type: String,
    hiddenInEdit: true,
    default: ''
  }
}
