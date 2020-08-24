<template>
  <div class="m-bubble">
    <span
      v-for="item in slideList"
      :key="item.id"
      :class="genItemClass(item)"
      :style="{
        transition: `transform linear 0.5s, opacity linear 0.5s`,
        opacity: item.opacity,
        transform: `translateY(${$px2vw(item.top)})`,
        ...genStyle(styleOptions)
      }"
      @click="$emit('jump', item)"
    >{{ item.title }}</span>
  </div>
</template>

<script>
import { listenerHidden } from '@/utils'
import uuidv1 from 'uuid/v1'
import { genStyle } from '@/modules/super/util'
export default {
  props: {
    list: {
      type: Array,
      default: _ => ([])
    },
    styleOptions: {
      type: Object,
      default: _ => ({})
    }
  },
  data () {
    return {
      slideDuration: 500,
      fadeOutDuration: 500,
      fadeInDuration: 500,
      slideList: [],
      initLength: 3,
      blockSpace: 24 + 7.5, // 高度 + 上间距
      startTop: 36,
      pushIndex: null,
      interval: null,
      timeOutList: []
    }
  },
  watch: {
    list () {
      console.log('消息队列', this.list)
      this._clearBubble()
      this._initBubble()
    }
  },
  mounted () {
    this._initModule()
  },
  methods: {
    genStyle,
    genItemClass (item) {
      return [
        'bubble',
        { 'fade-in': item.fadeIn },
        { 'fade-out': item.fadeOut }
      ]
    },
    setTimeout (fnc, delay) {
      const timmer = setTimeout(fnc, delay)
      this.timeOutList.push(timmer)
    },
    _clearBubble () {
      this.slideList = []
      this.timeOutList.forEach(timmer => {
        clearTimeout(timmer)
      })
      clearInterval(this.interval)
    },
    _initModule () {
      this._initBubble()
      listenerHidden((isHide) => {
        if (isHide) {
          this._clearBubble()
        } else {
          this._initBubble()
        }
      })
    },
    _initBubble () {
      const length = this.list.length
      if (!length) return
      this._initFirst()
      length > 3 && this._initAnimate()
    },
    _initAnimate () {
      const animate = async _ => {
        if (this.pushIndex >= this.list.length) {
          this.pushIndex = 0
        }
        await this.genItem(this.pushIndex, true)
        await this.spliceItem()
        this.pushIndex++
      }
      this.interval = setInterval(animate, 5000)
      this.$once('hook:beforeDestroy', _ => {
        clearInterval(this.interval)
      })
    },
    _initFirst (length = this.initLength) {
      const parseLength = length > this.list.length ? this.list.length : length
      this.pushIndex = parseLength
      new Array(parseLength).join(',').split(',').forEach((item, index) => {
        this.genItem(index)
      })
    },
    genItem (index, animate = false) {
      return new Promise((resolve, reject) => {
        const key = uuidv1()
        const length = this.slideList.length
        const startTop = this.startTop
        const blockSpace = this.blockSpace
        const target = this.list[index]
        const item = {
          id: key,
          slide: false,
          fadeOut: false,
          fadeIn: false,
          pause: false,
          top: animate ? startTop + blockSpace : startTop,
          opacity: animate ? 0 : 1,
          ...target
        }
        !animate && this.slide()
        this.slideList.push(item)
        !animate && resolve()
        if (animate) {
          this.setTimeout(_ => {
            this.slide()
            item.fadeIn = true
            resolve()
          }, 100)
        }
      })
    },
    slide () {
      const blockSpace = this.blockSpace
      this.slideList.forEach(item => {
        item.top += -blockSpace
      })
    },
    async spliceItem (index = 0) {
      return new Promise((resolve, reject) => {
        const fadeOutDuration = this.fadeOutDuration
        const target = this.slideList[index]
        target.fadeOut = true
        this.setTimeout(_ => {
          this.slideList.splice(0, 1)
          resolve()
        }, fadeOutDuration)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-bubble {
  position: absolute;
  left: 12px;
  bottom: 36px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  .bubble {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #faeafb;
    max-width: 350px;
    line-height: 24px;
    padding: 0 12px;
    background: rgba(130, 75, 255, 0.5);
    border-radius: 10px;
    font-size: 12px;
    transition: transform linear 0.5s, opacity ease 0.5s;
    opacity: 0;
    z-index: 3;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &.fade-in {
      opacity: 1 !important;
    }
    &.fade-out {
      animation: fadeOut ease 0.4s forwards;
    }
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>