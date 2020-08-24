<template>
  <div :style="{ background: bgColor }" :class="['m-product', { 'is-card': isCard }]">
    <img v-if="imgUrl" :src="imgUrl | thumbnail(800)" class="img" />
    <div
      :class="`list ${size}`"
      :style="{
        paddingTop: $px2vw(paddingTop),
        paddingBottom: $px2vw(paddingBottom)
      }"
    >
      <template v-for="(item, index) in items">
        <ProductItem
          class="m-product-cell"
          v-if="item.show"
          v-bind="item.model"
          :key="index"
          :id="item.mid"
          :size="size"
          :priceLayout="priceLayout"
          :titleLayout="titleLayout"
          :isHighCommission="isHighCommission"
          :isSpike="item.model.isSpike || isSpike"
          :isFight="item.model.isFight || isFight"
          :prefixIconSize="item.model.prefixIconSize || prefixIconSize"
          :switchTitleSubtitle="switchTitleSubtitle"
          :subtitleColor="item.model.subtitleColor || subtitleColor"
          :subtitleFontSize="item.model.subtitleFontSize || subtitleFontSize"
          :titleColor="item.model.titleColor || titleColor"
          :titleFontSize="item.model.titleFontSize || titleFontSize"
          :prefixIcon="item.model.prefixIcon || prefixIcon"
          :corner="item.model.corner || corner"
          :btnText="item.model.btnText || btnText"
          :btnColor="item.model.btnColor || btnColor"
          :salePricePrefix="item.model.salePricePrefix || salePricePrefix"
          :tips="item.model.tips || tips"
          :tipsSize="item.model.tipsSize || tipsSize"
          :tipsColor="item.model.tipsColor || tipsColor"
          :discountIcon="item.model.discountIcon || discountIcon"
          :channelCode="item.model.channelCode || 0"
          :subChannelCode="item.model.subChannelCode"
          :couponAmount="item.model.couponAmount"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import ProductItem from './ProductItem.vue'
  import config from './ProductView.js'
  import { MEMBER_LEVEL_OBJ } from '@/config'
  import recommend from '@/mixins/recommend'

  export default {
    name: 'Product',
    module: '商品列表',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/39e37390-170e-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    computed: {
      size() {
        return ['', 'lg', 'md', 'sm', 'xs'][this.styleType]
      },
      isHighCommission() {
        return this.highCommission
      //  if (this.highCommission) return false
        // if (this.pre) return true
        // if (!this.userInfo) return false
        // const { disSellerLevelId, id, disSellerStatus } = this.userInfo || {}
        // return Object.keys(MEMBER_LEVEL_OBJ).includes(disSellerLevelId) && Number(disSellerStatus) === 1
      },
      items() {
        const items = this.recommendId ? (this.pre ? this.dynamicChildList : this.products) : this.childList
        return items.slice(0, +this.count)
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        products: [],
      }
    },
    components: {
      ProductItem,
    },
    mounted() {
      this._initData()
    },
    methods: {
      async _initData() {
        this.recommendId && !this.pre && this.getData()
      },
      async getData() {
        const { list, context: { currentTime } } = await this.getDynamicList(this.recommendId)
        this.products = list
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-product {
    width: 100%;

    .img {
      width: 100%;
    }

    .list {
      display: flex;
      box-sizing: border-box;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 10px;

      .m-product-cell {
        margin-top: 5px;
      }

      &.lg {
        .m-product-cell {
          margin-top: 10px;

          &:first-child {
            margin-top: 0;
          }
        }
      }

      &.md {
        justify-content: space-between;

        .m-product-cell {
          // 开头前两个
          &:nth-child(-n + 2) {
            margin-top: 0;
          }
        }
      }

      &.sm {
        .m-product-cell {
          margin-right: 5px;
          // 开头前三个
          &:nth-child(-n + 3) {
            margin-top: 0;
          }

          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }

      &.xs {
        display: block;
        overflow-x: auto;
        overflow-y: hidden;
        text-align: left;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;

        .m-product-cell {
          display: inline-block;
          margin-top: 0;
          margin-right: 5px;
          margin-bottom: -3px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .m-product {
    &.is-card {
      .list {
        padding-left: 0;
        padding-right: 0;
        margin: 0 5px;

        .m-product-cell {
          &.lg {
            width: 345px;
            height: 170px;

            .avatar {
              width: 170px;
              height: 170px;
              flex: 0 0 170px;
            }
          }

          &.md {
            width: 170px;

            .avatar {
              width: 170px;
              height: 170px;
            }
          }

          &.sm {
            width: 111.66px;

            .avatar {
              width: 111.66px;
              height: 111.66px;
            }
          }
        }
      }
    }
  }
</style>
