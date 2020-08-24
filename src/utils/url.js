
export const url2object = function (url) {
  url = url || ''
  let protocol = url.indexOf('http') >= 0 ? 'https://' : 'gohoo://'
  let hostname = url.replace(protocol, '')
  if (hostname.indexOf('?') >= 0) {
    hostname = hostname.substring(0, hostname.indexOf('?'))
  }
  let hostItems = hostname.split('/')
  hostname = hostItems[0]
  let path = ''
  if (hostItems.length > 0) {
    path = hostItems.slice(1).join('/')
  }
  if (url.indexOf('?') === -1) {
    return {
      protocol,
      hostname,
      path,
      query: {}
    }
  } else {
    let query = url.substr(url.indexOf('?') + 1)
    let queryItems = query.split('&')
    let result = {}
    queryItems.forEach(item => {
      if (item.indexOf('=') > 0) {
        let temp = item.split('=')
        result[temp[0]] = decodeURIComponent(temp[1])
      } else {
        result[item] = ''
      }
    })
    return {
      protocol,
      hostname,
      path,
      query: result
    }
  }
}

export const object2url = function (obj) {
  let { protocol, hostname, path, query } = obj
  protocol = protocol || 'http://'
  hostname = hostname || ''
  if (path) {
    hostname = `${hostname}/${path}`
  }
  query = query || {}
  let queryItems = []
  for (let key in query) {
    queryItems.push(`${key}=${encodeURIComponent(query[key])}`)
  }
  if (queryItems.length > 0) {
    return `${protocol}${hostname}?${queryItems.join('&')}`
  } else {
    return `${protocol}${hostname}`
  }
}
