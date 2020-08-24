const {createBundleRenderer} = require('vue-server-renderer')
const path = require('path')
const debug = require('debug')('app-vueSSR')
const fs = require('fs')
const ENV = require('../../config/envConfig')
const webpack = require('webpack')
const clientConfig = require('./build/webpack.client.config')
const serverConfig = require('./build/webpack.server.config')
const uploadHelper = require('../ali/index')
const logger = require('../logger')
const serverUrl = require('../../config/saConfig')

let deployUserMap = {}

function deleteFolder(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

function webpackBuild(productName, deployPath) {
  return new Promise((resolve, reject) => {
    var outDir = path.resolve(__dirname, `../../deployed`)
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir)
    }
    // TODO ACPS

    // if (ENV === 'development') {
    //   if (!fs.existsSync(path.resolve(outDir, `./test`))) {
    //     fs.mkdirSync(path.resolve(outDir, `./test`))
    //   }
    // }
    //
    // outDir = path.resolve(outDir, `./${productName}`)
    // if (!fs.existsSync(outDir)) {
    //   fs.mkdirSync(outDir)
    // }

    outDir = path.resolve(outDir, `./${deployPath}`)
    deleteFolder(outDir)
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir)
    }
    // 动态替换打包输出位置 例如 /deployed/yunxin/page1/
    clientConfig.output.path = outDir
    clientConfig.output.publicPath = `./`
    serverConfig.output.path = outDir
    serverConfig.output.publicPath = `./${deployPath}/`

    var clientSuc, serverSuc
    webpack(clientConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(`buildClient error ${err || stats.toJson().errors}`)
        return
      }
      clientSuc = true
      if (serverSuc) {
        resolve(outDir)
      }
    })

    webpack(serverConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(`buildSever error ${err || stats.toJson().errors}`)
        return
      }
      serverSuc = true
      if (clientSuc) {
        resolve(outDir)
      }
    })
  })
}

function renderHtml(tpl, tModel, outDir, pageInfo, share) {
  return new Promise((resolve, reject) => {
    const clientManifestPath = path.resolve(outDir, './vue-ssr-client-manifest.json')
    const serverBundlePath = path.resolve(outDir, './vue-ssr-server-bundle.json')
    const template = fs.readFileSync(path.resolve(__dirname, './src/template.html'), 'utf-8')

    const renderer = createBundleRenderer(serverBundlePath, {
      runInNewContext: false,
      template,
      clientManifest: require(clientManifestPath)
    })
    const context = {tpl, tModel}
    context.aid = pageInfo.aid
    context.title = pageInfo.title
    context.description = pageInfo.description
    context.keywords = pageInfo.keywords
    context.needLogin = pageInfo.needLogin
    context.serverUrl = serverUrl
    context.share = {
      title: share.title,
      desc: share.desc,
      imgUrl: share.imgUrl,
      link: share.link
    }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        reject(err)
      } else {
        var outPath = path.resolve(outDir, `./index.html`)
        //todo 将文件上传至nos，返回nos地址
        fs.writeFile(outPath, html, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(outDir)
          }
        })

        // 删除clientManifest文件
        fs.unlink(clientManifestPath, err => {
          if (err) {
            logger.appError(err)
          }
        })
        // 删除serverBundle文件
        fs.unlink(serverBundlePath, err => {
          if (err) {
            logger.appError(err)
          }
        })
      }
    })
  })
}

function deploy(envPrefix, tpl, tModel, productName, rootPath, deployPath, pageInfo, share, pageId, ctx) {
  return new Promise((resolve, reject) => {
    const currentUser = ctx.session.username
    if (deployUserMap[pageId]) {
      if (deployUserMap[pageId] === currentUser) {
        return reject(`你正在部署该页面，请勿重复操作`)
      }
      return reject(`${deployUserMap[pageId]}正在部署该页面，请勿重复操作`)
    }
    deployUserMap[pageId] = ctx.session.username
    webpackBuild(productName, deployPath)
      .then(outDir => {
        return renderHtml(tpl, tModel, outDir, pageInfo, share)
      })
      .then(outDir => {
        if (envPrefix !== 'prod') {
          return outDir
        } else {
          // TODO Ali Oss
          return uploadHelper.uploadDir(outDir, `${deployPath}/`,rootPath)
        }
      })
      .then(results => {
        logger.appError(
          `${
            deployUserMap[pageId]
          }部署页面${pageId}完毕 ${new Date().toLocaleString()}`
        )
        delete deployUserMap[pageId]
        resolve(results)
      })
      .catch(err => {
        logger.appError(
          `${
            deployUserMap[pageId]
          }部署页面${pageId}失败 ${new Date().toLocaleString()}`
        )
        delete deployUserMap[pageId]
        reject(err)
      })
  })
}

exports.deploy = deploy
