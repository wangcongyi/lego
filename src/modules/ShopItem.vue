<template>
  <div class="m-shop-item">
    <div class="avatar">
      <img class="img" :src="shopPic | thumbnail(300)" alt />
      <div class="tablet">
        <div class="tt">{{ name }}</div>
      </div>
    </div>
    <div
      class="content"
      :style="{
        fontSize: benefitFontSizeParse,
        color: benefitColor
      }"
    >{{ benefit }}</div>
  </div>
</template>

<script>
import config from './ShopItem.js'
import { px2vw } from '@/utils'
export default {
  name: 'ShopItem',
  props: config,
  computed: {
    benefitFontSizeParse () {
      return px2vw(this.benefitFontSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
  width: 100%;
  object-fit: cover;
}
.m-shop-item {
  width: 115px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  z-index: 1;
  text-align: center;
  .avatar {
    position: relative;
    > .img {
      height: 90px;
    }
    .tablet {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      .tt {
        display: inline-block;
        font-size: 12px;
        font-weight: 500;
        color: #202020;
        line-height: 24px;
        text-align: center;
        padding: 0 5px;

        height: 24px;
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e4e4e4;
      }
    }
  }
  .content {
    padding: 18px 0 5px;
    text-align: center;
    font-size: 12px;
    color: #ff3d2f;
  }
}
</style>