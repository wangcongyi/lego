const router = require('koa-router')()
const debug = require('debug')('app:proxy')
const axios = require('axios')
const ENV = require('../../config/envConfig')
const getHost = function () {
  if (ENV === 'development') {
    return ''
  } else {
    return  ''
  }
}

module.exports = router
  .post('/proxy', async (ctx, next) => {
    debug('/proxy', ctx.request.body)
    var host = getHost(ctx.session.env)
    var {
      data
    } = await axios.post( host + ctx.request.body.url, ctx.request.body.data || {}, {
      headers: {
        'Authorization': ctx.session.token
      }
    })
    // var data = qiniuHelp.getUploadToken()
    ctx.body = {
      code: data.status,
      msg: data.msg || data.data
    }
  })