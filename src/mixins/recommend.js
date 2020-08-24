import { guid } from '@/utils'
import apix from '@/utils/apix'
import CouponItemConfig from '@/modules/CouponItem.js'


export const getRecommend = (recommendId, params) => {
  return apix.get(`/api/ttai/get`, { params: { pid: recommendId } })
    .then(res => {
      console.log(res.result)
      return res.result
    })
    .catch(errorMsg => {
      return Promise.reject(errorMsg || '数据异常')
    })
}

export const getRecommends = (recommendIds, params) => {
  return apix
    .get(`/api/ttai/mget`, {
      params: {
        pids: recommendIds,
        ...params,
      },
    })
    .then(res => {
      return res.result
    })
    .catch(errorMsg => {
      return Promise.reject(errorMsg || '数据异常')
    })
}

export default {
  methods: {

    getRecommend(recommendId, params) {
      let recommends = null
      try {
        recommends = JSON.parse(sessionStorage.getItem('recommends'))
      } catch (error) {
        recommends = null
      }
      if (recommends && recommends[recommendId]) {
        return recommends[recommendId]
      }
      return getRecommend(recommendId, params)
    },

    getRecommends,

    async getDynamicRecommend(recommendId, params) {
      this.$showLoading()
      try {
        const result = await this.getRecommend(recommendId, params)
        this.$hideLoading()
        return result
      } catch (error) {
        this.$hideLoading()
        throw error
      }
    },

    async getDynamicRecommendList(recommendId, params) {
      this.$showLoading()
      try {
        const ids = `${recommendId}`.split(',')
        const recommend = await this.getRecommends(recommendId, params)
        const list = ids.reduce(function (a, b) {
          return recommend[b] ? a.concat(recommend[b].list) : a
        }, [])
        this.$hideLoading()
        return Object.assign(recommend[ids[0]], {
          list,
        })
      } catch (error) {
        this.$hideLoading()
        return []
      }
    },

    handleDynamicList(list) {
      try {
        return list.map(item => {
          delete item.strategyValue
          delete item._recordEntryId
          delete item._recordId
          return {
            mid: guid(),
            show: true,
            model: {
              ...item,
            },
          }
        })
      } catch (error) {
        this.$toast('资源位数据错误')
      }
    },

    async getDynamicList(recommendId, params) {
      const { list, context } = await this.getDynamicRecommend(
        recommendId,
        params,
      )
      return {
        list: this.handleDynamicList(list),
        context,
      }
    },

    handleDynamicCouponList(list) {
      const getStatus = totalNum => {
        return totalNum > 0 ? 'valid' : 'blank'
      }
      return list.map(item => {
        delete item._recordId
        return {
          mid: guid(),
          show: true,
          model: {
            ...item,
            selfStyle: CouponItemConfig.selfStyle.default(),
            couponName: item.couponName, // 卡券名称
            shopName: item.name, // 店铺名称
            couponId: item.couponId, // 卡券id
            detailUrl: '', // 卡券详情链接
            status: getStatus(item.totalNum), // 卡券状态 pending, valid, owned, blank
            couponValue: item.couponValue, // 券面值
            limit: item.showRemark, // 使用门槛
            area: item.useRemark, // 使用范围
            shopImg: item.shopPic || item.masterImg || '', // 商品/店铺图片
            productUrl: item.h5Url, // 商品链接
            shopId: item.shopId, // 店铺ID
          },
        }
      })
    },

    async getDynamicCouponList(recommendId, params) {
      const { list, context } = await this.getDynamicRecommend(
        recommendId,
        params,
      )
      return {
        list: this.handleDynamicCouponList(list),
        context,
      }
    },
  },
}
