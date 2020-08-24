<template>
  <div ref="container"></div>
</template>
<script>
  import Quill from 'quill'

  export default {
    mounted() {
      window.quill = this.quill = new Quill(this.$refs.container, {
        modules: { toolbar: true },
        theme: 'snow',
      })
    },
  }
</script>
