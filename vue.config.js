// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('fs').readFileSync('./package.json')
const version = JSON .parse(packageJson).version || 0
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PROJECT_VERSION: '"' + version + '"'
        }
      })
    ]
  },

  chainWebpack: config => {
    config.plugins.delete('prefetch')

    config.plugin('fork-ts-checker').tap((args) => {
      args[0].memoryLimit = 8192
      return args
    });

    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
  },

  devServer: {
    disableHostCheck: true,
    ...(process.env.VUE_APP_DEV_SERVER_HOST ? { host: process.env.VUE_APP_DEV_SERVER_HOST } : {}),
    ...(process.env.VUE_APP_DEV_SERVER_PUBLIC ? { public: process.env.VUE_APP_DEV_SERVER_PUBLIC } : {}),
    ...(process.env.VUE_APP_DEV_SERVER_PORT ? { port: process.env.VUE_APP_DEV_SERVER_PORT } : {}),
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    }
  },

  filenameHashing: true,
  parallel: 4,

  pluginOptions: {},

  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ]
}
