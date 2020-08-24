const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = 'LEGO_BEARER_TOKEN'
exports.secret = secret
const toHump = val => {
  return val.replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase()
  })
}
exports.toHump = toHump

exports.toLine = name => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

exports.toHumpList = arr => {
  return arr.map(item => {
    const tpl = {}
    Object.keys(item).forEach(key => {
      tpl[toHump(key)] = item[key]
    })
    return tpl
  })
}

exports.toHexPwd = password => {
  return crypto
    .createHash('md5')
    .update(password)
    .digest('hex')
}

exports.promisify = fn => {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function(resolve, reject) {
      args.push(function(err, result) {
        if (err) reject(err)
        else resolve(result)
      })
      fn.apply(null, args)
    })
  }
}

exports.getToken = (payload) => {
  return jwt.sign(
    payload,
    secret,
    { expiresIn: '72h' }
  )
}
