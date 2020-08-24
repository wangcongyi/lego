const debug = require('debug')('app-api')
const router = require('koa-router')()
const formidable = require('formidable')
const uuidv1 = require('uuid/v1')
const queryData = require('../db/queryData')
const vueSSR = require('../vueSSR')
const ENV = require('../../config/envConfig')
const { cleanSession } = require('./session')
const aliHelp = require('../ali')
const DOMAIN_URL = require('../../config/ossConfig')['DOMAIN_URL']
const fs = require('fs')
const path = require('path')
const { toHumpList, toHexPwd } = require('../util')
const handleActivityStatus = item => {
  const {
    preStartTime,
    preEndTime,
    formalStartTime,
    formalEndTime,
    isDeleted
  } = item
  var status
  if (isDeleted) {
    status = 0
  } else if (+new Date() > formalEndTime) {
    status = 0
  } else if (preEndTime < formalStartTime) {
    if (+new Date() > preEndTime && +new Date() < formalStartTime) {
      status = 0
    } else {
      status = 1
    }
  } else {
    status = 1
  }
  return {
    ...item,
    status
  }
}


const hasAdminPermission = ctx => {
  return (ctx.session.userInfo.powerLevel === 1)
}

const hasPageEditPermission = async (ctx, pageId) => {
  if (ctx.session.userInfo.powerLevel === 1) {
    return true
  }
  var findPage = await queryData('getPageById', pageId)
  const username = ctx.session.username
  let creator = findPage[0].creator
  return creator ? username === creator : true
}

const hasActivityEditPermission = async (ctx, activityId) => {
  if (ctx.session.userInfo.powerLevel === 1) {
    return true
  }
  var findActivity = await queryData('getActivityById', [activityId])
  const username = ctx.session.username
  let creator = findActivity[0].creator
  return creator ? username === creator : true
}

