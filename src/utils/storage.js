import dayjs from 'dayjs'
/*设置浏览时长*/
export const setDuration = () => {
  const now = dayjs().valueOf()
  window.sessionStorage.setItem('DURATION', now)
}
/*获取浏览时长*/
export const getDuration = () => {
  const now = dayjs().valueOf()
  let startTime = window.sessionStorage.getItem('DURATION')
  startTime = Number(startTime)
  const duration = now - startTime
  return duration || 0
}