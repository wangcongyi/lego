const debug = require('debug')('app-webhook')
const path = require('path')
const { execFile } = require('child_process')
const TOKEN = '51DAC81F7BE64E6D0106016C3009120E'

module.exports = async(ctx, next)=> {
  if (ctx.method === 'POST' && ctx.url==='/fireWebhock') {
    debug(ctx.request.header['x-gitlab-event'], ctx.request.header['x-gitlab-token'])
    ctx.request.body.ref = 'refs/heads/master'
    debug(ctx.request.body.ref)
    if (ctx.request.body.ref === 'refs/heads/master' && ctx.request.header['x-gitlab-token'] === TOKEN) {
      var file = path.join(process.cwd(), '/bin/deploy.sh')
      const child = execFile(file, [], (error, stdout, stderr) => {
        if (error) {
          throw error
        }
      })
    }
    
    ctx.body= {
      code: 200
    }
  } else {
   await next()
  }
}