<template>
  <div class="m-loading" v-if="showWrap" :class="showContent ?'fadein':'fadeout'">
    <div class="mask" v-if="mask"/>
    <div class="inner">
      <LoadingSingle type="spinner" class="spinner"/>
      <div class="text">{{text}}</div>
    </div>
  </div>
</template>

<script>
import LoadingSingle from './LoadingSingle'
export default {
  components: {
    LoadingSingle
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.inner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 8px;
  background: rgba($color: #000, $alpha: 0.68);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
  padding: 14px;
}
.spinner {
  padding: 14px;
}
.text {
  width: 100%;
  font-size: 14px;
  text-align: center;
  color: #e6e6e6;
}

.fadein {
  animation: animate_in 0.25s;
}
.fadeout {
  animation: animate_out 0.25s;
  opacity: 0;
}

@keyframes animate_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animate_out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
