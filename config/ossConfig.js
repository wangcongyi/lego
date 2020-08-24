const BUILD_ARGVS = require('./buildEnvConfig')
const IS_PROD = BUILD_ARGVS === 'prod'
const DOMAIN_PREFIX_ENV = IS_PROD ? '' : `-${BUILD_ARGVS}`
const DOMAIN_SUFFIX = IS_PROD ? '.cn' : `.cn`
const PROTOCOL = IS_PROD ? `https` : `http`
const DOMAIN_URL = `${PROTOCOL}://lego${DOMAIN_PREFIX_ENV}.dydf${DOMAIN_SUFFIX}/`
// const DOWNLOAD_PREFIX = `https://${BUILD_ARGVS}-lego.oss-cn-hangzhou.aliyuncs.com/`


const url = {
  dev: 'https://lego-activity-dev.sznobug.com/',
  uat: 'https://lego-activity-uat.sznobug.com/',
  fat: 'https://lego-activity-fat.sznobug.com/',
  prod: 'https://lego-activity.sznobug.com/',
}

exports.ROOTPATHURL = url[BUILD_ARGVS]

exports.DOMAIN_URL = DOMAIN_URL
exports.BASE_PATH = 'resource/'
exports.PAGE_PATH = 'activity/'