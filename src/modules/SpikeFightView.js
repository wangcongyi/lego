import SpikeLayout from './components/SpikeLayout.js'
export default Object.assign({}, SpikeLayout, {
  hasBeenText: {
    title: '"拼团结束"',
    type: String,
    default: '正在拼团'
  },
  beingText: {
    title: '"正在拼团"',
    type: String,
    default: '正在拼团'
  },
  beGoingToText: {
    title: '"即将开始"',
    type: String,
    default: '即将开始'
  },
  nextDayNoticText: {
    title: '"明日预告"',
    type: String,
    default: '明日预告'
  },
  productConfig: {
    type: Object,
    default: _ => ({
      btnText: '',
      isFight: true
    }),
    hiddenInEdit: true
  },
  isFight: {
    type: Boolean,
    default: true,
    hiddenInEdit: true
  }
})
