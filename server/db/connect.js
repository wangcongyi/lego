const config = require('./dbConfig')
const mysql = require('mysql')
const logger = require('../logger')
let configDb = config.db

configDb.queueLimit = 0
configDb.connectionLimit = 1000

const pool = mysql.createPool(configDb)

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        logger.appError('连接数据库出错')
        reject(err)
      } else {
        conn.query(sql, params, (qerr, vals, fields) => {
          conn.release()
          if (qerr) {
            logger.appError('sql执行失败')
            logger.appError(`sql：${sql} params：${params} results：${qerr}`)
            reject(qerr)
          } else {
            resolve(vals)
          }
        })
      }
    })
  })
}

module.exports = query
