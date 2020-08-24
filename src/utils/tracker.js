export const LOG_NAME_ACTIVITY_PAGE = 'h5ActivityPage'
export const LOG_NAME_ACTIVITY_CLICK = 'h5ActivityClick'

export const LOG_NUMBER_ACTIVITY_PAGE = 10014
export const LOG_NUMBER_ACTIVITY_CLICK = 10016

const track =
  typeof window !== 'undefined' && window.sensors
    ? window.sensors.track
    : () => {}
export const trackActivityPage = ({
  activityId = '',
  activityName = window.document.title,
  duration = ''
} = {}) => {
  const params = {
    event_number: LOG_NUMBER_ACTIVITY_PAGE,
    event_name: LOG_NAME_ACTIVITY_PAGE,
    activityId,
    activityName,
    activityUrl: window.location.href
  }
  duration && (params.duration = duration)
  track(LOG_NAME_ACTIVITY_PAGE, params)

  const startTime = Date.now()

  return duration => {
    track(LOG_NAME_ACTIVITY_PAGE, {
      ...params,
      duration: duration || Date.now() - startTime
    })
  }
}

export const trackActivityClick = ({
  areaTitle = window.document.title,
  position = 0,
  content = '',
  contentId = '',
  pageName = window.document.title,
  tabName = '',
  relationData = ''
}) => {
  track(LOG_NAME_ACTIVITY_CLICK, {
    event_number: LOG_NUMBER_ACTIVITY_CLICK,
    event_name: LOG_NAME_ACTIVITY_CLICK,
    position,
    content,
    contentId,
    areaTitle,
    pageName,
    pageLink: window.location.href,
    tabName,
    relationData
  })
}
