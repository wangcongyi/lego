<template>
  <div class="m-brand-item">
    <div class="avatar">
      <img class="img" :src="brandPic | thumbnail(300)" alt />
    </div>
    <div class="content">
      <div class="logo">
        <img class="img" :src="brandLogo" alt />
      </div>
      <div class="tt">{{ name }}</div>
      <div class="benefit" :style="{fontSize: benefitFontSizeParse,color: benefitColor}">
        {{ benefit }}
      </div>
    </div>
  </div>
</template>

<script>
  import config from './BrandItem.js'
  import { px2vw } from '@/utils'

  export default {
    name: 'BrandItem',
    props: config,
    computed: {
      benefitFontSizeParse() {
        return px2vw(this.benefitFontSize)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin';

  .img {
    width: 100%;
    object-fit: cover;
  }

  .m-brand-item {
    width: 115px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #fff;
    z-index: 1;

    .avatar {
      position: relative;

      > .img {
        height: 90px;
      }
    }

    .content {
      position: relative;
      text-align: left;

      .logo {
        position: absolute;
        top: -7px;
        left: 3px;

        > .img {
          width: 26px;
          height: 26px;
          border: 2px solid #fff;
          border-radius: 50%;
        }
      }

      .tt {
        margin-left: 34px;
        margin-top: 2px;
        @include cutCount(72px, 1);

        font-size: 12px;
        font-weight: 500;
        color: #202020;
        line-height: 16px;
      }

      .benefit {
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
        font-size: 12px;
        color: #ff3d2f;
        line-height: 16px;
      }
    }
  }
</style>