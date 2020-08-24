export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
    default: null,
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
  userInfo: {
    title: '用户信息',
    type: Object,
    default: () => ({}),
    hiddenInEdit: true,
  },
  isSpike: {
    title: '秒杀模块',
    hiddenInEdit: true,
    checkBox: true,
    type: Boolean,
    default: false,
  },
  isFight: {
    title: '拼团模块',
    hiddenInEdit: true,
    checkBox: true,
    type: Boolean,
    default: false,
  },
  isCard: {
    title: '卡片风格',
    hiddenInEdit: true,
    checkBox: true,
    type: Boolean,
    default: false,
  },
  count: {
    title: '坑位数',
    type: [Number, String],
    default: 100,
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: '#c0c0c0',
  },
  prefixIcon: {
    title: '标题活动标',
    type: String,
    default:
      '//lego-activity-dev.weilaijishi.com/resource/935053d0-ec98-11e9-b458-e19b461cfb72',
  },
  prefixIconSize: {
    title: '标题活动标大小',
    type: Number,
    default: 14,
    inputNumber: { min: 0 },
  },
  discountIcon: {
    title: '优惠信息标',
    type: String,
    default:
      '//lego-activity-dev.weilaijishi.com/resource/213b3d80-ec9a-11e9-b458-e19b461cfb72',
    hiddenInEdit: true,
  },
  channelCode: {
    title: '商品来源',
    type: String,
    hiddenInEdit: true,
    defaults:"0"
  },
  switchTitleSubtitle: {
    title: '标题利益点互换',
    type: Boolean,
    checkBox: true,
    hiddenInEdit: true,
    default: false,
  },
  subtitleFontSize: {
    title: '利益点字号',
    type: Number,
    default: 14,
    inputNumber: { min: 0 },
  },
  subtitleColor: {
    title: '利益点颜色',
    type: String,
    default: '#8c8c8c',
  },
  titleLayout: {
    title: '标题布局',
    default: 1,
    options: [
      {
        title: '单行',
        value: 1,
      },
      {
        title: '两行',
        value: 2,
      },
    ],
  },
  titleFontSize: {
    title: '标题字号',
    type: Number,
    default: 14,
    inputNumber: { min: 0 },
  },
  titleColor: {
    title: '标题颜色',
    type: String,
    default: '#000',
  },
  btnColor: {
    title: '按钮颜色',
    type: String,
    default: '#ff354d',
  },
  btnText: {
    title: '按钮文案',
    type: String,
    default: '立即购买',
  },
  priceLayout: {
    title: '价格布局',
    default: 1,
    options: [
      {
        title: '单行',
        value: 1,
      },
      {
        title: '并行',
        value: 2,
      },
    ],
  },
  salePricePrefix: {
    title: '销售价前缀',
    type: String,
    default:
      '//lego-activity-dev.weilaijishi.com/resource/33f6ec20-eb42-11e9-ba9f-c1f157fd4210',
  },
  imgUrl: {
    title: '头图',
    type: String,
    default: 'http://iph.href.lu/375x200?text=商品组件',
  },
  corner: {
    title: 'Logo',
    type: String,
    default: '',
    // 'http://wiki.weilaijishi.cn/uploads/images/gallery/2019-09/image-1568703921653.png'
  },
  tips: {
    title: '营销标',
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
  // activityName: {
  //   title: '加入购物车埋点',
  //   type: String,
  //   default: 'x元x件'
  // },
  // addCart: {
  //   title: '点击加入购物车',
  //   type: Boolean,
  //   checkBox: true,
  //   default: false
  // },
  highCommission: {
    title: '高佣商品',
    type: Boolean,
    checkBox: true,
    default: false,
  },
  styleType: {
    title: '样式',
    type: String,
    default: '1',
    options: [
      {
        title: '一排一',
        value: '1',
      },
      {
        title: '一排二',
        value: '2',
      },
      {
        title: '一排三',
        value: '3',
      },
      {
        title: '一排三滑动',
        value: '4',
      },
    ],
  },
  // brandType: {
  //   title: '品牌',
  //   default: 2,
  //   options: [
  //     {
  //       title: '自营',
  //       value: 1
  //     },
  //     {
  //       title: '联营',
  //       value: 2
  //     }
  //   ]
  // },
  paddingBottom: {
    title: '下边距',
    type: [String, Number],
    default: 10,
    inputNumber: { min: 0 },
  },
  paddingTop: {
    title: '上边距',
    type: [String, Number],
    default: 10,
    inputNumber: { min: 0 },
  },
}
