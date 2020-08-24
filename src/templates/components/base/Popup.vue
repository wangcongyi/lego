<template>
  <div class="m-popup" :class="{'popup-show' : show, 'popup-hidden': hidden, 'popup-hide': !show, 'pre': pre}">
    <div class="popup-mask" @click="close"/>
    <div class="popup popup-bottom" :style="{
      backgroundColor: bgColor
    }">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean,
    bgColor: String
  },
  data () {
    return {
      pre: typeof window !== 'undefined' ? window.ISPRE : false,
      hidden: false
    }
  },
  methods: {
    close () {
      this.hidden = true
      setTimeout(() => {
        this.hidden = false
        this.$emit('closePopup')
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
.m-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .popup {
    position: fixed;
    height: 60vh;
    box-sizing: border-box;
    background-color: #fff;
  }
  .popup-bottom {
    width: 100%;
    left: 0;
    bottom: 0;
  }
  &.popup-show {
    display: block;
    .popup-mask {
      animation: fade-in 0.3s ease forwards;
    }
    .popup-bottom {
      animation: popup-bottom 0.3s ease forwards;
    }
  }
  &.popup-hidden {
    .popup-mask {
      animation: fade-out 0.3s ease forwards;
    }
    .popup-bottom {
      animation: popup-bottom-hide 0.3s ease forwards;
    }
  }
  &.popup-hide {
    display: none;
  }
  &.pre {
    position: absolute;
    .popup-bottom {
      position: absolute;
    }
  }
}
@keyframes popup-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes popup-bottom-hide {
  from {
    transform: ranslateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
