<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .app-main {
    /*84 = navbar + tags-view = 50 +34 */
    max-height: calc(100vh - 50px);
    position: relative;
    overflow-y: auto;
  }
</style>