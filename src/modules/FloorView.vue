<template>
  <div class="m-floor">
    <SuperImage class="bg-img" :options="bg" />
    <div :class="['content', 'f-y-center']">
      <SuperImage v-if="prefixIcon" class="prefix" :options="prefixIcon" />
      <SuperText class="tt" :options="title" />
      <SuperImage v-if="suffixIcon" class="suffix" :options="suffixIcon" />
    </div>
  </div>
</template>

<script>
  import SuperText from './super/Text.vue'
  import SuperImage from './super/Image.vue'
  import config from './FloorView.js'

  export default {
    name: 'Floor',
    module: '楼层',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/ff08c540-170d-11ea-ae56-b5039842b49f.png',
    props: config,
    components: {
      SuperText,
      SuperImage,
    },
  }
</script>

<style lang="scss" scoped>
  .m-floor {
    position: relative;

    .content {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
    }

    .tt {
      font-size: 16px;
    }
  }
</style>