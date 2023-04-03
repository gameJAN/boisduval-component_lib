export default {
  /* 用户名正则 */
  validateUserName (userName) {
    if (userName.trim().length < 1) {
      return {
        success: false,
        message: '用户名不能为空！'
      }
    }
    return {
      success: true,
      message: ''
    }
  },
  /* 密码正则 */
  validatePassword (password) {
    if (!/[A-Z]+/.test(password) || !/[a-z]+/.test(password) || !/\d+/.test(password) || !/[`~!@#$%^&*()\-_=+[{\]}|;:'",<.>/?]+/.test(password)) {
      return {
        success: false,
        message: '半角模式下必须同时包含大小写字母数字特殊字符,最小长度8位'
      }
    }
    if (password.length < 8) {
      return {
        success: false,
        message: '最小长度8位'
      }
    }
    return {
      success: true,
      message: ''
    }
  },

  /* 是否为邮箱地址 */
  isEmailString (str) {
    const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    return reg.test(str)
  },

  /* 是否是公司邮箱 */
  isWscnEmail (str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i
    return reg.test(str.trim())
  },

  /* 合法uri */
  validateURL (textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
  },

  /* 小写字母 */
  validateLowerCase (str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
  },

  /* 大写字母 */
  validateUpperCase (str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
  },

  /* 大小写字母 */
  validatAlphabets (str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
  },

  /* 电话号码 */
  validatTelephone (str) {
    const reg = /^1[3456789]\d{9}$/
    return reg.test(str)
  },

  /* 营业执照注册号 */
  validatCompanyLicense (str) {
    const reg = /^\d{15}$/
    return reg.test(str)
  },
  /* 社会信用代码 */
  validatCompanyCode (str) {
    const reg = /^\d{18}$/
    return reg.test(str)
  },

  /* 邮编 */
  validatZipCode (str) {
    const reg = /^[0-9]{6}$/
    return reg.test(str)
  },

  /* 只能输入数字和一个小数点 */
  validatNumber (str) {
    var reg = /^\d+$|^\d*\.\d+$/g
    return reg.test(str)
  },

  /** 默认的form表单校验规则 */
  defaultFormRule (type, validator) {
    if (validator) {
      return [{
        required: true,
        trigger: 'change | blur',
        validator: validator
      }]
    }
    type = type || 'string'
    return [{
      required: true,
      message: '不能为空',
      type: type,
      trigger: 'change | blur'
    }]
  }
}
