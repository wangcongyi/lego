<template>
  <div :class="`m-product-cell ${size}`" @click="goDetail">
    <div class="avatar">
      <img class="img" alt v-lazy="avatar" v-if="avatar" />
      <div class="corner" v-if="corner">
        <img class="img" :src="corner" alt />
      </div>
      <template v-if="tips">
        <img
          v-if="tips.indexOf('//') !== -1"
          class="tips-img"
          :src="tips"
          alt
          :style="{height: tipsSizeParse}"
        />
        <div
          v-else
          class="tips"
          :style="{
            background: tipsColor,
            height: tipsSizeParse,
            lineHeight: tipsSizeParse
          }"
        >{{ tips }}
        </div>
      </template>
    </div>
    <div class="content">
      <div
        :class="[`maintitle`, { parallel: titleLayout === 2 }]"
        :style="{
          fontSize: titleFontSizeParse[0],
          lineHeight: titleFontSizeParse[1],
          height: titleFontSizeParse[2],
          marginBottom:'5px'
        }"
      >
        <span class="prefix-icon" v-if="prefixIcon">
          <img
            class="img"
            :src="prefixIcon"
            alt
            :style="{
              maxHeight: prefixIconSizeParse[0],
              marginTop: prefixIconSizeParse[1]
            }"
          />
        </span>
        <img v-if="(channel === '1' && subChannelCode === '0' || channel === '10')"
             style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADtUlEQVRIS8WWa4hVVRTHf/87aimE9sA0IpRiiPJDURTNh94fehg447mXBnuBUDZoGflozKK6lQ1mEDKUJb2oiHOOFg1UUkZZlr0GicKQ3gUFRmVPk7l3xd5338uZO+c2QTO2P9xzz9l7r/9a//Vfey8RhhU5F1gOnAFMrX//j8+fgR3AWiW86mzJ/VjESmANqr2P+TAM6FVKn3xkxivjBtagEEOc7wBfBC4Y86jyDb7kAB3PY5Wz0fze6wAdv82jCt6RwzITXwDfAh1A22iWW83nAe6ijYv0DF9akdPAUz4NOEsJb1on05nIUozeYLQCfAV8A/wGTAZmAbProsyCjwQUlyvmyUy5rMGYopTrG99K9Pk0VHieAtuVsLc5IutiJm3cACwBDq7P5wEuV8y9DeMRq/mL+zTAHxknHKWTKDALYwbGTIzD/XyBz5zqlbDfl1yJczBerqchj9JfgVXAB169YqtitvnNrm67mK3NfG4lFmHc74FHDlfsLgU10CKbgU73Pw/wOeA4YA5ig2IWhU1OQA9RYYUHLDIDeB1ozxWIcZlSnvJ7I1Ygn4YRgFvYw1zaET+xFjgT6Aa+B7YiblfMQHDgGPCgecPlfYdSbg5rFwIb8wDfA65V4ul0nt2FvFjewBh0BmwexzKRuUo8nX5YRBFxaAb5GuAdJfRk5uNWlFZCJGVzEiiyE/P03gI++S4fU5VwSEZEHwMnDAtVrFfMdQGwC7GpFWBtn7haMQ9biVUYCzGuyhisKOWtBuB8Tgz1V/tUoC8w4m4fJ5oISP4ZEF5QwsUWsRRxG8aWDOA+pVyZiXAdxtGZ+Q7E40pYHSK8wr2PFuFixfRbkRSYjrEhGLwUcXYOpb9g3IiYg/Ggc1IJd4QIFwPrWwOKdYpZZkWcEj9FlBVTDt66iMtNgB8BPwDnKaFiEU8jPlTCPX5PiTJWi7a5Dn/HWKKUR8PCfowexK0NwHlMYxI9irm7QeklTBl2EkX+OENpLSqLeAzVUpAFHGSIbj3Lbr+omyMY4usghkH2cLpeY2iYEmuCmIxxodczvMs+NnIQA1RZpk28Hyh1z1OaAXdTZUFmkSvaOzMAOxFPUOU7X3Py56i7qk4F/gQm+CtNbMfYpoQHPFgn7Uxgl9duDqX7ETdh9APu/juqOaIW7x1KeHtE9PM5mQKPACfV51pdwJ8Ax/9LMLfMpeFH8JS7RszdiUcGh4c1Zv9Li3HAm6gD2yaGeltJdZwb4QK9iulrJHScWn3X6zj1Nlr9vwHOXGrMrMzovAAAAABJRU5ErkJggg==">
        <img v-if="(channel === '1' && subChannelCode === '1' || channel === '11')"
             style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACrElEQVRIS+2WX2jNYRjHP8/5bQ3ThP3Ln5lhtJVSixg7tUxKRMqfCyW5khRuWGRhyoULLa4sN4oUSiS1aWObViQX829YJmGHlT+zzc77e/XsvCda5xxnW1ztV6fz9j7P8/28z/M+v9/7CsAAmUEhUC0ESiw2TedG+wjS7+M/TMGvFD41iiWrzEfqLJI6WvFY8YIdCOBXyADZTYKU/gvIb03bIobcvvjlmoi3thRSvcTrCPuY603A95h+gvwUQ45vQWJ5eCcq4eCe5JI9WYM5UB3XNzFoXhHs3Qaey2jLesjIiIh9/QaXrkXGxsDpC5jnbSMDDY3yXrVCwazIdEcnpmBxctkCCTMaAyWq41jp/lPXNVyF4LLIVty9jwluGE57Z4dBXgNTLUxJFBkoXoicrdK3ArurCr/tcUKQQDfw2SJzxDJptvClw0LAkLtR8M9YJCvppcZ0tF0Q2O3x4YqAb8kriH7jZhKh91iy5hqkGSR7ZDDb5WFLhdBLIJ1Ild4qaB9wCggBW4F6y7QKg7k9WKPhPdaDVcLHOmAlcFG3BNivQprJZKfXAywC2g05tRZ2DIcjBGo93u8ECoFHwAQX360gO0SsGSizZKYbApdBVicHk1seZpMQ6gXuAUv/jIsFUvtR4IgO+sgsTCM13xBOiQX0SAlDuEMItTv7MeDQUN94IPU7BxwH3iSXEfnAYeKUW0E/gPFOrAu4CQSBVqAY0FNP58NxgJppjrPrybcEaATWANHO7VVQgxN+BiwH9NhcAbxzm6qds+4vWd0ANgMvgOmA7rPG6P8C/Y4oSG9Ad7QBgE4HiLa1ZvbUzY8DngB6idAGqgGKgH4gD5ivgm5Bap/hftoY5VHBEuCBg+p1Jvpoe58HdE4XpO9GvTOWu3GLs213vtFYrYrGDWr/AgBj9qPV7z1AAAAAAElFTkSuQmCC">
        <img v-if="channel === '2'" style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAqFBMVEX1NBX2NBX4NhT1MxQAAAD1NBX////+8O7++/r8y8P6pZf1Ohz+9fT3aFH1OBn96eb94d392dP6q575kYD4iHX4dmH3bFb2XET2TDH1Rin1PiH+/fz97On95eL81M38z8f8xr75lob3Y0v1QiX+6+j93dj80Mn7ua77s6j6r6P5mov5jXz4gW74e2f++Pf+8vD95+P7vbP6oJL6m4z3c133YUr2VDr2SS6BX0EUAAAABXRSTlPxrSbuAPQDWrQAAAEZSURBVDjLnZPXcoMwEEUF9sog0Xsz1b2kl///syigYJwYMfF5EnvPMGKXRXNZQjACkuQ5kmcgYCYjCYRICIkFngu4T6BNHEX0tpD4TrHCjKVzDuPfguGXCu7QEva8C68E6poseSBaazyVZYZ3Q0E328CKbNyz5UKoeoaX4r84XHhmd8IcxRoIfidQjdV7IVD7fEE74czOpK9qp+OiOy0D/pnft6oHb1b9wDtUp1rnjdJZLW0+VviCslbVteJxYc8qB4CowNcQ4IKL87e2j+7jIE6ryywocOLX7CfP329P09DJxsxspxaMW69cIvofEpM1aFyI4QULhSNRxALklqbuBUKwSRbh57hgbBuwAYp/LAaaXL3J5Z1c/y8YcB94G90dQAAAAABJRU5ErkJggg==">
        <img v-if="channel === '3'" style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA0lBMVEX0AAj1AAn4AAf0AAkAAAD0AAn////0BAz5gYX1DRb7n6L7l5r7lZj6k5f6kZX5cXb0CBH+8/T91Nb5fID/+vr+5OX+3N38xMb7m5/4Y2n3PEP/9vf+8fL+4OH92dv90NL9y8z9yMr8sbT7p6r5eH35bHL3Nz71HCT+7+/8uLr7ra/7mp34W2H3Q0n2MDj+6+v8vL77qaz6jJD5f4P3SlD2KDD1Iir+7e38v8H7trj7pKf4dnv3VFr3UFf2TlP1FB3+6On+5uf5iY36hor5aW/2RkxrNQV1AAAABXRSTlPxrSbuAPQDWrQAAAHlSURBVDjLhdPXduIwEAZgQzIjF9y7jXHH9N5r2r7/K60wkI3P2cDczdF38Y+kYV7rNQZ+KaZWf2XqL/CgXupMDR5WjWEeg2fnAN/g4B7hX53kRRVwPLLocHDrHBRQVH6AtoUUoNW+dpqKgm9PRndAWKMxQHbnec6cXLoRbAT1qBsZuYIUUV4ZbAughZtzhDgvxoIIEGJaAqL3/LOSsCbHmdoIPAs7KQq2UnR6n6QEmOhN45IBZ0sYwqKPSEM2O3oXbwDNXKMg8Lio3T1Y3jCgIJTf8A668tuMn/McDP1wPVYFOnVDaJiZfwOqAi5OLmMXrXbrs8kBAGf7HCz1K+gsi1xj3RPA3ndjXaXjHGQ9nI40654B0x7NICpkS8yzCkofJdzxxneGtRSUNxn+2UIf+GVkoqQG8cf6BuIU0c7Zbns0dQHAVZMBSnYujx27BNBDNL52bA7whSx8IA5BEwUAB6dQAo4Phn2NdRaLPp/p+ykmLooOIXbK3V9z0CwzNOUtTZfs31vYoN3gx39YRRTEcvBOgWbJEQXxqvKjyGze4GOOiFLHy5EXJZZABVCSYMhnXTGCFWKvPK4CUARsTFC0PDqkAhVwr6OJl3TjE8D/ARQbCibFg8Ug2SyrrsXT1Xu6vE/X/y9XkjcaCxavxQAAAABJRU5ErkJggg==">
        <img v-if="channel === '4'" style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACzklEQVRIS72WTUhUURiGn2tT9qONk6WOf+VPiSZFkqVQi6gWCWYUVBORVrioFtEqkmhRWGCgoGhuDKMWLTIQUlEs1FATtUgi8qc2iWkmgzaiqTlxPDeuzozNTI5zN/dyOOd77vd+7znnUwCs3N0GM/eAQ8B6MebBZwyoB90NhZweRYW9AQwehDgKZQZdimLldgVwfJlhf8M/F8DRZZBxsf8fE0DrkrNL2Agff7gUxn2g0Q/aLkD7AJx4BlF66L4CV2vhQadTqPvA8qOQuRPSn8KLXtD5QEsWJAZBdBEMjv8Tag/0WwXxgfaL3g3B9k3wNhsGLZD6EGbVakQb4GQC5LVoYyLC0DhMzy6IZQ/cHwFNWfbA4Hx4cgwORzuVbW7CzCxEFUL/TxeBNX1Q2Q0ZcXAkFjIr4VGGXPy4C8rfy28FKEuHDWtgT5kW3DwpM7R5Fs8w9zXcbIDcA5CzD0YnQb9aLr/TBLcatVAvz0KSEQz3nWbvOlCE6h2BrYH2wGoTpIZ7GNgzAtfqoMoEpZ1Q3K5lU5oGO4IhRTWSjwLfLCBkdS5pJDRlgq2kpyuk5RvOOZVtbkLHACTPq6m6ynVJheM2B0hgaQfkt8kQKxSoPAUxBogrkdtCZGiZWqJpwgpk/QTwej3ktWqZ1p6Bg1Ggy3WavesZilMkUu8YWGOS+9OjwPgSCPaTQHHSDM/bY1sCQJxQzV81ST8Mw6VqV0yjnjS2pkkogSAV2NYPVX1a8Mu7IWgd5LyCtStB7wtfzFA4z8lumyauGIz+jiVtvwi7QjwsaUwRRCxSw9bzkBy6ROD4lLS2qM2v3xBaACnhjjNszoK9Yf8JDPcHU6JWbAGr+wyfRiApBDqzYWIaJme0Of6+8l40T4CiyL0p3sZ8sEwvMI57F7C4GdJipTHEBhfXodVq862O9Y9B13eHLvV6E+XtNnGu6/ZeIyxE9mar/wey+V3CMsW66AAAAABJRU5ErkJggg==">
        <img v-if="channel === '5'" style="width: 13px;height: 13px;vertical-align: -1px"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACZUlEQVRIS72WXUhUQRTHf7OrfRBtBFuRJuVLImk9xNYma1EYhEJEVFAWSD30EhT0YVZvfUmBEOhrWe0aFO5TFoQVupKVBJHKVm9rH0gI4S2yWN2JYdbcde/KtG17X+7lzJnzm3vmf86MAJDN7pUIx2UQVYBL2bLwWCA7kbEGcWTkvdAQ53NgYRaC24X4ipzwCtmyuB3Ezv8EiYeVQSFblowap6tgA2y5Bgh4chQ+PzNdn6VA0si70AfVtyF/rnYfH4OOA/Cpx2h6GpCA0n3gXqVXLxxQsmcKMhlawd7eBRlTkoKRQQi36e9pjz1IQTY3Ga00xenpcQgHDEGVF6H8UGag/usQOmMKugTlBzME3YBQgyFoYyOU1WUGGrgJ3fUGoOnqUlNiE1oQQiQHkFILweGcskfH4EGqGpPFoOqkpi1VXcHtsMwHnpPwbUgrcX4RvGiE4T7YEUxegIJ11CbVWTJofx+4ilJT9rEHnLOg9wIMv9TjS73gPQuxKBRWpM6xhsC/7o/dDKTcHx2GyGPImxMv2J9QvA2qmu330voAfk8aUEEF1ASSU/fLgoFWeNUEm65CyW49+d096KqHtce0cGYnNH1VyPdnSp0KkCgGtdHt1fDltQ7uyAOPUpSEvisQG9f2RWtg10MtmDStyb4zTMp7NAKB9WYyr+2FBcUweAu6ThnIW7lUxgs2+gNaV0P0+8yw/HlQ9wbUW6W5+7QpKKEFRTohdA6siD3MtRx852HFVj3e/zed4Z+a6gkI+w3/SBVk6V5wl2VwTNxRrcQUZJOlLBx8uTrKc3U5ydV1S+1GLi6QvwEYsAyenUZUpQAAAABJRU5ErkJggg==">
        <span class="tt" :style="{color: titleColor}">{{ title }}</span>
      </div>
      <div
        v-if="subtitle"
        class="subtitle"
        :style="{
          fontSize: subtitleFontSizeParse[0],
          lineHeight: subtitleFontSizeParse[1],
          color: subtitleColor
        }"
      >{{ subtitle }}
      </div>

      <!--      <div class="discount" v-if="discountIcon">-->
      <!--        <img class="img" :src="discountIcon" alt v-if="discountIcon.indexOf('//') !== -1" />-->
      <!--        <span v-else class="discountText">{{ discountIcon }}</span>-->
      <!--      </div>-->
      <div class="countInfo">
        <div class="discount" v-if="couponAmount*1>0">
          <i />
          <div>{{couponAmount*1}}元</div>
        </div>
        <div v-else style="height: 20px"></div>
        <div
          v-if="isHighCommission"
          class="commission"
        >{{ commissionString }}{{ commission | parsePrice }}
        </div>
      </div>

      <div class="originPrice" v-if="showOriginPriceSingle">￥{{ originPrice | parsePrice }}</div>
      <div class="salePrice" v-if="salePricePrefix || salePrice">
        <img class="img" :src="salePricePrefix" alt v-if="salePricePrefix.indexOf('//') !== -1" />
        <span v-else class="prefix">{{ salePricePrefix }}</span>
        <em v-if="couponAmount*1>0">券后</em>
        <span>
          <span class="parsePrice">￥</span>{{ salePrice | parsePrice }}
          <span class="originPrice" v-if="showOriginPriceParallel">￥{{ originPrice | parsePrice }}</span>
        </span>
      </div>
      <!-- <div class="price" v-if="price">{{ price | parsePrice }}</div> -->
      <!--      <template v-if="isFight">-->
      <!--        <div class="fightProgress" v-if="!notSmXs && limitTuanCount">-->
      <!--          <div class="fightProgressInner" :style="{ width: fightProgressWidth }" />-->
      <!--          <span class="fightProgressCount">已开团数:{{ pintuanSuccessCount }}</span>-->
      <!--        </div>-->
      <!--        <div class="fight">-->
      <!--          <div class="fightCount">-->
      <!--            <div class="fightProgress" v-if="notSmXs && limitTuanCount">-->
      <!--              <div class="fightProgressInner" :style="{ width: fightProgressWidth }" />-->
      <!--              <span class="fightProgressCount">已开团数:{{ pintuanSuccessCount }}</span>-->
      <!--            </div>-->
      <!--            <span>已拼{{ sales | parseSales }}件</span>-->
      <!--          </div>-->
      <!--          <div class="heads" v-if="headList.length">-->
      <!--            <template v-for="(item, index) in headList.slice(0, headListSliceCount)">-->
      <!--              <img class="img" :key="index" :src="item" alt />-->
      <!--            </template>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
      <div class="footer">
        <div class="btn" :style="{background: btnColor}" v-if="btnText">{{ btnText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from './ProductItem.js'
  import { jumpById, px2vw, thumbnail } from '@/utils'
  import qs from 'qs'

  export default {
    name: 'ProductItem',
    filters: {
      parsePrice: value => `${value || '0.00'}`,
      parseSales: value => value < 100000 ? value : '10万+',
    },
    props: config,
    computed: {
      avatar: (that = this) => thumbnail(that.masterImg, 300),
      prefixIconSizeParse: (that = this) => {
        const height = that.prefixIconSize
        const top = (that.prefixIconSize - 19) * -0.5
        return px2vw([height, top])
      },
      title: (that = this) => that.switchTitleSubtitle ? that.subTitle : that.name,
      channel: (that = this) => that.channelCode,
      titleFontSizeParse: (that = this) => {
        const fontSize = that.titleFontSize
        const lineHeight = fontSize + 6
        const count = that.titleLayout
        return px2vw([fontSize, lineHeight, lineHeight * count])
      },
      subtitle: (that = this) => that.switchTitleSubtitle ? that.name : that.subTitle,
      subtitleFontSizeParse: (that = this) => {
        const fontSize = that.subtitleFontSize
        const lineHeight = fontSize + 6
        return px2vw([fontSize, lineHeight])
      },
      tipsSizeParse: (that = this) => {
        return px2vw(that.tipsSize)
      },
      // originPrice: (that = this) => that.marketPrice <= that.salePrice ? 0 : that.marketPrice,
      originPrice: (that = this) => that.marketPrice,
      salePrice: (that = this) => that.actPrice,
      // salePrice: (that = this) => that.seckillPrice || that.actPrice || that.price,

      notSmXs: (that = this) => that.size !== 'sm' && that.size !== 'xs',
      showOriginPriceSingle: (that = this) => that.priceLayout === 1 && that.originPrice,
      showOriginPriceParallel: (that = this) => that.priceLayout === 2 && that.originPrice,
      commissionString: () => '返 ￥',
      headListSliceCount() {
        // 无限制拼团
        if (this.limitTuanCount === 0) {
          switch (this.size) {
            case 'lg':
              return 5
            case 'md':
            case 'sm':
              return 4
            case 'xs':
              return 3
            default:
              return 3
          }
        } else {
          switch (this.size) {
            case 'lg':
            case 'md':
            case 'xs':
              return 3
            case 'sm':
              return 4
            default:
              return 3
          }
        }
      },
      fightProgressWidth() {
        return `${(this.pintuanSuccessCount / this.limitTuanCount).toFixed(2) * 100}%`
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
      }
    },
    methods: {
      goDetail() {
        const search = this.h5Url.split('?')
        const params = {
          productId: this.productId,
          ...qs.parse(search[search.length - 1]),
        }
        jumpById('product', params)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin';

  .m-product-cell {
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    z-index: 1;

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tips {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 8px 0px 0px 0px;

      color: #fff;
      font-size: 12px;
      padding: 0 5px;
      font-weight: 400;
      height: 25px;
      line-height: 25px;
      text-align: center;
    }

    .tips-img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: auto;
    }

    .content {
      .salePrice {
        white-space: nowrap;

        > .prefix {
          font-size: 12px;
        }

        > .img {
          max-height: 15px;
          width: auto;
          margin-right: 5px;
        }
      }

      .originPrice {
        font-size: 12px;
        color: #bcbcbc;
        line-height: 16px;
        text-decoration: line-through;
      }

      .maintitle {
        .prefix-icon {
          > .img {
            margin-top: 2.5px;
            max-height: 14px;
            width: auto;
          }
        }
      }

      .countInfo {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 120%;
        margin-bottom: 10px;
      }

      .discount {
        display: flex;
        align-items: center;
        justify-content: start;
        margin-right: 6px;

        i {
          width: 16px;
          height: 16px;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABF1BMVEUAAAD/IgD/IQD/KAD/IAD/IQD/GAD/IQD/IAD/IQD/IQD/JAD/HwD/IgD/IgD/IAD/HgD/HgD/JAD/GgD/AAD/IgD/////WTX/MQD/Tyn/VC//USz/GQD/VjL/TCb/EwD/SSP/OQz/RiD/XDj/HgD/DAD/LAD/4tz/iXP/6OT/5N//Pxj/PBP/Ngb/7uv/Qhz/JwD/IwD/+fj//fz/6+f/9vX/hG7/r6H/Z0//XDf/ORD/KQD/19D/emT/alH/3tn/zcT/vLL/rJ3/mYr/jXv/fmj/dl3/YUX/WT7/QhH/BgD/+vn/29b/wrj/tqv/qJr/loP/gWr/XET/UTL/RRn/NBD/8e//0Mf/pJb/o5X/oY//cFr/QiRmLB48AAAAFHRSTlMA2vImreES6dKK+e7ul4dwbl1PHOswbEUAAAGkSURBVDjLldPpUuJAFIbhHjZ19iWcoMMwMZJIgvSYhCwQNtnBfZtN7/86PM3pVElprPKpojt8vEXxB8ayuUzxWW+/MfahyLLvFmqr1drbw9e6xebnrXyB5RZqmpvMxwJjmZ0f61Q1edp+w1BxJ5UMvqeqULCdSqOgQmYTPC7+zyuVaVdOOgUa6btXmsa9a0078VWabijQySWc6TPo6PoYzuVUp+CXEAVBcxCEMAiCU78WRKvxgIK6EMKacDXK4EDo1dAQ+jXSW427FLTbu9IfmLTpHWlQ0EDDfWQD7CeGYi1RUEKhZVk+uBbicIxnKNYkIFPfvRN3o+NdysmkwDTjODYvPK9rrmg2/G3QIwWHaNoHz7Ulfgx2NxYzBY7j3Ptw1Gs2XWii3zD+51l1B1FQRZMIj5jbVVSDbnU2rwoUlBNjGIlrBL1koeCnFLm8JO4zuE4mCgxjuTQMZ+S5kYFuuVs2JAoUYc6BXynlk04Hf68iLR8FxuD8EK9Tzq2jWyUhgydeGWSUdPksBjklVTm/scVY9n3q519YYfPrC3//Dfz+T84Dp4B2LTolm9oAAAAASUVORK5CYII=") no-repeat;
          background-size: contain;
        }

        div {
          border: 1px solid #f34016;
          border-left: 0;
          color: #f34016;
          font-size: 12px;
          height: 20px;
          padding: 0 5px;
          margin-left: -5px;
          border-radius: 2px;
          transform: scale(0.8);
        }

      }

      /*.discount {*/
      /*  margin: 4px 0 5px;*/
      /*  line-height: 16px;*/

      /*  > .img {*/
      /*    max-height: 16px;*/
      /*    width: auto;*/
      /*  }*/

      /*  > .discountText {*/
      /*    height: 16px;*/
      /*    line-height: 16px;*/
      /*    background: #fff;*/
      /*    border-radius: 2px;*/
      /*    border: 1px solid #ff354d;*/

      /*    padding: 0 3px;*/
      /*    font-size: 12px;*/
      /*    color: #ff354d;*/
      /*  }*/
      /*}*/

      .footer {
        display: flex;
        align-items: center;

        .btn {
          flex: 1;
        }

      }

      .commission {
        height: 16px;
        background: #fff1d2;
        border-radius: 2px;
        color: #ac7915;
        line-height: 10px;
        font-size: 12px;
        padding: 3px 5px;
      }

      .fightProgress {
        position: relative;
        height: 12px;
        width: 100%;
        background: rgba(218, 81, 81, 0);
        border-radius: 6px;
        border: 1px solid rgba(255, 190, 197, 1);
        overflow: hidden;

        font-size: 10px;
        color: rgba(255, 53, 77, 1);
        line-height: 12px;
        padding-left: 5px;

        margin-top: 5px;

        display: flex;
        align-items: center;

        .fightProgressCount {
          position: relative;
        }

        .fightProgressInner {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: rgba(255, 190, 197, 1);
        }
      }

      .fight {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 25px;

        margin-top: 5px;

        .fightCount {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          line-height: 17px;

          > .fightProgress {
            margin-top: 0;
          }
        }

        .heads {
          margin-right: -1.5px;

          .img {
            width: 25px;
            height: 25px;
            border: 1.5px solid #fff;
            object-fit: cover;
            margin-right: -13px;
            border-radius: 50%;

            &:last-child {
              margin-right: 0 !important;
            }
          }
        }
      }
    }

    &.lg {
      position: relative;
      width: 355px;
      height: 175px;
      display: flex;
      justify-content: space-between;

      .avatar {
        position: relative;
        width: 175px;
        height: 175px;
        flex: 0 0 175px;
      }

      .corner {
        position: absolute;
        top: 0;
        left: 10px;
        width: 40px;
      }

      .content {
        position: relative;
        font-size: 14px;
        line-height: 20px;
        background: #fff;
        text-align: left;
        padding: 5px 10px 10px;
        width: 100%;

        .maintitle {
          font-weight: 500;
          color: #000;
          @include cutCount(100%, 1);

          &.parallel {
            @include cutCount(100%, 2);
          }

          // .prefix-icon {
          // }
          // .tt {
          // }
        }

        .subtitle {
          color: #8c8c8c;
          margin-top: 5px;
          @include cutCount(100%, 2);
        }

        .originPrice,
        .salePrice,
        .price,
        .footer,
        .fight {
          position: absolute;
          left: 10px;
        }

        .originPrice {
          top: 90px;
        }

        .parsePrice {
          font-size: 12px;
        }

        .salePrice {
          top: 106px;
          color: #ff354d;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          // > .prefix {
          // }
          // > .img {
          // }
          em {
            font-size: 12px;
            font-style: normal;
          }


          .originPrice {
            position: static;
          }
        }

        .price {
          top: 143px;
          color: #ff354d;
          font-size: 16px;
          font-weight: bold;
        }

        .footer {
          width: 100%;
          left: 0;
          bottom: 10px;
          padding: 0 10px;
        }

        .btn {
          height: 25px;
          background: #ff354d;
          border-radius: 13px;

          font-size: 12px;
          font-weight: 500;
          color: #fff;
          line-height: 25px;
          text-align: center;
        }

        .fight {
          width: 100%;
          left: 0;
          padding: 0 10px;
          bottom: 10px;

          .fightCount {
            > .fightProgress {
              width: 99px;
            }
          }
        }
      }
    }

    &.md {
      position: relative;
      width: 175px;

      .avatar {
        position: relative;
        width: 175px;
        height: 175px;
      }

      .corner {
        position: absolute;
        top: 0;
        left: 10px;
        width: 40px;
      }

      .content {
        position: relative;
        font-size: 14px;
        line-height: 20px;
        background: #fff;
        text-align: left;
        padding: 5px 10px 10px;
        border-radius: 0 0 4px 4px;

        .maintitle {
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          color: #000;
          @include cutCount(100%, 1);

          &.parallel {
            @include cutCount(100%, 2);
          }
        }

        .subtitle {
          display: none;
        }

        // .originPrice {
        // }
        .parsePrice {
          font-size: 12px;
        }

        .salePrice {
          color: #ff354d;
          font-size: 16px;
          font-weight: 600;
          line-height: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          // > .prefix {
          // }
          // > .img {
          // }
          em {
            font-size: 12px;
            font-style: normal;
          }
        }

        .originPrice ~ .price,
        .salePrice ~ .price {
          margin-top: 0;
        }

        .price {
          color: #ff354d;
          font-size: 16px;
          font-weight: bold;
        }

        .footer {
          .btn {
            display: inline-block;
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

          // .commission {
          // }
        }

        .fight {
          margin-top: 5px;

          .fightCount {
            > .fightProgress {
              width: 94px;
            }
          }
        }
      }
    }

    &.sm,
    &.xs {
      .originPrice {
        font-weight: normal;
      }

      .content {
        .fight {
          line-height: 16px;

          .fightCount {
            font-size: 10px;
            line-height: 14px;
          }

          .heads {
            .img {
              width: 16px;
              height: 16px;
              margin-right: -8px;
            }
          }
        }
      }
    }

    &.sm {
      position: relative;
      width: 115px;

      .avatar {
        position: relative;
        width: 115px;
        height: 115px;
      }

      .corner {
        position: absolute;
        top: 0;
        left: 10px;
        width: 30px;
      }

      .content {
        position: relative;
        font-size: 14px;
        line-height: 20px;
        background: #fff;
        text-align: left;
        padding: 5px;
        border-radius: 0 0 4px 4px;

        .maintitle {
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          color: #000;
          @include cutCount(100%, 1);

          &.parallel {
            @include cutCount(100%, 2);
          }
        }

        .subtitle {
          display: none;
        }

        // .originPrice {
        // }
        .parsePrice {
          font-size: 12px;
          transform: scale(0.9);
        }

        .salePrice {
          color: #ff354d;
          font-size: 14px;
          font-weight: bold;
          line-height: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          em {
            font-size: 12px;
            font-style: normal;
            transform: scale(0.9);
          }
        }

        // > .prefix {
        // }
        // > .img {
        // }
        .originPrice ~ .price,
        .salePrice ~ .price {
          margin-top: 0;
        }

        .price {
          margin-top: 5px;
          color: #ff354d;
          font-size: 16px;
          font-weight: bold;
        }

        .footer {
          text-align: center;
        }

        .btn {
          display: inline-block;
          height: 20px;
          background: #ff354d;
          border-radius: 13px;

          font-size: 12px;
          font-weight: 500;
          color: #fff;
          line-height: 20px;
          text-align: center;
        }
      }
    }

    &.xs {
      position: relative;
      width: 100px;

      .avatar {
        position: relative;
        width: 100px;
        height: 100px;
      }

      .corner {
        position: absolute;
        top: 0;
        left: 10px;
        width: 30px;
      }

      .content {
        position: relative;
        background: #fff;
        text-align: left;
        padding: 5px;
        border-radius: 0 0 4px 4px;

        .maintitle {
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          color: #000;
          white-space: normal;
          @include cutCount(100%, 1);

          &.parallel {
            @include cutCount(100%, 2);
          }
        }

        .subtitle {
          display: none;
        }

        .originPrice {
          font-size: 12px;
          line-height: 14px;
        }

        .parsePrice {
          font-size: 12px;
          transform: scale(0.9);
        }

        .salePrice {
          color: #ff354d;
          font-size: 14px;
          line-height: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          // > .prefix {
          // }
          em {
            font-size: 12px;
            font-style: normal;
            transform: scale(0.9);
          }

          > .img {
            max-height: 13px;
            width: auto;
          }
        }

        .originPrice ~ .price,
        .salePrice ~ .price {
          margin-top: 0;
        }

        .price {
          color: #ff354d;
          font-size: 14px;
          font-weight: bold;
          line-height: 16px;
        }

        .footer {
          text-align: center;
        }

        .btn {
          display: inline-block;
          height: 20px;
          background: #ff354d;
          border-radius: 13px;

          font-size: 12px;
          font-weight: 500;
          color: #fff;
          line-height: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
