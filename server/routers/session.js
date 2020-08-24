const debug = require('debug')('app:router-session')
const unless = require('koa-unless')
function checkSession() {
  const middleware = async function(ctx, next) {
    debug('check session')
    debug(ctx.session)
    if (ctx.session && ctx.session.username) {
      debug('session exist')
    } else {
      debug('session not exist')
      ctx.throw(401, 'need login')
    }
    return next()
  }
  middleware.unless = unless
  return middleware
}

function setSessionToken(ctx, token, username, id, info) {
  ctx.session.token = token
  ctx.session.username = username
  ctx.session.userId = id
  ctx.session.userInfo = info
}

function cleanSession(ctx) {
  ctx.session.username = ''
  ctx.session.token = ''
  ctx.session.userId = ''
}

module.exports = { checkSession, setSessionToken, cleanSession }
