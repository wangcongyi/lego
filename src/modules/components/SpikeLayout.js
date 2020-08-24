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
    default: _ => [],
  },
  dynamicCurrentTime: {
    type: [Number, String],
    hiddenInEdit: true,
    default: '',
  },
  productConfig: {
    title: '商品模块配置',
    type: Object,
    hiddenInEdit: true,
    default: _ => ({}),
  },
  bgColor: {
    title: '背景色',
    type: String,
    default: 'transparent',
  },
  moduleBgColor: {
    title: '模块背景色',
    type: String,
    default: '#ff2c73',
  },
  hasBeenText: {
    title: '"已抢完"',
    type: String,
    default: '已抢完',
  },
  beingText: {
    title: '"正在疯抢"',
    type: String,
    default: '正在疯抢',
  },
  beGoingToText: {
    title: '"即将开场"',
    type: String,
    default: '即将开场',
  },
  nextDayNoticText: {
    title: '"明日预告"',
    type: String,
    default: '明日预告',
  },
  color: {
    title: '文案颜色',
    type: String,
    default: 'rgba(255, 255, 255, 0.5)',
  },
  activeColor: {
    title: '文案选中颜色',
    type: String,
    default: 'rgba(255, 255, 255)',
  },
  paddingBottom: {
    title: '下边距',
    type: [String, Number],
    default: 0,
    inputNumber: { min: 0 },
  },
  paddingTop: {
    title: '上边距',
    type: [String, Number],
    default: 0,
    inputNumber: { min: 0 },
  },
  isSpike: {
    title: '秒杀',
    type: Boolean,
    default: false,
    checkBox: true,
    hiddenInEdit: true,
  },
  isFight: {
    title: '拼团',
    type: Boolean,
    default: false,
    checkBox: true,
    hiddenInEdit: true,
  },
}
