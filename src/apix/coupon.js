import { apix2Get } from '@/utils/apix'

export const receiveCoupon = ({ couponId }) => {
  return apix2Get('/api/actcenter/market/coupon/deliver/ttai', { couponId })
    .catch(msg => {
      throw msg
    })
}
