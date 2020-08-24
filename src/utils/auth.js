import Cookies from 'js-cookie'

const TokenKey = 'LEGO_TOKEN'
const token_exp = 1000 * 60 * 60 * 72

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires) {
  return Cookies.set(TokenKey, token, {
    expires: expires || new Date(new Date().getTime() + token_exp)
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
