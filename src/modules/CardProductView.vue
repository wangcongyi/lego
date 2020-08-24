<template>
  <Card class="m-card-product" v-bind="props">
    <ProductView
      v-bind="Object.assign(productViewConfig, {
        childList: items,
        corner: corner,
        tips: tips,
        tipsSize: tipsSize,
        tipsColor: tipsColor
      })"
    />
  </Card>
</template>

<script>
  import Card from '@/templates/components/base/Card'
  import ProductView from './ProductView.vue'
  import config from './CardProductView.js'
  import recommend from '@/mixins/recommend'
  import { isContains } from '@/utils'
  import { handleModelProps } from '@/modules/utils'

  export default {
    name: 'CardProduct',
    module: '商品卡片',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/5cec5fb0-170d-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    components: {
      ProductView,
      Card,
    },
    watch: {
      // target () {
      //   this.getChildList()
      // }
      items() {
        Object.assign(this.productViewConfig, {
          childList: this.items,
        })
      },
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
      // target () {
      //   let target = {}
      //   if (this.recommendId) {
      //     target = this.pre ? this.dynamicChildList[0] : this.resource
      //     return target ? handleModelProps(this.props, target) : this.props
      //   }
      //   return this.props
      // },
      items() {
        const items = this.recommendId ? this.pre ? this.dynamicChildList : this.list : []
        return items
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        productViewConfig: {
          count: 200, // 坑位数
          recommendId: null, // 资源位Id
          prefixIcon: '', // 标题活动标
          prefixIconSize: 14, // 标题活动标大小
          discountIcon: '', // 优惠信息标
          switchTitleSubtitle: false, // 标题利益点互换
          subtitleFontSize: 14, // 利益点字号
          subtitleColor: '#8c8c8c', // 利益点颜色
          titleLayout: 1, // 标题布局 1 - 1行 2 - 2行
          titleFontSize: 14, // 标题字号
          titleColor: '#000', // 标题颜色
          bgColor: 'transparent', // 背景色
          btnColor: '#ff354d', // 按钮颜色
          btnText: '', // 按钮文案
          priceLayout: 2, // 价格布局 1 - 1行 2 - 并行
          salePricePrefix: '', // 销售价前缀
          imgUrl: '', // 头图
          corner: '', // Logo
          tips: '', // 营销标
          tipsSize: 25, // 营销标大小
          tipsColor: '#00abff', // 营销标背景色
          highCommission: false, // 高佣商品
          styleType: '3', // 样式 1 - 一排一, 2 - 一排二, 3 - 一排三, 4 - 一排三滑动
          childList: [], // 商品列表
          isSpike: false, // 秒杀模块
          isCard: true, // 卡片风格
          paddingBottom: 5, // 下边距
          paddingTop: 0, // 上边距
        },
        resource: {},
        list: [],
      }
    },
    mounted() {
      this.recommendId && !this.pre && this.getData()
    },
    methods: {
      // async getData () {
      //   const recommendId = this.recommendId
      //   const { list = [] } = await this.getDynamicRecommend(recommendId)
      //   this.resource = list.length ? list[0] : {}
      // },
      // async getChildList () {
      //   const { childPid } = this.target
      //   const { list } = await this.getDynamicList(childPid)
      //   Object.assign(this.productViewConfig, {
      //     childList: list
      //   })
      // }
      async getData() {
        const recommendId = this.recommendId
        const { list } = await this.getDynamicList(recommendId)
        this.list = list
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>