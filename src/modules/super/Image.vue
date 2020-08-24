<template>
  <div :style="style" class="m-image">
    <img v-if="hasImage" :src="options.value" alt :class="['m-image__bg-img', {'f-abs': isBg}]" />
    <div v-else :style="bgStyle" class="m-image__bg" />
    <slot />
  </div>
</template>

<script>
import { px2vw } from '@/utils'
export default {
  props: {
    options: {
      type: Object,
      default: _ => ({})
    }
  },
  computed: {
    isBg () {
      return this.options.isBg
    },
    // http https //
    hasImage () {
      const value = this.options.value
      return /[h\/]/.test(value)
    },
    // liner-gradient url
    isCustomBg () {
      const value = this.options.value
      return /[lu]/.test(value)
    },
    bgStyle () {
      const style = this.options.style
      const value = this.options.value
      return {
        background: this.isCustomBg ? value : this.hasImage ? '' : style.background,
      }
    },
    bgHeight () {
      const { imageAutoHeight } = this.options
      if (this.hasImage && imageAutoHeight) {
        return {
          height: ''
        }
      }
      return {}
    },
    style () {
      const { style } = this.options
      if (!this.hasImage && !this.isCustomBg) {
        this.options.value = style.background
      }
      let output = {}
      for (const key in style) {
        output[key] = typeof style[key] === 'number' ? px2vw(style[key]) : style[key]
      }
      return {
        ...output,
        ...this.bgHeight,
        background: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-image {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
}
.m-image__bg-img {
  width: 100%;
}
.m-image__bg {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>