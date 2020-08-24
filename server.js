const path = require('path')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const mount = require('koa-mount')
const static = require('koa-static')
const send = require('koa-send')
const cors = require('./server/cors')
const router = require('./server/routers')
const webhook = require('./server/webhook')
const logger = require('./server/logger')
const app = new Koa()
app.use(cors)
app.use(
  bodyparser({
    jsonLimit: '50mb'
  })
)
app.keys = ['lego']
app.use(
  session(app, {
    // 默认 session 结束后 cookie 失效, 满足需求
    // maxAge: 24 * 60 * 60 * 1000
  })
)

// 静态路径
app.use(mount('/logs', static(path.join(__dirname, './logs'))))
app.use(mount('/static', static(path.join(__dirname, './dist'))))
app.use(mount('/static', static(path.join(__dirname, './res'))))
app.use(mount('/deployed', static(path.join(__dirname, './deployed'))))
app.use(mount('/axrue', static(path.join(__dirname, './axrue'))))
// webhock
// app.use(webhook)

//路由
app.use(router.routes()).use(router.allowedMethods())

app.use(async (ctx, next) => {
  if (ctx.method === 'GET') {
    await send(ctx, 'index.html', {
      root: path.join(__dirname, '.')
    })
  } else {
    ctx.body = {
      code: 404
    }
  }
  next()
})

app.on('error', (err, ctx) => {
  logger.appError(err)
  console.log(err)
})

const server = app.listen(8080, () => {
  logger.appError(
    `[INFO] server on ${server.address().port} ${
      process.env.NODE_ENV
    } Start Time ${new Date()}`
  )
  console.log('server on ', server.address().port)
  console.log(process.env.NODE_ENV)
})
