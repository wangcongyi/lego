<template>
  <div class="m-share-h5" v-if="h5visible" @click="()=>this.h5visible = false">
    <p>1.点击右上角</p>
    <p>2.点击
      <img src="https://static.lifeyouyu.com/minprogram/icon/share.png">
      发送给朋友或
      <img src="https://static.lifeyouyu.com/minprogram/icon/round.png">
      分享朋友圈
      <img
        class="arrow"
        src="https://static.lifeyouyu.com/minprogram/icon/shareMark.png">
    </p>
  </div>

  <div
    v-else
    class="m-share-view"
    :class="{ fixed: !pre ? isFixed : false }"
    @click="goShare"
    :style="{ top: position }"
  >
    <img :src="url" alt :style="{width: `${size}px`}" />
  </div>
</template>

<script>
  import config from './ShareView.js'
  import { share, getAppFlag, px2vw, getParam } from '@/utils'

  export default {
    name: 'Share',
    module: '分享',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/f79ec560-170e-11ea-ae56-b5039842b49f.png',
    props: config,
    computed: {
      position() {
        return px2vw(this.top)
      },
    },
    data() {
      return {
        h5visible: false,
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
      }
    },
    created() {
      if (getParam('miniFlag')) {
        wx.miniProgram.postMessage({
          data: {
            linkTitle: this.shareTitle,
            imageUrl: this.shareImage.startsWith('http') ? this.shareImage : `https:${this.shareImage}`,
          },
        })
      }
    },

    methods: {
      goShare() {
        if (getAppFlag()) {
          share({
            title: this.shareTitle,
            description: this.shareDesc,
            content: this.shareContent,
            image: this.shareImage.startsWith('http') ? this.shareImage : `https:${this.shareImage}`,
            shareType: 3,
            platforms: [1, 2, 3],
            url: window.location.href,
          })
        } else {
          this.h5visible = true
        }

      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-share-view {
    position: absolute;

    &.fixed {
      position: fixed;
    }

    right: 0;
    z-index: 9;
  }

  .m-share-h5 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    padding-top: 40px;
    text-align: left;
    padding-left: 40px;

    img {
      width: 18px;
      height: 18px;
    }

    .arrow {
      width: 55px;
      height: 80px;
      position: absolute;
      top: 10px;
      right: 25px;
    }
  }

</style>