import { px2vw, isContains } from '@/utils'

// inputNumber min : -1 - auto, -2 - initial, -3 - 100%
export const map = {
  fontSize: {
    label: '字号',
    inputNumber: true
  },
  fontWeight: {
    label: '字体粗细',
    inputNumber: true,
    step: 100,
    min: 100,
    max: 900
  },
  borderRadius: {
    label: '弧度',
    inputNumber: true
  },
  color: {
    label: '字体颜色',
    colorPicker: true
  },
  background: {
    label: '背景',
    colorPicker: true
  },
  paddingLeft: {
    label: '左间距',
    inputNumber: true
  },
  paddingRight: {
    label: '右间距',
    inputNumber: true
  },
  paddingTop: {
    label: '上间距',
    inputNumber: true
  },
  paddingBottom: {
    label: '下间距',
    inputNumber: true
  },
  width: {
    label: '大小',
    inputNumber: true
  },
  height: {
    label: '高度',
    inputNumber: true
  },
  lineHeight: {
    label: '行高',
    inputNumber: true
  },
  bottom: {
    label: '底部距离',
    inputNumber: true,
    min: -Infinity,
    max: Infinity
  }
}

export const expand = {
  moduleBackground: {
    label: '模块背景',
    colorPicker: true
  },
  buttonBackground: {
    label: '按钮颜色',
    colorPicker: true
  }
}

export const genLabel = (_ => {
  const obj = {}
  const config = {
    ...map,
    ...expand
  }
  Object.keys(config).forEach(key => {
    obj[key] = typeof config[key] === 'string' ? config[key] : config[key].label
  })
  return obj
})()

export const genType = (_ => {
  const obj = {}
  const config = {
    ...map,
    ...expand
  }
  Object.keys(config).forEach(key => {
    obj[key] = typeof config[key] === 'string' ? { input: true } : config[key]
  })
  return obj
})()

export const genStyle = ({ style }) => {
  const output = {}
  const externals = ['fontWeight']
  const replaceKeyFnc = key => {
    switch (key) {
      case 'x':
        return 'left'
      case 'y':
        return 'top'
      case 'w':
        return 'width'
      case 'h':
        return 'height'
      default:
        return key
    }
  }
  for (const key in style) {
    if (!isContains(externals, key)) {
      output[replaceKeyFnc(key)] =
        typeof style[key] === 'number'
          ? (_ => {
              switch (style[key]) {
                case -1:
                  return 'auto'
                case -2:
                  return 'initial'
                case -3:
                  return '100%'
                default:
                  return px2vw(style[key])
              }
            })()
          : style[key]
    } else {
      output[key] = style[key]
    }
  }
  return {
    ...output
  }
}
