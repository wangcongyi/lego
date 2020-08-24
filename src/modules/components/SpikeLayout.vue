<template>
  <div
    class="m-spike"
    :style="{
      background: bgColor,
      paddingTop: $px2vw(paddingTop),
      paddingBottom: $px2vw(paddingBottom)
    }"
  >
    <div
      v-if="items.length"
      class="m-spike-inner"
      :style="{
        background: moduleBgColor
      }"
    >
      <div class="bar" ref="bar">
        <Scroll
          ref="scroll"
          class="scroll-wrap"
          eventPassthrough="vertical"
          scrollX
          stopPropagation
        >
          <div class="nav-wrap">
            <template v-for="(item, index) in items">
              <div
                class="item"
                :key="index"
                @click="getProductList(item, index)"
                :style="{
                  color: current === index ? activeColor : color
                }"
              >
                <div class="time">{{ item.timeSlice | parseTime('{h}:{i}') }}</div>
                <div class="status">{{ parseStatus(item.timeSlice, index) }}</div>
              </div>
            </template>
          </div>
        </Scroll>
      </div>
      <div class="content" v-if="productViewConfig.childList.length">
        <ProductView
          v-bind="Object.assign(productViewConfig, {
            bgColor: moduleBgColor
          })"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '@/templates/components/base/Scroll'
  import LoadingSingle from '@/templates/components/base/LoadingSingle'
  import ProductView from '@/modules/ProductView.vue'
  import config from './SpikeLayout.js'
  import recommend from '@/mixins/recommend'

  const STATUS_STRING_MAP = {
    hasBeenText: '已抢完',
    beingText: '正在疯抢',
    beGoingToText: '即将开场',
    nextDayNoticText: '明日预告',
  }
  const STATUS_MAP = {
    '已抢完': 1,
    '正在疯抢': 2,
    '即将开场': 3,
    '明日预告': 4,
  }
  const BEING_CUT = 60 * 60 * 1000 // 秒杀模块的状态是保持一小时，然后变成已结束
  export default {
    mixins: [recommend],
    components: {
      Scroll,
      LoadingSingle,
      ProductView,
    },
    props: config,
    computed: {
      statusMap() {
        const t = Object.assign({}, STATUS_STRING_MAP)

        Object.keys(t).forEach(i => t[i] = this[i])

        return t
      },
      currentTime() {
        let curTime = this.curTime || new Date().getTime()
        if (`${curTime}`.length === 10) curTime = curTime * 1000
        return curTime
      },
      items() {
        const items = this.recommendId ? (this.pre ? this.dynamicChildList : this.timeLineList) : []
        return items
        // const time = (value, day = '16') => new Date(`2019-10-${day} ${value}:00`).getTime()
        // return [
        //   { timeSlice: time('00:00'), childPid: 76 },
        //   { timeSlice: time('08:00'), childPid: 76 },
        //   { timeSlice: time('16:00'), childPid: 76 },
        //   { timeSlice: time('22:00'), childPid: 76 },
        //   { timeSlice: time('00:00', '17'), childPid: 76 },
        //   { timeSlice: time('08:00', '17'), childPid: 76 },
        //   { timeSlice: time('14:00', '17'), childPid: 76 },
        //   { timeSlice: time('22:00', '17'), childPid: 76 }
        // ]
      },
    },
    watch: {
      current(oldValue, newVal) {
        this.move()
      },
      items(items) {
        this.pre && this.handleIndex(this.currentTime, items)
      },
    },
    data() {
      return {
        pre: typeof window !== 'undefined' ? window.ISPRE : false,
        // pre: false,
        curTime: null,
        current: 0,
        timeLineList: [],
        productListMap: {},
        productViewConfig: Object.assign({
          count: 200, // 坑位数
          recommendId: null, // 资源位Id
          prefixIcon: '', // 标题活动标
          prefixIconSize: 14, // 标题活动标大小
          discountIcon: '', // 优惠信息标
          switchTitleSubtitle: false, // 标题利益点互换
          subtitleFontSize: 14, // 利益点字号
          subtitleColor: '#8c8c8c', // 利益点颜色
          titleLayout: 2, // 标题布局 1 - 1行 2 - 2行
          titleFontSize: 14, // 标题字号
          titleColor: '#000', // 标题颜色
          bgColor: 'transparent', // 背景色
          btnColor: '#ff354d', // 按钮颜色
          btnText: '立即抢购', // 按钮文案
          priceLayout: 2, // 价格布局 1 - 1行 2 - 并行
          salePricePrefix: '', // 销售价前缀
          imgUrl: '', // 头图
          corner: '', // Logo
          tips: '', // 营销标
          tipsSize: 25, // 营销标大小
          tipsColor: '#00abff', // 营销标背景色
          highCommission: false, // 高佣商品
          styleType: '1', // 样式 1 - 一排一, 2 - 一排二, 3 - 一排三, 4 - 一排三滑动
          childList: [], // 商品列表
          isSpike: false, // 秒杀模块
          isFight: false, // 秒杀模块
          isCard: true, // 卡片风格
          paddingBottom: 10, // 下边距
          paddingTop: 0, // 上边距
        }, this.productConfig),
      }
    },
    mounted() {
      this.recommendId && !this.pre && this.getData()
      this.pre && this.handleIndex(this.currentTime, this.items)
    },
    methods: {
      move() {
        var node = this.$refs.bar
        if (!node) {
          return
        }
        var child = node.querySelectorAll('.item')[this.current]
        if (!child) {
          return
        }
        var scroll = this.$refs.scroll
        scroll.scrollToElement(child, 300, true, true)
      },
      parseStatus(originTime, index) {
        const time = originTime * 1000
        const curTime = this.currentTime
        const beingCut =
          this.isFight
            ? this.items[index + 1]
            ? (this.items[index + 1].timeSlice - originTime) * 1000
            : Infinity
            : BEING_CUT
        const upperLimit = time + beingCut
        // 已抢完
        const hasBeen = curTime > upperLimit
        // 正在疯抢
        const being = curTime <= upperLimit && curTime >= time
        // 即将开场
        const beGoingTo = curTime < time
        // 明日开场
        const nextDayNotic = new Date(time).getDate() > new Date(curTime).getDate()

        if (hasBeen) return this.statusMap.hasBeenText
        else if (being) return this.statusMap.beingText
        else if (nextDayNotic) return this.statusMap.nextDayNoticText
        else if (beGoingTo) return this.statusMap.beGoingToText
      },
      getStatus(beingItem) {
        return STATUS_MAP[this.parseStatus(beingItem.timeSlice * 1000)]
      },
      getStyleType(length) {
        if (length === 1) return '1'
        else if (length === 2) return '2'
        else if (length === 3) return '3'
        else return '4'
      },
      async getData(origin) {
        this.$showLoading()
        const recommendId = this.recommendId
        const { list, context: { currentTime } } = await this.getDynamicRecommend(recommendId)
        this.handleIndex(currentTime, list)
        this.$hideLoading()
      },
      async handleIndex(currentTime, list) {
        if (!list.length || !currentTime) return
        this.curTime = currentTime
        // TODO
        // list.length = 3

        this.timeLineList = list
        const findCondition = (item, index) => {
          if (list[index + 1]) {
            return currentTime >= item.timeSlice && currentTime <= list[index + 1].timeSlice
          } else {
            return false
          }
        }
        let beingItem = list.find(findCondition) ? list.find(findCondition) : list[list.length - 1]
        let index = list.findIndex(findCondition) > -1 ? list.findIndex(findCondition) : list.length - 1
        const status = this.getStatus(beingItem)
        const isLast = index === list.length - 1
        if ([3, 4].includes(status) && isLast && [3, 4].includes(this.getStatus(list[0]))) {
          beingItem = list[0]
          index = 0
        } else if (status === 1 && !isLast) {
          beingItem = list[index + 1]
          index = index + 1
        }
        // TODO
        // beingItem = list[2]
        // index = 2
        if (!beingItem) return
        await this.getProductList(beingItem, index)
      },
      async getProductList({ childPid: recommendId }, index) {
        let list = []
        this.$showLoading()
        let params = {}
        if (this.isFight) {
          const originalParameter = this.items[index].timeSlice
          params = {
            originalParameter,
          }
        }
        const localKey = `${recommendId}${JSON.stringify(params)}`
        if (this.productListMap[localKey] && this.productListMap[localKey].length) {
          list = this.productListMap[localKey]
        } else {
          const { list: rsList } = await this.getDynamicList(recommendId, params)
          // TODO
          // rsList.length = index + 1
          list = rsList
          this.productListMap[recommendId] = list
        }
        setTimeout(_ => {
          this.current = index
        }, 0)
        Object.assign(this.productViewConfig, {
          titleLayout: list.length === 1 ? 2 : 1,
          priceLayout: list.length === 1 ? 1 : 2,
          styleType: this.getStyleType(list.length),
          childList: list,
        })
        setTimeout(_ => {
          this.$hideLoading()
        }, 0)
      },
    },
  }

</script>
<style lang="scss" scoped>
  .m-spike-inner {
    position: relative;
    overflow: hidden;
    background-color: #c0c0c0;
    width: 355px;
    margin: 0 auto;
    border-radius: 4px;

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .content {
      // background-color: #db483e;
    }

    .bar {
      width: 355px;
      margin: 0 auto;
      padding: 7px 0 10px;
      overflow: hidden;

      .scroll-wrap {
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        text-align: left;

        .nav-wrap {
          height: 100%;
          display: inline-block;
          white-space: nowrap;
        }

        .item {
          position: relative;
          display: inline-block;
          width: 100px;
          text-align: center;
          color: #fff;

          &::after {
            content: '';
            width: 2px;
            height: 30px;
            border-radius: 1px;
            background-color: #fff;
            opacity: 0.2;
            position: absolute;
            right: -1px;
            top: 50%;
            transform: translateY(-50%);
          }

          &:last-child::after {
            display: none;
          }

          .time {
            font-size: 20px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: inherit;
            line-height: 24px;
          }

          .status {
            font-size: 12px;
            color: inherit;
            line-height: 16px;
          }
        }
      }
    }
  }
</style>