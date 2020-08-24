<template>
  <div class="m-bubble">
    <span
      v-for="item in slideList"
      :key="item.id"
      :class="genItemClass(item)"
      :style="item.style"
    >{{ item.title }}</span>
  </div>
</template>

<script>
import { listenerHidden } from '@/utils'
import uuidv1 from 'uuid/v1'
export default {
  props: {
    list: {
      type: Array,
      default: _ => ([])
    }
  },
  data () {
    return {
      slideDuration: 3000,
      fadeOutDuration: 500,
      fadeInDuration: 500,
      slideList: [],
      interval: null,
      timeOutList: []
    }
  },
  // 替代上层数组变化重新进行init的操作
  watch: {
    list () {
      this.clearBubble()
      this.initBubble()
    }
  },
  mounted () {
    this._initModule()
  },
  methods: {
    _initModule () {
      this.initBubble()
      listenerHidden((isHide) => {
        if (isHide) {
          this.clearBubble()
        } else {
          this.initBubble()
        }
      })
    },
    genItemClass (item) {
      return [
        'bubble',
        { 'fade-in': item.fadeIn },
        { 'fade-out': item.fadeOut },
        { 'slide': item.fadeIn },
        { 'pause': item.pause }
      ]
    },
    setTimeout (fnc, delay) {
      const timmer = setTimeout(fnc, delay)
      this.timeOutList.push(timmer)
    },
    clearBubble () {
      this.slideList = []
      this.timeOutList.forEach(timmer => {
        clearTimeout(timmer)
      })
      clearInterval(this.interval)
    },
    // 执行动画顺序
    _toSlide (item) {
      const slideDuration = this.slideDuration / 2
      const fadeOutDuration = this.fadeOutDuration
      const fadeInDuration = this.fadeInDuration
      return new Promise((resolve, reject) => {
        // 显现
        item.fadeIn = true
        this.setTimeout(_ => {
          // 开始滚动
          item.slide = true
          this.setTimeout(_ => {
            // 滚动完毕消失
            item.fadeOut = true
            this.setTimeout(_ => {
              // 一个动画周期完毕
              resolve()
            }, fadeOutDuration)
          }, slideDuration + 300)
        }, fadeInDuration)
      })
    },
    pushBubble (index) {
      return new Promise((resolve, reject) => {
        const key = uuidv1()
        const item = {
          id: key,
          title: this.list[index],
          slide: false,
          fadeOut: false,
          pause: false
        }
        this.slideList.push(item)
        this.setTimeout(_ => {
          this._toSlide(item).then(_ => {
            this.slideList = this.slideList.filter(child => child.id !== key)
            resolve()
          })
        }, 100)
      })
    },
    toBubble (gap) {
      this.list.forEach((item, index) => {
        this.setTimeout(_ => {
          this.pushBubble(index)
        }, index * gap)
      })
    },
    initBubble (options) {
      if (!this.list.length) return
      const defaultOptions = {
        loop: true,
        gap: this.slideDuration * 0.2666, // ms， 每一个块出现的间隔
        ...options
      }
      const { loop, gap } = defaultOptions
      this.toBubble(gap)
      if (loop) {
        const length = this.list.length
        this.interval = setInterval(_ => {
          this.toBubble(gap)
        }, length * gap)
        this.$once('hook:beforeDestroy', _ => {
          clearInterval(this.interval)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-bubble {
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: column;
  .bubble {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #faeafb;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    background: rgba(130, 75, 255, 0.5);
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity linear 0.5s, transform linear 3s;
    &.slide {
      transform: translateY(-80px);
    }
    &.fade-in {
      opacity: 1;
    }
    &.fade-out {
      opacity: 0;
    }
  }
}
</style>