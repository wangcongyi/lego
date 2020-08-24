<template>
  <Card class="m-card-shop" v-bind="props">
    <ShopView v-bind="Object.assign(shopViewConfig, {childList: items})" />
  </Card>
</template>

<script>
  import Card from '@/templates/components/base/Card'
  import ShopView from './ShopView.vue'
  import config from './CardShopView.js'
  import recommend from '@/mixins/recommend'
  import { isContains } from '@/utils'

  export default {
    name: 'CardShop',
    module: '店铺卡片',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/5cec86c0-170d-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    components: {
      ShopView,
      Card,
    },
    computed: {
      props() {
        const props = {}
        const externals = ['recommendId', 'dynamicChildList', 'childlist']
        for (const key in config) {
          if (!isContains(externals, key))
            props[key] = this[key]
        }
        return props
      },
      items() {
        return this.recommendId ? this.pre ? this.dynamicChildList : this.list : []
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        shopViewConfig: {
          recommendId: null, // 资源位Id
          bgColor: '', // 背景色
          benefitFontSize: 12, // 利益点字体大小
          benefitColor: '#ff3d2f', // 利益点颜色
          paddingBottom: 5, // 下边距
          paddingTop: 0, // 上边距
          childList: [], // 列表
          isCard: true, // 卡片风格
        },
        list: [],
      }
    },
    mounted() {
      this.recommendId && !this.pre && this.getData()
    },
    methods: {
      async getData(origin) {
        const recommendId = this.recommendId
        const { list } = await this.getDynamicRecommend(recommendId)
        this.list = list
      },
    },
  }
</script>
