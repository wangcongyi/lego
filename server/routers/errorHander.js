const debug = require('debug')('app:errorHander')
const logger = require('../logger')
module.exports = async function (ctx, next) {
  const start = new Date()
  try {
    await next()
    const ms = new Date() - start
    logger.logResponse(ctx, ms)
  } catch (error) {
    const ms = new Date() - start
    logger.logError(ctx, error, ms)
    let status = error.status || 500
    let message =
      typeof error === 'string' ? error : error.message || '服务器错误'
    if (error.status === 401) {
      message = 'Protected resource, use Authorization header to get access\n'
    }
    ctx.body = {
      code: status,
      msg: message,
    }
    if (status == 500) {
      // this.body = yield this.render('500.html', {'err': e})
      // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
      ctx.app.emit('error', error, this)
    }
  }
}
