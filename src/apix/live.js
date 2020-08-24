import { apix2Get, apix2Post } from '@/utils/apix'
import qs from 'qs'

export const requestAppointLive = params => {
  return apix2Get(`/api/live/noauth/hty/getAppointLive?${qs.stringify(params)}`)
    .catch(msg => {
      throw msg
    })
}

export const todoFollow = params => apix2Post('/api/vod/video/toggleFans', params)
export const requestIsFollow = params => apix2Post('/api/live/fans/isfollow', params)