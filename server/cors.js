const cors = require('koa2-cors')
module.exports = cors({
  origin: function(ctx) {
    // 非生产
    const isApply = /^(http|https):\/\/(lego-activity|ttai)-(dev|lpt|uat|fat).weilaijishi.com$/.test(
      ctx.req.headers.origin
    )
    // 生产
    const isApply2 = /^(http|https):\/\/(lego-activity|ttai).weilaijishi.cn$/.test(
      ctx.req.headers.origin
    )
    // 开发
    const isApply3 = /^(http|https):\/\/(lego|ttai)-local.weilaijishi.com:(8080|8089)$/.test(
      ctx.req.headers.origin
    )
    if (isApply || isApply2 | isApply3) {
      return ctx.req.headers.origin
    }
    return false
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
})
