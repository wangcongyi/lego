<template>
  <div class="item" @click.stop="$emit('jump')">
    <img v-if="showIcon && icon" class="img" :src="icon" :style="{
      width: size,
      left: left
    }" />
    <span :style="{
      fontSize: fontSizeParse,
      fontWeight: active && activeBold ? 'bold' : 400
    }">{{ title }}</span>
  </div>
</template>

<script>
import config from './StickyNavItem.js'
import { px2vw } from '@/utils'
export default {
  name: 'StickyNavItem',
  props: config,
  computed: {
    fontSizeParse () {
      return px2vw(this.fontSize)
    },
    size () {
      return px2vw(this.iconSize)
    },
    left () {
      return `-${px2vw(this.iconSize + 2)}`
    },
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin: 0 5px 0 22px;
  position: relative;
  display: inline-block;
  font-size: 16px;
  white-space: nowrap;
  text-align: center;
  overflow: visible;
  cursor: pointer;
  user-select: none;

  .img {
    position: absolute;
    top: 50%;
    left: -12px;
    transform: translateY(-50%);
    width: 10px;
    height: auto;
  }
}
</style>