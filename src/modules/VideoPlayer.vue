<template>
  <div
    class="m-video-player"
    :class="{'landscape': direction === 2, 'black-bg': !!url}"
    v-if="url || videoId"
  >
    <template v-if="isPre">
      <video
        class="video"
        :class="{'show': isPlay || isFirstLoaded}"
        ref="player"
        controls
        :src="url"
        @pause="pause"
      />
      <template v-if="!isFirstLoaded">
        <img
          class="cover"
          :class="{'fade-out': isPlay}"
          :src="coverSource"
          v-if="coverSource"
          crossorigin="Anonymous"
        />
        <img
          class="play-btn"
          :class="{'fade-out': isPlay}"
          src="http://lego-activity-dev.weilaijishi.com/resource/icon/play-circle-fill.png"
          @click="play"
        />
      </template>
    </template>

    <template v-else>
      <img class="cover" :src="coverSource" v-if="coverSource" crossorigin="Anonymous" />
      <img
        class="play-btn"
        src="http://dev-lego.oss-cn-hangzhou.aliyuncs.com/resource/play-circle-fill.png"
        @click="play"
      />
    </template>
  </div>
</template>

<script>
// 进入全屏
function FullScreen (el) {
  var ele = el || document.documentElement;
  if (ele.requestFullscreen) {
    ele.requestFullscreen()
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen()
  } else if (ele.webkitRequestFullScreen) {
    ele.webkitRequestFullScreen()
  }
}
// 退出全屏
function exitFullscreen (el) {
  var de = el || document
  if (de.exitFullscreen) {
    de.exitFullscreen()
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen()
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen()
  }
}
import config from './VideoPlayer.js'
import apix from '@/utils/apix'
import { getAppFlag, jumpById } from '@/utils'
export default {
  name: 'VideoPlayer',
  props: config,
  data () {
    return {
      isPre: false,
      isPlay: false,
      isFirstLoaded: false
    }
  },
  computed: {
    coverSource () {
      // return `${this.url}?spm=a2c4g.11186623.2.1.yjOb8V&x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast`
      return this.videoCover || `${this.url}?x-oss-process=video/snapshot,t_1000,m_fast`
    }
  },
  mounted () {
    if (typeof window === 'undefined') {
      this.isPre = false
    } else {
      this.isPre = window.ISPRE
    }
  },
  methods: {
    pause () {
      this.isPlay = false
    },
    play () {
      // if (this.isPre) {
      //   this.$refs.player.play()
      //   this.isPlay = !this.isPlay
      //   !this.isPre && FullScreen(this.$refs.player)
      //   this.isFirstLoaded = true
      // } else {
      //   this.$emit('videoPlay', this.url)
      // }
      jumpById('video', {
        videoId: this.videoId,
        viewMode: 2,
        authorId: 22314877
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-video-player {
  position: relative;
  width: 102px;
  height: 180px;
  border-radius: 3px;
  overflow: hidden;
  background: linear-gradient(rgba(255, 255, 255, 0) 90%, rgba(0, 0, 0, 0.87));
  &.black-bg {
    background: #000;
  }
  &.landscape {
    width: 180px;
    height: 102px;
  }
  .video {
    height: 100%;
    width: 100%;
    display: none;
    opacity: 0;
    transition: 0.2s all;
    object-fit: cover;
    &.show {
      display: block;
      opacity: 1;
    }
  }
  .cover {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 45px;
    height: 45px;
    cursor: pointer;
  }
}
.fade-out {
  animation: fadeOut 0.5s forwards;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    display: none;
  }
}
</style>
