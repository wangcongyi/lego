<template>
  <Card class="m-card-brand" v-bind="props">
    <BrandView v-bind="Object.assign(brandViewConfig, {
      childList: items
    })" />
  </Card>
</template>

<script>
  import Card from '@/templates/components/base/Card'
  import BrandView from './BrandView.vue'
  import config from './CardBrandView.js'
  import recommend from '@/mixins/recommend'
  import { isContains } from '@/utils'

  export default {
    name: 'CardBrand',
    module: '品牌卡片',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/5cecd4e0-170d-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    components: {
      BrandView,
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
        const items = this.recommendId ? this.pre ? this.dynamicChildList : this.list : []
        return items
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        brandViewConfig: {
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
