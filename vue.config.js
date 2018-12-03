let publicPath = './'
if (typeof process.env["npm_config_public_path"] !== "undefined") {
  publicPath = process.env["npm_config_public_path"]
}

module.exports = {
  // 部署应用时的基本 URL
  baseUrl: process.env.NODE_ENV === 'production' ? publicPath : './',
  // build时构建文件的目录 构建时传入 --no-clean 可关闭该行为
  outputDir: 'dist',
  // 打包到static
  assetsDir: "static",
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 可以用来传递任何第三方插件选项
  devServer: {
    open: true,
    port: 1025,
    https: false,
    proxy: {
      '/api': {
        target: '', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => {
    }
  },
  pluginOptions: {}
}