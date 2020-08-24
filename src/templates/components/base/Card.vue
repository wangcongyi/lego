<template>
  <SuperImage class="m-card" :options="bg">
    <SuperImage class="card-inner" :options="moduleBg">
      <CardHeader :bg="headerBg" :title="title" :benefit="benefit" @click.native="jump" />
      <div class="card-content">
        <slot />
      </div>
    </SuperImage>
  </SuperImage>
</template>

<script>
import CardHeader from '@/templates/components/base/CardHeader'
import SuperImage from '@/modules/super/Image.vue'
import linkToolMixins from '@/mixins/linkTool'
export default {
  name: 'Card',
  mixins: [linkToolMixins],
  props: {
    bg: Object,
    moduleBg: Object,
    headerBg: Object,
    headerBgLink: Object,
    title: Object,
    benefit: Object
  },
  components: {
    CardHeader,
    SuperImage
  },
  methods: {
    jump () {
      this.go(this.headerBgLink)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-card {
  text-align: left;
  .card-inner {
    width: 355px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>