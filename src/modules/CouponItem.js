const setting = [
  { key: 'color', title: '字体颜色' },
  { key: 'background', title: '背景颜色/图' },
  { key: 'btnColor', title: '按钮字体颜色' },
  { key: 'btnBgColor', title: '按钮背景颜色' },
]

export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
  },
  couponName: {
    title: '卡券名称',
    hiddenInEdit: true,
    type: String,
  },
  detailUrl: {
    title: '卡券详情链接',
    hiddenInEdit: true,
    type: String,
  },
  status: {
    title: '卡券状态',
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    default: 'valid',
    options: [
      { title: '未开始', value: 'pending' },
      { title: '可领取', value: 'valid' },
      { title: '已领取', value: 'owned' },
      { title: '已抢光', value: 'blank' },
    ],
  },
  selfStyle: {
    title: '卡券样式',
    type: Object,
    collapse: [
      { title: '未开始', key: 'pending', children: setting },
      { title: '可领取', key: 'valid', children: setting },
      { title: '已领取', key: 'owned', children: setting },
      { title: '已抢光', key: 'blank', children: setting },
    ],
    default: () => ({
      pending: {
        color: '',
        background: '',
        btnColor: '',
        btnBgColor: '',
      },
      valid: {
        color: '',
        background: '',
        btnColor: '',
        btnBgColor: '',
      },
      owned: {
        color: '',
        background: '',
        btnColor: '',
        btnBgColor: '',
      },
      blank: {
        color: '',
        background: '',
        btnColor: '',
        btnBgColor: '',
      },
    }),
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
    default: '',
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    options: [
      { title: '卡券类型标签', value: '1' },
      { title: '使用说明', value: '2' },
    ],
  },
  couponValue: {
    title: '优惠券面值',
    type: String,
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    default: '',
  },
  limit: {
    title: '使用门槛',
    type: String,
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    default: '',
  },
  area: {
    title: '使用范围',
    type: String,
    disableCondition: [{ path: 'editModel.recommendId', value: true }],
    default: '',
  },
  shopImg: {
    title: '商品/店铺图片',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
    ],
  },
  shopLogo: {
    title: '店铺Logo',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
    ],
  },
  shopName: {
    title: '店铺名称',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
    ],
  },
  couponId: {
    title: '卡券id',
    type: [Number, String],
  },
  jumpLink: {
    title: '普通链接',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
      { path: 'parentNode.data.model.type', value: '2' },
    ],
  },
  productUrl: {
    title: '商品链接',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
      { path: 'parentNode.data.model.type', value: '3' },
    ],
  },
  shopId: {
    title: '店铺ID',
    type: String,
    default: '',
    disableCondition: [
      { path: 'editModel.recommendId', value: true },
      { path: 'parentNode.data.model.type', value: '1' },
      { path: 'parentNode.data.model.type', value: '2' },
    ],
  },
}
