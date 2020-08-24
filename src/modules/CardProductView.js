import CardViewCoommon from './CardViewCoommon'

export default Object.assign({}, CardViewCoommon, {
  corner: {
    title: '商品Logo',
    type: String,
    default: '',
    // 'http://wiki.weilaijishi.cn/uploads/images/gallery/2019-09/image-1568703921653.png'
  },
  tips: {
    title: '商品营销标',
    type: String,
    default: '',
  },
  tipsSize: {
    title: '营销标大小',
    type: Number,
    default: 25,
    inputNumber: { min: 0 },
  },
  tipsColor: {
    title: '营销标背景色',
    type: String,
    default: '#00abff',
  },
})
