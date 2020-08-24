const router = require('koa-router')()
const { checkSession } = require('./session')
const checkToken = require('./checkToken')
const errorHander = require('./errorHander')
const noAuth = require('./noAuth')
const api = require('./api')
const proxy = require('./proxy')
const unless = {
  path: [
    /\/login/,
    /\/api\/user\/create/,
    /\/api\/login/,
    /\/api\/status/,
    /\/api\/getInfo/,
    /\/api\/activityPages/,
    /\/api\/logs/,
    /\/api\/storage\/uploadFile/
  ]
}
router.use(errorHander)
router.use(checkToken().unless(unless))
router.use(noAuth.routes())
router.use(checkSession().unless(unless))
router.use('/api', api.routes())
router.use(proxy.routes())

module.exports = router
