<template>
  <div class="m-barrage">
    <span
      :class="['barrage', { 'slide': item.slide }]"
      v-for="item in slideList"
      :key="item.id"
      :style="{
        top: $px2vw(item.top),
        transform: `translateX(${$px2vw(maxWidth)})`,
        transition: `transform linear ${(item.slideDuration || slideDuration) / 1000}s`,
        ...genStyle(styleOptions)
      }"
      @click="$emit('jump', item)"
    >{{ item.title }}</span>
  </div>
</template>

<script>
import { listenerHidden, getStringLength } from '@/utils'
import uuidv1 from 'uuid/v1'
import { genStyle } from '@/modules/super/util'
export default {
  props: {
    maxWidth: Number,
    maxHeight: Number,
    list: {
      type: Array,
      default: _ => ([])
    },
    styleOptions: {
      type: Object,
      default: _ => ({})
    }
  },
  computed: {
    // 划分弹道
    course () {
      if (this.maxHeight) {
        const itemHeight = this.itemHeight
        const overHeight = this.maxHeight - this.styleOptions.style.bottom
        const arr = new Array(Math.floor(overHeight / itemHeight))
        // console.log('弹道', arr)
        return arr.fill(false)
      }
      return []
    }
  },
  data () {
    return {
      itemHeight: 25,
      slideDuration: 6000,
      slideList: [],
      interval: null,
      timeOutList: []
    }
  },
  // 替代上层数组变化重新进行init的操作
  watch: {
    'styleOptions.style.bottom' () {
      this.clearBubble()
      this.initBubble()
    },
    maxWidth () {
      this.clearBubble()
      this.initBubble()
    },
    list () {
      this.clearBubble()
      this.initBubble()
    }
  },
  mounted () {
    this._initModule()
  },
  destroyed () {
    this.clearBubble()
  },
  methods: {
    genStyle,
    // 初始化
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
    // 包装setTimeout
    setTimeout (fnc, delay) {
      const timmer = setTimeout(fnc, delay)
      this.timeOutList.push(timmer)
    },
    // 执行动画顺序
    _toSlide (item) {
      const slideDuration = item.slideDuration || this.getLongestDuration()
      return new Promise((resolve, reject) => {
        // 开始滚动
        item.slide = true
        setTimeout(_ => {
          resolve()
        }, slideDuration)
      })
    },
    // 清除所有弹幕以及动画
    clearBubble () {
      this.slideList = []
      this.timeOutList.forEach(timmer => {
        clearTimeout(timmer)
      })
      clearInterval(this.interval)
    },
    // 一个弹幕循环
    toBubble (gap) {
      this.list.forEach((item, index) => {
        this.setTimeout(_ => {
          this.pushBubble(index)
        }, index * gap)
      })
    },
    // 初始化弹幕
    initBubble (options) {
      if (!this.list.length) return
      const defaultOptions = {
        loop: true,
        gap: this.getLongestDuration() * 0.2666, // ms， 每一个块出现的间隔
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
    },
    // 可用弹道列表
    getAvailableCourse () {
      const arr = []
      this.course.forEach((item, index) => {
        if (!item) arr.push(index)
      })
      return arr
    },
    // 释放列表中的弹道
    releaseCourse (courseIndex) {
      if (this.course.length > courseIndex) {
        this.course[courseIndex] = false
      }
    },
    // 获取一个可用弹道
    getCourse () {
      function RandomNum (minNum, maxNum) {
        switch (arguments.length) {
          case 1:
            return parseInt(Math.random() * minNum + 1, 10)
            break
          case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
            break
          default:
            return 0
            break
        }
      }
      const itemHeight = this.itemHeight
      const availableCourse = this.getAvailableCourse()
      const max = availableCourse.length > 1 ? availableCourse.length - 1 : 0
      const genRadomNum = RandomNum(0, max)
      const courseIndex = typeof availableCourse[genRadomNum] !== 'undefined' ? availableCourse[genRadomNum] : null
      // if (courseIndex === null) return null
      console.log('获取可用弹道', availableCourse, availableCourse.length, genRadomNum, courseIndex)
      // 弹道置为使用中
      this.course[courseIndex] = true
      return courseIndex
    },
    // 获取最长时间
    getLongestDuration () {
      const arr = []
      this.list.forEach(item => {
        const titleLength = getStringLength(item.title)
        arr.push(titleLength * 200 < 6000 ? 6000 : titleLength * 200 > 12000 ? 12000 : titleLength * 200)
      })
      return Math.max(...arr)
    },
    // 推送一个弹幕
    pushBubble (index) {
      return new Promise((resolve, reject) => {
        const key = uuidv1()
        const target = this.list[index]
        const titleLength = getStringLength(target.title)
        const courseIndex = this.getCourse()
        // if (courseIndex === null) return
        const item = {
          id: key,
          slide: false,
          top: courseIndex * this.itemHeight,
          slideDuration: titleLength * 200 < 6000 ? 6000 : titleLength * 200 > 12000 ? 12000 : titleLength * 200,
          ...target
        }
        this.slideList.push(item)
        this.setTimeout(_ => {
          this._toSlide(item).then(_ => {
            this.slideList = this.slideList.filter(child => child.id !== key)
            this.releaseCourse(courseIndex)
            resolve()
          })
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.barrage {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 20px;
  height: 25px;
  line-height: 25px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 12px;
  z-index: 3;
  white-space: nowrap;
  &.slide {
    transform: translateX(-101%) !important;
  }
}
</style>