module.exports = router
  .get('/logs', async ctx => {
    const fileList = []
    const logsPath = path.join(__dirname, '../../logs')
    const readdir = dir => {
      return new Promise((resolve, reject) => {
        fs.readdir(dir, function (err, picFiles) {
          if (err) ctx.throw(err)
          resolve(picFiles)
        })
      })
    }
    const stats = dir => {
      return new Promise((resolve, reject) => {
        fs.stat(dir, function (err, file) {
          if (err) ctx.throw(err)
          resolve(file)
        })
      })
    }
    const readFileList = async dir => {
      return new Promise(async (resolve, reject) => {
        const files = await readdir(dir)
        files.forEach(async (file, index) => {
          const fullPath = path.join(dir, file)
          const stat = await stats(fullPath)
          if (stat.isDirectory()) await readFileList(fullPath)
          else fileList.push(fullPath)
          if (index === files.length - 1) resolve()
        })
      })
    }
    await readFileList(logsPath)
    const html = fileList
      .map(path => {
        const n = path.replace(logsPath, '/logs').replace(/\\/g, '/')
        return `<a href="${n}" />${n}<br />`
      })
      .join('')
    ctx.type = 'html'
    ctx.body = html
  })
  .get('/products', async (ctx, next) => {
    try {
      var result = await queryData('products')
      ctx.body = {
        code: 200,
        msg: result,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/logout', async (ctx, next) => {
    try {
      cleanSession(ctx)
      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/pages', async (ctx, next) => {
    try {
      var body = ctx.request.body
      var productId = body.pid
      var activityId = body.activityId
      var search = '%' + (body.search || '') + '%'
      var offset = body.offset || 0
      var limit = body.limit || 20
      var more = body.more
      var result = await queryData('getPagesByPIdTotal', [
        activityId,
        productId,
        search,
      ])
      var list = await queryData(
        more ? 'getPagesByPId' : 'getPagesByPIdForSome',
        [activityId, productId, search, offset, limit],
      )
      ctx.body = {
        code: 200,
        msg: {
          total: result[0].total,
          list,
        },
      }
    } catch (error) {
      throw error
    }
  })
  .post('/trueDeletePage', async (ctx, next) => {
    try {
      var body = ctx.request.body
      var pageId = body.pageId

      //真实删除
      await queryData('deletePage', [pageId])

      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/deletePage', async (ctx, next) => {
    try {
      var body = ctx.request.body
      var pageId = body.pageId

      var pages = await queryData('getPageById', [pageId])
      var page = pages[0]
      var products = await queryData('getProductById', [page.pid])
      var product = products[0]
      var productName = product.name_en

      //真实删除
      // await queryData('deletePage', [pageId])

      var hasPower = await hasPageEditPermission(ctx, pageId)
      if (!hasPower) {
        ctx.throw(403, '无删除权限')
      }

      // 逻辑删除，为防止后续name重复，将删除的页面name更改为 deleted-id-name
      await queryData('markPageDeleted', [
        `deleted-${pageId}-${page.name}`,
        ctx.session.username,
        pageId,
      ])

      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/createPage', async ctx => {
    const {
      name,
      pid,
      activity_id,
      deploy_title,
      deploy_desc,
      deploy_keywords,
      root_path,
    } = ctx.request.body
    const username = ctx.session.username
    let creator = username
    var params = [
      name,
      pid,
      activity_id,
      deploy_title,
      deploy_desc,
      deploy_keywords,
      creator,
      username,
      root_path
    ]
    try {
      var result = await queryData('createPage', params)
      ctx.body = {
        code: 200,
        msg: {
          id: result.insertId,
        },
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.status = 0
        error.message = '作品名已存在，请重命名'
      }
      throw error
    }
  })
  .post('/clonePage', async (ctx, next) => {
    try {
      const body = ctx.request.body
      const cloneName = body.cloneName
      const cloneActivityId = body.placeActivityId
      var origin = JSON.parse(body.origin)
      var clone = Object.assign({}, origin)
      if (!clone.t_model) {
        var findPage = await queryData('getPageById', [clone.id])
        clone = findPage[0]
      }
      clone.activity_id = cloneActivityId || clone.activity_id
      clone.name = cloneName || origin.name + '*' + new Date().getMilliseconds()
      clone.sub_path = ''
      clone.deployed_prod = 0
      clone.deployed_test = 0
      const username = ctx.session.username
      let creator = username
      var result = await queryData('createPage', [
        clone.name,
        clone.pid,
        clone.activity_id,
        '',
        '',
        '',
        creator,
        username,
        ''
      ])
      clone.id = result.insertId
      var params = [
        '',
        clone.name,
        clone.t_name,
        clone.t_model,
        clone.sub_path,
        clone.activity_id,
        clone.deploy_title,
        clone.deploy_desc,
        clone.deploy_keywords,
        clone.share_title,
        clone.share_desc,
        clone.share_img_url,
        clone.share_link,
        username,
        username,
        clone.id,
      ]
      await queryData('updatePage', params)
      ctx.body = {
        code: 200,
        msg: JSON.stringify(clone),
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.status = 400
        error.message = '作品名已存在，请重命名'
      }
      throw error
    }
  })
  .post('/save', async ctx => {
    const {
      pid, pageId, name, tName, tModel, sub_path = new Date().getTime(),
      activity_id, share_title, share_desc, share_img_url,
      share_link, deploy_title, deploy_desc, deploy_keywords, root_path
    } = ctx.request.body

    try {
      if (sub_path) {
        //首先检查 sub_path是否重复
        var result = await queryData('checkSubPathUnique', [pid, sub_path, pageId])
        if (result && result.length > 0) {
          ctx.body = {
            code: 500,
            msg: `部署路径与作品{${result[0].name}}重复，请修改后提交。`,
          }
          return
        }
      }
      var findPage = await queryData('getPageById', pageId)
      const username = ctx.session.username
      let creator = findPage[0].creator
      var params = [
        root_path,
        name,
        tName,
        tModel,
        sub_path,
        activity_id,
        deploy_title,
        deploy_desc,
        deploy_keywords,
        share_title,
        share_desc,
        share_img_url,
        share_link,
        creator,
        username,
        pageId,
      ]
      await queryData('updatePage', params)
      var page = await queryData('getPageById', pageId)
      ctx.body = {
        code: 200,
        data: page[0],
      }
    } catch (error) {
      throw error
    }
  })
  .post('/getPageDetail', async ctx => {
    var body = ctx.request.body
    var pageId = body.pageId
    var params = [pageId]
    try {
      var result = await queryData('getPageById', params)
      var hasPower = await hasPageEditPermission(ctx, pageId)
      if (!result.length) {
        ctx.throw(404, '没有找到页面')
      }
      if (!hasPower) {
        ctx.throw(403, '无编辑权限')
      }
      ctx.body = {
        code: 200,
        msg: result[0],
      }
    } catch (error) {
      throw error
    }
  })
  .post('/getDeletedPages', async ctx => {
    try {
      var pages = await queryData('getDeletedPages')
      ctx.body = {
        code: 200,
        data: toHumpList(pages),
      }
    } catch (error) {
      throw error
    }
  })
  .post('/restorePage', async ctx => {
    try {
      var body = ctx.request.body
      var pageId = body.pageId

      var pages = await queryData('getPageById', [pageId])
      var page = pages[0]

      //逻辑恢复
      await queryData('markPageValid', [
        page.name.replace(`deleted-${pageId}-`, ''),
        ctx.session.username,
        pageId,
      ])

      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/deploy', async (ctx, next) => {
    try {
      var body = ctx.request.body
      var env = body.env
      var aid = body.aid
      var needLogin = body.needLogin
      // if (!isDevEnv && !nodeProdEnv) {
      //   //非正式环境 不允许部署到 线上
      //   ctx.body = {
      //     code: 500,
      //     msg: '非正式环境只允许部署到测试'
      //   }
      //   return
      // }

      var pageId = body.id
      var page = await queryData('getPageById', [pageId])
      page = page[0]

      var pd = await queryData('getProductById', [page.pid])
      pd = pd[0]
      var tName = page.t_name
      var tModel = JSON.parse(page.t_model)
      var deployPath = page.sub_path
      const rootPath = page.root_path
      var productName = pd.name_en

      var pageInfo = {
        title: page.deploy_title || page.name || pd.default_deploy_title,
        description: page.deploy_desc || pd.default_deploy_desc,
        keywords: page.deploy_keywords || pd.default_deploy_keywords,
        aid,
        needLogin,
      }
      var share = {
        title: page.share_title,
        desc: page.share_desc,
        imgUrl: page.share_img_url,
        link: page.share_link,
      }
      // TODO ACPS

      // if (ENV === 'development') {
      //   deployPath = 'test/' + deployPath
      // }


      const path = await vueSSR.deploy(
        env,
        tName,
        tModel,
        productName,
        rootPath,
        deployPath,
        pageInfo,
        share,
        pageId,
        ctx,
      )
      debug('deploy', path)
      //开发环境下部署时，在数据库中也是标记已部署到测试。
      await queryData(
        env !== 'prod' ? 'updateTestDeployState' : 'updateDeployState',
        [pageId],
      )
      if (env !== 'prod') {
        ctx.body = {
          code: 200,
          msg: `/deployed/${deployPath}/index.html`,
        }
      } else {
        ctx.body = {
          code: 200,
          msg: path,
        }
      }
    } catch (error) {
      throw error
    }
  })
  .post('/getActivityDetail', async ctx => {
    var body = ctx.request.body
    var activityId = body.activityId
    var params = [activityId]
    try {
      var result = await queryData('getActivityById', params)
      if (!result.length) {
        ctx.throw(404, '没有找到活动')
      }
      ctx.body = {
        code: 200,
        msg: toHumpList(result)[0],
      }
    } catch (error) {
      throw error
    }
  })
  .post('/activityPages', async ctx => {
    var body = ctx.request.body
    var productId = body.pid || 1
    var activityName = '%' + (body.activityName || '') + '%'
    var offset = body.offset || 0
    var limit = body.limit || 10000
    try {
      var result = await queryData('getActivitiesTotalNoIds', [activityName])
      var list = await queryData('getActivitiesNoIds', [
        activityName,
        offset,
        limit,
      ])
      var promiseList = []
      var statusList = []
      toHumpList(list).forEach(item => {
        promiseList.push(
          new Promise(async (resolve, reject) => {
            const activityId = item.id
            var pages = await queryData('getPagesByPId', [
              activityId,
              productId,
              '%%',
              0,
              10000,
            ])
            resolve({
              ...handleActivityStatus(item),
              items: pages,
            })
          }),
        )
      })
      // 保证顺序
      statusList = await Promise.all(promiseList)
      ctx.body = {
        code: 200,
        msg: {
          total: result[0].total,
          list: statusList,
        },
      }
    } catch (error) {
      error.status = 400
      throw error
    }
  })
  .post('/activities', async ctx => {
    try {
      var body = ctx.request.body
      var activityName = '%' + (body.activityName || '') + '%'
      var activityIds = body.activityIds
      var offset = body.offset || 0
      var limit = body.limit || 10000
      var sqlActivitiesTotal = () => {
        return {
          sql: `SELECT COUNT(*) as total FROM lego_activity WHERE activity_name LIKE '${activityName}' AND id in(${activityIds})`
        }
      }
      var sqlActivities = () => {
        return {
          sql: `SELECT * FROM lego_activity WHERE activity_name LIKE '${activityName}' AND id in(${activityIds}) ORDER BY created_time DESC limit ${offset}, ${limit}`
        }
      }
      var result = activityIds
        ? await queryData(sqlActivitiesTotal, [])
        : await queryData('getActivitiesTotalNoIds', [activityName])

      var list = activityIds
        ? await queryData(sqlActivities, [])
        : await queryData('getActivitiesNoIds', [activityName, offset, limit])

      const statusList = toHumpList(list).map(item => {
        return handleActivityStatus(item)
      })

      ctx.body = {
        code: 200,
        msg: {
          total: result[0].total,
          list: statusList
        }
      }
    } catch (error) {
      throw error
    }
  })
  .post('/createActivity', async ctx => {
    var body = ctx.request.body
    var {
      activityName,
      activityLevel,
      activityManager,
      preStartTime = null,
      preEndTime = null,
      formalStartTime,
      formalEndTime,
    } = body
    // INSERT INTO lego_activity(activity_name, activity_level, pre_start_time, pre_end_time, formal_start_time, formal_end_time) VALUE(?,?,?,?,?,?)
    const username = ctx.session.username
    let creator = username
    var params = [
      activityName,
      activityLevel,
      preStartTime,
      preEndTime,
      formalStartTime,
      formalEndTime,
      creator,
      username,
    ]
    try {
      var result = await queryData('createActivity', params)
      ctx.body = {
        code: 200,
        msg: {
          id: result.insertId,
        },
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.status = 0
        error.message = '活动已存在，请重命名'
      }
      throw error
    }
  })
  .post('/removeActivity', async (ctx, next) => {
    try {
      var body = ctx.request.body
      var activityId = body.id
      var activities = await queryData('getActivityById', [activityId])
      var activity = toHumpList(activities)[0]
      //真实删除
      // await queryData('deleteActivity', [activityId])

      var hasPower = await hasActivityEditPermission(ctx, activityId)
      if (!hasPower) {
        ctx.throw(403, '无删除权限')
      }

      //逻辑删除，为防止后续name重复，将删除的活动name更改为 deleted-id-name
      await queryData('markActivityDeleted', [
        `deleted-${activityId}-${activity.activityName}`,
        ctx.session.username,
        activityId,
      ])
      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/updateActivity', async ctx => {
    try {
      var body = ctx.request.body
      var {
        id,
        activityName,
        activityLevel,
        activityManager,
        preStartTime = null,
        preEndTime = null,
        formalStartTime,
        formalEndTime,
      } = body
      var hasPower = await hasActivityEditPermission(ctx, id)
      if (!hasPower) {
        ctx.throw(403, '无编辑权限')
      }

      // INSERT INTO lego_activity(activity_name, activity_level, pre_start_time, pre_end_time, formal_start_time, formal_end_time) VALUE(?,?,?,?,?,?)
      var findActivity = await queryData('getActivities', ['%%', `${id}`, 0, 1])
      const username = ctx.session.username
      let creator = findActivity[0].creator
      var params = [
        activityName,
        activityLevel,
        preStartTime,
        preEndTime,
        formalStartTime,
        formalEndTime,
        creator,
        username,
        id,
      ]
      await queryData('updateActivity', params)
      var results = await queryData('getActivities', ['%%', `${id}`, 0, 1])
      var list = toHumpList(results)
      ctx.body = {
        code: 200,
        data: list[0],
      }
    } catch (error) {
      throw error
    }
  })
  .post('/getDeletedActivities', async ctx => {
    try {
      var activities = await queryData('getDeletedActivities')
      ctx.body = {
        code: 200,
        data: toHumpList(activities),
      }
    } catch (error) {
      throw error
    }
  })
  .post('/restoreActivity', async ctx => {
    try {
      var body = ctx.request.body
      var activityId = body.activityId
      var activities = await queryData('getActivityById', [activityId])
      var activity = toHumpList(activities)[0]

      //逻辑恢复
      await queryData('markActivityValid', [
        activity.activityName.replace(`deleted-${activityId}-`, ''),
        ctx.session.username,
        activityId,
      ])

      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/status', async ctx => {
    var body = ctx.request.body
    var id = body.id
    var params = [id]
    try {
      var result = await queryData('getActivityById', params)
      var status = handleActivityStatus(toHumpList(result)[0]).status
      ctx.body = {
        code: 200,
        msg: status,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/upload', async ctx => {
    await new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm()
      form.parse(ctx.req, async (err, fields, files) => {
        if (err) {
          reject(err)
        }
        try {
          const key = uuidv1()
          const slice = files.file.name.split('.')
          const fileName =
            slice.length > 1 ? `${key}.${slice[slice.length - 1]}` : key
          let res = await aliHelp.upload({
            fileName: fileName,
            file: files.file,
          })
          resolve(`${DOMAIN_URL}${res.name}`)
        } catch (error) {
          reject(error)
        }
      })
    })
      .then(result => {
        ctx.body = {
          code: 200,
          msg: result,
        }
      })
      .catch(error => {
        throw error
      })
  })
  .post('/storage/uploadFile', async ctx => {
    await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.parse(ctx.req, async (err, fields, files) => {
        if (err) {
          reject(err)
        }
        try {
          const key = uuidv1()
          const slice = files.file.name.split('.')
          const fileName =
            slice.length > 1 ? `${key}.${slice[slice.length - 1]}` : key
          let res = await aliHelp.upload({
            fileName: +fields.r ? '' : fileName,
            prefix: fields.prefix,
            file: files.file,
          })
          resolve(`${DOMAIN_URL}${res.name}`)
        } catch (error) {
          reject(error)
        }
      })
    })
      .then(result => {
        ctx.body = {
          code: 200,
          msg: result,
        }
      })
      .catch(error => {
        throw error
      })
  })
  .post('/storage/listFiles', async ctx => {
    try {
      const body = ctx.request.body
      const result = await aliHelp.list({
        prefix: body.prefix,
      })
      ctx.body = {
        code: 200,
        msg: result,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/storage/deleteFile', async (ctx, next) => {
    try {
      const body = ctx.request.body
      const result = await aliHelp.delete({
        fileName: body.name,
      })
      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/user/create', async (ctx, next) => {
    try {
      if (!hasAdminPermission(ctx)) return
      const { username, password = '', email, array } = ctx.request.body
      const defaultPwd = 'lego1234'
      const getPwd = pwd => {
        return pwd ? toHexPwd(pwd) : toHexPwd(defaultPwd)
      }
      let promiseList = []
      let result = null
      let msg = null
      if (array && array.length) {
        promiseList = array.map(async item => {
          let pa = []
          if (Object.prototype.toString.call(item) === '[object Array]') {
            const [un, pw, em] = item
            pa = [un, getPwd(pw), em]
          } else {
            const { un, pw, em } = item
            pa = [un, getPwd(pw), em]
          }
          return await queryData('createUser', pa)
        })
        result = await Promise.all(promiseList)
        msg = result.map(rs => rs.insertId)
      } else {
        const params = [username, getPwd(password), email]
        result = await queryData('createUser', params)
        msg = {
          id: result.insertId,
        }
      }
      ctx.body = {
        code: 200,
        msg: msg,
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.status = 404
        error.message = '用户已存在'
      }
      throw error
    }
  })
  .post('/user/updateLevel', async (ctx, next) => {
    try {
      if (!hasAdminPermission(ctx)) return
      const body = ctx.request.body
      const { level = 1, id = '', username = '' } = body
      await queryData('updateUserLevel', [level, id, username])
      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/user/update', async (ctx, next) => {
    try {
      const body = ctx.request.body
      const { id, username, oldpass, email, newpass } = body
      const params1 = [username, toHexPwd(oldpass)]
      let current = await queryData('getUserByUserName', params1)
      if (!current || !current.length) {
        ctx.throw(400, '密码错误')
      }
      current = toHumpList(current)[0]
      const activityIds = body.activityIds
        ? body.activityIds
        : current.activityIds
      const pageIds = body.pageIds ? body.pageIds : current.pageIds
      const emailTarget = email || current.email
      const params = [
        toHexPwd(newpass),
        emailTarget,
        activityIds,
        pageIds,
        id,
        username,
      ]
      await queryData('updateUser', params)
      ctx.body = {
        code: 200,
      }
    } catch (error) {
      throw error
    }
  })
  .post('/user/info', async (ctx, next) => {
    try {
      if (!hasAdminPermission(ctx)) return
      const body = ctx.request.body
      const { id, username } = body
      let current = await queryData('getUser', [id, username])
      current = toHumpList(current)[0]
      delete current.password
      ctx.body = {
        code: 200,
        msg: current,
      }
    } catch (error) {
      throw error
    }
  })
  .get('/getInfo', async (ctx, next) => {
    const userInfo = ctx.session.userInfo || {}
    ctx.body = {
      code: 200,
      msg: {
        username: userInfo.username,
        level: userInfo.powerLevel,
        env: ENV,
      },
    }
  })
