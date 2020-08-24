import regl from './regl.min'
const createREGL = regl()
export default function() {
  function Vector2(x, y) {
    this.x = x || 0
    this.y = y || 0
  }
  Object.defineProperties(Vector2.prototype, {
    width: {
      get: function() {
        return this.x
      },
      set: function(value) {
        this.x = value
      }
    },
    height: {
      get: function() {
        return this.y
      },
      set: function(value) {
        this.y = value
      }
    }
  })
  Object.assign(Vector2.prototype, {
    isVector2: true,
    set: function(x, y) {
      this.x = x
      this.y = y
      return this
    },
    setScalar: function(scalar) {
      this.x = scalar
      this.y = scalar
      return this
    },
    setX: function(x) {
      this.x = x
      return this
    },
    setY: function(y) {
      this.y = y
      return this
    },
    setComponent: function(index, value) {
      switch (index) {
        case 0:
          this.x = value
          break
        case 1:
          this.y = value
          break
        default:
          throw new Error('index is out of range: ' + index)
      }
      return this
    },
    getComponent: function(index) {
      switch (index) {
        case 0:
          return this.x
        case 1:
          return this.y
        default:
          throw new Error('index is out of range: ' + index)
      }
    },
    clone: function() {
      return new this.constructor(this.x, this.y)
    },
    copy: function(v) {
      this.x = v.x
      this.y = v.y
      return this
    },
    add: function(v, w) {
      if (w !== undefined) {
        console.warn(
          'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.'
        )
        return this.addVectors(v, w)
      }
      this.x += v.x
      this.y += v.y
      return this
    },
    addScalar: function(s) {
      this.x += s
      this.y += s
      return this
    },
    addVectors: function(a, b) {
      this.x = a.x + b.x
      this.y = a.y + b.y
      return this
    },
    addScaledVector: function(v, s) {
      this.x += v.x * s
      this.y += v.y * s
      return this
    },
    sub: function(v, w) {
      if (w !== undefined) {
        console.warn(
          'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.'
        )
        return this.subVectors(v, w)
      }
      this.x -= v.x
      this.y -= v.y
      return this
    },
    subScalar: function(s) {
      this.x -= s
      this.y -= s
      return this
    },
    subVectors: function(a, b) {
      this.x = a.x - b.x
      this.y = a.y - b.y
      return this
    },
    multiply: function(v) {
      this.x *= v.x
      this.y *= v.y
      return this
    },
    multiplyScalar: function(scalar) {
      this.x *= scalar
      this.y *= scalar
      return this
    },
    divide: function(v) {
      this.x /= v.x
      this.y /= v.y
      return this
    },
    divideScalar: function(scalar) {
      return this.multiplyScalar(1 / scalar)
    },
    min: function(v) {
      this.x = Math.min(this.x, v.x)
      this.y = Math.min(this.y, v.y)
      return this
    },
    max: function(v) {
      this.x = Math.max(this.x, v.x)
      this.y = Math.max(this.y, v.y)
      return this
    },
    clamp: function(min, max) {
      this.x = Math.max(min.x, Math.min(max.x, this.x))
      this.y = Math.max(min.y, Math.min(max.y, this.y))
      return this
    },
    clampScalar: (function() {
      var min = new Vector2()
      var max = new Vector2()
      return function clampScalar(minVal, maxVal) {
        min.set(minVal, minVal)
        max.set(maxVal, maxVal)
        return this.clamp(min, max)
      }
    })(),
    clampLength: function(min, max) {
      var length = this.length()
      return this.divideScalar(length || 1).multiplyScalar(
        Math.max(min, Math.min(max, length))
      )
    },
    floor: function() {
      this.x = Math.floor(this.x)
      this.y = Math.floor(this.y)
      return this
    },
    ceil: function() {
      this.x = Math.ceil(this.x)
      this.y = Math.ceil(this.y)
      return this
    },
    round: function() {
      this.x = Math.round(this.x)
      this.y = Math.round(this.y)
      return this
    },
    roundToZero: function() {
      this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x)
      this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y)
      return this
    },
    negate: function() {
      this.x = -this.x
      this.y = -this.y
      return this
    },
    dot: function(v) {
      return this.x * v.x + this.y * v.y
    },
    lengthSq: function() {
      return this.x * this.x + this.y * this.y
    },
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    lengthManhattan: function() {
      return Math.abs(this.x) + Math.abs(this.y)
    },
    normalize: function() {
      return this.divideScalar(this.length() || 1)
    },
    angle: function() {
      var angle = Math.atan2(this.y, this.x)
      if (angle < 0) {
        angle += 2 * Math.PI
      }
      return angle
    },
    distanceTo: function(v) {
      return Math.sqrt(this.distanceToSquared(v))
    },
    distanceToSquared: function(v) {
      var dx = this.x - v.x,
        dy = this.y - v.y
      return dx * dx + dy * dy
    },
    distanceToManhattan: function(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y)
    },
    setLength: function(length) {
      return this.normalize().multiplyScalar(length)
    },
    lerp: function(v, alpha) {
      this.x += (v.x - this.x) * alpha
      this.y += (v.y - this.y) * alpha
      return this
    },
    lerpVectors: function(v1, v2, alpha) {
      return this.subVectors(v2, v1)
        .multiplyScalar(alpha)
        .add(v1)
    },
    equals: function(v) {
      return v.x === this.x && v.y === this.y
    },
    fromArray: function(array, offset) {
      if (offset === undefined) {
        offset = 0
      }
      this.x = array[offset]
      this.y = array[offset + 1]
      return this
    },
    toArray: function(array, offset) {
      if (array === undefined) {
        array = []
      }
      if (offset === undefined) {
        offset = 0
      }
      array[offset] = this.x
      array[offset + 1] = this.y
      return array
    },
    fromBufferAttribute: function(attribute, index, offset) {
      if (offset !== undefined) {
        console.warn(
          'THREE.Vector2: offset has been removed from .fromBufferAttribute().'
        )
      }
      this.x = attribute.getX(index)
      this.y = attribute.getY(index)
      return this
    },
    rotateAround: function(center, angle) {
      var c = Math.cos(angle),
        s = Math.sin(angle)
      var x = this.x - center.x
      var y = this.y - center.y
      this.x = x * c - y * s + center.x
      this.y = x * s + y * c + center.y
      return this
    }
  })
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i]
        descriptor.enumerable = descriptor.enumerable || false
        descriptor.configurable = true
        if ('value' in descriptor) {
          descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) {
        defineProperties(Constructor.prototype, protoProps)
      }
      if (staticProps) {
        defineProperties(Constructor, staticProps)
      }
      return Constructor
    }
  })()
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }
  var Pointer = (function() {
    function Pointer(domElement) {
      var _ref =
        arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1]
      var _ref$scaleMin = _ref.scaleMin
      var scaleMin = _ref$scaleMin === undefined ? 0.01 : _ref$scaleMin
      var _ref$scaleMax = _ref.scaleMax
      var scaleMax = _ref$scaleMax === undefined ? 10 : _ref$scaleMax
      var _ref$pressureMax = _ref.pressureMax
      var pressureMax = _ref$pressureMax === undefined ? 1 : _ref$pressureMax
      var _ref$pressureDuration = _ref.pressureDuration
      var pressureDuration =
        _ref$pressureDuration === undefined ? 1000 : _ref$pressureDuration
      _classCallCheck(this, Pointer)
      if (Pointer.instance) {
        return Pointer.instance
      }
      this.dom = domElement
      this.opt = {
        scaleMin: scaleMin,
        scaleMax: scaleMax,
        pressureMax: pressureMax,
        pressureDuration: pressureDuration
      }
      this.pressCheckInterval = 20
      this.deltaPressure =
        (this.opt.pressureMax / this.opt.pressureDuration) *
        this.pressCheckInterval
      this.position = new Vector2()
      this.zoomSpeed = 1
      this.scale = 1
      this.dollyStart = new Vector2()
      this.dollyEnd = new Vector2()
      this.dollyDelta = new Vector2()
      this.addMoveListener(this.onMove.bind(this))
      this.addDownListener(this.onDown.bind(this))
      this.addUpListener(this.onUp.bind(this))
      this.dom.addEventListener('touchstart', this._onTouchZoomStart, false)
      this.addZoomListener(this.onZoom.bind(this))
      this.isPressing = false
      this.pressure = 0
      Pointer.instance = this
    }
    Pointer.prototype.setScale = function setScale(val) {
      this.scale = clamp(val, this.opt.scaleMin, this.opt.scaleMax)
    }
    Pointer.prototype.updatePosition = function updatePosition(
      clientX,
      clientY
    ) {
      var size = Math.min(this.dom.clientWidth, this.dom.clientHeight)
      this.position.x = (clientX * 2 - this.dom.clientWidth) / size
      this.position.y =
        ((this.dom.clientHeight - clientY) * 2 - this.dom.clientHeight) / size
    }
    Pointer.prototype.onMove = function onMove(e) {
      var x = undefined,
        y = undefined
      if (e.touches) {
        x = e.touches[0].clientX
        y = e.touches[0].clientY
      } else {
        x = e.clientX
        y = e.clientY
      }
      this.updatePosition(x, y)
    }
    Pointer.prototype.addMoveListener = function addMoveListener(cb) {
      var _this = this
      ;['mousemove', 'touchmove'].forEach(function(evtName) {
        _this.dom.addEventListener(evtName, cb, false)
      })
    }
    Pointer.prototype.setPressure = function setPressure(val) {
      var valid = val <= this.opt.pressureMax && val >= 0
      this.pressure = clamp(val, 0, this.opt.pressureMax)
      return valid
    }
    Pointer.prototype.onDown = function onDown(e) {
      var _this2 = this
      if (e instanceof MouseEvent && e.button !== Pointer.BUTTON.MOUSE_LEFT) {
        return
      }
      this.isPressing = true
      if (e.touches) {
        var x = e.touches[0].clientX
        var y = e.touches[0].clientY
        this.updatePosition(x, y)
      }
      var intervalID = setInterval(function() {
        if (
          !_this2.isPressing ||
          !_this2.setPressure(_this2.pressure + _this2.deltaPressure)
        ) {
          clearInterval(intervalID)
        }
      }, this.pressCheckInterval)
      var pressingTest = setInterval(function() {
        if (_this2.isPressing) {
          var event = new CustomEvent('Pointer.pressing', {
            detail: _this2.pressure
          })
          _this2.dom.dispatchEvent(event)
        } else {
          clearInterval(pressingTest)
        }
      }, this.pressCheckInterval)
    }
    Pointer.prototype.addDownListener = function addDownListener(cb) {
      var _this3 = this
      ;['mousedown', 'touchstart'].forEach(function(evtName) {
        _this3.dom.addEventListener(evtName, cb, false)
      })
    }
    Pointer.prototype.addPressingListener = function addPressingListener(cb) {
      var _this4 = this
      ;['Pointer.pressing', 'Pointer.postpressing'].forEach(function(evtName) {
        _this4.dom.addEventListener(evtName, cb, false)
      })
    }
    Pointer.prototype.addPressingEndListener = function addPressingEndListener(
      cb
    ) {
      this.dom.addEventListener('Pointer.pressingEnd', cb, false)
    }
    Pointer.prototype.onUp = function onUp(e) {
      var _this5 = this
      if (e instanceof MouseEvent && e.button !== Pointer.BUTTON.MOUSE_LEFT) {
        return
      }
      this.isPressing = false
      var intervalID = setInterval(function() {
        if (
          _this5.isPressing ||
          !_this5.setPressure(_this5.pressure - _this5.deltaPressure)
        ) {
          var event = new CustomEvent('Pointer.pressingEnd', {
            detail: _this5.pressure
          })
          _this5.dom.dispatchEvent(event)
          clearInterval(intervalID)
        } else {
          var event = new CustomEvent('Pointer.postpressing', {
            detail: _this5.pressure
          })
          _this5.dom.dispatchEvent(event)
        }
      }, this.pressCheckInterval)
    }
    Pointer.prototype.addUpListener = function addUpListener(cb) {
      var _this6 = this
      ;['mouseup', 'touchend'].forEach(function(evtName) {
        _this6.dom.addEventListener(evtName, cb, false)
      })
    }
    Pointer.prototype._onTouchZoomStart = function _onTouchZoomStart(e) {
      if (e.touches.length !== 2) {
        return
      }
      var dx = e.touches[0].pageX - e.touches[1].pageX
      var dy = e.touches[0].pageY - e.touches[1].pageY
      this.dollyStart.set(0, Math.sqrt(dx * dx + dy * dy))
    }
    Pointer.prototype._onTouchZoom = function _onTouchZoom(e) {
      var dx = e.touches[0].pageX - e.touches[1].pageX
      var dy = e.touches[0].pageY - e.touches[1].pageY
      this.dollyEnd.set(0, Math.sqrt(dx * dx + dy * dy))
      this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)
      if (dollyDelta.y > 0) {
        this.zoomOut()
      } else {
        if (dollyDelta.y < 0) {
          this.zoomIn()
        }
      }
      this.dollyStart.copy(this.dollyEnd)
    }
    Pointer.prototype._onWheelZoom = function _onWheelZoom(e) {
      if (e.deltaY > 0) {
        this.zoomOut()
      } else {
        if (e.deltaY < 0) {
          this.zoomIn()
        }
      }
      e.preventDefault()
    }
    Pointer.prototype.onZoom = function onZoom(e) {
      if (e.touches) {
        this._onTouchZoom(e)
      } else {
        this._onWheelZoom(e)
      }
    }
    Pointer.prototype.addZoomListener = function addZoomListener(_cb) {
      var _this7 = this
      ;['wheel', 'touchmove'].forEach(function(evtName) {
        if (evtName === 'touchmove') {
          _cb = function cb(e) {
            return e.touches.length === 2 ? _cb(e) : undefined
          }
        }
        _this7.dom.addEventListener(evtName, _cb, false)
      })
    }
    Pointer.prototype.zoomIn = function zoomIn() {
      var scaleFactor =
        arguments.length <= 0 || arguments[0] === undefined
          ? this.zoomScale
          : arguments[0]
      this.setScale(this.scale * scaleFactor)
    }
    Pointer.prototype.zoomOut = function zoomOut() {
      var scaleFactor =
        arguments.length <= 0 || arguments[0] === undefined
          ? this.zoomScale
          : arguments[0]
      this.setScale(this.scale / scaleFactor)
    }
    _createClass(Pointer, [
      {
        key: 'zoomScale',
        get: function get() {
          return Math.pow(0.95, this.zoomSpeed)
        }
      }
    ])
    return Pointer
  })()
  Pointer.instance = null
  Pointer.BUTTON = { MOUSE_LEFT: 0, MOUSE_MIDDLE: 1, MOUSE_RIGHT: 2 }
  var regl = createREGL()
  var DEV = false
  var seed = DEV ? 138975.579831 : new Date().getTime() % 1000000
  var pointer = new Pointer(regl._gl.canvas)
  var lastPressingT = undefined,
    dtSec = 0,
    morphAmount = 0
  pointer.addPressingListener(function(e) {
    lastPressingT = lastPressingT || Date.now()
    var nowInMs = Date.now()
    dtSec = (nowInMs - lastPressingT) / 1000
    lastPressingT = nowInMs
    morphAmount += dtSec * pointer.pressure * 0.1
  })
  var draw = regl({
    frag:
      '\n    // fork from Fork from http://glslsandbox.com/e#8143.0\n    precision mediump float;\n    #define SEED ' +
      seed +
      '.579831\n\n    uniform vec2 uResolution;\n    uniform float uTime;\n    uniform vec2 uMouse;\n    uniform float uMorph;\n    uniform vec2 uGrid;\n\n    const int   complexity  = 10;   // complexity of curls/computation\n    const float mouseSpeed  = 0.3;  // control the color changing\n    const float fixedOffset = 0.7;  // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.\n    const float fluidSpeed  = 0.07; // Drives speed, smaller number will make it slower.\n    const float baseColor   = 0.6;\n    const float BLUR        = 0.47;\n\n    #define PI 3.14159\n\n    // more about noise: \n    // http://thebookofshaders.com/11/\n    float random(float x) {\n      return fract(sin(x) * SEED);\n    }\n    float noise(float x) {\n      float i = floor(x);\n      float f = fract(x);\n      return mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));\n    }\n    float noiseS(float x) {\n      return noise(x) * 2.0 - 1.0;\n    }\n\n    void main() {\n      vec2 p = (2.0 * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y) * 0.7;\n      float t = uTime * fluidSpeed + uMorph;\n      float noiseTime = noise(t);\n      float noiseSTime = noiseS(t);\n      float noiseSTime1 = noiseS(t + 1.0);\n\n      float blur = (BLUR + 0.14 * noiseSTime);\n      for(int i=1; i <= complexity; i++) {\n        p += blur / float(i) * sin(\n            float(i) * p.yx + t + PI * vec2(noiseSTime, noiseSTime1))\n          + fixedOffset;\n      }\n      for(int i=1; i <= complexity; i++) {\n        p += blur / float(i) * cos(\n            float(i) * p.yx + t + PI * vec2(noiseSTime, noiseSTime1))\n          + fixedOffset;\n      }\n      p += uMouse * mouseSpeed;\n\n      vec2 grid = uGrid * 2.0; // set complexity to 0 to debug the grid\n      gl_FragColor = vec4(\n        baseColor * vec3(\n          sin(grid * p + vec2(2.0 * noiseSTime, 3.0 * noiseSTime1)),\n          sin(p.x + p.y + noiseSTime)\n        )\n        + baseColor,\n        1.0);\n    }\n  ',
    vert:
      '\n    attribute vec2 position;\n    void main () {\n      gl_Position = vec4(position, 0, 1);\n    }\n  ',
    attributes: {
      position: regl.buffer([
        [-1, -1],
        [1, -1],
        [-1, 1],
        [-1, 1],
        [1, 1],
        [1, -1]
      ])
    },
    uniforms: {
      uResolution: function uResolution(_ref2) {
        var viewportWidth = _ref2.viewportWidth
        var viewportHeight = _ref2.viewportHeight
        return [viewportWidth, viewportHeight]
      },
      uTime: function uTime(_ref3) {
        var tick = _ref3.tick
        return 0.01 * tick
      },
      uMouse: function uMouse() {
        return [pointer.position.x, pointer.position.y]
      },
      uMorph: function uMorph() {
        return morphAmount
      },
      uRandomSeed: DEV ? 138975.579831 : new Date().getTime() % 1000000,
      uGrid: function uGrid(_ref4) {
        var viewportWidth = _ref4.viewportWidth
        var viewportHeight = _ref4.viewportHeight
        var ratio = 0.32
        return viewportHeight >= viewportWidth
          ? [1, (viewportHeight / viewportWidth) * ratio]
          : [(viewportWidth / viewportHeight) * ratio, 1]
      }
    },
    count: 6
  })
  regl.frame(function() {
    draw()
  })
}