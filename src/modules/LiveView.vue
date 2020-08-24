<template>
  <div class="m-live" :style="liveStyle">
    <div class="inner" @click.prevent="jump" :style="moduleStyle">
      <div class="header">
        <img class="avatar" :src="avatar" alt />
        <div class="info">
          <div class="broadcaster">
            <span class="name">{{ info.userName }}</span>
            <span class="follow">{{ info.fansCount }}人已关注</span>
          </div>
          <div class="desc">{{ info.userDesc }}</div>
        </div>
        <div :class="['care', { 'active': info.isCare }]" @click.stop="care" :style="buttonStyle">
          <img
            class="plus-icon"
            src="https://lego-activity.weilaijishi.cn/resource/0501f6d0-1c8e-11ea-b88c-fd9739d336df.png"
            alt
            v-if="!info.isCare"
          />
          <span>{{ info.isCare | parseCareStr }}</span>
        </div>
      </div>
      <div class="content">
        <img class="bg" :src="info.liveImage" alt />
        <!-- <div class="time">
        <img
          class="time-icon"
          src="https://lego-activity.weilaijishi.cn/resource/e0cd6350-1c8b-11ea-b88c-fd9739d336df.png"
          alt
        />
        <span class="time-date">{{ info.startDate }} 开播</span>
        </div>-->
        <div class="products">
          <template v-for="(item, index) in info.itemList.slice(0, 4)">
            <div class="product" :key="index" @click.stop="go(item)">
              <img class="product-avatar" :src="item.masterImg" alt />
              <span class="product-price">¥{{ item.price }}</span>
            </div>
          </template>
        </div>
        <div class="heat" v-if="info.isLiving === 1">
          <div class="living">直播中</div>
          <div class="count">
            <img
              class="heat-icon"
              src="https://lego-activity.weilaijishi.cn/resource/abc005c0-1c93-11ea-b88c-fd9739d336df.png"
              alt
            />
            <span class="heat-num">{{ info.heat }}</span>
          </div>
        </div>
        <div class="mask" v-if="info.isLiving === 2">直播已结束</div>
      </div>
      <div class="footer">
        <div class="maintitle">{{ info.liveTitle }}</div>
        <div class="subtitle" :style="{color:subtitleColor}">{{ info.liveDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from './LiveView.js'
  import recommend from '@/mixins/recommend'
  import { genStyle } from '@/modules/super/util'
  import { jumpById } from '@/utils'
  import { todoFollow, requestIsFollow } from '@/apix/live'
  import { handleToken } from '@/utils'

  export default {
    name: 'Live',
    module: '直播',
    poster: 'https://lego-activity-dev.weilaijishi.com/resource/9a47e910-1c8a-11ea-a610-dbc609e5d844.png',
    mixins: [recommend],
    props: config,
    filters: {
      parseCareStr(bool) {
        return bool ? '已关注' : '关注'
      },
    },
    watch: {
      target() {
        this.handleData()
      },
    },
    computed: {
      avatar() {
        return this.info.userAvator || 'https://new-app-dev.oss-cn-shenzhen.aliyuncs.com/dev/plantform/logo2.png'
      },
      target() {
        return this.recommendId ? (this.$pre ? this.dynamicChildList[0] : this.queryData) : this.props
      },
      liveStyle() {
        return genStyle(this.styleOptions)
      },
      moduleStyle() {
        return {
          background: this.liveStyle.moduleBackground,
        }
      },
      buttonStyle() {
        return this.info.isCare ? {} : {
          background: this.liveStyle.buttonBackground,
        }
      },
    },
    data() {
      return {
        info: {
          userAvator: '',
          userName: '',
          fansCount: '',
          userDesc: '',
          startDate: '03月28日 17:30',
          liveImage: '',
          isLiving: 0, // 0 - 未开播， 1 - 直播中， 2 - 已结束
          heat: '',
          isCare: false,
          memberId: null,
          liveId: null,
          itemList: [
            // {
            //   productId: '1',
            //   masterImg: 'http://lego-activity-dev.weilaijishi.com/resource/5c955560-fb8a-11e9-87ee-47d6641725a5.jpg',
            //   price: '11'
            // },
            // {
            //   productId: '2',
            //   masterImg: 'http://lego-activity-dev.weilaijishi.com/resource/5c955560-fb8a-11e9-87ee-47d6641725a5.jpg',
            //   price: '11'
            // },
            // {
            //   productId: '2',
            //   masterImg: 'http://lego-activity-dev.weilaijishi.com/resource/5c955560-fb8a-11e9-87ee-47d6641725a5.jpg',
            //   price: '11'
            // }
          ],
          liveTitle: '直播主题直播主题直播主题直播主题',
          liveDesc: '直播利益点直播利益点直播利益点',
        },
        queryData: {},
      }
    },
    mounted() {
      this.recommendId && !this.$pre && this.getData()
      this.handleData()
    },
    methods: {
      async getData() {
        const { list, context: { currentTime } } = await this.getDynamicRecommend(this.recommendId)
        this.queryData = list.length ? list[0] : {}
        const { memberId } = this.queryData
        const { result } = await requestIsFollow({
          masterId: +memberId,
        })
        this.info.isCare = !!result.isFollow
      },
      handleData() {
        Object.assign(this.info, this.target)
      },
      jump() {
        const { liveId, preLink } = this.info
        if (!liveId) {
          if (preLink) {
            jumpById('articleDetail', preLink)
            return
          }
          this.$toast('主播还在赶来的路上~')
          return
        }
        jumpById('live', {
          liveId,
        })
      },
      go({ productId }) {
        jumpById('product', {
          productId,
        })
      },
      async care() {
        const checkToken = await handleToken()
        if (!checkToken) return
        const { memberId, isCare } = this.info
        try {
          await todoFollow({
            anchorId: +memberId,
          })
          this.info.isCare = !isCare
          this.$toast(!isCare ? '已关注' : '取消关注')
        } catch (error) {
          this.$toast(error)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-live {
    background: #3a3a3a;
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
        background: rgba(255, 193, 28, 1);
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