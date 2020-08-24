/**
 * throttle
 * @param {*} fn 
 * @param {*} delay 
 */
// options是一个对象，如果options.leading为false，就是禁用第一次触发立即调用
// 如果options.trailing为false，则是禁用第一次执行
export function _throttle(func, wait, options) {
  // 一些初始化操作
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
      // 如果禁用第一次首先执行，返回0否则就用previous保存当前时间戳
      previous = options.leading === false ? 0 : Date.now();
      // 解除引用
      timeout = null;
      result = func.apply(context, args);
      // var throttled = _.throttle(func, 500);
      // 这里看到一种说法是在func函数内部可能会再次调用这个throttled函数导致timeout被改变
      // 
      if (!timeout) context = args = null;
  };
  return function () {
      // 获取当前调用时的时间（ms）
      var now = Date.now();
      // 如果previous为0并且禁用了第一次执行，那么将previous设置为当前时间
      // 这里用全等来避免undefined的情况
      if (!previous && options.leading === false) previous = now;
      // 还要wait时间才会触发下一次func
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // remaining小于0有两种情况，一种是上次调用后到现在已经到了wait时间
      // 一种情况是第一次触发的时候并且options.leading不为false，previous为0，因为now记录的是unix时间戳，所以会远远大于wait
      // remaining大于wait的情况我自己不清楚，但看到一种说法是客户端系统时间被调整过，可能会出现now小于previous的情况
      // 这两种情形下会立即执行func函数，并把previous设置为now
      if (remaining <= 0 || remaining > wait) {
          if (timeout) {
              // 清除定时器
              clearTimeout(timeout);
              timeout = null;
          }
          // previous保存当前触发的时间戳
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
      // 如果timeout不存在（当前定时器还存在）
      // 并且options.trailing不为false，这个时候会重新设置定时器，remaining时间后执行later函数
      } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
      }
      return result;
  };
};

/**
 * debounce
 */
export function _debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  // later 函数是延迟后执行的函数
  var later = function() {
    var last = Date.now() - timestamp; // 获取延迟时间

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last); // 继续延迟
    } else {
      timeout = null; //执行，设置 null 开启下次循环
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this; // 上下文和参数
    args = arguments;
    timestamp = Date.now(); // 记录当前的时间点
    var callNow = immediate && !timeout; // 判断是否开启立即函数
    if (!timeout) timeout = setTimeout(later, wait); // timeout 开始计时
    // 立即执行
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};