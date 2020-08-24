<template>
  <div :style="{ background: bgColor }" class="m-liveList">
    <img v-if="imgUrl" :src="imgUrl | thumbnail(800)" class="img" />
    <div
      class='list'
      :style="{
        paddingTop: $px2vw(paddingTop),
        paddingBottom: $px2vw(paddingBottom)
      }"
    >
      <template v-for="(item, index) in items">
        <LiveListItem
          class="m-liveList-cell"
          v-if="item.show"
          v-bind="item.model"
          :data="item.model"
          :key="index"
          :id="item.mid"
          :subtitleColor="item.model.subtitleColor || subtitleColor"
          :subBgColor="item.model.subBgColor || subBgColor"
          :subBtnTextColor="item.model.subBtnTextColor || subBtnTextColor"
          :itemBottom="item.model.itemBottom || itemBottom"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import LiveListItem from './LiveListItem.vue'
  import config from './LiveList.js'
  import recommend from '@/mixins/recommend'

  export default {
    name: 'LiveList',
    module: '直播列表',
    mixins: [recommend],
    props: config,
    computed: {
      items() {
        const items = this.recommendId ? (this.dynamicChildList) : this.childList
        return items.slice(0, 100)
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        products: [],
      }
    },
    components: {
      LiveListItem,
    },
    mounted() {
      if (this.recommendId && !this.pre) {
        this.products = this.getDynamicList(this.recommendId)
      }
    },
    methods: {
      async _initData() {
        this.recommendId && !this.pre && this.getData()
      },
      async getData() {
        const { list,context: { currentTime } } = await this.getDynamicList(this.recommendId)
        this.products = list
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-liveList {
    width: 100%;

    .img {
      width: 100%;
    }

    .list {
      display: flex;
      box-sizing: border-box;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
