import SpikeLayout from './components/SpikeLayout.js'
export default Object.assign(SpikeLayout, {
  productConfig: {
    type: Object,
    default: _ => ({
      isSpike: true
    }),
    hiddenInEdit: true
  }
})

