<template>
  <div
    class="m-bottom-nav"
    :class="{ipx: isIpx}"
    :style="{
      color: color,
      position: pre ? 'absolute' : 'fixed'
    }"
  >
    <div ref="bg" class="bg" :style="{ 
      background: background
    }" />
    <template v-for="item in items">
      <BottomNavItem
        v-bind="item.model"
        v-if="item.show"
        :key="item.mid"
        :id="item.mid"
        :color="item.model.color || color"
        :selectColor="item.model.selectColor || selectColor"
      />
    </template>
  </div>
</template>

<script>
  import config from './BottomNavView.js'
  import BottomNavItem from './BottomNavItem.vue'
  import recommend from '@/mixins/recommend'
  import { checkX } from '@/utils'

  export default {
    name: 'BottomNav',
    module: '底部导航',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/e2106050-1709-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    components: {
      BottomNavItem,
    },
    computed: {
      background() {
        return this.bgColor.indexOf('//') !== -1 ? `url(${this.bgColor.replace(';', '')})` : this.bgColor
      },
      items() {
        return this.recommendId ? (this.pre ? this.dynamicChildList : this.list) : this.childList
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        list: [],
        isIpx: checkX(),
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (document) {
          const wrap = this.pre
            ? document.getElementsByClassName('content-abs')[0]
            : document.getElementById('temp')

          const distance = this.$refs.bg.offsetHeight
          wrap.setAttribute('style', `padding-bottom: ${distance}px`)
        }
      })
      this.recommendId && !this.pre && this.getData()
    },
    methods: {
      async getData() {
        const { list, context: { currentTime } } = await this.getDynamicList(this.recommendId)
        this.list = list
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-wrap: nowrap;
    height: 72px;
    // line-height: 50px;
    user-select: none;
    cursor: pointer;
    z-index: 10;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;

    .bg {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 56px;
      width: 100%;
    }

    $extra: 24px;

    &.ipx {
      height: 72px + $extra;
      padding-bottom: $extra;

      .bg {
        height: 56px + $extra;
      }
    }
  }
</style>