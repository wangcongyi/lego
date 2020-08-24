const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')
const BUILD_ARGVS = require('../../config/buildEnvConfig')
const bucket = {
  dev: 'nbug-lego-activity-dev',
  uat: 'nbug-lego-activity-uat',
  fat: 'nbug-lego-activity-fat',
  prod: 'nbug-lego-activity-pro',
}[BUILD_ARGVS]
const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4G4gJQown1SsmnbkVYV8',
  accessKeySecret: 'FFuiTiTTouladLgFLSmmFqP9VEwxdG',
  bucket,
})
const config = require('../../config/ossConfig')
const { DOMAIN_URL, BASE_PATH, PAGE_PATH } = config
const upload = (exports.upload = async ({ prefix = '', fileName = '', file, flag }) => {
  try {
    const path = flag ? PAGE_PATH : BASE_PATH
    const filePath = flag ? file : file.path
    return await client.put(
      `${path}${prefix}${fileName || file.name}`,
      filePath,
    )
  } catch (e) {
    return Promise.reject(e)
  }
})

exports.uploadDir = async (localDir, prefix,rootPath) => {
  return new Promise((resolve, reject, progress) => {
    fs.readdir(localDir, function (err, files) {
      if (err) {
        reject(err)
        return
      }

      if (!files || !files.length) {
        reject(`No files in ${localDir} to upload!`)
      }
      var promiseList = []
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i]
        let filePath = path.resolve(localDir, fileName)
        promiseList.push(
          upload({
            fileName,
            file: filePath,
            prefix,
            flag: true,
          }),
        )
      }
      Promise.all(promiseList)
        .then(results => resolve(`${rootPath}${PAGE_PATH}${prefix}index.html`))
        .catch(reject)
    })
  })
}

exports.list = async ({ prefix = '', marker = '' }) => {
  try {
    const result = await client.list({
      prefix: `${BASE_PATH}${prefix}`,
      marker,
    })
    return result.objects
  } catch (e) {
    return Promise.reject(e)
  }
}

exports.delete = async ({ fileName = '' }) => {
  try {
    const result = await client.delete(fileName)
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}
