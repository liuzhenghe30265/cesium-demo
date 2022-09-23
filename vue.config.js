const CopyWebpackPlugin = require('copy-webpack-plugin')
const dateTime = new Date()
const year = dateTime.getFullYear()
const month = dateTime.getMonth() + 1
const date = dateTime.getDate()
const hours = dateTime.getHours()
const minutes = dateTime.getMinutes()
const seconds = dateTime.getSeconds()
// const version = Date.parse(new Date()).toString()
const version = `${year}${month}${date}${hours}${minutes}${seconds}`
module.exports = {
  publicPath: './',
  assetsDir: version,
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    const webpackArr = [
      {
        from: './node_modules/cesium/Build/Cesium',
        to: 'tool/Cesium',
        toType: 'dir'
      },
      {
        from: './node_modules/cesiumvectortile/dist',
        to: 'tool/cesiumvectortile',
        toType: 'dir'
      },
      {
        from: './node_modules/earthsdk/dist/XbsjCesium',
        to: 'tool/earthsdk/XbsjCesium',
        toType: 'dir'
      },
      {
        from: './node_modules/earthsdk/dist/XbsjEarth',
        to: 'tool/earthsdk/XbsjEarth',
        toType: 'dir'
      }
    ]
    webpackArr.push(
      {
        from: `./config/index-${process.env.VUE_APP_CURRENTMODE}.js`,
        to: 'config',
        toType: 'dir'
      })
    const cwp = new CopyWebpackPlugin(webpackArr)
    config.plugins.push(cwp)
  },
  chainWebpack: config => {
    config.resolve.symlinks(false)
    config.plugin('html').tap(args => {
      args[0].minify = false
      return args
    })
  },
  devServer: {
    disableHostCheck: true,
    open: true,
    // host: '192.168.2.194',
    port: '9999',
    https: false,
    hotOnly: false
    // proxy: {
    //   '/': {
    //     target: 'http://192.168.2.194:3000/',
    //     pathRewrite: {
    //       '^/': ''
    //     }
    //   }
    // }
  }
}