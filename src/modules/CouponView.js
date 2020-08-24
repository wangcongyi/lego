const setting = [
  { key: 'color', title: '字体颜色' },
  { key: 'background', title: '背景颜色/图' },
  { key: 'btnColor', title: '按钮字体颜色' },
  { key: 'btnBgColor', title: '按钮背景颜色' },
]

const linearBg =
  'linear-gradient(315deg,rgba(255,50,143,1) 0%,rgba(255,136,69,1) 100%)'
const linearImg =
  'https://lego-activity.weilaijishi.cn/resource/365d70a0-0f38-11ea-94c7-3d11cc378a78.png'

export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
    default: null,
  },
  count: {
    title: '坑位数',
    type: [Number, String],
    default: 100,
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: '',
  },
  type: {
    title: '卡券风格',
    tyoe: String,
    default: '1',
    options: [
      { title: '普通', value: '1' },
      { title: '商品', value: '2' },
      { title: '店铺', value: '3' },
    ],
  },
  couponType: {
    title: '卡券类型',
    tyoe: String,
    default: '1',
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    options: [
      { title: '满减券', value: '1' },
      { title: '立减券', value: '2' },
      { title: '折扣券', value: '3' },
      { title: '随机券', value: '4' },
    ],
  },
  couponUseRemarkType: {
    title: '卡券说明',
    tyoe: String,
    default: '1',
    options: [
      { title: '卡券类型标签', value: '1' },
      { title: '使用说明', value: '2' },
    ],
  },
  layout: {
    title: '布局',
    type: String,
    default: '1',
    options: [
      { title: '一排一', value: '1' },
      { title: '一排二', value: '2' },
      { title: '一排三', value: '3' },
    ],
  },
  priceColor: {
    title: '价格颜色',
    type: String,
    default: '',
  },
  limitColor: {
    title: '使用门槛颜色',
    type: String,
    default: '',
  },
  areaColor: {
    title: '使用说明颜色',
    type: String,
    default: '',
  },
  couponTypeColor: {
    title: '标签颜色',
    type: String,
    default: '#f8d7a9',
  },
  couponTypeBgColor: {
    title: '标签背景色',
    type: String,
    default: '#ad6c2f',
  },
  defaultStyle: {
    title: '默认样式',
    type: Object,
    collapse: [
      {
        title: '未开始',
        key: 'pending',
        children: setting,
      },
      {
        title: '可领取',
        key: 'valid',
        children: setting,
      },
      {
        title: '已领取',
        key: 'owned',
        children: setting,
      },
      {
        title: '已抢光',
        key: 'blank',
        children: setting,
      },
    ],
    default: () => ({
      // 未开始
      pending: {
        color: '#ad6c2f',
        background: linearImg,
        btnColor: '#fff',
        btnBgColor:
          'linear-gradient(90deg,rgba(255,0,131,1) 0%,rgba(255,0,53,1) 100%)',
      },
      // 可领取
      valid: {
        color: '#ad6c2f',
        background: linearImg,
        btnColor: '#fff',
        btnBgColor:
          'linear-gradient(90deg,rgba(255,0,131,1) 0%,rgba(255,0,53,1) 100%)',
      },
      // 已领取
      owned: {
        color: '#ad6c2f',
        background: linearImg,
        btnColor: '#ad6c2f',
        btnBgColor: 'rgba(255, 255, 255, 0.1)',
      },
      // 已抢光
      blank: {
        color: '#ad6c2f',
        background: linearImg,
        btnColor: '#fff',
        btnBgColor: 'rgba(0,0,0,0.5)',
      },
    }),
  },
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
  childList: {
    type: Array,
    hiddenInEdit: true,
    default: () => [],
  },
  dynamicChildList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
}
