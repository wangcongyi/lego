const jwt = require('jsonwebtoken')
const { promisify, getToken, secret } = require('../util')
const verify = promisify(jwt.verify)
const { setSessionToken } = require('./session')
const unless = require('koa-unless')
module.exports = function() {
  const middleware = async function(ctx, next) {
    if (ctx.header && ctx.header.authorization) {
      const parts = ctx.header.authorization.split(' ')
      if (parts.length === 2) {
        //取出token
        const scheme = parts[0]
        const token = parts[1]
        let payload = null

        if (/^Bearer$/i.test(scheme)) {
          try {
            // jwt.verify方法验证token是否有效
            payload = await verify(token, secret, {
              complete: true
            })
          } catch (error) {
            if (error.message === 'jwt expired') {
              // token过期 生成新的token
              const newToken = getToken({
                name: ctx.session.username,
                _id: ctx.session.userId
              })
              setSessionToken(
                ctx,
                newToken,
                ctx.session.username,
                ctx.session.userId,
                ctx.session.userInfo
              )
              // ctx.header.authorization = newToken
              // 将新token放入Authorization中返回给前端
              ctx.res.setHeader('Authorization', newToken)
            } else {
              //  if (error.message === 'jwt malformed' || error.message === 'invalid signature')
              ctx.throw(401)
            }
          }
        }
      }
    } else {
      ctx.throw(401)
    }
    return next()
  }
  middleware.unless = unless
  return middleware
}
