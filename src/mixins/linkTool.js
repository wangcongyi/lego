import { getUrlQuery, handleToken, jump } from '@/utils'
import { getDuration } from '@/utils/storage'

import { trackActivityPage, trackActivityClick } from '@/utils/tracker'
import { receiveCoupon } from '@/apix/coupon'
import { requestAppointLive } from '@/apix/live'
import qs from 'qs'

export default {
  data() {
    return {
      couponLoading: false,
    }
  },
  methods: {
    // 图片热区跳转
    async go(item) {
      if (!item) return
      if (item.type === 'custom') {
        if (this.$pre) {
          item.h5Link && window.open(item.h5Link)
          return
        }
        trackActivityPage({
          duration: getDuration(),
        })
        trackActivityClick({
          content: item.desc,
        })
        typeof window !== 'undefined' && item.h5Link && (window.location.href = item.h5Link)
      } else if (item.type === 'coupon') {
        if (this.$pre) {
          this.$toast('点击领券')
          return
        }
        if (this.couponLoading === true) {
          return
        }
        const checkToken = await handleToken()
        if (!checkToken) return
        this.$showLoading()
        this.couponLoading = true
        const query = getUrlQuery()
        const platform = parseInt(query.platform || `0`)
        const coupon = item
        try {
          await receiveCoupon({
            couponId: coupon.couponId,
          })
          this.$hideLoading()
          this.couponLoading = false
          this.$toast('优惠券已放到您的卡包\n快去使用吧～')
          trackActivityClick({
            content: coupon.name,
            contentId: coupon.couponId,
            relationData: 'success',
          })
        } catch (e) {
          this.$hideLoading()
          this.$toast(e)
          this.couponLoading = false
          trackActivityClick({
            content: coupon.name,
            contentId: coupon.couponId,
            relationData: 'failure',
          })
        }
      } else if (item.type === 'link') {
        const { id, parameter, notLiveLink = '' } = item
        const params = qs.parse(parameter)
        try {
          // 直播特殊处理
          if (id === 'live') {
            this.$showLoading()
            const { result } = await requestAppointLive({
              memberId: [params.memberId],
            })
            this.$hideLoading()
            const target = result && result.length ? result[0] : {}
            const isLiving = !target.isLiving // 直播 - 0， 未直播 - 1
            if (!isLiving && notLiveLink) {
              typeof window !== 'undefined' &&
              (this.$pre
                ? window.open(notLiveLink)
                : (window.location.href = notLiveLink))
              return
            }
            params.liveId = target.liveId
          }
          jump({
            id,
            method: 'jumpPage',
            appPath: item.appLink,
            h5Path: item.h5Link,
            wxPath: item.wxLink,
            params,
            name: item.desc,
          })
        } catch (error) {
          this.$hideLoading()
          this.$toast(error)
        }
      }
    },
  },
}
