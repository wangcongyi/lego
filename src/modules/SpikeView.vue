<template>
  <SpikeLayout v-bind="props" />
</template>

<script>
import SpikeLayout from '@/modules/components/SpikeLayout.vue'
import config from './SpikeView.js'
export default {
  name: 'Spike',
  module: '秒杀',
  poster: 'https://lego-activity-dev.weilaijishi.com/resource/1c0af590-170f-11ea-ae56-b5039842b49f.png',
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