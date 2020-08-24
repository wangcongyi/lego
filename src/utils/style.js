export const genStyle = ({ x, y, w, h, imgHeight, imgWidth }) => {
  const str =
    'left:' +
    _topxvw(x, imgWidth) +
    'width:' +
    _topxvw(w, imgWidth) +
    'top:' +
    _topxvh(y, imgHeight) +
    'height:' +
    _topxvh(h, imgHeight)
  // console.log('热区位置', str)
  return str.split(' ').join('')
}

const _topxvw = (num, origin) => {
  return ((num * 100) / origin).toFixed(2) + '%;'
}
const _topxvh = (num, origin) => {
  return ((num * 100) / origin).toFixed(2) + '%;'
}
