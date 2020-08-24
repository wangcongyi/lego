<template>
  <div class="m-live" :style="{paddingBottom: itemBottom+'px'}">
    <div class="inner" @click.prevent="jump" :style="{backgroundColor:subBgColor}">
      <div class="header">
        <img class="avatar" :src="avatar" alt />
        <div class="info">
          <div class="broadcaster">
            <span class="name">{{ userName }}</span>
            <span class="follow">{{ fansCount }}人已关注</span>
          </div>
          <div class="desc">{{ userDesc }}</div>
        </div>
        <div class="care"></div>
      </div>
      <div class="content">
        <img class="bg" :src="liveImage" alt />
        <!-- <div class="time">
        <img
          class="time-icon"
          src="https://lego-activity.weilaijishi.cn/resource/e0cd6350-1c8b-11ea-b88c-fd9739d336df.png"
          alt
        />
        <span class="time-date">{{ info.startDate }} 开播</span>
        </div>-->
        <div class="products">
          <template v-for="(item, index) in itemList.slice(0, 4)">
            <div class="product" :key="index">
              <img class="product-avatar" :src="item.masterImg" alt />
              <span class="product-price">¥{{ item.price }}</span>
            </div>
          </template>
        </div>
        <!--        <div class="heat" v-if="isLiving === '1'">-->
        <!--          <div class="living">直播中</div>-->
        <!--          <div class="count">-->
        <!--            <img-->
        <!--                class="heat-icon"-->
        <!--                src="https://lego-activity.weilaijishi.cn/resource/abc005c0-1c93-11ea-b88c-fd9739d336df.png"-->
        <!--                alt-->
        <!--            />-->
        <!--            <span class="heat-num">{{ heat }}</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--        <div class="mask" v-if="isLiving === 2">直播已结束</div>-->
      </div>
      <div class="footer">
        <div class="maintitle">{{ liveTitle }}</div>
        <div class="subtitle" :style="{color:subtitleColor}">{{ liveDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from './LiveListItem.js'
  import recommend from '@/mixins/recommend'
  import { getParam, getAppFlag, connectWebViewJavascriptBridge } from '@/utils'
  import BUILD_ARGVS from '../../config/buildEnvConfig'


  export default {
    name: 'LiveListItem',
    mixins: [recommend],
    props: config,
    filters: {
      parseCareStr(bool) {
        return bool ? '已关注' : '关注'
      },
    },

    computed: {
      avatar() {
        return this.data.userAvator
      },
      userName() {
        return this.data.userName
      },
      liveImage() {
        return this.data.liveImage
      },
      itemList() {
        return this.data.itemList || []
      },
      fansCount() {
        return this.data.fansCount || ''
      },
      userDesc() {
        return this.data.userDesc || ''
      },
      liveTitle() {
        return this.data.liveTitle || ''
      },
      liveDesc() {
        return this.data.liveDesc || ''
      },
    },

    methods: {
      jump() {
        const { memberId, liveRoomId } = this.data
        const liveURL = BUILD_ARGVS === 'prod' ? `https://m.lifeyouyu.com/pages/live/detail/index?id=${liveRoomId}&memberId=${memberId}` :
          `https://sm-${BUILD_ARGVS}.weilaijishi.com/pages/live/detail/index?id=${liveRoomId}&memberId=${memberId}`

        if (getAppFlag()) {
          connectWebViewJavascriptBridge(bridge => {
            bridge.callHandle('commonJumpPage', {
              router: liveURL,
            })
          })
        }

        if (getParam('miniFlag')) {
          wx.miniProgram.navigateTo({
            url: `/pages/live/detail/index?id=${liveRoomId}&memberId=${memberId}`,
          })
        } else {
          window.location.href = liveURL
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-live {
    padding: 0 10px;
  }

  .inner {
    width: 355px;
    height: 287px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    text-align: left;
    overflow: hidden;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .info {
        width: 216px;

        .broadcaster {
          display: flex;
          align-items: center;

          .name {
            position: relative;
            font-size: 14px;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            padding-right: 10px;

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
              height: 10px;
              background: rgba(255, 255, 255, 0.6);
            }
          }

          .follow {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            padding-left: 10px;
          }
        }

        .desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 17px;

          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .care {
        width: 64px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: transparent;
        border-radius: 17px;

        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);

        display: flex;
        align-items: center;
        justify-content: center;

        transition: background 0.3s ease-in-out;

        &.active {
          background: rgba(255, 255, 255, 0.1);
        }

        .plus-icon {
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }
      }
    }

    .content {
      position: relative;
      width: 355px;
      height: 164px;
      border-radius: 8px 8px 0px 0px;
      overflow: hidden;

      .bg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .time {
        position: absolute;
        left: 5px;
        top: 5px;
        width: 147px;
        height: 24px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 17px;
        padding: 0 8px;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        &-icon {
          width: 12px;
          height: 12px;
          margin-right: 6px;
        }

        &-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
        }
      }

      .heat {
        position: absolute;
        left: 5px;
        top: 5px;

        height: 16px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        color: rgba(255, 255, 255, 1);

        display: flex;
        align-items: center;
        justify-content: space-between;

        .living {
          width: 38px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          background: rgba(255, 193, 28, 1);
          border-radius: 2px;

          font-size: 10px;
          color: rgba(255, 255, 255, 1);
        }

        .count {
          padding-left: 7px;
          padding-right: 5px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          .heat-icon {
            width: 8px;
            height: 10px;
            margin-right: 2px;
          }

          .heat-num {
            font-size: 10px;
          }
        }
      }

      .mask {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 14px;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .products {
        position: absolute;
        right: 5px;
        bottom: 5px;
        display: flex;

        .product {
          position: relative;
          width: 50px;
          height: 50px;
          background: rgba(68, 51, 51, 0.05);
          border-radius: 2px;
          margin-left: 5px;

          &-avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          &-price {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 0px 0px 2px 2px;

            font-size: 10px;
            color: rgba(254, 254, 254, 1);
          }
        }
      }
    }

    .footer {
      padding: 10px;
      background: #fff;

      .maintitle {
        font-size: 16px;
        font-weight: 500;
        color: rgba(32, 32, 32, 1);
        line-height: 22px;
      }

      .subtitle {
        margin-top: 5px;
        font-size: 14px;
        color: rgba(127, 127, 127, 1);
        line-height: 20px;
      }
    }
  }
</style>