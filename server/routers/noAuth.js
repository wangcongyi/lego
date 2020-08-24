const router = require('koa-router')()
const { setSessionToken } = require('./session')
const debug = require('debug')('app:api')
const queryData = require('../db/queryData')
const { toHumpList, toHexPwd, getToken } = require('../util')

module.exports = router.post('/login', async ctx => {
  try {
    debug(ctx.request.body)
    const { username, password } = ctx.request.body
    if (!username.trim() || !password.trim()) {
      return ctx.throw(400, '参数不合法')
    }
    const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
    const pwd = toHexPwd(password)
    let params = [username, pwd]
    const result = reg.test(username) ? await queryData('getUserByEmail', params) : await queryData('getUserByUserName', params)
    const resultList = toHumpList(result)
    if (result.length) {
      const target = resultList[0]
      const username = target.username
      const userId = target.id
      const token = getToken({ name: username, _id: userId })
      setSessionToken(ctx, token, username, userId, target)
      ctx.body = { code: 200, msg: token }
    } else {
      return ctx.throw(400, '用户名或密码错误')
    }
  } catch (error) {
    throw error
  }
})
