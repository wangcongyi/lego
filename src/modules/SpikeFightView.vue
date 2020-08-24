<template>
  <SpikeLayout v-bind="props" />
</template>

<script>
import SpikeLayout from '@/modules/components/SpikeLayout.vue'
import config from './SpikeFightView.js'
export default {
  name: 'SpikeFight',
  module: '拼团',
  poster: 'http://lego-activity-dev.weilaijishi.com/resource/f7f1b550-1d7a-11ea-a8ce-95bb1fbf35c8.jpg',
  components: {
    SpikeLayout
  },
  props: config,
  computed: {
    props () {
      const props = {}
      Object.keys(config).forEach(key => {
        props[key] = this[key]
      })
      return props
    }
  }
}
</script>