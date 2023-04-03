export default {
  /** 附件下载 */
  downloadFile (fileContent, fileName) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([fileContent])
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      resolve(true)
    })
  },
  file2DataURL (file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => {
        resolve(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  },
  uint8ArrayToStr (array) {
    var out, i, len, c
    var char2, char3

    out = ''
    len = array.length
    i = 0
    while (i < len) {
      c = array[i++]
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c)
          break
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++]
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++]
          char3 = array[i++]
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0))
          break
      }
    }

    return out
  }
}
