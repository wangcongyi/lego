<template>
  <transition name="rotate-fall">
    <div id="app">
      <router-view :class="className"></router-view>
      <install-img-modal />
    </div>
  </transition>
</template>

<script>
import 'vue-transition.css'
import InstallImgModal from '@/components/common/ImgModal'
import { isContains } from '@/utils'
export default {
  name: 'App',
  components: {
    InstallImgModal
  },
  computed: {
    className () {
      const contains = ['/upload']
      if (!isContains(contains, this.$route.path, true)) {
        return `app-router-view`
      }
      return ''
    }
  }
}

</script>
<style>
#app .app-router-view {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  visibility: visible;
  min-width: 860px;
}
</style>
<style lang="scss">
@import '@/styles/mixin';
* {
  @include scrollBar;
}
</style>
