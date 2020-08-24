<template>
  <div class="wrap" v-if="showWrap" :class="showContent ?'fadein':'fadeout'">
    <div class="mask" v-if="mask"/>
    <div class="content">{{text}}</div>
  </div>
</template>
<style lang="scss" scoped>
.wrap {
  position: fixed;
  color: #fff;
  z-index: 1000;
  .mask {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    margin-top: -5px;
    background: rgba(0, 0, 0, 0.65);
    padding: 14px;
    border-radius: 5px;

    font-size: 14px;
    text-align: center;
  }
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
