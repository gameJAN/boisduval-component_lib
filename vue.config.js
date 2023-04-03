const path = require("path");
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  devServer: {
    port: 8085,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "/api": {
        target: "/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
    // lintOnSave: false,
  },
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    performance: {
      hints: false,
    },
  },
  // 修改 pages 入口
  pages: {
    index: {
      entry: "examples/main.js", // 入口
      template: "public/index.html", // 模板
      filename: "index.html", // 输出文件
    },
  },
  pluginOptions: {
    // 配置全局less变量
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "examples/assets/styles/variable.less"),
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 扩展 webpack 配置
  chainWebpack: (config) => {
    // @ 默认指向 examples 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set("@", path.resolve("examples"))
      .set("~", path.resolve("packages"))
      .set("_c", path.resolve("examples/components"))
      .set("_s", path.resolve("src"));

    // 把 packages 和 examples 加入编译，因为新增的文件默认是不被 webpack 处理的
    config.module
      .rule("js")
      .include.add(/packages/)
      .end()
      .include.add(/examples/)
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap((options) => {
        // 修改它的选项...
        return options;
      });
  },
};
