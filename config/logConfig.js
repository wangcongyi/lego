'use strict'
var path = require('path')

// 日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

// 错误日志目录
var errorPath = '/error'
// 错误日志文件名
var errorFileName = 'error'
// 错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + '/' + errorFileName
//  var errorLogPath = path.resolve(__dirname, "../logs/error/error")

// 响应日志目录
var responsePath = '/response'
// 响应日志文件名
var responseFileName = 'response'
// 响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + '/' + responseFileName
//  var responseLogPath = path.resolve(__dirname, "../logs/response/response")

// 系统日志目录
var applicationPath = '/application'
// 系统日志文件名
var applicationFileName = 'application'
// 系统日志输出完整路径
var applicationLogPath =
  baseLogPath + applicationPath + '/' + applicationFileName

var log_config = {
  appenders: {
    // 错误日志
    errorLogger: {
      type: 'dateFile', // 日志类型
      filename: errorLogPath, // 日志输出位置
      alwaysIncludePattern: true, // 是否总是有后缀名
      encoding: 'utf-8', // 日志编码
      pattern: '-yyyy-MM-dd-hh.log' // 后缀，每小时创建一个新的日志文件
    },
    // 响应日志
    resLogger: {
      type: 'dateFile',
      filename: responseLogPath,
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      pattern: '-yyyy-MM-dd-hh.log'
    },
    // 系统日志
    appLogger: {
      type: 'dateFile',
      filename: applicationLogPath,
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      pattern: '-yyyy-MM-dd-hh.log'
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    errorLogger: { appenders: ['errorLogger'], level: 'error' },
    resLogger: { appenders: ['resLogger'], level: 'info' },
    appLogger: { appenders: ['appLogger'], level: 'warn' },
  }
}

module.exports = log_config
