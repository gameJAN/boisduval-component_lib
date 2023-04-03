export default {
  /**
   * 获取本地assets中的图片
   * @param {String} imageName 图片名称(带后缀)
   */
  getAssetsImg(imageName) {
    try {
      return require(`images/${imageName}`);
    } catch (error) {
      return "";
    }
  },
  /**
   * 图片路径拼接
   * @param {String} path 图片url
   */
  appendImgUrl(url) {
    if (!url) {
      return "";
    }
    // 如果已经是完整路径，无需拼接
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:image/")
    ) {
      return url;
    }
    return `${process.env.VUE_APP_SERVER_URL}${url}`;
  },
};
