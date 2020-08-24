const router = require('koa-router')()
const send  = require('koa-send')
const path = require('path')

module.exports = router
  .get('/', async ( ctx ) => {
    await send(ctx, 'index.html', {
      root: path.join(__dirname, '../..')
    })
  })