<template>
  <div
    class="m-coupon"
    :style="{
      backgroundColor: bgColor,
      paddingTop: $px2vw(paddingTop),
      paddingBottom: $px2vw(paddingBottom)
    }"
  >
    <div v-if="!formatList.length && pre" class="placeholder">卡券模块</div>
    <div v-else :class="['c-card-list', `layout-${layout}`, `type-${type}`]">
      <template v-for="(item) in formatList">
        <div v-if="item.show" :key="item.mid" :id="item.mid" class="c-card">
          <div
            class="image"
            :style="{backgroundImage: `url(${item.shopImg})`}"
            @click.prevent="jumpDetail(item)"
          >
            <div class="shop-info" v-if="type == 3">
              <img v-if="item.shopLogo" :class="['shop-logo', { 'big': !item.shopName }]" :src="item.shopLogo" alt />
              <span class="shop-name">{{ item.shopName }}</span>
            </div>
          </div>
          <div
            class="content"
            :style="{color: item.style.color,...item.style.background}"
          >
            <div class="content-text">
              <p
                class="price"
                :class="{'discount': +item.couponType === 3}"
                :style="{color: priceColor}"
              >
                {{ item.couponValue }}
              </p>
              <p class="desc" :style="{color: limitColor}">
                {{ item.limit }}
              </p>
              <p
                class="desc"
                v-if="item.couponUseRemarkType === '2'"
                :style="{color: areaColor}"
              >
                {{ item.area }}
              </p>
              <p
                class="tab"
                v-else-if="getTab(item.couponType)"
                :style="{background: couponTypeBgColor,color: couponTypeColor}"
              >
                {{ getTab(item.couponType) }}
              </p>
            </div>
            <div
              id="coupon_btn"
              :class="['content-btn', item.statusInfo.class]"
              :style="{
                color: item.style.btnColor, 
                background: item.style.btnBgColor
              }"
              @click.stop="getCoupon(item)"
            >
              <span>{{ item.statusInfo.text }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { getUrlQuery, handleToken } from '@/utils'
  import { receiveCoupon } from '@/apix/coupon'
  import { trackActivityClick } from '@/utils/tracker'
  import config from './CouponView.js'
  import { jumpById } from '@/utils'
  import qs from 'qs'
  import recommend from '@/mixins/recommend'

  const GetStatus = (status, layout) => {
    const maps = {
      pending: {
        text: '未开始',
        class: 'pending',
      },
      valid: {
        text: layout !== '3' ? '立即领取' : '领券',
        class: 'valid',
      },
      owned: {
        text: '已领取',
        class: 'owned',
      },
      blank: {
        text: '已抢光',
        class: 'blank',
      },
    }
    return {
      text: maps[status].text,
      class: maps[status].class,
    }
  }

  const GetDefaultBg = (defaults, key, layout) => {
    const list = [
      'https://lego-activity.weilaijishi.cn/resource/365d70a0-0f38-11ea-94c7-3d11cc378a78.png', // lg
      'https://lego-activity.weilaijishi.cn/resource/35d97390-0f38-11ea-94c7-3d11cc378a78.png', // md
      'https://lego-activity.weilaijishi.cn/resource/35d1d270-0f38-11ea-8457-25cc960d1283.png',  // xs
    ]

    if (list.includes(defaults[key])) {
      defaults[key] = list[layout - 1]
    }
    return defaults[key]
  }

  export default {
    name: 'Coupon',
    module: '卡券',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/9ce29490-170d-11ea-ae56-b5039842b49f.png',
    mixins: [recommend],
    props: config,
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        loading: false,
        list: [],
      }
    },
    computed: {
      items() {
        return this.recommendId ? (this.pre ? this.dynamicChildList : this.list) : this.childList
      },
      // todo: 判断来源
      formatList() {
        // list长度不可大于布局一排数量
        const list = this.items.slice(0, this.count)

        return list.map(({ model = {}, mid, show, id }) => {
          const status = model.status
          const self = model.selfStyle[status] || {}
          const defaults = this.defaultStyle[status] || {}
          const style = {}

          for (const key in self) {
            if (self.hasOwnProperty(key)) {
              if (key === 'background') {
                console.log(self[key])
                const bg = self[key] || GetDefaultBg(defaults, key, +this.layout)
                if (typeof bg === 'string') {
                  style[key] = bg.startsWith('http')
                    ? {
                      backgroundImage: `url(${bg})`,
                    } : {
                      background: bg,
                    }
                } else {
                  style[key] = {}
                }
              } else {
                style[key] = self[key] || defaults[key]
              }
            }
          }
          return {
            ...model,
            id,
            mid,
            show,
            couponUseRemarkType: model.couponUseRemarkType || this.couponUseRemarkType,
            couponType: model.couponType || this.couponType,
            style,
            statusInfo: GetStatus(status, this.layout),
          }
        })
      },
    },
    mounted() {
      this.recommendId && !this.pre && this.getData()
    },
    methods: {
      async getData() {
        const { list, context: { currentTime } } = await this.getDynamicCouponList(this.recommendId)
        this.list = list
      },
      getTab(type) {
        return ['', '满减券', '立减券', '折扣券', '随机券'][parseInt(type || this.couponType)]
      },
      jumpDetail(item) {
        const id = item.jumpLink ? 'jump' : item.shopId ? 'seller' : item.productUrl ? 'product' : ''
        if (id === 'jump') {
          if (this.pre) {
            window.open(item.jumpLink)
          } else {
            window.location.href = item.jumpLink
          }
        } else if (id === 'product') {
          const search = item.productUrl.split('?')
          const params = qs.parse(search[search.length - 1])
          jumpById(id, params)
        } else if (id === 'seller') {
          jumpById(id, {
            id: item.shopId,
          })
        }
      },
      async getCoupon(coupon) {
        if (coupon.status !== 'valid' || this.loading) {
          return
        }
        if (this.pre) {
          this.$toast('优惠券已放到您的卡包\n快去使用吧～')
        } else {
          const checkToken = await handleToken()
          if (!checkToken) return
          this.$showLoading()

          if (coupon.recommendId) {
            // 動態卡券，跳轉至詳情頁
            window.location.href = coupon.detailUrl
          } else {
            this.loading = true
            const query = getUrlQuery()
            const platform = parseInt(query.platform || `0`, 10)
            try {
              const res = await receiveCoupon({
                couponId: coupon.couponId,
              })
              this.$hideLoading()
              this.loading = false
              const { errorCode, errorMsg, success } = res
              this.$toast('优惠券已放到您的卡包\n快去使用吧～')
              trackActivityClick({
                content: coupon.couponName,
                contentId: coupon.couponId,
                relationData: 'success',
              })
            } catch (e) {
              this.$toast(e)
              this.$hideLoading()
              this.loading = false
              trackActivityClick({
                content: coupon.couponName,
                contentId: coupon.couponId,
                relationData: 'failure',
              })
            }
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin';

  .m-coupon {
    padding: 10px;

    .placeholder {
      width: 80%;
      margin: auto;
      border: 1px solid #333;
    }

    // 通用
    .c-card-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow: hidden;
      margin-top: -5px;

      .c-card {
        flex-shrink: 0;
        flex-grow: 0;
        position: relative;
        color: #fff;
        text-align: left;
        border-radius: 4px;
        box-sizing: border-box;
        overflow: hidden;
        user-select: none;
        cursor: pointer;
        margin-top: 5px;

        p {
          margin: 0;
        }

        .image {
          background-color: #e5e5e5;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 4px;
        }

        .content {
          position: relative;
          width: 100%;
          background-size: 100% 100%;
          background-position: center;

          &-btn {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: #202020;
            font-weight: 500;
            // 已抢光权重最高
            &#coupon_btn.blank {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              border-radius: 4px;

              span {
                font-size: 16px;
                transform: scale(1);
              }
            }
          }

          &-text {
            .price {
              position: relative;
              padding-left: 14px;
              box-sizing: border-box;

              &::before {
                content: '¥';
                display: block;
                position: absolute;
                left: 0;
                font-size: 16px;
                line-height: 1;
              }
            }

            .discount {
              padding-left: 0 !important;

              &::before {
                content: '折';
                left: 14px;
                font-size: 14px;
              }
            }

            .tab {
              padding: 0 2px;
              height: 14px;
              font-size: 10px;
              line-height: 14px;
              text-align: center;
              background: #ffeb86;
              border-radius: 2px;
              color: #202020;
              position: absolute;
              bottom: 5px;

              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }

      // 布局 一排一
      &.layout-1 {
        .c-card {
          width: 355px;

          .content {
            &-btn {
              width: 98px;
              height: 46px;
              top: 16px;
              right: 10px;
              font-size: 16px;
              border-radius: 33px;
            }

            &-text {
              .desc {
                @include cut(70%);
                font-size: 12px;
                height: 17px;
                line-height: 17px;
              }

              .price {
                @include cut(70%);
                font-size: 32px;
                line-height: 37px;

                &::before {
                  top: 16px;
                }
              }

              .discount {
                &::before {
                  top: 18px;
                  left: 22px;
                }
              }
            }
          }
        }
      }

      // 布局 一排二
      &.layout-2 {
        .c-card {
          width: 175px;

          .content {
            &-btn {
              width: 68px;
              height: 27px;
              top: 5px;
              right: 5px;
              font-size: 12px;
              border-radius: 15px;
            }

            &-text {
              .desc {
                @include cut(90%);
                height: 14px;
                line-height: 14px;
                font-size: 10px;
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(0.833333333333334);
              }

              .price {
                @include cut(50%);
                font-size: 21px;
                line-height: 1;
                margin-bottom: 3px;

                &::before {
                  top: 4px;
                }
              }

              .discount {
                &::before {
                  top: 7px;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      // 布局 一排三
      &.layout-3 {
        .c-card {
          width: 115px;

          .content {
            &-btn {
              width: 40px;
              height: 20px;
              top: 6px;
              right: 10px;
              border-radius: 15px;

              span {
                font-size: 12px;
                transform: scale(0.833333333333334);
              }
            }

            &-text {
              .desc {
                @include cut(90%);
                font-size: 10px;
                height: 14px;
                line-height: 14px;
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(0.833333333333334);
              }

              .price {
                @include cut(50%);
                padding-left: 12px;
                font-size: 21px;
                line-height: 21px;
                margin-bottom: 2px;

                &::before {
                  top: 6px;
                }
              }

              .discount {
                &::before {
                  top: 8px;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      // 普通券
      &.type-1 {
        .image {
          display: none;
        }

        .c-card {
          .content {
            height: 100%;
          }
        }

        &.layout-1 .c-card {
          height: 80px;

          .content {
            padding: 5px 0 0 10px;
          }
        }

        &.layout-2 .c-card {
          height: 70px;

          .content {
            padding: 8px 0 0 10px;

            &-text {
              .desc {
                height: auto;
                line-height: 17px;
              }
            }
          }
        }

        &.layout-3 .c-card {
          height: 60px;

          .content {
            padding: 5px 0 0 5px;
          }
        }
      }

      // 商品券
      &.type-2 {
        &.layout-2,
        &.layout-3 {
          .image {
            border-radius: 4px 4px 20px 20px;
          }
        }

        &.layout-1 .c-card {
          height: 80px;

          .image {
            width: 70px;
            height: 70px;
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 10;
          }

          .content {
            height: 100%;
            padding: 5px 0 0 85px;
          }
        }

        &.layout-2 .c-card {
          height: 203px;
          padding-top: 140px;

          .image {
            width: 175px;
            height: 175px;
            max-width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 0;
          }

          .content {
            height: 63px;
            padding: 7px 0 0 10px;
          }
        }

        &.layout-3 .c-card {
          height: 149px;
          padding-top: 90px;

          .image {
            height: 115px;
            width: 115px;
            max-width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 0;
          }

          .content {
            height: 60px;
            padding: 5px 0 0 5px;
          }
        }
      }

      // 店铺券
      &.type-3 {
        .shop-info {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100%;
          padding-right: 15px;
          padding-left: 5px;

          .shop-logo {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;

            &.big {
              width: 56px;
              height: 56px;
            }
          }

          .shop-name {
            font-size: 14px;
            line-height: 18px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
            text-align: center;
            @include cut(100%);
          }
        }

        &.layout-1 .c-card {
          height: 70px;

          .image {
            width: 187px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
          }

          .content {
            width: 175px;
            height: 100%;
            margin-left: 177px;
            padding: 8px 0 0 10px;

            &-btn {
              width: 68px;
              height: 27px;
              top: 5px;
              right: 5px;
              font-size: 12px;
              border-radius: 15px;
            }

            &-text {
              .desc {
                @include cut(90%);
                line-height: 17px;
                font-size: 10px;
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(0.833333333333334);
              }

              .price {
                @include cut(50%);
                font-size: 21px;
                line-height: 1;
                margin-bottom: 3px;

                &::before {
                  top: 4px;
                }
              }

              .discount {
                &::before {
                  top: 6.2px;
                  left: 16px;
                }
              }
            }
          }
        }

        &.layout-2 .c-card {
          height: 133px;
          padding-top: 70px;

          .image {
            width: 175px;
            height: 80px;
            max-width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 0;

            .shop-info {
              height: 70px;
              padding-right: 5px;
            }
          }

          .content {
            height: 63px;
            padding: 7px 0 0 10px;
          }
        }

        &.layout-3 .c-card {
          height: 107px;
          padding-top: 48px;

          .image {
            height: 58px;
            width: 115px;
            max-width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 0;

            .shop-info {
              padding-left: 2px;
              padding-right: 2px;
              height: 48px;

              .shop-logo {
                width: 24px;
                height: 24px;

                &.big {
                  width: 32px;
                  height: 32px;
                }
              }

              .shop-name {
                font-size: 10px;
                line-height: 14px;
              }
            }
          }

          .content {
            height: 60px;
            padding: 5px 0 0 5px;
          }
        }
      }
    }
  }
</style>