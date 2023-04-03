
// 节流 定时器 + 时间戳
export const throttle = (fn, interval) => {
  let last = 0
  let timer
  const interVal = interval || 200
  return function () {
    const th = this
    const args = arguments
    const now = new Date().getTime()
    if (last && now - last < interVal) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = new Date().getTime()
        // fn.apply(th, args)
      }, interVal)
    } else {
      last = new Date().getTime()
      fn.apply(th, args)
    }
  }
}