<template>
  <span :style="style">{{ options.value }}</span>
</template>

<script>
import { px2vw, isContains } from '@/utils'
import { genStyle } from './util'
export default {
  props: {
    options: {
      type: Object,
      default: _ => ({})
    }
  },
  computed: {
    style () {
      return genStyle(this.options)
    }
  }
}
</script>