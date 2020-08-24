<template>
  <el-dialog :visible="visible" @close="_close" append-to-body class="m-img-dialog">
    <div class="img-box">
      <div :style="{background: background}" class="m-img-wrap">
        <img :src="src" :style="`${width ? `width:${width}px;` : ''};`" class="img">
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'ImgModal',
  data: () => ({
    width: 0,
    background: '',
    visible: false,
    src: ''
  }),
  mounted () {
    this._initModal()
  },
  methods: {
    _close () {
      this.visible = false
      this.src = ''
    },
    _initModal () {
      const self = this
      const imodal = (src = '', width = 0, background = '') => {
        Object.assign(self, {
          visible: true,
          src,
          width,
          background
        })
      }
      Vue.prototype.$imodal = imodal
    }
  }
}
</script>

<style lang="scss">
.m-img-dialog {
  .img-box {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .m-img-wrap {
    display: inline-block;
  }
  .img {
    width: 100%;
  }
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__body {
    text-align: center;
  }
}
</style>
