<template>
  <SuperImage class="card-header" :options="bg">
    <div class="content">
      <SuperText class="maintitle f-block" :options="title" />
      <SuperText class="benefit f-block" :options="benefit" />
    </div>
  </SuperImage>
</template>

<script>
import SuperText from '@/modules/super/Text.vue'
import SuperImage from '@/modules/super/Image.vue'
export default {
  name: 'CardHeader',
  props: {
    bg: Object,
    title: Object,
    benefit: Object
  },
  components: {
    SuperText,
    SuperImage
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  .content {
    position: absolute;
    top: 15px;
    left: 15px;
  }
}
</style>