<template>
  <div class="m-floating-nav">
    <div
      :class="['floating-btn', btnHide ? 'hide' : 'show']"
      :style="{
        backgroundImage: bgImg ? `url(${bgImg})` : 'none',
        position: pre ? 'absolute' : 'fixed'
      }"
      @click="handleShowContent"
    />
    <Popup
      @closePopup="handleHideContent"
      :show="showContent"
      class="meeting-popup"
      :bgColor="outBgColor"
    >
      <div
        class="meeting-close"
        @click.stop="handleHideContent"
        :style="{
          backgroundColor: outBgColor
        }"
      >
        <i class="arrow-down" :style="{ borderColor: arrowDownIconColor || color}" />
      </div>
      <div class="meeting-inner">
        <div
          v-for="(line) in childList"
          :key="line.mid"
          :class="[
            'meeting-line',
            `style-${line.model.styleType}`
          ]"
        >
          <div
            v-for="(item) in line.model.childList"
            :key="item.mid"
            :class="[
              'item',
              { active: item.model.active }
            ]"
            :style="{
              color: color,
              background: bgColor
            }"
          >
            <div class="text">
              <h3>{{ item.model.name }}</h3>
              <p>{{ item.model.point }}</p>
            </div>
            <div class="meeting-logo">
              <img :src="item.model.logo || defaultLogo" alt="logo" />
            </div>
            <div
              class="meeting-icon"
              :style="{
                backgroundColor: color,
              }"
              @click="handleJump(item.model.url)"
            >
              <i class="arrow-right" :style="{ borderColor: arrowIconColor}" />
            </div>
          </div>
        </div>
      </div>
      <button
        class="meeting-btn"
        :style="{
          background: bottomBgColor,
          color: bottomTextColor
        }"
        @click="handleJump(bottomTarget)"
      >{{ bottomText }}
      </button>
    </Popup>
  </div>
</template>

<script>
  import config from './FloatingNavView'
  import Popup from '@/templates/components/base/Popup'

  export default {
    name: 'FloatingNav',
    module: '会场悬浮导航',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/c09b0520-170d-11ea-ae56-b5039842b49f.png',
    components: {
      Popup,
    },
    props: config,
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        btnHide: false,
        showContent: false,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.t1 = 0
        this.t2 = 0
        this.timer = null // 定时器

        window.addEventListener('scroll', this.handleScroll)
      })
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    computed: {
      location() {
        return (window && window.location.href) || this.$route.fullPath
      },
    },
    methods: {
      handleScroll() {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.handleScrollEnd, 150)
        this.t1 = window.scrollTop
        this.btnHide = true
      },
      handleScrollEnd() {
        clearTimeout(this.timer)
        this.t2 = window.scrollTop
        if (this.t2 === this.t1) {
          this.btnHide = false
        }
      },
      handleShowContent(e) {
        e.preventDefault()
        this.showContent = true
      },
      handleHideContent() {
        this.showContent = false
      },
      handleJump(target) {
        if (target) {
          window.location.href = target
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mixin';

  .m-floating-nav {
    position: static !important;
  }

  .floating-btn {
    position: fixed;
    right: 10px;
    bottom: 68px;
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 10;
    transition: all 0.4s ease;
    cursor: pointer;

    &.hide {
      right: -60px;
    }

    &.show {
      right: 10px;
    }
  }

  .meeting-close {
    width: 40px;
    height: 40px;
    position: absolute;
    top: -20px;
    left: 50%;
    margin-left: -20px;
    border-radius: 100%;
    line-height: 32px;
    text-align: center;
    background: #dadada;
    z-index: -1;

    .arrow-down {
      display: inline-block;
      border-style: solid;
      border-width: 0px 3px 3px 0px;
      width: 12px;
      height: 12px;
      transform: matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0);
    }
  }

  .meeting-popup {
    z-index: 11;
  }

  .meeting-inner {
    width: 100%;
    height: 100%;
    max-height: 420px;
    position: relative;
    overflow: auto;

    .meeting-line {
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      display: flex;
      height: 96px;
      position: relative;
      margin-bottom: 5px;
      border-radius: 4px;
      background: #fff;
      overflow: hidden;

      &.active::before {
        content: '';
        display: block;
        background-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 3;
      }

      .meeting-icon {
        position: absolute;
        left: 10px;
        bottom: 10px;
        border-radius: 100%;
        width: 20px;
        height: 20px;
        line-height: 24px;
        text-align: center;
        background: #000;

        .arrow-right {
          position: absolute;
          top: 50%;
          left: 50%;
          display: inline-block;
          width: 4.9px;
          height: 4.9px;
          margin: -3px 0 0 -4px;
          border-right: 2px solid #fff;
          border-top: 2px solid #fff;
          transform: rotate(45deg);
        }
      }

      .text {
        margin: 5px 0 0 10px;
        text-align: left;

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          line-height: 26px;
          @include cut();
        }

        p {
          margin: 0;
          font-size: 12px;
          line-height: 20px;
          @include cut();
        }
      }

      .meeting-logo {
        flex: 1;
        height: 100%;

        img {
          max-width: 100%;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .meeting-btn {
    width: 100%;
    margin-top: 5px;
    padding: 10px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #fff;
    border: 0;
    outline: 0;
    border-radius: 4px;
    box-shadow: none;
    background: #000;
  }

  // 不同布局
  .style-1 {
    .item {
      width: 100%;

      .text {
        width: 106px;
      }
    }
  }

  .style-2 {
    justify-content: space-between;

    .item {
      flex: 0 0 49%;

      .text {
        width: 106px;
      }
    }
  }

  .style-3 {
    .item {
      flex-direction: column;
      flex: 0 0 32%;

      .meeting-logo {
        width: 75px;
        align-self: flex-end;
      }

      &:nth-child(3n + 2),
      &:nth-child(3n + 1) {
        margin-right: 2%;
      }
    }
  }
</style>
<style lang="scss">
  // 底部会场列表
  .meeting-popup.m-popup {
    .popup.popup-bottom {
      height: auto;
      padding: 15px 10px 10px;
      background: #dadada;
      border-radius: 8px 8px 0px 0px;
    }
  }
</style>
