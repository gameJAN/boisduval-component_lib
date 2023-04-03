/*
 * 日期相关工具类
 * @description:
 *
 * Created by JuneCheng on 2020/09/08 11:05:21.
 * Copyright © 2020年 zjhcsoft. All rights reserved.
 */
/**
 * 格式化时间
 * @author fatto
 *
 * @param {String} date 时间字符串
 * @param {String} fmt 需要的格式, 如果不传格式，直接返回时间戳
 * add by fatto on 2020/11/12 09:30:11
 */
const format = (date, fmt) => {
  if (!date) {
    date = new Date()
  }
  if (typeof (date) === 'string') {
    // 处理ie new Date()兼容性
    date = new Date(Date.parse(date.replace(/-/g, '/')))
  }
  if (!fmt) {
    return date.getTime()
  }

  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
/**
 * 获取当前格式化时间
 * add by fatto on 2020/11/12 09:31:40
 */
const now = (fmt) => {
  return format(new Date(), fmt)
}

export default {
  now,
  format,
  /**
   * 将毫秒转换成n天n时n分n秒
   * @param {Number} offsetTimeStamp 时间戳
   * add by fatto on 2020/11/12 09:32:58
   */
  formatTimeStamp (offsetTimeStamp) {
    let day = 0
    let hour = 0
    let min = 0
    let second = 0
    if (offsetTimeStamp >= 0) {
      // 天
      const d = Math.floor(offsetTimeStamp / 1000 / 60 / 60 / 24)
      day = d < 10 ? `0${d}` : String(d)
      // 时
      const h = Math.floor(offsetTimeStamp / 1000 / 60 / 60 % 24)
      hour = h < 10 ? `0${h}` : String(h)
      // 分
      const m = Math.floor(offsetTimeStamp / 1000 / 60 % 60)
      min = m < 10 ? `0${m}` : String(m)
      // 秒
      const s = Math.floor(offsetTimeStamp / 1000 % 60)
      second = s < 10 ? `0${s}` : String(s)
    }
    return { day, hour, min, second }
  },
  /**
   * 日期格式化
   * @param {String} fmt 格式化类型
   * @param {Date} date
   *
   * @return {String} 日期格式化字符串
   */
  dateFormat (fmt, date) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt
  },

  /**
   * 返回date+days天后的日期
   * @param {String} dateString
   * @param {Int} days
   *
   * @return {Date}
   */
  dateByAddingDays (dateString, days) {
    let date = new Date(dateString)
    date.setDate(date.getDate() + days)
    return date
  },

  /**
   * 格式化${startDate}距现在的已过时间
   *
   * @param {Date} startDate 时间
   *
   * @return {String}
   */
  formatPassTime (startDate) {
    var currentDate = Date.parse(new Date())
    var time = currentDate - startDate
    var day = parseInt(time / (1000 * 60 * 60 * 24))
    var hour = parseInt(time / (1000 * 60 * 60))
    var min = parseInt(time / (1000 * 60))
    var month = parseInt(day / 30)
    var year = parseInt(month / 12)
    if (year) return year + '年前'
    if (month) return month + '个月前'
    if (day) return day + '天前'
    if (hour) return hour + '小时前'
    if (min) return min + '分钟前'
    else return '刚刚'
  }
}
