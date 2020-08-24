const ENV = require('../../config/buildEnvConfig')
const dbConfig = {
  dev: {
    db: {
      host: 'rm-wz976vto9g9tnh904.mysql.rds.aliyuncs.com',
      user: 'develop',
      password: 'U2@amhtEs6YhU6',
      database: 'lego',
      port: '3306',
      charset: 'utf8mb4',
    },
  },
  uat: {
    db: {
      host: 'rm-wz96378h5d05nb6f6.mysql.rds.aliyuncs.com',
      user: 'develop',
      password: 'U2@amhtEs6YhU6',
      database: 'lego',
      port: '3306',
      charset: 'utf8mb4',
    },
  },
  fat: {
    db: {
      host: 'rm-wz9o92jd56xti37zf.mysql.rds.aliyuncs.com',
      user: 'fat_lego_rw',
      password: 'v93G5cz5ByPl355Z',
      database: 'lego',
      port: '3306',
      charset: 'utf8mb4',
    },
  },
  prod: {
    db: {
      host: 'rm-wz9788h902sc106ug.mysql.rds.aliyuncs.com',
      user: 'pro_lego_rw',
      password: 'tCipybQBu3Hjoekv',
      database: 'lego',
      port: '3306',
      charset: 'utf8mb4',
    },
  },
}

module.exports = dbConfig[ENV] || dbConfig['dev']
