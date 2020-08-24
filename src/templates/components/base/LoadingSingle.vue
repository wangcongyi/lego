<template>
  <div class="loading" v-if="show">
    <div
      :class="`loading__spinner loading__spinner--${type}`"
      :style="`color: ${color};width: ${sizeParse}; height: ${sizeParse}`"
    >
      <template v-if="type === 'spinner'">
        <div v-for="(item, index) in itemArr" :key="index" class="loading__dot" />
      </template>
    </div>
  </div>
</template>

<script>
import { px2vw } from '@/utils'
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    size: {
      type: [String, Number],
      default: '8vw'
    },
    type: {
      type: String,
      default: 'circular' // spinner, circular
    },
    color: {
      type: String,
      default: '#c9c9c9'
    }
  },
  computed: {
    sizeParse () {
      return px2vw(this.size)
    }
  },
  data: () => ({
    itemArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  })
}
</script>

<style lang="scss" scoped>
.loading {
  display: inline-block;
  z-index: 0;
  font-size: 0;
  line-height: 0;
  position: relative;
  text-align: center;
}

.loading__spinner {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  -webkit-animation: rotate 0.8s linear infinite;
  animation: rotate 0.8s linear infinite;
}

.loading__spinner--spinner {
  -webkit-animation-timing-function: steps(12);
  animation-timing-function: steps(12);
}

.loading__spinner--circular {
  border: 1px solid;
  border-radius: 100%;
  border-color: currentColor;
  border-top-color: transparent;
}

.loading__dot {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.loading__dot::before {
  width: 2px;
  height: 25%;
  content: ' ';
  display: block;
  margin: 0 auto;
  border-radius: 40%;
  background-color: currentColor;
}

.loading__dot:nth-of-type(1) {
  opacity: 1;
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}

.loading__dot:nth-of-type(2) {
  opacity: 0.9375;
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}

.loading__dot:nth-of-type(3) {
  opacity: 0.875;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.loading__dot:nth-of-type(4) {
  opacity: 0.8125;
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
}

.loading__dot:nth-of-type(5) {
  opacity: 0.75;
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
}

.loading__dot:nth-of-type(6) {
  opacity: 0.6875;
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.loading__dot:nth-of-type(7) {
  opacity: 0.625;
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
}

.loading__dot:nth-of-type(8) {
  opacity: 0.5625;
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
}

.loading__dot:nth-of-type(9) {
  opacity: 0.5;
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
}

.loading__dot:nth-of-type(10) {
  opacity: 0.4375;
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
}

.loading__dot:nth-of-type(11) {
  opacity: 0.375;
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
}

.loading__dot:nth-of-type(12) {
  opacity: 0.3125;
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
