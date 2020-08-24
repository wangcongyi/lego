<template>
  <div
    class="m-video-cell"
    :style="{
      background: bgColor,
      paddingTop: $px2vw(paddingTop),
      paddingBottom: $px2vw(paddingBottom)
    }"
  >
    <div :class="`content lg`">
      <div class="video" @click="goVideoDetail">
        <img class="player" :src="videoCover | thumbnail(800)" alt />
      </div>
      <div class="content" @click="goProductDetail">
        <div class="maintitle">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
        <div class="discount" v-if="discountIcon">
          <img class="img" :src="discountIcon" alt v-if="discountIcon.indexOf('//') !== -1" />
          <span v-else class="discountText">{{ discountIcon }}</span>
        </div>
        <div class="box">
          <div class="avatar">
            <img class="img" :src="avatar | thumbnail(300)" alt />
          </div>
          <div class="price-wrap">
            <div class="originPrice" v-if="originPrice">{{ originPrice | parsePrice }}</div>
            <div class="salePrice" v-if="salePricePrefix || salePrice">
              <img
                class="img"
                :src="salePricePrefix"
                alt
                v-if="salePricePrefix.indexOf('//') !== -1"
              />
              <span v-else class="prefix">{{ salePricePrefix }}</span>
              <span>
                {{ salePrice | parsePrice }}
                <!-- <span
                  class="originPrice"
                  v-if="showOriginPriceParallel"
                >{{ originPrice | parsePrice }}</span>-->
              </span>
            </div>

            <div class="salePrice" v-else-if="price">{{ price | parsePrice }}</div>
            <div class="footer" v-if="showFooter">
              <div
                v-if="isHighCommission && commission"
                class="commission"
              >{{ commissionString }}:{{ commission | parsePrice }}</div>
              <div
                class="btn"
                :style="{
                  background: btnColor
                }"
                v-if="btnText"
              >{{ btnText }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './VideoLarge.js'
import { jumpById } from '@/utils'
import { MEMBER_LEVEL_OBJ } from '@/config'
import qs from 'qs'
export default {
  name: 'VideoLargeInner',
  filters: {
    parsePrice: value => `¥${value || '0.00'}`,
  },
  props: config,
  computed: {
    isHighCommission () {
      if (!this.highCommission) return false
      if (this.pre) return true
      if (!this.userInfo) return false
      const { disSellerLevelId, id, disSellerStatus } = this.userInfo || {}
      return Object.keys(MEMBER_LEVEL_OBJ).includes(disSellerLevelId) && Number(disSellerStatus) === 1
    },
    showFooter () {
      return (this.isHighCommission && this.commission) || this.btnText
    },
    commissionString: (that = this) => '奖'
  },
  data () {
    return {
      pre: typeof window !== 'undefined' ? window.ISPRE : false
    }
  },
  methods: {
    goProductDetail () {
      const search = this.productUrl.split('?')
      const params = qs.parse(search[search.length - 1])
      jumpById('product', params)
    },
    goVideoDetail () {
      const search = this.videoUrl.split('?')
      const params = qs.parse(search[search.length - 1])
      jumpById('video', params)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';
.m-video-cell {
  width: 100%;
  padding: 0 10px 10px;
  > .content {
    height: 200px;
    border-radius: 4px;
    text-align: left;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &.lg {
      display: flex;
      justify-content: space-between;
      .video {
        flex: 0 0 150px;
        height: 100%;
        padding: 10px 0 10px 10px;
        background: #fff;
        .player {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      }
      .content {
        position: relative;
        height: 100%;
        background: #fff;
        padding: 10px;
        .maintitle {
          font-size: 16px;
          font-weight: 500;
          color: #000;
          line-height: 22px;
          @include cut(185px);
        }
        .subtitle {
          font-size: 14px;
          color: #8c8c8c;
          line-height: 20px;
          @include cutCount(185px, 2);
          margin-top: 5px;
        }
        .discount {
          margin: 5px 0;
          line-height: 16px;
          > .img {
            max-height: 16px;
            width: auto;
          }
          > .discountText {
            height: 16px;
            line-height: 16px;
            background: #fff;
            border-radius: 2px;
            border: 1px solid #ff354d;

            padding: 0 3px;
            font-size: 12px;
            color: #ff354d;
          }
        }
        .box {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0 10px 10px;
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          .avatar {
            width: 70px;
            height: 70px;
            background: #e5e5e5;
            border-radius: 2px;
            overflow: hidden;
          }
          .price-wrap {
            position: relative;
            margin-left: 5px;
            flex: 1 1 auto;
            // .originPrice,
            // .salePrice,
            // .price {
            //   position: absolute;
            //   left: 0;
            // }
            .originPrice {
              top: 18px;
              font-size: 14px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #8c8c8c;
              line-height: 16px;
              text-decoration: line-through;
            }
            .salePrice {
              font-family: DINAlternate-Bold, DINAlternate;
              white-space: nowrap;

              color: #ff354d;
              font-size: 16px;
              font-weight: bold;
              display: flex;
              align-items: center;
              line-height: 20px;
              > .prefix {
                font-size: 12px;
                font-weight: 600;
              }
              > .img {
                max-height: 15px;
                width: auto;
                margin-right: 5px;
              }
            }
            .footer {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;

              display: flex;
              align-items: center;
              .btn {
                flex: 1;

                height: 25px;
                background: #ff354d;
                border-radius: 13px;

                font-size: 12px;
                font-weight: 500;
                color: #fff;
                line-height: 25px;
                text-align: center;
              }
              .commission {
                margin-right: 10px;
                font-size: 12px;
                font-weight: 500;
                color: #ff9a00;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
}
</style>