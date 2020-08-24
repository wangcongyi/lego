<template>
  <div class="m-base-modal">
    <div class='m-base-content' :style='{ width: cWidth, height: cHeight}'>
      <i class='i-close' @click='$emit("close")'>X</i>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cWidth: {
        type: String,
        default: '500px',
      },
      cHeight: {
        type: String,
        default: '300px',
      },
    },
    mounted() {
      document.body.appendChild(this.$el)
    },
  }
</script>

<style scoped lang='less'>
  .m-base-modal {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3)
  }

  .m-base-content {
    position: absolute;
    box-sizing: border-box;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
    margin: auto;
    min-width: 200px;
    min-height: 200px;
    background-color: #fff;
  }

  .i-close {
    cursor: pointer;
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
    top: 10px;
    right: 10px;
    font-size: 20px;
    z-index: 1000;
  }

</style>
