<template>
  <div
    class="m-video-cell"
    :style="{
    backgroundColor: bgColor,
    paddingTop: $px2vw(paddingTop),
    paddingBottom: $px2vw(paddingBottom)
  }"
  >
    <div :class="`content xl`">
      <div class="header" @click="goProductDetail">
        <img class="img avatar" :src="avatar | thumbnail(800)" alt />
        <img class="img corner" :src="corner" alt />
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
        <div class="btn" :style="{
          backgroundColor: btnColor
        }">{{ btnText }}</div>
      </div>
      <div class="video" @click="goVideoDetail">
        <img class="player" :src="videoCover | thumbnail(800)" alt />
      </div>
    </div>
  </div>
</template>

<script>
import config from './VideoExtraLarge.js'
import { jumpById } from '@/utils'
import qs from 'qs'
export default {
  name: 'VideoExtraLargeInner',
  props: config,
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
    border-radius: 4px;
    text-align: left;
    overflow: hidden;
    .img {
      width: 100%;
    }
    &.xl {
      .header {
        position: relative;
        height: 97px;
        background-color: #9c9c9c;
        .avatar {
          height: 100%;
        }
        .corner,
        .title,
        .subtitle,
        .btn {
          position: absolute;
        }
        .corner {
          top: 0;
          left: 10px;
          width: 75px;
        }
        .title {
          left: 10px;
          top: 40px;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          line-height: 22px;
          @include cut(200px);
        }
        .subtitle {
          left: 10px;
          top: 62px;
          font-size: 14px;
          color: #cdcdcd;
          line-height: 20px;
          @include cut(200px);
        }
        .btn {
          right: 10px;
          top: 36px;
          height: 25px;
          background-color: #4e4e4e;
          border-radius: 13px;
          padding: 0 10px;
          display: inline-block;

          font-size: 12px;
          font-weight: 500;
          color: #fff;
          line-height: 25px;
          text-align: center;
        }
      }
      .video {
        height: 170px;
        padding: 10px;
        background: #fff;
        .player {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      }
    }
  }
}
</style>