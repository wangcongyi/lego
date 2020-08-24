const sqlConfig = require('./sqlConfig')
const connect = require('./connect')

module.exports = queryData = (queryType, params) => {
  return new Promise((resolve, reject) => {
    const options = typeof queryType === 'function' ? queryType() : sqlConfig[queryType]
    if (!options) {
      reject(`${queryType} not in table configs`)
      return
    }
    connect(options.sql, params)
      .then(records => resolve(records))
      .catch(err => reject(err))
  })
}
