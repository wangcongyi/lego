<template>
  <div
    ref="box"
    class="m-sticky-nav"
    :style="{
      padding: `${marginV}px 0px`,
      ...outBg
    }"
  >
    <img v-if="isImageBg" class="bg" :src="outColor | thumbnail(800)" alt />
    <div ref="placeholderrHolder" class="inner-wrap placeholder center" />
    <div
      ref="placeholderr"
      :class="['inner-wrap', isImageBg && !headerFixed ? 'center' : '', !isImageBg ? 'placeholder' : '']"
    >
      <Scroll
        ref="scroll"
        :class="['scrollWrap', { fixed: headerFixed }]"
        eventPassthrough="vertical"
        scrollX
        stopPropagation
        :style="{
          backgroundColor: backgroundColor,
          margin: `0 ${marginH}px`
        }"
      >
        <div class="navWrap">
          <template v-for="(item, index) in childList">
            <StickyNavItem
              v-if="item.show"
              v-bind="item.model"
              :id="item.mid"
              :style="{'color': current === index ? activeColor : color}"
              :key="index"
              :fontSize="fontSize"
              :active="current === index"
              :showIcon="current === index ? item.model.icon : false"
              :icon="item.model.icon || icon"
              :iconSize="item.model.iconSize || iconSize"
              @jump="jump(item, index)"
            />
          </template>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Scroll from '@/templates/components/base/Scroll'
import config from './StickyNavView.js'
import StickyNavItem from './StickyNavItem.vue'
export default {
  name: 'StickyNav',
  module: '吸顶导航',
  poster: 'https://lego-activity-dev.weilaijishi.com/resource/07bf4ce0-170e-11ea-ae56-b5039842b49f.png',
  props: config,
  components: {
    Scroll,
    StickyNavItem
  },
  computed: {
    isImageBg () {
      return this.outColor.indexOf('//') !== -1
    },
    outBg () {
      return this.isImageBg ? {} : {
        backgroundColor: this.outColor
      }
    }
  },
  data () {
    return {
      current: 0,
      headerFixed: false
    }
  },
  watch: {
    current (oldValue, newVal) {
      this.move()
    }
  },
  mounted () {
    window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    if (!window.ISPRE) {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  beforeDestroy () {
    if (!window.ISPRE) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    // offsetTop获取到的是离最近的relative定位的父级元素的顶部边框的距离，因此要加上父级的offestTop
    getStickOffsetTop () {
      return this.$refs.placeholderrHolder.offsetTop + this.$refs.box.offsetTop
    },
    getStickOffsetHeight () {
      return this.$refs.placeholderrHolder.offsetHeight
    },
    move () {
      var node = this.$refs.placeholderr
      if (!node) {
        return
      }
      var child = node.querySelectorAll('.item')[this.current]
      if (!child) {
        return
      }
      var scroll = this.$refs.scroll
      scroll.scrollToElement(child, 300, true, true)
    },
    jump (item, index) {
      if (window.ISPRE) {
        this.current = index
      } else {
        var element = document.getElementById(item.model.anchor)
        if (element) {
          const placeholderr = this.$refs.placeholderr
          const offsetHeight = this.getStickOffsetHeight()
          const isLower = element.offsetTop > placeholderr.offsetTop
          let diff = isLower ? offsetHeight : 0
          scrollToElement(element, 1500, 'easeInOutQuint', diff)
        }
      }
    },
    handleScroll () {
      // 得到页面滚动的距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // 这里要得到距离页面顶部的距离和元素自身的高度
      let offsetTop = this.getStickOffsetTop()
      let offsetHeight = this.getStickOffsetHeight()
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.headerFixed = scrollTop >= offsetTop
      setTimeout(() => {
        var step = 0
        this.childList.map((item, index) => {
          let element = document.getElementById(item.model.anchor)
          if (element) {
            let nodeOffset = element.offsetTop
            if (scrollTop >= nodeOffset - offsetHeight) {
              step = index
            }
          }
        })
        this.current = step
      }, 0)
    }
  }
}

// main function
function scrollToElement (element, speed, easing, diff) {
  var scrollTargetY = element.offsetTop - diff;
  // scrollTargetY: the target scrollY property of the window
  // speed: time in pixels per second
  // easing: easing equation to use

  var scrollY = window.scrollY,
    scrollTargetY = scrollTargetY || 0,
    speed = speed || 2000,
    easing = easing || 'easeOutSine',
    currentTime = 0;

  // min time .1, max time .8 seconds
  var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  var PI_D2 = Math.PI / 2,
    easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

  // add animation loop
  function tick () {
    currentTime += 1 / 60;

    var p = currentTime / time;
    var t = easingEquations[easing](p);

    if (p < 1) {
      requestAnimFrame(tick);

      window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    } else {
      window.scrollTo(0, scrollTargetY);
    }
  }

  // call it once to get started
  tick();
}

</script>

<style lang="scss" scoped>
.m-sticky-nav {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-repeat: no-repeat;
  .bg {
    width: 100%;
  }
}
.inner-wrap {
  width: 100%;
  overflow: hidden;
  &.placeholder {
    min-height: 46px;
  }
  &.center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .scrollWrap {
    // width: 100%;
    height: 46px;
    line-height: 46px;
    text-align: left;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

    .navWrap {
      height: 100%;
      display: inline-block;
      white-space: nowrap;
    }
  }

  .scrollWrap.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0 !important;
    border-radius: 0;
    z-index: 99;
  }
}
</style>
