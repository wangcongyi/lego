import GenSuperText from './super/Text'
import GenSuperImage from './super/Image'

export default {
  recommendId: {
    title: '资源位Id',
    disableInEdit: true,
    hiddenInNull: true,
    type: [Number, String],
  },
  effectiveDate: {
    title: '展示时间段',
    disableInEdit: true,
    hiddenInNull: true,
    type: String,
  },
  url: {
    title: '图片地址',
    type: String,
    default:
      'http://iph.href.lu/375x300?text=%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6',
  },
  styleOptions: GenSuperImage(
    '高级配置',
    {
      height: -2,
    },
    {
      onlySuper: true,
    },
  ),
  barrageSwitch: {
    title: '开启消息',
    type: Boolean,
    default: true,
    checkBox: true,
    hiddenInEdit: true,
  },
  barrages: {
    title: '消息',
    type: Array,
    default: _ => [],
    tagLink: true,
  },
  barrageType: {
    title: '消息风格',
    type: Number,
    default: 1,
    options: [
      {
        title: '气泡',
        value: 1,
      },
      {
        title: '弹幕',
        value: 2,
      },
    ],
  },
  barrageStyle: GenSuperText(
    '消息样式',
    {
      fontSize: 12,
      color: '#faeafb',
      lineHeight: 24,
      paddingLeft: 12,
      paddingRight: 12,
      background: 'rgba(130, 75, 255, 0.5)',
      borderRadius: 10,
      bottom: 14,
    },
    {
      onlySuper: true,
    },
  ),
  link: {
    title: '跳转链接',
    type: String,
    default: '',
    disableInEdit: true,
    hiddenInNull: true,
  },
  items: {
    type: Array,
    hiddenInEdit: true,
    default: _ => [],
  },
  // 等分切割数
  fencesCount: {
    title: '区域等分',
    inputNumber: { min: 0, max: 100 },
    type: Number,
    default: 0,
  },
  fencesOptions: GenSuperImage(
    '区域样式',
    {
      paddingLeft: 0,
      paddingRight: 0,
      height: -3,
    },
    {
      onlySuper: true,
    },
  ),
  // 等分区域
  fences: {
    type: Array,
    hiddenInEdit: true,
    default: _ => [
      // { imageSource: 'http://lego-activity-dev.weilaijishi.com/resource/9da04ea0-27c9-11ea-8ed4-05d15c0a16f2.png' },
      // { imageSource: 'http://lego-activity-dev.weilaijishi.com/resource/154de080-27c4-11ea-865b-2512687449fc.jpg' },
      // { imageSource: 'http://lego-activity-dev.weilaijishi.com/resource/8bc223c0-2247-11ea-abce-8986c379d798.jpg' },
      // { imageSource: 'http://lego-activity-dev.weilaijishi.com/resource/5fe771c0-2246-11ea-abce-8986c379d798.png' },
      // { imageSource: 'http://lego-activity-dev.weilaijishi.com/resource/66eed840-0064-11ea-b1d6-d7176f1abd8d.jpg' },
    ],
  },
}
