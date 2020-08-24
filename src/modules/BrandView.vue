<template>
  <div
    :class="['m-brand-view', { 'is-card': isCard }]"
    :style="{
      backgroundColor: bgColor,
      paddingTop: $px2vw(paddingTop),
      paddingBottom: $px2vw(paddingBottom)
    }"
  >
    <template v-for="(item, index) in items">
      <BrandItem
        class="m-brand-item"
        v-bind="item"
        :key="index"
        @click.native="goDetail(item)"
        :benefitFontSize="item.benefitFontSize || benefitFontSize"
        :benefitColor="item.benefitColor || benefitColor"
      />
    </template>
  </div>
</template>

<script>
  import BrandItem from './BrandItem.vue'
  import { jumpById } from '@/utils'
  import config from './BrandView.js'
  import recommend from '@/mixins/recommend'

  export default {
    name: 'Brand',
    module: '品牌',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/1a04f3c0-170c-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    components: {
      BrandItem,
    },
    computed: {
      items() {
        const items = this.recommendId ? (this.pre ? this.dynamicChildList : this.list) : this.childList
        return items
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        list: [
          // {
          //   brandLogo: 'https://e-test-future-market.oss-cn-hangzhou.aliyuncs.com/test-product/927/image/10001/8c827070-ea76-11e9-b47e-1d2d0a3c57a9.png',
          //   brandPic: 'https://e-test-future-market.oss-cn-hangzhou.aliyuncs.com/test-product/927/image/10001/8c827070-ea76-11e9-b47e-1d2d0a3c57a9.png',
          //   name: '蒙牛旗舰店',
          //   jumpLink: 'https://www.baidu.com',
          //   benefit: '这里最多八个字符',
          //   shopId: null
          // }
        ],
      }
    },
    mounted() {
      this.recommendId && !this.pre && this.getData()
    },
    methods: {
      async getData() {
        const { list, context: { currentTime } } = await this.getDynamicRecommend(this.recommendId)
        this.list = list
      },
      goDetail(item) {
        if (item.jumpLink) {
          if (!this.pre)
            window.location.href = item.jumpLink
          else
            window.open(item.jumpLink)
        } else if (`${item.shopId}`) {
          jumpById(seller, {
            id: item.shopId,
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-brand-view {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    background-color: #c0c0c0;

    .m-brand-item {
      margin-right: 5px;
      margin-top: 5px;

      &:nth-child(-n + 3) {
        margin-top: 0;
      }

      &:nth-child(3n) {
        margin-right: 0;
      }
    }

    &.is-card {
      padding: 0 5px 5px 5px;

      .m-brand-item {
        width: 111.66px;
      }
    }
  }
</style>