/*
This component is export from the ElemeFE/element, which's rep is https://github.com/ElemeFE/element
*/
<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ElUploadDrag',
    props: {
      disabled: Boolean,
    },
    inject: {
      uploader: {
        default: '',
      },
    },
    data() {
      return {
        dragover: false,
      }
    },
    methods: {
      onDragover() {
        if (!this.disabled) {
          this.dragover = true
        }
      },
      onDrop(e) {
        if (this.disabled) return
        const accept = this.uploader.accept
        this.dragover = false
        if (!accept) {
          this.$emit('file', e.dataTransfer.files)
          return
        }
        this.$emit('file', [].slice.call(e.dataTransfer.files).filter(file => {
          const { type, name } = file
          const extension = name.indexOf('.') > -1
            ? `.${name.split('.').pop()}`
            : ''
          const baseType = type.replace(/\/.*$/, '')
          return accept.split(',')
            .map(type => type.trim())
            .filter(type => type)
            .some(acceptedType => {
              if (/\..+$/.test(acceptedType)) {
                return extension === acceptedType
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '')
              }
              if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                return type === acceptedType
              }
              return false
            })
        }))
      },
    },
  }
</script>
<style lang='less'>
  .el-upload-dragger {
    cursor: pointer;
    margin: auto;
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }

    // .el-upload__text {
    //   margin-top: 80px;
    // }
  }

  .is-dragover {
    border: 2px dotted #27f;
    background-color: rgba(32, 159, 255, .6);
  }
</style>