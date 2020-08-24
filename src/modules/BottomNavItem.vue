<template>
  <div class="m-bottom-nav-tab" @click="handleJump(url)">
    <img class="icon" :src="curIcon" alt />
    <span class="name" :style="{color: curColor}">{{ name }}</span>
  </div>
</template>

<script>
  import config from './BottomNavItem.js'

  export default {
    name: 'BottomNavItem',
    props: config,
    computed: {
      curColor() {
        return this.isActive ? this.selectColor : this.color
      },
      curIcon() {
        return this.isActive ? this.selectIcon : this.icon
      },
      isActive() {
        return decodeURI(this.location) === decodeURI(this.url)
      },
      location() {
        return (window && window.location.href) || this.$route.fullPath
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
      }
    },
    methods: {
      handleJump(url) {
        if (!url) return
        // fixed: 跳转问题
        if (this.pre) {
          window.open(url)
        } else {
          window.location.href = url
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin';

  .m-bottom-nav-tab {
    position: relative;
    flex: 1;
    text-align: center;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    .icon {
      width: 55px;
      height: 55px;
      object-fit: cover;
    }

    .name {
      font-size: 11px;
      font-weight: 400;
      line-height: 14px;
      @include cut();
    }
  }
</style>