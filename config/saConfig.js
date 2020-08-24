const BUILD_ARGVS = require('./buildEnvConfig')
const IS_PROD = BUILD_ARGVS === 'prod'
const SA_PRO_SERVER_URL = 'https://access.weilaijishi.cn/sa?project=production'
const SA_TEST_SERVER_URL = 'https://access.weilaijishi.cn/sa?project=default'
module.exports = IS_PROD ? SA_PRO_SERVER_URL : SA_TEST_SERVER_URL