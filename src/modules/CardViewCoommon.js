import GenSuperText from './super/Text'
import GenSuperImage from './super/Image'

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
  bg: GenSuperImage('背景', {}, {
    isBg: true,
  }),
  moduleBg: GenSuperImage('卡片背景', {}, {
    isBg: true,
  }),
  headerBg: GenSuperImage('头图', {
    height: 80,
  }),
  headerBgLink: {
    title: '头图链接',
    type: Object,
    linkTool: true,
    default: _ => ({}),
  },
  title: GenSuperText('标题', {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 25,
    color: '#fff',
  }),
  benefit: GenSuperText('利益点', {
    fontSize: 12,
    fontWeight: 500,
    color: '#000',
  }),
}